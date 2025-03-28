document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("SearchInput");
    const searchButton = document.getElementById("btn-lancer-recherche");
    const resultsContainer = document.getElementById("bloc-resultats");
    const loadingGif = document.getElementById("bloc-gif-attente");
    const favorisButton = document.getElementById("btn-favoris");
    const favorisList = document.getElementById("liste-favoris");
    loadingGif.style.display = "none";
    window.onload = () => searchInput.focus();


    fetch("https://api.openf1.org/v1/drivers")
    .then(response => response.json())
    .then(data => {
        allDrivers = data.filter(driver=> driver.headshot_url&& driver.headshot_url.trim() !=="");
        displayResults(""); // Afficher tous les pilotes au démarrage
    })
    .catch(error => console.error("Erreur lors du chargement des pilotes :", error));
    
    function getFavoris() {
        return JSON.parse(localStorage.getItem("favoris")) || [];
    }

    function setFavoris(favoris) {
        localStorage.setItem("favoris", JSON.stringify(favoris));
        renderFavorisList();
    }

    function renderFavorisList() {
        const favoris = getFavoris();
        favorisList.innerHTML = favoris.length ? "" : "<p>(Aucune recherche favorite)</p>";
        favoris.forEach(fav => {
            const li = document.createElement("li");
            li.textContent = fav;
            li.addEventListener("click", () => {
                searchInput.value = fav;
                performSearch();
            });
            const deleteBtn = document.createElement("span");
            deleteBtn.textContent = " ⨷";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                if (confirm("Voulez-vous vraiment supprimer ce favori ?")) {
                    setFavoris(favoris.filter(f => f !== fav));
                }
            });
            li.appendChild(deleteBtn);
            favorisList.appendChild(li);
        });
    }

    function updateFavorisButton() {
        const query = searchInput.value.trim();
        const favoris = getFavoris();
        if (!query) {
            favorisButton.disabled = true;
            favorisButton.style.backgroundColor.hover = "grey";
        } else if (favoris.includes(query)) {
            favorisButton.disabled = false;
            favorisButton.textContent = "★";
            favorisButton.style.backgroundColor = "red";
        } else {
            favorisButton.disabled = false;
            favorisButton.textContent = "☆";
            favorisButton.style.backgroundColor = "red";
        }
    }



    favorisButton.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (!query) return;
        let favoris = getFavoris();
        if (favoris.includes(query)) {
            if (confirm("Voulez-vous vraiment supprimer ce favori ?")) {
                setFavoris(favoris.filter(f => f !== query));
            }
        } else {
            favoris.push(query);
            setFavoris(favoris);
        }
        updateFavorisButton();
    });

    searchInput.addEventListener("input", updateFavorisButton);
    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") performSearch();
    });

    function performSearch() {
        let query = searchInput.value.trim();
        query = query.charAt(0).toUpperCase() + query.slice(1);
        if (query === "") return;
        loadingGif.style.display = "block";
        fetch(`https://api.openf1.org/v1/drivers?first_name=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors de la requête");
                return response.json();
            })
            .then(data => {
                loadingGif.style.display = "none";
                resultsContainer.innerHTML = "";
                if (data.length === 0) {
                    resultsContainer.innerHTML = "<p class='info-vide'>(Aucun résultat trouvé)</p>";
                    return;
                }
                const uniqueResults = new Set();
                data.forEach(driver => {
                    let resultText = `
                        <div class="driver-card" style="border-color: #${driver.team_colour};">
                            <div class="driver-photo">
                                <img src="${driver.headshot_url}" alt="Photo de ${driver.full_name}" />
                            </div>
                            <div class="driver-info">
                                <p><strong>Pilote :</strong> ${driver.full_name}</p>
                                <p><strong>Nationalité :</strong> ${driver.country_code}</p>
                                <p><strong>Équipe Actuelle :</strong> ${driver.team_name}</p>
                                <p><strong>Numéro :</strong> ${driver.driver_number}</p>
                            </div>
                        </div>`;
                    if (!uniqueResults.has(resultText)) {
                        uniqueResults.add(resultText);
                        resultsContainer.innerHTML += resultText;
                    }
                });
                updateFavorisButton();
            })
            .catch(error => {
                console.error("Erreur :", error);
                resultsContainer.innerHTML = "<p class='info-vide'>Une erreur est survenue.</p>";
                loadingGif.style.display = "none";
            });
    }

    renderFavorisList();
    updateFavorisButton();
});

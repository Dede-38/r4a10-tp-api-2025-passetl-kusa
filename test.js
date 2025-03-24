/* JavaScript amélioré pour afficher tous les pilotes de base et effectuer une recherche dynamique */
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("SearchInput");
    const resultsContainer = document.getElementById("bloc-resultats");
    const loadingGif = document.getElementById("bloc-gif-attente");
    const favorisButton = document.getElementById("btn-favoris");
    let timeout = null;

    loadingGif.style.display = "none";

    // Charger tous les pilotes au démarrage
    fetch("https://api.openf1.org/v1/drivers")
        .then(response => response.json())
        .then(data => {
            allDrivers = data.filter(driver=> driver.headshot_url&& driver.headshot_url.trim() !=="");
            displayResults(""); // Afficher tous les pilotes au démarrage
        })
        .catch(error => console.error("Erreur lors du chargement des pilotes :", error));

    searchInput.addEventListener("input", function () {
        clearTimeout(timeout);
        let query = searchInput.value.trim().toLowerCase();
        timeout = setTimeout(() => {
            displayResults(query);
        }, 300);
    });

    function displayResults(query) {
    searchButton.addEventListener("click", function () {
        let query = searchInput.value.trim();
        if (query === "") {
            alert("Veuillez entrer un mot-clé !");
            return;
        }

        loadingGif.style.display = "block";
        resultsContainer.innerHTML = "";
        let uniqueResults = new Set();
        let outputHtml = "";

        const filteredDrivers = allDrivers.filter(driver => 
            query === "" || driver.full_name.toLowerCase().includes(query)
        );

        filteredDrivers.forEach(driver => {
            let resultText = `
                <div class="driver-card" style="display: flex; align-items: center; gap: 15px; padding: 10px; border-color: #${driver.team_colour} ;">
                    <div class="driver-photo">
                        <img src="${driver.headshot_url }" alt="Photo de ${driver.full_name}" style="width: 80px; height: auto; border-radius: 5px;"/>
                    </div>
                    <div class="driver-info" style="text-align: left;">
                        <p><strong>Pilote :</strong> ${driver.full_name}</p>
                        <p><strong>Nationalité :</strong> ${driver.country_code || " Inconnue "}</p>
                        <p><strong>Équipe Actuelle :</strong> ${driver.team_name}</p>
                        <p><strong>Numéro :</strong> ${driver.driver_number}</p>
                    </div>
                </div>`;
            
            if (!uniqueResults.has(driver.driver_number) && !uniqueResults.has(driver.headshot_url==null)) {
                uniqueResults.add(driver.driver_number);
                outputHtml += resultText;
            }
        });

        resultsContainer.innerHTML = outputHtml || `<p class="info-vide">(Aucun résultat trouvé)</p>`;
        loadingGif.style.display = "none";
        favorisButton.disabled = false;
    }

        fetch(`https://api.openf1.org/v1/drivers?first_name=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la requête API");
                }
                return response.json();
            })
            .then(data => {
                loadingGif.style.display = "none";
                resultsContainer.innerHTML = "";
                let uniqueResults = new Set();
                if (data.length === 0) {
                    resultsContainer.innerHTML = `<p class="info-vide">(Aucun pilote trouvé)</p>`;
                    return;
                }
                data.forEach(driver => {
                    if (!driver.full_name || !driver.country_code || !driver.team_name) return;
                    let resultText = `
                        <div class="driver-card" data-driver-id="${driver.id}">
                            <div class="driver-photo">
                                <img src="${driver.headshot_url || 'default-driver.png'}" alt="Photo de ${driver.full_name}" />
                            </div>
                            <div class="driver-info">
                                <p><strong>Pilote :</strong> ${driver.full_name}</p>
                                <p><strong>Nationalité :</strong> ${driver.country_code}</p>
                                <p><strong>Équipe Actuelle :</strong> ${driver.team_name || 'Non renseigné'}</p>
                                <p><strong>Numéro :</strong> ${driver.driver_number || 'N/A'}</p>
                            </div>
                        </div>`;

                    if (!uniqueResults.has(driver.id)) {
                        uniqueResults.add(driver.id);
                        resultsContainer.innerHTML += resultText;
                    }
                });

                favorisButton.disabled = false;
            })
            .catch(error => {
                console.error("Erreur :", error);
                resultsContainer.innerHTML = `<p class="info-vide">Une erreur est survenue lors de la récupération des pilotes.</p>`;
                loadingGif.style.display = "none";
            });
    });
});





/* JavaScript corrigé pour afficher tous les pilotes et effectuer une recherche dynamique */
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("SearchInput");
    const searchButton = document.getElementById("btn-lancer-recherche");
    const resultsContainer = document.getElementById("bloc-resultats");
    const loadingGif = document.getElementById("bloc-gif-attente");
    const favorisButton = document.getElementById("btn-favoris");
    let timeout = null;
    let allDrivers = [];

    loadingGif.style.display = "none";

    // Charger tous les pilotes au démarrage
    fetch("https://api.openf1.org/v1/drivers")
        .then(response => response.json())
        .then(data => {
            allDrivers = data.filter(driver => driver.headshot_url && driver.headshot_url.trim() !== "");
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

    searchButton.addEventListener("click", function () {
        let query = searchInput.value.trim().toLowerCase();
        if (query === "") {
            alert("Veuillez entrer un mot-clé !");
            return;
        }
        displayResults(query);
    });

    function displayResults(query) {
        loadingGif.style.display = "block";
        resultsContainer.innerHTML = "";
        let uniqueResults = new Set();
        let outputHtml = "";

        const filteredDrivers = allDrivers.filter(driver => 
            query === "" || driver.full_name.toLowerCase().includes(query)
        );

        filteredDrivers.forEach(driver => {
            if (!uniqueResults.has(driver.driver_number)) {
                uniqueResults.add(driver.driver_number);
                let resultText = `
                    <div class="driver-card" style="display: flex; align-items: center; gap: 15px; padding: 10px; border: 5px solid #${driver.team_colour};">
                        <div class="driver-photo">
                            <img src="${driver.headshot_url}" alt="Photo de ${driver.full_name}" />
                        </div>
                        <div class="driver-info" style="text-align: left;">
                            <p><strong>Pilote :</strong> ${driver.full_name}</p>
                            <p><strong>Nationalité :</strong> ${driver.country_code || "Inconnue"}</p>
                            <p><strong>Équipe Actuelle :</strong> ${driver.team_name}</p>
                            <p><strong>Numéro :</strong> ${driver.driver_number}</p>
                        </div>
                    </div>`;
                outputHtml += resultText;
            }
        });

        resultsContainer.innerHTML = outputHtml || `<p class="info-vide">(Aucun résultat trouvé)</p>`;
        loadingGif.style.display = "none";
        favorisButton.disabled = false;
    }
});

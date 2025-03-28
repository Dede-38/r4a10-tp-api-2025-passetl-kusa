export class DriverView {
    constructor() {
        this.searchInput = document.getElementById("SearchInput");
        this.resultsContainer = document.getElementById("bloc-resultats");
        this.loadingGif = document.getElementById("bloc-gif-attente");
        this.favorisButton = document.getElementById("btn-favoris");
        this.loadingGif.style.display = "none";
    }

    displayResults(drivers) {
        this.loadingGif.style.display = "block";
        this.resultsContainer.innerHTML = "";
        let uniqueResults = new Set();

        let outputHtml = drivers.map(driver => {
            if (!uniqueResults.has(driver.driver_number)) {
                uniqueResults.add(driver.driver_number);
                return `
                    <div class="driver-card" style="display: flex; align-items: center; gap: 15px; padding: 10px; border-color: #${driver.team_colour};">
                        <div class="driver-photo">
                            <img src="${driver.headshot_url}" alt="Photo de ${driver.full_name}" style="width: 80px; height: auto; border-radius: 5px;"/>
                        </div>
                        <div class="driver-info" style="text-align: left;">
                            <p><strong>Pilote :</strong> ${driver.full_name}</p>
                            <p><strong>Nationalité :</strong> ${driver.country_code || "Inconnue"}</p>
                            <p><strong>Équipe Actuelle :</strong> ${driver.team_name || "Aucune"}</p>
                            <p><strong>Numéro :</strong> ${driver.driver_number || "N/A"}</p>
                        </div>
                    </div>`;
            }
            return "";
        }).join('');

        this.resultsContainer.innerHTML = outputHtml || `<p class="info-vide">(Aucun résultat trouvé)</p>`;
        this.loadingGif.style.display = "none";
        this.favorisButton.disabled = false;
    }
}
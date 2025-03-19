/*const answer = function ( response ) {
    console.log(response)
    let j = response.json()
    console.log(j)
 } 

 fetch('https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8')
 .then(answer) */

/* JavaScript Amélioré pour éviter les doublons dans les résultats */


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("SearchInput");
    const searchButton = document.getElementById("btn-lancer-recherche");
    const resultsContainer = document.getElementById("bloc-resultats");
    const loadingGif = document.getElementById("bloc-gif-attente");
    const favorisButton = document.getElementById("btn-favoris");
    const favorisList = document.getElementById("liste-favoris");

    loadingGif.style.display = "none";

    searchButton.addEventListener("click", function () {
        let query = searchInput.value.trim();
        if (query === "") {
            alert("Veuillez entrer un mot-clé !");
            return;
        }
        loadingGif.style.display = "block";
        fetch(`https://api.openf1.org/v1/drivers?first_name=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la requête");
                }
                return response.json();
            })
            .then(data => {
                loadingGif.style.display = "none";
                resultsContainer.innerHTML = "";
                let uniqueResults = new Set();
                data.forEach(driver => {
                    let resultText = `
                        <div class="driver-card">
                            <div class="driver-photo">
                                <img src="${driver.headshot_url }" alt="Photo de ${driver.full_name}" />
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
                if (uniqueResults.size === 0) {
                    resultsContainer.innerHTML = `<p class="info-vide">(Aucun résultat trouvé)</p>`;
                }
                favorisButton.disabled = false;
            })
            .catch(error => {
                console.error("Erreur :", error);
                resultsContainer.innerHTML = `<p class="info-vide">Une erreur est survenue.</p>`;
                loadingGif.style.display = "none";
            });
    });
});


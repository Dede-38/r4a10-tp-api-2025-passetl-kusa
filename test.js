/*const answer = function ( response ) {
    console.log(response)
    let j = response.json()
    console.log(j)
 } 

 fetch('https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8')
 .then(answer) */


 document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("SearchInput");
    const searchButton = document.getElementById("btn-lancer-recherche");
    const resultsContainer = document.getElementById("bloc-resultats");
    const loadingGif = document.getElementById("bloc-gif-attente");
    const favorisButton = document.getElementById("btn-favoris");
    const favorisList = document.getElementById("liste-favoris");

    // Cacher le GIF de chargement au départ
    loadingGif.style.display = "none";

    searchButton.addEventListener("click", function () {
        let query = searchInput.value.trim();

        if (query === "") {
            alert("Veuillez entrer un mot-clé !");
            return;
        }

        // Afficher le GIF de chargement
        loadingGif.style.display = "block";

        // Appel API
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

                if (data.length === 0) {
                    resultsContainer.innerHTML = `<p class="info-vide">(Aucun résultat trouvé)</p>`;
                    return;
                }

                // Afficher les résultats
                data.forEach(driver => {
                    let p = document.createElement("p");
                    p.classList.add("res");
                    p.textContent = `Pilote : ${driver.full_name} 
                    | Nationalité : ${driver.country_code}
                    |Equipe Actuelle : ${driver.team_name}`
                    ;
                    resultsContainer.appendChild(p);
                   
                });

                // Activer le bouton favoris
                favorisButton.disabled = false;
            })
            .catch(error => {
                console.error("Erreur :", error);
                resultsContainer.innerHTML = `<p class="info-vide">Une erreur est survenue.</p>`;
                loadingGif.style.display = "none";
            });
    });
});
 

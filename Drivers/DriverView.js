export class DriverView {
    constructor() {
      this.searchInput = document.getElementById("SearchInput");
      this.resultsContainer = document.getElementById("bloc-resultats");
      this.loadingGif = document.getElementById("bloc-gif-attente");
      this.favorisList = document.getElementById("liste-favoris");
  
      // Récupération des favoris stockés dans localStorage
      this.favoris = new Set(JSON.parse(localStorage.getItem("favoris")) || []);
      this.loadingGif.style.display = "none";
      this.renderFavoris();
    }
  
    displayResults(drivers) {
      this.loadingGif.style.display = "block";
      this.resultsContainer.innerHTML = "";
      const uniqueResults = new Set();
  
      const outputHtml = drivers.map(driver => {
        if (uniqueResults.has(driver.driver_number)) return "";
        uniqueResults.add(driver.driver_number);
  
        const isFavori = this.favoris.has(driver.full_name);
        const favoriteIcon = isFavori ? "images/etoile-pleine.svg" : "images/etoile-vide.svg";
        const favoriteTitle = isFavori ? "Retirer des favoris" : "Ajouter aux favoris";
  
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
              <button class="btn-favori" data-name="${driver.full_name}" title="${favoriteTitle}">
                <img src="${favoriteIcon}" alt="${favoriteTitle}" width="22" />
              </button>
            </div>
          </div>`;
      }).join("");
  
      this.resultsContainer.innerHTML = outputHtml || `<p class="info-vide">(Aucun résultat trouvé)</p>`;
      this.loadingGif.style.display = "none";
      this.bindFavorisButtons();
    }
  
    bindFavorisButtons() {
      const favButtons = this.resultsContainer.querySelectorAll(".btn-favori");
      favButtons.forEach(button => {
        button.addEventListener("click", () => {
          const driverName = button.getAttribute("data-name");
          this.toggleFavori(driverName);
          this.updateFavoriButton(button, driverName);
          this.renderFavoris();
        });
      });
    }
  
    toggleFavori(driverName) {
      if (this.favoris.has(driverName)) {
        this.favoris.delete(driverName);
      } else {
        this.favoris.add(driverName);
      }
      localStorage.setItem("favoris", JSON.stringify([...this.favoris]));
    }
  
    updateFavoriButton(button, driverName) {
      const isFavori = this.favoris.has(driverName);
      const favoriteIcon = isFavori ? "images/etoile-pleine.svg" : "images/etoile-vide.svg";
      const favoriteTitle = isFavori ? "Retirer des favoris" : "Ajouter aux favoris";
      button.title = favoriteTitle;
      button.innerHTML = `<img src="${favoriteIcon}" alt="${favoriteTitle}" width="22" />`;
    }
  
    renderFavoris() {
      this.favorisList.innerHTML = "";
      if (this.favoris.size === 0) {
        this.favorisList.innerHTML = `<p class="info-vide">(Aucun favori enregistré)</p>`;
        return;
      }
  
      this.favoris.forEach(driverName => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span title="Cliquer pour relancer la recherche">${driverName}</span>
          <img src="images/croix.svg" alt="Icône pour supprimer le favori" width="15" title="Cliquer pour supprimer le favori" class="remove-favori" data-name="${driverName}" />
        `;
        this.favorisList.appendChild(li);
      });
      this.bindRemoveFavorisButtons();
    }
  
    bindRemoveFavorisButtons() {
      const removeButtons = this.favorisList.querySelectorAll(".remove-favori");
      removeButtons.forEach(img => {
        img.addEventListener("click", () => {
          const driverName = img.getAttribute("data-name");
          this.favoris.delete(driverName);
          localStorage.setItem("favoris", JSON.stringify([...this.favoris]));
          this.renderFavoris();
          this.updateResultsButton(driverName);
        });
      });
    }
  
    updateResultsButton(driverName) {
      const button = this.resultsContainer.querySelector(`.btn-favori[data-name="${driverName}"]`);
      if (button) {
        this.updateFavoriButton(button, driverName);
      }
    }
  }
  
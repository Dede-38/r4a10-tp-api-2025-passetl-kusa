import { DriverModel } from "./DriverModel.js";
import { DriverView } from "./DriverView.js";

class DriverController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.timeout = null;
    }

    async init() {
        try {
            await this.model.loadDrivers();
            this.updateView("");
        } catch (error) {
            this.view.resultsContainer.innerHTML = `<p class='info-vide'>${error.message}</p>`;
        }
        this.view.searchInput.addEventListener("input", () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.updateView(this.view.searchInput.value);
            }, 300);
        });
    }

    updateView(query) {
        const filteredDrivers = this.model.getFilteredDrivers(query);
        this.view.displayResults(filteredDrivers);
    }
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
    const model = new DriverModel();
    const view = new DriverView();
    const controller = new DriverController(model, view);
    controller.init();
});

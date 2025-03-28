import { GrandPrixModel } from "./GPModel.js";
import { GrandPrixView } from "./GPView.js";

class GrandPrixController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        await this.model.loadGrandsPrix();
        this.view.displayGrandsPrix(this.model.grandsPrix, this.handleGrandPrixClick.bind(this));}

        async handleGrandPrixClick(sessionId) {
            await this.model.loadPositions(sessionId);
            this.view.displayPositions(this.model.positions);
        }
}

document.addEventListener("DOMContentLoaded", () => {
    const model = new GrandPrixModel();
    const view = new GrandPrixView();
    const controller = new GrandPrixController(model, view);
    controller.init();
});
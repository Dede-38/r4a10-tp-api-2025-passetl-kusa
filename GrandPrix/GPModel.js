export class GrandPrixModel {
    constructor() {
        this.grandsPrix = [];
        this.positions = [];
    }

    async loadGrandsPrix() {
        try {
            const response = await fetch("https://api.openf1.org/v1/meetings");
            const data = await response.json();
            this.grandsPrix = data.filter(gp => gp.meeting_name && gp.meeting_name.trim() !== "");
        } catch (error) {
            console.error("Erreur lors du chargement des Grands Prix :", error);
        }
    }

    async loadPositions(sessionId) {
        try {
            const response = await fetch(`https://api.openf1.org/v1/position?session_id=${sessionId}`);
            const positions = await response.json();
            this.positions = this.getLatestPositions(positions); // Appelez la méthode ici
        } catch (error) {
            console.error("Erreur lors du chargement des positions :", error);
        }
    }

    getLatestPositions(positions) {
        const latestPositions = {}; 

        positions.forEach(pos => {
            const driverId = pos.driver_number;
            if (!latestPositions[driverId] || new Date(pos.date) > new Date(latestPositions[driverId].date)) {
                latestPositions[driverId] = pos; 
            }
        });

        return Object.values(latestPositions);
    }
}
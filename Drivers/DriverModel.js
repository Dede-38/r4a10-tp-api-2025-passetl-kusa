class DriverModel {
    constructor() {
        this.allDrivers = [];
    }

    async loadDrivers() {
        try {
            const response = await fetch("https://api.openf1.org/v1/drivers");
            const data = await response.json();
            this.allDrivers = data.filter(driver => driver.headshot_url && driver.headshot_url.trim() !== "");
        } catch (error) {
            console.error("Erreur lors du chargement des pilotes :", error);
            throw new Error("Erreur de chargement des pilotes.");
        }
    }

    getFilteredDrivers(query) {
        query = query.trim().toLowerCase();
        return this.allDrivers.filter(driver => 
            query === "" || driver.full_name.toLowerCase().includes(query)
        );
    }
}
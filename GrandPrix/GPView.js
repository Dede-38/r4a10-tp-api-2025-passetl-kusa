export class GrandPrixView {
    constructor() {
        this.gpContainer = document.getElementById("grand-prix-container");
        this.positionsContainer = document.getElementById("positions-container");
    }

    displayGrandsPrix(grandsPrix, onGrandPrixClick) {
        this.gpContainer.innerHTML = "<table><tr>";
        grandsPrix.forEach(gp => {
            this.gpContainer.innerHTML += `<th><button onclick="(${onGrandPrixClick})(${gp.meeting_id})">${gp.meeting_name} - ${gp.year}</button></th>`;
      
        this.gpContainer.innerHTML += `
        <td>
            <button onclick="handleGrandPrixClick(${gp.meeting_id})">
                ${gp.meeting_name} - ${gp.year}
            </button>
        </td>`;   
    });
     }

    displayPositions(positions) {
        this.positionsContainer.innerHTML = "";
        if (positions.length === 0) {
            this.positionsContainer.innerHTML = "<p>Aucune position trouvée.</p>";
            return;
        }
        positions.forEach(pos => {
            const div = document.createElement("div");
            div.innerHTML = `<p>#${pos.position} - ${pos.driver_name} (${pos.team_name})</p>`;
            this.positionsContainer.appendChild(div);
        });
    }
}
export class Favoris {
    getFavoris() {
        return JSON.parse(localStorage.getItem("favoris")) || [];
    }

    setFavoris(favoris) {
        localStorage.setItem("favoris", JSON.stringify(favoris));
    }

    addFavori(favori) {
        let favoris = this.getFavoris();
        if (!favoris.includes(favori)) {
            favoris.push(favori);
            this.setFavoris(favoris);
        }
    }

    removeFavori(favori) {
        let favoris = this.getFavoris().filter(f => f !== favori);
        this.setFavoris(favoris);
    }
}

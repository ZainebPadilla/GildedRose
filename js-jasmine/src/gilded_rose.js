class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;

    // Ajout de nouvelles propriétés pour mieux catégoriser les objets
    this.legendary = false; // Pour identifier les objets légendaires (ex: Sulfuras)
    this.betterOlder = false; // Pour les objets qui s'améliorent avec le temps (ex: Aged Brie, Backstage passes)
    this.conjured = false; // Pour les objets Conjured qui se dégradent plus vite
    this.expireSpeed = 1; // Vitesse normale de dégradation
  }

  // Fonction pour analyser le nom de l'objet et lui attribuer les bonnes propriétés
  checkName() {
    if (this.name.includes('Backstage passes', 0) || this.name.includes('Aged Brie', 0)) {
      this.betterOlder = true; // Ces objets deviennent meilleurs avec le temps
    } else if (this.name.includes('Sulfuras, Hand of Ragnaros', 0)) {
      this.legendary = true; // Objet légendaire, il ne change jamais
    } else if (this.name.includes('Conjured', 0)) {
      if (this.name.includes('Conjured Sulfuras, Hand of Ragnaros', 0)) {
        this.legendary = true; // Un Sulfuras conjured reste légendaire
      } else {
        this.conjured = true; // Objet conjured, il se dégrade plus vite
        this.expireSpeed = 2;
      }
    }
  }

  // Fonction qui s'assure que la qualité reste dans les limites (entre 0 et 50 sauf Sulfuras)
  qualityExceeded() {
    if (this.quality >= 50 || this.quality <= 0) {
      if (this.quality > 50) this.quality = 50; // Limite max 50 sauf Sulfuras
      if (this.quality < 0) this.quality = 0; // La qualité ne peut pas être négative
    }
  }

  // Fonction qui gère les objets expirés
  isExpired() {
    if (this.sellIn <= 0) {
      if (this.betterOlder) {
        this.quality = 0; // Les Backstage passes tombent à 0 après expiration
      } else {
        this.expireSpeed = 2; // Les objets normaux se dégradent 2× plus vite après expiration

        if (this.conjured) this.expireSpeed = 4; // Les objets conjured se dégradent encore plus vite

        this.quality -= this.expireSpeed;
        this.qualityExceeded(); // Vérifie qu'on ne descend pas sous 0
      }
      this.sellIn--; // Réduit le nombre de jours restants
      return true;
    }
    return false;
  }

  // Fonction qui applique les changements quotidiens de qualité et de sellIn
  dailyCount() {
    if (this.legendary) {
      this.quality = 80; // Un objet légendaire garde toujours la même qualité
      return;
    }

    if (this.isExpired()) return; // Si l'objet est expiré, on ne fait plus rien ici

    if (this.betterOlder) {
      // Les objets qui s'améliorent avec le temps (Aged Brie, Backstage passes)
      if (this.sellIn <= 10 && this.sellIn > 5) {
        this.quality += 2; // Augmentation rapide quand on approche la date
      } else if (this.sellIn <= 5) {
        this.quality += 3; // Encore plus rapide !
      } else {
        this.quality++; // Augmentation normale
      }
    } else {
      this.quality -= this.expireSpeed; // Dégradation normale
    }

    this.qualityExceeded(); // Vérifie les limites de qualité
    this.sellIn--; // Diminue le nombre de jours restants
  }
}

class Shop {
  constructor(items=[]) {
    this.items = items;
  }

  // Fonction principale qui met à jour tous les objets chaque jour
  updateQuality() {
    this.items.forEach((product) => {
      product.checkName(); // Détermine les propriétés spéciales de l'objet
      product.dailyCount(); // Applique les règles quotidiennes de mise à jour
    });

    return this.items; // Retourne la liste mise à jour
  }
}

module.exports = {
  Item,
  Shop
};

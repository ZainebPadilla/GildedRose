const { Shop, Item } = require('../src/gilded_rose.js');

describe("Gilded Rose", function () {
  let listItems;

  beforeEach(() => {
    listItems = []; // Réinitialisation de la liste des items avant chaque test
  });

  it("Test complet sur plusieurs jours", () => {
    const items = [
      new Item("+5 Dexterity Vest", 10, 20), // Objet normal
      new Item("Aged Brie", 2, 0), // Devient meilleur avec le temps
      new Item("Elixir of the Mongoose", 5, 7), // Objet normal
      new Item("Sulfuras, Hand of Ragnaros", 0, 80), // Objet légendaire, ne change jamais
      new Item("Sulfuras, Hand of Ragnaros", -1, 80), // Test pour Sulfuras avec date expirée
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20), // Augmente en qualité en approchant du concert
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49), // Test qualité proche de la limite
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 39), // Test avec 5 jours restants
      new Item("Conjured Mana Cake", 3, 6), // Objet Conjured qui se dégrade plus vite
    ];

    const days = 5; // On veut voir ce qui se passe sur 5 jours
    const gildedRose = new Shop(items); // On met les objets dans la boutique

    for (let day = 0; day < days; day++) {
      console.log(`\n-------- Jour ${day} --------`);
      console.log("Nom, jours restants, qualité");
      
      // On affiche chaque objet avant mise à jour
      items.forEach(item => console.log(`${item.name}, ${item.sellIn}, ${item.quality}`));
      
      gildedRose.updateQuality(); // On met à jour les objets (ils vieillissent)
    }
  });

  // 🛠️ TEST 2 : Vérifier que les objets normaux perdent 1 en qualité et en sellIn
  it("Baisser de 1 la qualité et la date de péremption d'items normaux", () => {
    listItems.push(new Item('+5 Dexterity Vest', 10, 20)); // Un objet normal
    listItems.push(new Item('Elixir of the Mongoose', 5, 7)); // Un autre objet normal

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    // On s'attend à ce que la qualité et la date de péremption diminuent de 1
    const expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 4, quality: 6 },
    ];

    // On vérifie que le code fonctionne comme prévu
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  // 🛠️ TEST 3 : Aged Brie et Backstage Pass augmentent en qualité
  it('Augmenter la qualité de 1 pour Aged Brie et Backstage pass', () => {
    listItems.push(new Item('Aged Brie', 20, 30)); // Le Brie vieillit bien, sa qualité augmente
    listItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 20, 30)); // Idem pour les billets de concert

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    // La qualité doit avoir augmenté de 1
    const expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
    ];

    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  // 🛠️ TEST 4 : Sulfuras ne change jamais
  it('Ne pas modifier la qualité de Sulfuras', () => {
    listItems.push(new Item('Sulfuras, Hand of Ragnaros', 5, 50)); // Objet légendaire

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    // Sulfuras est spécial, il ne vieillit pas et ne perd pas de qualité
    const expected = [
      { quality: 80 },
    ];

    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  // 🛠️ TEST 5 : Un objet ne peut jamais avoir une qualité négative
  it("La qualité ne peux pas passer sous 0", () => {
    listItems.push(new Item('+5 Dexterity Vest', 10, 0)); // Qualité déjà à 0
    listItems.push(new Item('Top quality cake', -1, 0)); // Déjà périmé

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    // On s'assure que la qualité ne descend pas en dessous de 0
    const expected = [
      { quality: 0 },
      { quality: 0 },
    ];

    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  // 🛠️ TEST 6 : Les objets "Conjured" se détériorent deux fois plus vite
  it("Réduire deux fois plus rapidement la qualité des items Conjured", () => {
    listItems.push(new Item("Conjured Elixir of the Mongoose", 5, 7));
    listItems.push(new Item("Conjured Mana Cake", 3, 6));
    listItems.push(new Item("Conjured +5 Dexterity Vest", 0, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    // Comme ce sont des objets "Conjured", leur qualité baisse 2 fois plus vite
    const expected = [
      { sellIn: 4, quality: 5 }, // 7 - 2 = 5
      { sellIn: 2, quality: 4 }, // 6 - 2 = 4
      { sellIn: -1, quality: 16 }, // 20 - 4 (car date dépassée) = 16
    ];

    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

});
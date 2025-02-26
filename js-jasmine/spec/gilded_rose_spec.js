const {Shop, Item} = require('../src/gilded_rose.js');

describe("Gilded Rose", function() {
  let listItems;

  beforeEach(() => {
    listItems = [];
  });

  it("test complet", () => {
    const items = [
      new Item("+5 Dexterity Vest", 10, 20),
      new Item("Aged Brie", 2, 0),
      new Item("Elixir of the Mongoose", 5, 7),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 39),
    
      // This Conjured item does not work properly yet
      new Item("Conjured Mana Cake", 3, 6),
    ];
    
    const days = 5;
    const gildedRose = new Shop(items);

    for (let day = 0; day < days; day++) {
      console.log(`\n-------- day ${day} --------`);
      console.log("name, sellIn, quality");
      items.forEach(item => console.log(`${item.name}, ${item.sellIn}, ${item.quality}`));
      gildedRose.updateQuality();
    }
  });

  it("Baisser de 1 la qualité et la date de péremption d'item normaux", () => {
    listItems.push(new Item('+5 Dexterity Vest', 10, 20));
    listItems.push(new Item('Elixir of the Mongoose',  5, 7));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 4, quality: 6 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it('Augmenter la qualité de 1 pour Aged Brie et Backstage pass', () => {
    listItems.push(new Item('Aged Brie', 20, 30));
    listItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 20, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it('Augmenter la qualité de 3 quand il reste 5 jours ou moins avant la deadline du brie ou de backstage', () => {
    listItems.push(new Item('Aged Brie', 5, 30));
    listItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 4, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 4, quality: 33 },
      { sellIn: 3, quality: 33 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it('Ne pas modifier la qualité de Sulfuras', () => {
    listItems.push(new Item('Sulfuras, Hand of Ragnaros', 5, 50));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { quality: 80 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  it("Réduire deux fois plus rapidement la qualité des items une fois la dates de péremption dépassée", () => {
    listItems.push(new Item('+5 Dexterity Vest', 10, 20));
    listItems.push(new Item('Top quality cake', -1, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: -2, quality: 18 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("La qualité ne peux pas passer sous 0", () => {
    listItems.push(new Item('+5 Dexterity Vest', 10, 0));
    listItems.push(new Item('Top quality cake', -1, 0));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { quality: 0 },
      { quality: 0 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  it("La qualité des produits ne peux pas passer au-dessus de 50 (sauf sulfuras qui pete des fiak)", () => {
    listItems.push(new Item('Sulfuras, Hand of Ragnaros', 10, 50));
    listItems.push(new Item('Aged Brie', 5, 50));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 9, quality: 80 },
      { sellIn: 4, quality: 50 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  it("La qualité des pass Backstage tombe à 0 après le concert", () => {
    listItems.push(new Item('Backstage passes', 0, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: -1, quality: 0 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  //test bonus

  it('Modifier la qualité de Sulfuras si elle est Conjured (nan je rigole elle peux pas être conjured elle est mythique !!!!)', () => {
    listItems.push(new Item('Conjured Sulfuras, Hand of Ragnaros', 5, 80));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 4, quality: 80 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  it('Augmenter la qualité de 2 quand il reste 10 jours ou moins et plus de 5 avant la deadline du brie ou de backstage', () => {
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 10, 28));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 5, 28));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 14, quality: 21 },
      { sellIn: 9, quality: 50 },
      { sellIn: 9, quality: 30 },
      { sellIn: 4, quality: 31 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Réduire deux fois plus rapidement la qualité des items Conjured, avec ou sans dépassement de la date", () => {
    listItems.push(new Item("Conjured Elixir of the Mongoose", 5, 7));
    listItems.push(new Item("Conjured Mana Cake", 3, 6));
    listItems.push(new Item("Conjured +5 Dexterity Vest", 0, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 4, quality: 5 },
      { sellIn: 2, quality: 4 },
      { sellIn: -1, quality: 16 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it('Est ce que Sulfura perd en qualité si elle pourris ? je ne crois pas', () => {
    listItems.push(new Item('Conjured Sulfuras, Hand of Ragnaros', 0, 80));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: -1, quality: 80 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

});
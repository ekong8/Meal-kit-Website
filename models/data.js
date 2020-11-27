var packages = {
  fakeDB: [],
  init() {
    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/Apr201810/thumb_onmenu/0KukMTgNAmSrzOo.jpg",
      name: "Squid mixed stew",
      included: "Squid, Pork, Shrimp, Cabbage, Scallion, Onion, Squash, Potato",
      price: "$15.95",
      desc: "Squid meets pork belly in this savory and spicy stew",
      cookingTime: "11 minutes",
      category: "classic",
      servings: "1",
      calories: "400",
      topmenu: true,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/May201902/thumb_onmenu/Te8GBOF3aji9SUH.jpg",
      name: "Seafood scallion pancake",
      included:
        "Shrimp, Squid, Scallion, Onion, Carrot, Green chili pepper, Garlic",
      price: "$11.49",
      desc:
        "Squid, shrimp and vegetables mixed into a healthy pancake mix to provide a nutritious meal.",
      cookingTime: "14 minutes",
      category: "classic",
      servings: "2",
      calories: "469",
      topmenu: true,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/May201808/thumb_onmenu/kJFf9lzahs0HUvM.jpg",
      name: "Bibimbap",
      included:
        "Beef, Carrot, Squash, Cucumber, Korean radish, Shitake mushroom, Egg",
      price: "$12.95",
      desc:
        "Colorful, healthy and delicious. Nutritionally packed with variety of veggies and no sub-therapeutic antibiotic beef (rice not included).",
      cookingTime: "10 minutes",
      category: "easy-prep",
      servings: "1",
      calories: "476",
      topmenu: true,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/Apr201826/thumb_onmenu/2wWgLHpvq9eTJUh.jpg",
      name: "Black bean noodle",
      included: "Shrimp, Onion, Scallion, Pork, Squash, Garlic, Sesame Oil",
      price: "$11.95",
      desc: "Possibly the best black bean noodle ever without any MSG.",
      cookingTime: "8 minutes",
      category: "easy-prep",
      servings: "1",
      calories: "592",
      topmenu: true,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/Mar201813/thumb_home/Pmhwko9MgDBXICc.jpg",
      name: "Chewy pork belly",
      included:
        "Pork belly, Garlic, Onion, Carrot, Green chili pepper, Scallion",
      price: "$11.95",
      desc:
        "To suit your much needed craving, this dish is sure to satisfy for either lunch or dinner! Subtle hints of ginger and teriyaki sauce",
      cookingTime: "8 minutes",
      category: "classic",
      servings: "1",
      calories: "609",
      topmenu: false,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/May201902/thumb_onmenu/3vrJnFuiIa8N5lX.jpg",
      name: "Bulgogi casserole",
      included:
        "Beef, Green chili pepper, Cellophane noodle, Enoki mushroom, King oyster mushroom, Korean cabbage, Korean radish, Onion, Garlic, Carrot, Scallion",
      price: "$20.95",
      desc:
        "Deep savory flavored beef with variety of mushrooms makes this Korean dish as healthy as its rich flavors",
      cookingTime: "11 minutes",
      category: "classic",
      servings: "2",
      calories: "561",
      topmenu: false,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/Apr201826/thumb_onmenu/Vy9702N1Z3vOWRX.jpg",
      name: "Bulgogi with Eggplant",
      included: "Beef, Eggplant, Garlic, Green chili pepper, Carrot, Onion",
      price: "$11.95",
      desc:
        "Unlikely meeting between bulgogi and aggplant brings out a surprisingly complimentary delicious flavors.",
      cookingTime: "10 minutes",
      category: "classic",
      servings: "1",
      calories: "507",
      topmenu: false,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/Apr201803/thumb_onmenu/hIHSdK39xzyM8BO.jpg",
      name: "Army base stew",
      included:
        "Sausage, Bacon, Kimchi, Onion, Scallion, Cellophane noodle, Enoki mushroom, Carrot",
      price: "$13.95",
      desc:
        "A beloved Korean stew with an interesting origin story. Except in this one, there is no MSG and includes Angus beef sausages.",
      cookingTime: "10 minutes",
      category: "classic",
      servings: "1",
      calories: "743",
      topmenu: false,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/Aug202009/thumb_onmenu/rZJF416yH2GRzTQ.jpg",
      name: "Cold Soba noodles",
      included: "Buckwheat noodle, Korean radish, Scallion, Wassabi",
      price: "$9.95",
      desc:
        "Made with healthy buckwheat noodle along with doofood's own MSG-free dipping sauce.",
      cookingTime: "6 minutes",
      category: "easy-prep",
      servings: "1",
      calories: "751",
      topmenu: false,
    })

    this.fakeDB.push({
      img:
        "https://www.doofood.com/assets/shared/images/recipe/May201822/thumb_onmenu/T1Pp4IdbYrkq5mx.jpg",
      name: "Pork with chives",
      included:
        "Pork, Carrot, Onion, Garlic, Green chili pepper, Chive, Butter",
      price: "$10.95",
      desc:
        "Refreshing flavor of chives compliments savory flavor of pork in this healthy Korean dish.",
      cookingTime: "6 minutes",
      category: "easy-prep",
      servings: "1",
      calories: "649",
      topmenu: false,
    })
  },

  getAllData() {
    return this.fakeDB
  },
}

packages.init()
module.exports = packages

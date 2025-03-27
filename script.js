/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
    Beef: "whiskey",
    Chicken: "gin",
    Dessert: "amaretto",
    Lamb: "vodka",
    Miscellaneous: "vodka",
    Pasta: "tequila",
    Pork: "tequila",
    Seafood: "rum",
    Side: "brandy",
    Starter: "rum",
    Vegetarian: "gin",
    Breakfast: "vodka",
    Goat: "whiskey",
    Vegan: "rum",
    // Add more if needed; otherwise default to something like 'cola'
  };
  
  /*
      2) Main Initialization Function
         Called on page load to start all the requests:
         - Fetch random meal
         - Display meal
         - Map meal category to spirit
         - Fetch matching (or random) cocktail
         - Display cocktail
  */
  function init() {
    fetchRandomMeal()
      .then((meal) => {
        displayMealData(meal);
        const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
        return fetchCocktailByDrinkIngredient(spirit);
      })
      .then((cocktail) => {
        displayCocktailData(cocktail);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  /*
   Fetch a Random Meal from TheMealDB
   Returns a Promise that resolves with the meal object
   */
  function fetchRandomMeal() {
      return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
          console.log("Meal Data:", data);
          return data.meals[0];
        });
  }
  
  /*
  Display Meal Data in the DOM
  Receives a meal object with fields like:
    strMeal, strMealThumb, strCategory, strInstructions,
    strIngredientX, strMeasureX, etc.
  */
  function displayMealData(meal) {
      let mealContainer = document.getElementById("mealContainer");
      mealContainer.textContent = "";
  
      let title = document.createElement("h2");
      title.textContent = meal.strMeal;
  
      let img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.alt = meal.strMeal;
  
      let category = document.createElement("p");
      category.innerHTML = "Category:", meal.strCategory;
  
      let ingredientsTitle = document.createElement("h3");
      ingredientsTitle.textContent = "Ingredients:";
  
      let ingredientsList = document.createElement("ul");
      getMealIngredients(meal).forEach(item => ingredientsList.appendChild(item));
  
      let instructionsTitle = document.createElement("h3");
      instructionsTitle.textContent = "Instructions:";
  
      let instructions = document.createElement("p");
      instructions.textContent = meal.strInstructions;
  
      mealContainer.append(title, img, category, ingredientsTitle, ingredientsList, instructionsTitle, instructions);
  }
  
  function getMealIngredients(meal) {
    let ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      let ingredient = meal[`strIngredient${i}`];
      let measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        let li = document.createElement("li");
        li.textContent = `${measure} ${ingredient}`;
        ingredients.push(li);
      }
    }
  
    return ingredients;
  }
  
  /*
  Convert MealDB Category to a TheCocktailDB Spirit
  Looks up category in our map, or defaults to 'cola'
  */
  function mapMealCategoryToDrinkIngredient(category) {
    if (!category) return "cola";
    return mealCategoryToCocktailIngredient[category] || "cola";
  }
  
  /*
  Fetch a Cocktail Using a Spirit from TheCocktailDB
  Returns Promise that resolves to cocktail object
  We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
  Don't forget encodeURIComponent()
  If no cocktails found, fetch random
  */
  function fetchCocktailByDrinkIngredient(drinkIngredient) {
      return fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkIngredient)}`)
        .then(response => response.json())
        .then(data => {
          console.log("Cocktail Data:", data);
          return data.drinks ? data.drinks[0] : fetchRandomCocktail();
        });
  }
  
  /*
  Fetch a Random Cocktail (backup in case nothing is found by the search)
  Returns a Promise that resolves to cocktail object
  */
  function fetchRandomCocktail() {
      return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            console.log("Random Cocktail Data:", data);
            return data.drinks[0];
        });
  }
  
  /*
  Display Cocktail Data in the DOM
  */
  function displayCocktailData(cocktail) {
      let cocktailContainer = document.getElementById("cocktailContainer");
      cocktailContainer.textContent = "";
  
      let title = document.createElement("h2");
      title.textContent = cocktail.strDrink;
  
      let img = document.createElement("img");
      img.src = cocktail.strDrinkThumb;
      img.alt = cocktail.strDrink;
  
      let ingredientsTitle = document.createElement("h3");
      ingredientsTitle.textContent = "Ingredients:";
  
      let ingredientsList = document.createElement("ul");
      getCocktailIngredients(cocktail).forEach(item => ingredientsList.appendChild(item));
  
      let instructionsTitle = document.createElement("h3");
      instructionsTitle.textContent = "Instructions:";
  
      let instructions = document.createElement("p");
      instructions.textContent = cocktail.strInstructions;
  
      cocktailContainer.append(title, img, ingredientsTitle, ingredientsList, instructionsTitle, instructions);
  }
  
  function getCocktailIngredients(cocktail) {
    let ingredients = [];
  
    for (let i = 1; i <= 15; i++) {
      let ingredient = cocktail[`strIngredient${i}`];
      let measure = cocktail[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        let li = document.createElement("li");
        li.textContent = `${measure ? measure : ""} ${ingredient}`;
        ingredients.push(li);
      }
    }
    return ingredients;
  }
  
  /*
  Call init() when the page loads
  */
  window.onload = init;
  
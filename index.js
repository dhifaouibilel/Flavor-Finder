import express from 'express'
import { flagEmoji } from "./utils/flags.js";
import { mealApi } from "./services/mealApi.js";
import { cocktailApi } from "./services/cocktailApi.js";
const app = express()
const port = process.env.PORT || 3000



app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', async(req, res)=>{
    try {        
        const [randomMeal, categories, areas, ingredients, cocktailsAlco, cocktailsVirgin, randomCocktail] = await Promise.all([
      mealApi.getRandom(),
      mealApi.getCategories(),
      mealApi.getAreas(),
      mealApi.getIngredients(),
      cocktailApi.filterByAlcohol("Alcoholic"),
    //   cocktailApi.filterByIngredient("Alcoholic"),
      cocktailApi.filterByAlcohol("Non_Alcoholic"),
      cocktailApi.getRandom(),
    ]);
        
        
        res.render("home.ejs", {
            randomMeal: randomMeal.data.meals[0],
            categories: categories.data.categories,
            areas: areas.data.meals,
            cocktails: cocktailsAlco.data.drinks.slice(0, 6),
            virginCocktails: cocktailsVirgin.data.drinks.slice(0, 6),
            randomCocktail: randomCocktail.data.drinks[0], 
            ingredients: ingredients.data.meals, 
            flagEmoji
        })

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.get('/recipe/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await mealApi.getById(id);
        const meal = result.data.meals ? result.data.meals[0] : null;

        if (!meal) {
            return res.status(404).send('Recipe not found');
        }

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    ingredient: ingredient.trim(),
                    measure: measure ? measure.trim() : ''
                });
            }
        }

        const instructions = meal.strInstructions
            ? meal.strInstructions
                .split(/\r\n|\n/)
                .map(s => s.trim())
                .filter(Boolean)
                .filter(s => !/^step\s*\d+[:.]?$/i.test(s))
            : [];

        const tags = meal.strTags
            ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean)
            : [];

        let youtubeEmbed = null;
        if (meal.strYoutube) {
            const match = meal.strYoutube.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (match) youtubeEmbed = `https://www.youtube.com/embed/${match[1]}`;
        }

        let related = [];
        if (meal.strCategory) {
            const relatedResult = await mealApi.filterByCategory(meal.strCategory);
            related = (relatedResult.data.meals || [])
                .filter(m => m.idMeal !== meal.idMeal)
                .slice(0, 4);
        }

        res.render('recipe.ejs', { meal, ingredients, instructions, tags, youtubeEmbed, related });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.get('/category/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const categoriesResult = await mealApi.getCategories();
        const categories = categoriesResult.data.categories || [];
        const category = categories.find(c => c.strCategory.toLowerCase() === name.toLowerCase());

        let meals;
        if (category) {
            const filterResult = await mealApi.filterByCategory(category.strCategory);
            meals = filterResult.data.meals || [];
        } else {
            const searchResult = await mealApi.search(name);
            meals = searchResult.data.meals || [];
        }

        res.render('category.ejs', { name, meals, categories, category });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.get('/ingredient/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const [ingredientsResult, mealsResult] = await Promise.all([
            mealApi.getIngredients(),
            mealApi.filterByIngredient(name),
        ]);

        const allIngredients = ingredientsResult.data.meals || [];
        const query = name.toLowerCase();

        const ingredient = allIngredients.find(i => i.strIngredient.toLowerCase() === query);
        const meals = mealsResult.data.meals || [];
        const noExactMatch = !ingredient;

        const partialMatches = allIngredients
            .filter(i => i.strIngredient.toLowerCase() !== query && i.strIngredient.toLowerCase().includes(query))
            .slice(0, 12);

        const suggestions = noExactMatch && partialMatches.length
            ? partialMatches
            : allIngredients
                .filter(i => i.strIngredient.toLowerCase() !== query)
                .sort(() => Math.random() - 0.5)
                .slice(0, 12);

        res.render('ingredient.ejs', { name, ingredient, meals, suggestions, noExactMatch });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.get('/area', async (req, res) => {
    try {
        const areasResult = await mealApi.getAreas();
        const allAreas = areasResult.data.meals || [];
        const suggestions = [...allAreas].sort((a, b) => a.strArea.localeCompare(b.strArea));

        res.render('area.ejs', {
            name: '',
            area: null,
            meals: [],
            suggestions,
            noExactMatch: false,
            noSelection: true,
            flagEmoji
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.get('/area/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const [areasResult, mealsResult] = await Promise.all([
            mealApi.getAreas(),
            mealApi.filterByArea(name),
        ]);

        const allAreas = areasResult.data.meals || [];
        const query = name.toLowerCase();

        const area = allAreas.find(a => a.strArea.toLowerCase() === query);
        const meals = mealsResult.data.meals || [];
        const noExactMatch = !area;

        const partialMatches = allAreas
            .filter(a => a.strArea.toLowerCase() !== query && a.strArea.toLowerCase().includes(query))
            .slice(0, 12);

        const suggestions = noExactMatch && partialMatches.length
            ? partialMatches
            : allAreas
                .filter(a => a.strArea.toLowerCase() !== query)
                .sort(() => Math.random() - 0.5)
                .slice(0, 12);

        res.render('area.ejs', { name, area, meals, suggestions, noExactMatch, noSelection: false, flagEmoji });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.get('/cocktails', async (req, res) => {
    try {
        const q = (req.query.q || '').trim();

        let searchResults = null;
        if (q) {
            const searchResult = await cocktailApi.search(q);
            searchResults = searchResult.data.drinks || [];
        }

        const [alco, virgin] = await Promise.all([
            cocktailApi.filterByAlcohol('Alcoholic'),
            cocktailApi.filterByAlcohol('Non_Alcoholic'),
        ]);

        res.render('cocktails.ejs', {
            q,
            searchResults,
            cocktails: alco.data.drinks || [],
            virginCocktails: virgin.data.drinks || [],
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.get('/cocktail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await cocktailApi.getById(id);
        const drink = result.data.drinks ? result.data.drinks[0] : null;

        if (!drink) {
            return res.status(404).send('Cocktail not found');
        }

        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    ingredient: ingredient.trim(),
                    measure: measure ? measure.trim() : ''
                });
            }
        }

        const tags = drink.strTags
            ? drink.strTags.split(',').map(t => t.trim()).filter(Boolean)
            : [];

        let youtubeEmbed = null;
        if (drink.strVideo) {
            const match = drink.strVideo.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (match) youtubeEmbed = `https://www.youtube.com/embed/${match[1]}`;
        }

        let related = [];
        if (drink.strCategory) {
            const relatedResult = await cocktailApi.filterByCategory(drink.strCategory);
            related = (relatedResult.data.drinks || [])
                .filter(d => d.idDrink !== drink.idDrink)
                .slice(0, 4);
        }

        res.render('cocktail.ejs', { drink, ingredients, tags, youtubeEmbed, related });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})


app.listen(port, ()=>{
    console.log(`server running in port ${port}`);
    
})
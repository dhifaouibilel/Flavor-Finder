<div align="center">
  <img src="public/images/favicon.svg" width="72" height="72" alt="FlavorFinder logo" />

  # FlavorFinder

  Discover, cook, and pair recipes from around the world — with a cocktail to match.

  **[🌐 Live site](https://flavorfinder-kcvf.onrender.com/)**
</div>

---

## About

FlavorFinder is a recipe discovery app built on top of the [TheMealDB](https://www.themealdb.com/) and [TheCocktailDB](https://www.thecocktaildb.com/) APIs. Browse recipes by category, country, or ingredient, search cocktails to pair with your meal, and dive into full step-by-step instructions for both.

> Free-tier hosting — the site sleeps after inactivity and can take ~30s to wake up on the first visit.

## Features

- 🍽️ **Recipe details** — ingredients, step-by-step instructions, video tutorial, and related recipes
- 🗂️ **Browse by category** — quick category switcher with a live recipe grid
- 🥕 **Ingredient search** — with "did you mean" suggestions when the input is incomplete
- 🌍 **Browse by country** — explore cuisines by nation, with the same smart search
- 🍸 **Cocktails** — pairing suggestions, a full alcoholic/non-alcoholic browser, and detailed cocktail recipes
- 🔎 **Home search** — quick-tag search and smooth-scroll navigation

## Tech stack

- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- [EJS](https://ejs.co/) templating
- [Axios](https://axios-http.com/) for API requests
- [TheMealDB](https://www.themealdb.com/api.php) & [TheCocktailDB](https://www.thecocktaildb.com/api.php) free APIs
- Hosted on [Render](https://render.com/)

## Getting started

```bash
git clone https://github.com/dhifaouibilel/Flavor-Finder.git
cd Flavor-Finder
npm install
npm start
```

The app runs on `http://localhost:3000` by default (or `process.env.PORT` if set).

## Project structure

```
.
├── index.js                 # Express app & routes
├── services/                # TheMealDB / TheCocktailDB API clients
├── utils/flags.js           # Country name → flag emoji
├── views/                   # EJS pages & partials
└── public/                  # Static assets (styles, images)
```

## Credits

Recipe and cocktail data provided by [TheMealDB](https://www.themealdb.com/) and [TheCocktailDB](https://www.thecocktaildb.com/).

## License

ISC © Bilel DH

import axios from "axios";
const BASE = "https://www.thecocktaildb.com/api/json/v1/1";

export const cocktailApi = {
  search:          (q)   => axios.get(`${BASE}/search.php?s=${q}`),
  getRandom:       ()    => axios.get(`${BASE}/random.php`),
  filterByAlcohol: (a)   => axios.get(`${BASE}/filter.php?a=${a}`),
  filterByCategory:(c)   => axios.get(`${BASE}/filter.php?c=${c}`),
  filterByIngredient:(i) => axios.get(`${BASE}/filter.php?i=${i}`),
  getById:         (id)  => axios.get(`${BASE}/lookup.php?i=${id}`),
  searchIngredient:(i)   => axios.get(`${BASE}/search.php?i=${i}`),
};
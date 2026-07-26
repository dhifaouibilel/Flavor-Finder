import axios from "axios";
const BASE = "https://www.themealdb.com/api/json/v1/1"

export const mealApi = {
  search:          (q)   => axios.get(`${BASE}/search.php?s=${q}`),
  getRandom:       ()    => axios.get(`${BASE}/random.php`),
  filterByArea:    (a)   => axios.get(`${BASE}/filter.php?a=${a}`),
  filterByCategory:(c)   => axios.get(`${BASE}/filter.php?c=${c}`),
  filterByIngredient:(i) => axios.get(`${BASE}/filter.php?i=${i}`),
  getById:         (id)  => axios.get(`${BASE}/lookup.php?i=${id}`),
  getAreas:()   => axios.get(`${BASE}/list.php?a=list`),
  getCategories:()   => axios.get(`${BASE}/categories.php`),
  getIngredients:()   => axios.get(`${BASE}/list.php?i=list`),
};
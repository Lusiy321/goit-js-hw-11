import { page } from './search';
import axios from 'axios';
const URL =
  'https://pixabay.com/api/?key=31600470-cb6dfcad8308a56e880daea1a&q=';
const SET =
  '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=';

export async function fetchImg(value) {
  try {
    const res = await axios.get(`${URL}${value}${SET}${page}`);
    return res;
  } catch (e) {}
}

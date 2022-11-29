import { page } from './search';
import axios from 'axios';

const URL = 'https://pixabay.com/api/?key=';
const KEY = '31600470-cb6dfcad8308a56e880daea1a';
const SET =
  '&image_type=photo&orientation=horizontal&safesearch=true&per_page=';
export const PER_PAGE = 40;

export async function fetchImg(value, page) {
  try {
    const res = await axios.get(
      `${URL}${KEY}&q=${value}${SET}${PER_PAGE}&page=${page}`
    );
    return res;
  } catch (e) {
    return Error;
  }
}

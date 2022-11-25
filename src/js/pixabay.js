const URL =
  'https://pixabay.com/api/?key=31600470-cb6dfcad8308a56e880daea1a&q=';
const SET =
  '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=';
let page = 1;

export async function fetchImg(value) {
  const res = await fetch(`${URL}${value}${SET}${page}`);
  return await res.json();
}

const BASE_URL = 'https://restcountries.com/v2/name/';
const FILTER = '?fields=name,capital,population,flags,languages';

export async function fetchCountries(val) {
  const res = await fetch(`${BASE_URL}${val}${FILTER}`);
  return await res.json();
}

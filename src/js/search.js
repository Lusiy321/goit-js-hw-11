import { fetchImg } from './pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
export let page = 1;

const input = document.querySelector('#search-box');
const container = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const foundInfo = document.querySelector('.found');

form.addEventListener('submit', onSearch);

export function onSearch(e) {
  e.preventDefault();
  container.innerHTML = null;
  page = 1;
  const value = input.value.trim();
  fetchImg(value).then(res => createMarkup(res.data));
  return;
}
export function createMarkup(data) {
  if (data.total <= 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        opacity: 0.5,
        position: 'right-top',
        timeout: 1000,
        backOverlay: true,
        cssAnimationDuration: 2000,
        cssAnimationStyle: 'zoom',
      }
    );
    container.innerHTML = null;
    foundInfo.textContent = null;
  } else {
    foundInfo.textContent = `We found: ${data.total} images for you`;
    const markup = data.hits
      .map(
        item =>
          `<div class="photo-card" id="num">
        <a href="${item.largeImageURL}" class="galery__link" rel="noopener noreferrer">
        <img src="${item.webformatURL}" alt="${item.tags}" width="369" loading="lazy" />
        
        <div class="info">
          <p class="info-item">
            <b>Likes:<br> <span class="info-item__num">${item.likes}</span></b>
          </p>
          <p class="info-item">
            <b>Views:<br> <span class="info-item__num">${item.views}</span></b>
          </p>
          <p class="info-item">
            <b>Comments:<br> <span class="info-item__num">${item.comments}</span></b>
          </p>
          <p class="info-item">
            <b>Downloads:<br> <span class="info-item__num">${item.downloads}</span></b>
          </p>
        </div></a>
      </div>`
      )
      .join('');
    container.insertAdjacentHTML('beforeend', markup);
    new SimpleLightbox('.photo-card a', {
      fadeSpeed: 250,
      captionsData: 'alt',
    });
  }
  return;
}

window.addEventListener('scroll', debounce(loadMore), 300);

function loadMore() {
  const rect = document.documentElement.getBoundingClientRect();
  if (rect.bottom <= document.documentElement.clientHeight + 1000) {
    page += 1;
    const value = input.value.trim();
    fetchImg(value)
      .then(res => createMarkup(res.data))
      .catch(
        Error =>
          (Error = Notify.info(
            "We're sorry, but you've reached the end of search results.",
            {
              opacity: 0.8,
              position: 'right-top',
              timeout: 1000,
              backOverlay: true,
              cssAnimationDuration: 2000,
              cssAnimationStyle: 'zoom',
            }
          ))
      );
  }
  return;
}
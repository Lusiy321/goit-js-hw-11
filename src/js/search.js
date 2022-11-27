import { fetchImg } from './pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';
export let page = 1;

const input = document.querySelector('#search-box');
const container = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

form.addEventListener('submit', onSearch);

export function onSearch(e) {
  e.preventDefault();
  const value = input.value.trim();
  fetchImg(value)
    .then(data => createMarkup(data))
    .catch(e => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          opacity: 0.5,
          position: 'right-top',
          timeout: 2000,
          backOverlay: true,
          cssAnimationDuration: 300,
          backOverlayColor: 'rgb(255,255,255)',
          cssAnimationStyle: 'zoom',
        }
      );
      return;
    });
}

export function createMarkup(imgData) {
  if (imgData.hits.length <= 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        opacity: 0.5,
        position: 'right-top',
        timeout: 1000,
        backOverlay: true,
        cssAnimationDuration: 500,
        cssAnimationStyle: 'zoom',
      }
    );
    container.innerHTML = null;
  } else {
    Notify.info(`"Hooray! We found ${imgData.total} images."`, {
      opacity: 0.5,
      position: 'right-top',
      timeout: 1000,
      backOverlay: true,
      cssAnimationDuration: 500,
      cssAnimationStyle: 'zoom',
    });
    const markup = imgData.hits
      .map(
        item =>
          `<div class="photo-card">
        <a href="${item.largeImageURL}" class="galery__link" rel="noopener noreferrer">
        <img src="${item.webformatURL}" alt="${item.tags}" width="369" loading="lazy" />
        
        <div class="info">
          <p class="info-item">
            <b>Likes: <span class="info-item__num">${item.likes}</span></b>
          </p>
          <p class="info-item">
            <b>Views: <span class="info-item__num">${item.views}</span></b>
          </p>
          <p class="info-item">
            <b>Comments: <span class="info-item__num">${item.comments}</span></b>
          </p>
          <p class="info-item">
            <b>Downloads: <span class="info-item__num">${item.downloads}</span></b>
          </p>
        </div></a>
      </div>`
      )
      .join('');
    container.innerHTML = markup;
    new SimpleLightbox('.photo-card a', {
      fadeSpeed: 250,
      captionsData: 'alt',
    });
    return;
  }
}

const loadBtn = document.querySelector('.load-more');
loadBtn.addEventListener('click', loadMore);

function loadMore() {
  page += 1;
  const value = input.value.trim();
  fetchImg(value)
    .then(data => createMarkup(data))
    .catch(e => {});
}

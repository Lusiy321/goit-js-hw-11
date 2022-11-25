import { fetchImg } from './pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('#search-box');
const container = document.querySelector('.gallery');
const searchBtn = document.querySelector('.search_btn');
searchBtn.addEventListener('click', onSearch);

export function onSearch(e) {
  e.preventDefault();
  const value = input.value.trim();
  fetchImg(value)
    .then(data => createMarkup(data.hits))
    .catch(error => {
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

export function createMarkup(arr) {
  if (arr.length <= 0) {
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
  } else {
    const markup = arr
      .map(
        item =>
          `<div class="photo-card">
        <a href="${item.largeImageURL}" class="galery__link" rel="noopener noreferrer">
        <img src="${item.webformatURL}" alt="${item.tags}" width="370" loading="lazy" />
        
        <div class="info">
          <p class="info-item">
            <b>Likes: ${item.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${item.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${item.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${item.downloads}</b>
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

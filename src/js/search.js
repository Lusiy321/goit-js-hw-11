import { fetchImg, PER_PAGE } from './pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { simpleGallery } from './lightbox';

export let page = 1;
let totalHits = '';

const container = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const foundInfo = document.querySelector('.found');
const gg = document.querySelector('.js-gg');
let value = '';
form.addEventListener('submit', onSearch);

export async function onSearch(e) {
  e.preventDefault();
  observer.unobserve(gg);
  container.innerHTML = null;
  foundInfo.textContent = null;
  page = 1;
  value = e.currentTarget.searchQuery.value.trim();
  e.currentTarget.reset();
  if (!value) {
    Notify.failure('Wrong value', {
      opacity: 0.9,
      position: 'center-center',
      timeout: 2000,
      cssAnimationDuration: 1000,
      cssAnimationStyle: 'fade',
    });
    return;
  }
  try {
    await fetchImg(value, page).then(res => {
      totalHits = res.data.totalHits;
      if (!res.data.totalHits) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            opacity: 0.9,
            position: 'center-center',
            timeout: 2000,
            cssAnimationDuration: 1000,
            cssAnimationStyle: 'fade',
          }
        );
      } else if (totalHits < 40 && totalHits != 0) {
        Notify.info(
          "We're sorry, but you've reached the end of search results.",
          {
            opacity: 0.9,
            position: 'right-top',
            timeout: 2000,
            cssAnimationDuration: 1000,
            cssAnimationStyle: 'fade',
          }
        );
      }
      Notify.success(`Hooray! We found ${res.data.total} images.`, {
        opacity: 0.9,
        position: 'center-center',
        timeout: 2000,
        cssAnimationDuration: 1000,
        cssAnimationStyle: 'fade',
      });
      foundInfo.textContent = `We found: ${res.data.total} images for you`;
      createMarkup(res.data);
      simpleGallery.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      observer.observe(gg);
    });
  } catch (e) {
    return Error;
  }
}

export function createMarkup(data) {
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
  simpleGallery.refresh();
  return;
}

const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1.0,
};

export const observer = new IntersectionObserver(loadMore, options);

async function loadMore(entries, observer) {
  try {
    await entries.forEach(entries => {
      if (entries.isIntersecting) {
        page += 1;

        fetchImg(value, page).then(res => {
          createMarkup(res.data);
          const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        });

        if (page === Math.round(totalHits / PER_PAGE)) {
          observer.unobserve(gg);
          observerBottom.observe(gg);
          page = 1;
        }
      }
    });
  } catch (e) {
    return Error;
  }
}

const optionsBottom = {
  root: null,
  rootMargin: '10px',
  threshold: 1.0,
};

const observerBottom = new IntersectionObserver(OnBottomMessage, optionsBottom);

async function OnBottomMessage(entries) {
  await entries.forEach(entry => {
    if (entry.isIntersecting) {
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        {
          opacity: 0.9,
          position: 'center-center',
          timeout: 2000,
          cssAnimationDuration: 1000,
          cssAnimationStyle: 'fade',
        }
      );
    }
  });
}

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export let simpleGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  loop: true,
  captionDelay: 400,
  animationSpeed: 400,
  animationSlide: true,
});

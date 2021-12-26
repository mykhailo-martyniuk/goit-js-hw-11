import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotos } from './api';
import { delay, generateGallery, getQueryText, State } from './tools';
import { PER_PAGE } from './tools/constans';

const toggleLoading = () => {
  refs.loading.classList.toggle('is-hidden');
};

const state = new State(1, false, 1, toggleLoading);
const lightbox = new SimpleLightbox('.gallery a', {});
const refs = {
  loading: document.querySelector('#loading'),
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
  input: document.querySelector('#input'),
};

const handlerForm = async e => {
  e.preventDefault();
  const query = getQueryText(refs.input.value);
  if (query) {
    state.loading = true;
    state.page = 1;
    const { arrOfPhotos: data, total } = await getPhotos(
      query,
      state.page,
    );
    state.total = total;
    if (total) {
      const markdown = generateGallery(data);
      Notify.success(`Hooray! We found ${total} images.`);

      refs.gallery.innerHTML = markdown;
      lightbox.refresh();
      state.page++;
    } else {
      refs.gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    state.loading = false;
  }
};

const loadMore = async () => {
  state.loading = true;

  const { arrOfPhotos: data } = await getPhotos(
    getQueryText(refs.input.value),
    state.page,
  );

  const markdown = generateGallery(data);
  refs.gallery.insertAdjacentHTML('beforeend', markdown);

  lightbox.refresh();

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy(0, cardHeight * 2);

  state.page++;
  state.loading = false;
};

const infinityLoad = async () => {
  if (!state.loading && (state.page <= state.total / PER_PAGE)) {

    const contentHeight = refs.gallery.offsetHeight;
    const yOffset = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const end = yOffset + windowHeight;

    if (end >= contentHeight) {
      await loadMore();
    }
  }
};

window.addEventListener('scroll', infinityLoad);
refs.form.addEventListener('submit', handlerForm);

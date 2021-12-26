import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getPhotos } from './api';

const refiningPhotoData = rawData => {
  const arrOfPhotos = rawData.hits.map(el => ({
    smallImgURL: el.webformatURL,
    largeImgURL: el.largeImageURL,
    alt: el.tags,
    likes: el.likes,
    views: el.views,
    comments: el.comments,
    downloads: el.downloads,
  }));
  console.log('refiningPhotoData: ', arrOfPhotos);
  return { total: rawData.totalHits, arrOfPhotos };
};

const generatePhotoEl = ({
  smallImgURL,
  largeImgURL,
  alt,
  likes,
  views,
  comments,
  downloads,
}) => {
  return `
  <div class="photo-card">
    <img src="${smallImgURL}" alt="${alt}" loading="lazy" width="300px"/>
    <ul class="info">
      <li class="info-item">
        <b class="title">Likes</b>
        <p class="count">${likes}</p>
      </li>
      <li class="info-item">
        <b class="title">Views</b>
        <p class="count">${views}</p>
      </li>
      <li class="info-item">
        <b class="title">Comments</b>
        <p class="count">${comments}</p>
      </li>
      <li class="info-item">
        <b class="title">Downloads</b>
        <p class="count">${downloads}</p>
      </li>
    </ul>
  </div>`;
};

const generateGallery = photos => {
  return photos.map(photo => generatePhotoEl(photo)).join('');
};

const getQueryText = str => {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ /g, '+')
    .toLowerCase();
};

const refs = {
  loadMore: document.querySelector('#loadMore'),
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
  input: document.querySelector('#input'),
};

const state = { page: 1 };

const createMarkdown = async () => {
  const data = await getPhotos(
    getQueryText(refs.input.value),
    state.page,
  );
  const { arrOfPhotos: clearedData } = refiningPhotoData(data);
  const markdown = generateGallery(clearedData);

  return markdown;
};

const handlerForm = async e => {
  e.preventDefault();
  refs.loadMore.classList.add('is-hidden');
  state.page = 1;
  const data = await getPhotos(
    getQueryText(refs.input.value),
    state.page,
  );
  const { arrOfPhotos: clearedData, total } = refiningPhotoData(data);
  if (total) {
    const markdown = generateGallery(clearedData);
    Notify.success(`Hooray! We found ${total} images.`);

    refs.gallery.innerHTML = markdown;
    refs.loadMore.classList.remove('is-hidden');
    state.page++;
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }

  console.log('formData:', refs.input.value);
  console.log('formData2:', getQueryText(refs.input.value));
};

const handlerLoadMore = async () => {
  const markdown = await createMarkdown();
  refs.gallery.insertAdjacentHTML('beforeend', markdown);
  state.page++;
};

refs.form.addEventListener('submit', handlerForm);
refs.loadMore.addEventListener('click', handlerLoadMore);

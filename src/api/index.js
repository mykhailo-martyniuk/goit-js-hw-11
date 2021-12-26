import axios from 'axios';
import { API_KEY, PER_PAGE } from '../tools/constans';

const axiosInstance = axios.create({
  baseURL: 'https://pixabay.com/api',
});

const query = async (query, page = 1) => {
  const res = await axiosInstance.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true\
    &per_page=${PER_PAGE}&page=${page}`,
  );

  return res.data;
};

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
  return { total: rawData.totalHits, arrOfPhotos };
};

export const getPhotos = async (queryStr, page = 1) => {
  return refiningPhotoData(await query(queryStr, page));
};

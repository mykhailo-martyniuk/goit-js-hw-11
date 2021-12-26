import axios from 'axios';

const API_KEY = '24981883-cdf10776969878d5abe2cfe80';
const PER_PAGE = 40;

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

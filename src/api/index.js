import axios from 'axios';

const API_KEY = '24981883-cdf10776969878d5abe2cfe80';
const PER_PAGE = 40;

const axiosInstance = axios.create({
  baseURL: 'https://pixabay.com/api',
});

export const getPhotos = async (query, page = 1) => {
  console.log('getPhotos query: ', query);
  const res = await axiosInstance.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true\
    &per_page=${PER_PAGE}&page=${page}`,
  );
  console.log('res.data:', res.data);

  return res.data;
};

export function State(page, load, total, loadingCallback) {
  let loading = load;
  this.page = page;
  this.total = total

  Object.defineProperty(this, 'loading', {
    get() {
      return loading;
    },
    set(val) {
      loadingCallback();
      loading = val;
    },
  });

}

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
    <a href="${largeImgURL}"><img class="img" src="${smallImgURL}" alt="${alt}" loading="lazy" \
    width="300px" /></a>
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

export const generateGallery = photos => {
  return photos.map(photo => generatePhotoEl(photo)).join('');
};

export const getQueryText = str => {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ /g, '+')
    .toLowerCase();
};

export const delay = async (ms) => {
  return await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
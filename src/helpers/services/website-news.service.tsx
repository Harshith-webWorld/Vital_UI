import {
  postFormData,
  putFormData,
  deleteService,
  get,
} from '../fetchServicesMethods';
import { BASE_URL } from '../config';
import ENDPOINT from '../Api';
import { WebsiteContentNews } from '../interfaces/websitecontent-news';

async function getNewsInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_NEWS_LIST;
  try {
    return await get(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getoneNewsInfo(id: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_NEWS_GETONE + '/?id=' + id;
  try {
    return await get(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function postNews(news: WebsiteContentNews) {
  let url = BASE_URL + ENDPOINT.ADMIN_NEWS_POSTLIST;
  const formdata = new FormData();
  formdata.append('newsHeader', news.newsHeader);
  formdata.append('newsDescriptionShortHTML', news.newsDescriptionShortHTML);
  formdata.append('newsDescriptionLongHTML', news.newsDescriptionLongHTML);
  if (news.isVideoContent === true) {
    formdata.append('images', news.newsVideoName);
    formdata.append('isVideoContent', news.isVideoContent.toString());
  } else if (news.isNewsPaperCutting) {
    formdata.append('IsNewsPaperCutting', news.isNewsPaperCutting.toString());
    formdata.append('images', news.newsImageName);
  } else {
    formdata.append('images', news.newsImageName);
  }
  formdata.append('createdBy', news.createdBy.toString());
  formdata.append('lastModifiedBy', news.lastModifiedBy.toString());
  formdata.append('isActive', news.isActive.toString());
  formdata.append('isShowPublic', news.isShowPublic.toString());

  try {
    return await postFormData(url, formdata)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function updateNews(newsData: WebsiteContentNews, id) {
  const formdata = new FormData();
  let url = BASE_URL + ENDPOINT.ADMIN_NEWS_UPDATE + '/?id=' + id;
  formdata.append('newsHeader', newsData.newsHeader);
  formdata.append(
    'newsDescriptionShortHTML',
    newsData.newsDescriptionShortHTML,
  );
  formdata.append('newsDescriptionLongHTML', newsData.newsDescriptionLongHTML);
  if (newsData.isVideoContent === true) {
    formdata.append('images', newsData.newsVideoName);
    formdata.append('isVideoContent', newsData.isVideoContent.toString());
  } else if (newsData.isNewsPaperCutting) {
    formdata.append(
      'IsNewsPaperCutting',
      newsData.isNewsPaperCutting.toString(),
    );
    formdata.append('images', newsData.newsImageName);
  } else {
    formdata.append('images', newsData.newsImageName);
  }
  formdata.append('createdBy', newsData.createdBy.toString());
  formdata.append('lastModifiedBy', newsData.lastModifiedBy.toString());
  formdata.append('isActive', '' + newsData.isActive);
  formdata.append('isShowPublic', '' + newsData.isShowPublic);

  try {
    return await putFormData(url, formdata)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function deleteNews(id) {
  let url = BASE_URL + ENDPOINT.ADMIN_NEWS_DELETE + '/?id=' + id;
  try {
    return await deleteService(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

const NewsService = {
  getNewsInfo,
  getoneNewsInfo,
  postNews,
  updateNews,
  deleteNews,
};

export default NewsService;

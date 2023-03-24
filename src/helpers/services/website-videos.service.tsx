import {
  postFormData,
  putFormData,
  deleteService,
  get,
} from '../fetchServicesMethods';
import { BASE_URL } from '../config';
import ENDPOINT from '../Api';
async function getVideoInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_VIDEOS_LIST;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function createVideoInfo(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_VIDEOS_CREATE;

  const formdata = new FormData();
  formdata.append('videoHeader', values.videoHeader);
  formdata.append('videoHtmlText', values.videoHtmlText);
  formdata.append('videos', values.videoName);
  formdata.append('thumbnail', values.thumbnail);
  formdata.append('createdBy', values.createdBy.toString());
  formdata.append('lastModifiedBy', values.lastModifiedBy.toString());
  formdata.append('isActive', values.isActive.toString());
  formdata.append('isShowPublic', values.isShowPublic.toString());

  try {
    return await postFormData(url, formdata)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function editVideoInfo(id, values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_VIDEOS_UPDATE + '?id=' + id;

  const formdata = new FormData();
  formdata.append('videoHeader', values.videoHeader);
  formdata.append('videoHtmlText', values.videoHtmlText);
  formdata.append('videos', values.videoName);
  formdata.append('thumbnail', values.thumbnail);
  formdata.append('createdBy', values.createdBy.toString());
  formdata.append('lastModifiedBy', values.lastModifiedBy.toString());
  formdata.append('isActive', values.isActive.toString());
  formdata.append('isShowPublic', values.isShowPublic);

  try {
    return await putFormData(url, formdata)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function deleteVideoInfo(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_VIDEOS_DELETE + '?id=' + id;
  try {
    return await deleteService(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getOneVideoInfo(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_VIDEOS_LIST + '?id=' + id;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
const videoServices = {
  getVideoInfo,
  createVideoInfo,
  getOneVideoInfo,
  editVideoInfo,
  deleteVideoInfo,
};

export default videoServices;

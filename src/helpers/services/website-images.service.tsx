import {
  post,
  put,
  deleteService,
  get,
} from '../fetchServicesMethods';
import { BASE_URL } from '../config';
import ENDPOINT from '../Api';
import { WebsiteContentImages } from '../interfaces/websitecontent-images';

async function getImagesInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_IMAGES_LIST;
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

async function getoneImagesInfo(id: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_IMAGE_GETONE + '/?id=' + id;
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

async function postImageInfo(image: WebsiteContentImages) {
  let url = BASE_URL + ENDPOINT.ADMIN_IMAGE_POSTLIST;
  const formdata = new FormData();
  formdata.append('images', image.imageName);
  formdata.append('imageHeader', image.imageHeader);
  formdata.append('imageHtmlText', image.imageHtmlText);
  formdata.append('createdBy', image.createdBy.toString());
  formdata.append('lastModifiedBy', image.lastModifiedBy.toString());
  formdata.append('isShowPublic', image.isShowPublic.toString());
  formdata.append('isActive', image.isActive.toString());

  try {
    return await post(url, formdata)
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

async function updateImageInfo(imageData: WebsiteContentImages, id) {
  const formdata = new FormData();
  let url = BASE_URL + ENDPOINT.ADMIN_IMAGE_UPDATE + '/?id=' + id;
  formdata.append('images', imageData.imageName);
  formdata.append('imageHeader', imageData.imageHeader);
  formdata.append('imageHtmlText', imageData.imageHtmlText);
  formdata.append('createdBy', imageData.createdBy.toString());
  formdata.append('lastModifiedBy', imageData.lastModifiedBy.toString());
  formdata.append('isShowPublic', imageData.isShowPublic.toString());
  formdata.append('isActive', imageData.isActive.toString());
  console.log('Formdata', formdata);
  try {
    return await put(url, formdata)
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

async function deleteImageInfo(id) {
  let url = BASE_URL + ENDPOINT.ADMIN_IMAGE_DELETE + '/?id=' + id;
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

const ImagesService = {
  getImagesInfo,
  getoneImagesInfo,
  postImageInfo,
  updateImageInfo,
  deleteImageInfo,
};

export default ImagesService;

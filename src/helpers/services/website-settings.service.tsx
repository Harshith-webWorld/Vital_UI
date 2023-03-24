import { post, put, deleteService, get } from '../fetchServicesMethods';
import { BASE_URL } from '../config';
import ENDPOINT from '../Api';

async function getWebsiteSettingsDataInfo() {
  let url = BASE_URL + ENDPOINT.ADMIN_SETTINGS_GETLIST;
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

async function getOneWebsiteSettingsDataInfo(id: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_SETTINGS_GETONE + '/' + id;
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

async function postWebsiteSettingsData(settingsData) {
  let url = BASE_URL + ENDPOINT.ADMIN_SETTINGS_POST;
  console.log(JSON.stringify(settingsData));

  try {
    return await post(url, settingsData)
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

async function updateWebsiteSettingsData(settingsData, id) {
  let url = BASE_URL + ENDPOINT.ADMIN_SETTINGS_UPDATE + '/' + id;
  try {
    return await put(url, settingsData)
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

async function deleteWebsiteSettingsData(id) {
  let url = BASE_URL + ENDPOINT.ADMIN_SETTINGS_DELETE + '/' + id;
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
  getWebsiteSettingsDataInfo,
  getOneWebsiteSettingsDataInfo,
  postWebsiteSettingsData,
  updateWebsiteSettingsData,
  deleteWebsiteSettingsData,
};

export default ImagesService;

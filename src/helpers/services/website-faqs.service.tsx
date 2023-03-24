import { post, put, deleteService, get } from '../fetchServicesMethods';
import { BASE_URL } from '../config';
import ENDPOINT from '../Api';
async function getFaqsInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_FAQS_LIST;
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
async function createFaqsInfo(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_FAQS_CREATE;

  try {
    return await post(url, values)
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

async function editFaqsInfo(id, values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_FAQS_UPDATE + '?id=' + id;

  try {
    return await put(url, values)
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

async function deleteFaqsInfo(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_FAQS_DELETE + '?id=' + id;
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

async function getOneFaqsInfo(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_FAQS_GETONE + '?id=' + id;
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
const FaqsService = {
  getFaqsInfo,
  createFaqsInfo,
  getOneFaqsInfo,
  editFaqsInfo,
  deleteFaqsInfo,
};

export default FaqsService;

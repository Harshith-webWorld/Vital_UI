import { post,get } from "../fetchServicesMethods";
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";

async function getState() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_STATE;
  try {
    return await get(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getDistrict() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_DISTRICT;
  try {
    return await get(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getOneDistrict(id: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_DISTRICT_GETONE +
    `?stateId=14&id=${id}`;
  try {
    return await get(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function createOrUpdateDistrict(data: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_ZONE_DISTRICT_CREATE_OR_UPDATE;
  try {
    return await post(url, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

const districtService = {
  getState,
  getDistrict,
  getOneDistrict,
  createOrUpdateDistrict,
};

export default districtService;

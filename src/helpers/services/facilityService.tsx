import { post,get } from "../fetchServicesMethods";
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";

async function getFacility() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_FACILITY;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getOneFacility(id: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_ZONE_FACILITY_GET_ONLY_ONE + `?id=${id}`;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

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
    `?stateId=${id}`;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function gettaluka() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_TALUKA;
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

async function getOneTaluka(id: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_TALUKA_GETONE +
    `?districtId=${id}`;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function createOrUpdateFacility(data: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_ZONE_FACILITY_CREATE_OR_UPDATE;
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

const facilityService = {
  getFacility,
  getState,
  getDistrict,
  getOneDistrict,
  gettaluka,
  getOneTaluka,
  getOneFacility,
  createOrUpdateFacility,
};

export default facilityService;

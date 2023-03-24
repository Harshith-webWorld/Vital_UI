import { get } from "../fetchServicesMethods";
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";

async function getStateForTaluka() {
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

async function getDistrictInfoForTaluka() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_DISTRICT;
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

const talukaService = {
  gettaluka,
  getStateForTaluka,
  getDistrictInfoForTaluka,
};

export default talukaService;

import { post,get } from '../fetchServicesMethods';
import { BASE_URL } from '../config';
import ENDPOINT from '../Api';

async function GetEndemicityMapHome() {
  let url = BASE_URL + ENDPOINT.GET_ENDEMICITYMAP_HOME;
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

async function GetEndemicityMapAllDistricts(data) {
  let url = BASE_URL + ENDPOINT.GET_ENDEMICITYMAPALL_DISTRICTS;
  try {
    return await post(url, data)
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

async function GetEndemicityMapAllVillagesByTaluka(data) {
  let url = BASE_URL + ENDPOINT.GET_ENDEMICITYMAPALL_VILLAGESBYTALUKA;
  try {
    return await post(url, data)
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

async function GetEndemicityMapAllTaluksByDistrict(data) {
  let url = BASE_URL + ENDPOINT.GET_ENDEMICITYMAPALL_VILLAGESBY_DISTRICT;
  try {
    return await post(url, data)
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

async function GetDistrictsGeo() {
  let url = BASE_URL + ENDPOINT.GET_GEODATA_DISTRICT;
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

async function GetTalukasGeo(id: any) {
  let url = BASE_URL + ENDPOINT.GET_GEODATA_TALUKA +
  `?districtMapId=${id}`;
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

async function GetVillagesGeo(id: any) {
  let url = BASE_URL + ENDPOINT.GET_GEODATA_VILLAGE +
  `?talukaMapId=${id}`;
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

async function GetTownsGeo(id: any) {
  let url = BASE_URL + ENDPOINT.GET_GEODATA_VILLAGE +
  `?talukaMapId=${id}`;
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
const MapService = {
  GetEndemicityMapAllDistricts,
  GetEndemicityMapAllTaluksByDistrict,
  GetEndemicityMapAllVillagesByTaluka,
  GetDistrictsGeo,
  GetTalukasGeo,
  GetVillagesGeo,
  GetTownsGeo,
  GetEndemicityMapHome
};
export default MapService;

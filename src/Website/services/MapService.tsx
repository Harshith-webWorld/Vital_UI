import {
    post,
  } from "../../helpers/fetchServicesMethods";
  import { BASE_URL } from "../../helpers/config";
  import ENDPOINT from "../../helpers/Api";

 function GetEndemicityMapAllDistricts(data) {
    let url = BASE_URL + ENDPOINT.GET_ENDEMICITYMAPALL_DISTRICTS;
    try {
      return  post(url, data)
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


 function GetEndemicityMapAllVillagesByTaluka(data) {
    let url = BASE_URL + ENDPOINT.GET_ENDEMICITYMAPALL_VILLAGESBYTALUKA;
    try {
      return  post(url, data)
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

 function GetEndemicityMapAllTaluksByDistrict(data) {
    let url = BASE_URL + ENDPOINT.GET_ENDEMICITYMAPALL_VILLAGESBY_DISTRICT;
    try {
      return  post(url, data)
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

  

  const MapService={
    GetEndemicityMapAllDistricts,
    GetEndemicityMapAllTaluksByDistrict,
    GetEndemicityMapAllVillagesByTaluka,
  }
export default MapService;



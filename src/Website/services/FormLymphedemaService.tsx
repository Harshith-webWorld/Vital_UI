import {
  post,
  put,
  deleteService,
  get,
} from "../../helpers/fetchServicesMethods";
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function postLymphedemaPatientInformation(data: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_POST_PATIENT_INFORMATION;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function createAllLymphedemaLineList(data: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_CREATE;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function postSurvey(data: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_POST_SURVEY;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function postLFFollowups(data: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_POST_LF_FOLLOWUP;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function postHFFollowups(data: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_POST_HF_FOLLOWUP;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getLymphedemaPatientInformation(params: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_LIST;
  if(params){
    url = url + `?${objectToQueryString(params)}`
  }
  try {
    return await get(url)
      .then((response) => {
     //   console.log("get::", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getStep1Info(lineListId) {
  let url = BASE_URL + ENDPOINT.GET_LYMPHEDEMA_PATIENT_INFO+"/"+lineListId;
  try {
    return await get(url)
      .then((response) => {
      //  console.log("get::", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getOneLymphedemaPatientInformation(id) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_GETONE;
  try {
    return await get(url + `?id=${id}`)
      .then((response) => {
     //   console.log("get::", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getSurveyDetails(lymphedemaLineListId) {
  let url = BASE_URL + ENDPOINT.GET_SURVEY_LIST + "/" + lymphedemaLineListId;
  try {
    return await get(url)
      .then((response) => {
       // console.log("get::", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getLFFollowups(lymphedemaLineListId) {
  let url =
    BASE_URL + ENDPOINT.GET_LF_FOLLOWUPS_LIST + "/" + lymphedemaLineListId;
  try {
    return await get(url)
      .then((response) => {
      //  console.log("get::", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getHFFollowups(lymphedemaLineListId) {
  let url =
    BASE_URL + ENDPOINT.GET_HF_FOLLOWUPS_LIST + "/" + lymphedemaLineListId;
  try {
    return await get(url)
      .then((response) => {
       // console.log("get::", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function updateLymphedemaPatientInformation(data: any, id: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_UPDATE_PATIENT_INFORMATION +"/"+id;
  try {
    return await put(url, data)
      .then((response) => {
       // console.log("update", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function deleteLymphedemaPatientInformation(id: any) {
  let url = BASE_URL + ENDPOINT.LYMPHEDEMA_DELETE + "/?id=" + id;
  try {
    return await deleteService(url)
      .then((response) => {
       // console.log("update", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function deleteHFFollowups(data: any) {
  let url = BASE_URL + ENDPOINT.DELETE_HF_FOLLOWUP + "/" + data.id;
  try {
    return await deleteService(url)
      .then((response) => {
       // console.log("update", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function deleteSurvey(data: any) {
  let url = BASE_URL + ENDPOINT.DELETE_SURVEY + "/" + data.id;
  try {
    return await deleteService(url)
      .then((response) => {
       // console.log("update", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function deleteLFFollowups(data: any) {
  let url = BASE_URL + ENDPOINT.DELETE_LF_FOLLOWUP + "/" + data.id;
  try {
    return await deleteService(url)
      .then((response) => {
       // console.log("update", response);
        return response;
      })
      .catch((error) => {
        console.log("error::", error);
      });
  } catch (error) {
    console.error(error);
  }
}

const LymphedemaPatientInfoService = {
  postLymphedemaPatientInformation,
  getLymphedemaPatientInformation,
  postSurvey,
  getSurveyDetails,
  getLFFollowups,
  updateLymphedemaPatientInformation,
  deleteLymphedemaPatientInformation,
  getOneLymphedemaPatientInformation,
  createAllLymphedemaLineList,
  postLFFollowups,
  postHFFollowups,
  getHFFollowups,
  getStep1Info,
  deleteLFFollowups,
  deleteHFFollowups,
  deleteSurvey
};
export default LymphedemaPatientInfoService;

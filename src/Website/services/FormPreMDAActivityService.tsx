import {
  post,
  put,
  deleteService,
  get,
} from '../../helpers/fetchServicesMethods';
import {objectToQueryString} from './utils';
import { BASE_URL } from '../../helpers/config';
import ENDPOINT from '../../helpers/Api';

async function getPreMDAActivity(params: any) {
  let url = BASE_URL + ENDPOINT.PREMDAACTIVITY_LIST;
  if(params){
    url = url + `?${objectToQueryString(params)}`
  }
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

async function getPreMDAActivityDrugLogistics(id: any) {
  let url = BASE_URL + ENDPOINT.PREMDAACTIVITYDRUGLOGISTICS_LIST + '/' + id;
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
async function postPreMDAActivity(data) {
  let url = BASE_URL + ENDPOINT.PREMDAACTIVITY_CREATE;
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

async function postPreMDAActivityDrugLogistics(data) {
  let url = BASE_URL + ENDPOINT.PREMDAACTIVITYDRUGLOGISTICS_CREATE;

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
async function updatePreMDAActivity(data: any, id: any) {
  let url = BASE_URL + ENDPOINT.PREMDAACTIVITY_UPDATE + '?id=' + id;

  try {
    return await put(url, data)
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

async function updatePreMDAActivityDrugLogistics(data: any, id: any) {
  let url =
    BASE_URL + ENDPOINT.PREMDAACTIVITYDRUGLOGISTICS_UPDATE + '?id=' + id;

  try {
    return await put(url, data)
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

async function deletePreMDAActivity(id) {
  let url = BASE_URL + ENDPOINT.PREMDAACTIVITY_DELETE + '/?id=' + id;
  try {
    return await deleteService(url)
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

async function deletePreMDAActivityDrugLogistics(id) {
  let url =
    BASE_URL + ENDPOINT.PREMDAACTIVITYDRUGLOGISTICS_DELETE + '/?id=' + id;
  try {
    return await deleteService(url)
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

async function deletePreMDAActivityDrugAdministrators(id) {
    let url = BASE_URL + ENDPOINT.PREMDAACTIVITYDRUGADMINISTRATORS_DELETE+ "/?id=" + id;
    try {
        return await deleteService(url)
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

async function deletePreMDAActivitySupervisors(id) {
    let url = BASE_URL + ENDPOINT.PREMDAACTIVITYSUPERVISORS_DELETE+ "/?id=" + id;
    try {
        return await deleteService(url)
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
async function getOnePreMDAActivity(id:any) {
    let url = BASE_URL+ENDPOINT.PREMDAACTIVITY_GETONE+'/'+id;
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
async function getOnePreMDAActivityDrugLogistics(id: any) {
  let url = BASE_URL + ENDPOINT.PREMDAACTIVITYDRUGLOGISTICS_GETONE + '/' + id;
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

async function createAllPreMDAActivities(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.PREMDAACTIVITY_CREATEALL;

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

const preMDAActivity = {
    getPreMDAActivity,
    postPreMDAActivity,
    updatePreMDAActivity,
    deletePreMDAActivity,
    getOnePreMDAActivity,
    postPreMDAActivityDrugLogistics,
    updatePreMDAActivityDrugLogistics,
    getOnePreMDAActivityDrugLogistics,
    getPreMDAActivityDrugLogistics,
    deletePreMDAActivityDrugLogistics,
    deletePreMDAActivityDrugAdministrators,
    deletePreMDAActivitySupervisors,
    createAllPreMDAActivities
}

export default preMDAActivity;

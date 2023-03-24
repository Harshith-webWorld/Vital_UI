import { post } from "../fetchServicesMethods";
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";
async function getEndemicityGraphAllDistricts(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_ENDEMICITY_GRAPH_ALLDISTRICTS;
  try {
    return await post(url, values)
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

async function getMFEndemicityGraphAllDistricts(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_MF_ENDEMICITY_GRAPH_ALLDISTRICTS;
  try {
    return await post(url, values)
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
async function getLFCasesGraphDistwise(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_LFCASES_GRAPH_DISTRICT_WISE;
  try {
    return await post(url, values)
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
async function getHydroceleCasesGraphDistwise(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_HYDROCELECASES_GRAPH_DISTRICT_WISE;
  try {
    return await post(url, values)
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
async function getHydroceleOperatedGraphDistwise(values) {
  let url =
    BASE_URL + ENDPOINT.WEBSITE_GET_HYDROCELEOPERATED_GRAPH_DISTRICT_WISE;
  try {
    return await post(url, values)
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
async function getPendingApprovalMOGraphDistwise(values) {
  let url =
    BASE_URL + ENDPOINT.WEBSITE_GET_PENDINGAPPROVALMO_GRAPH_DISTRICT_WISE;
  try {
    return await post(url, values)
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

async function getMfPositiveDistwise(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_MF_POSITIVE_DISTRICT_WISE;
  try {
    return await post(url, values)
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

async function getBsCollectedDistwise(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_BS_COLLECTED_DISTRICT_WISE;
  try {
    return await post(url, values)
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

async function getBsExaminedDistwise(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_BS_EXAMINED_DISTRICT_WISE;
  try {
    return await post(url, values)
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

async function getMfRateDistwise(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_MF_RATE_DISTRICT_WISE;
  try {
    return await post(url, values)
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

async function getMMDPDetailsInPercentageDistrictwise(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_GET_MMDP_PERCENT_DISTRICT_WISE;
  try {
    return await post(url, values)
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

const GraphService = {
  getEndemicityGraphAllDistricts,
  getLFCasesGraphDistwise,
  getHydroceleCasesGraphDistwise,
  getHydroceleOperatedGraphDistwise,
  getPendingApprovalMOGraphDistwise,
  getMFEndemicityGraphAllDistricts,
  getMfPositiveDistwise,
  getBsCollectedDistwise,
  getBsExaminedDistwise,
  getMfRateDistwise,
  getMMDPDetailsInPercentageDistrictwise,
};

export default GraphService;

import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import ENDPOINT from '../../helpers/Api';

async function get_DashboardTodayEntry(data: any) {
  let url = BASE_URL + ENDPOINT.GET_DASHBOARDTODAYENTRY;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardBSCollectedToday(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDBSCOLLECTEDTODAY;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardLFThisMonth(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDLFTHISMONTH;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardMFPositive12Months(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDMFPOSITIVE12MONTHS;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardLFCases12Months(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDLFCASES12MONTHS;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardMONotVerified(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDMONOTVERIFIED;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardFSUTargets(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDFSUTARGETS;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardMFRates(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDMFRATES;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardDrugConsumption(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDDRUGCONSUMPTION;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function get_EndemicityTotalAllDistricts(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDEndemicityTotalAllDistricts;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function get_DASHBOARDGetMFRateTimeTrendList(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDGetMFRateTimeTrendList;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function DashboardMFRateTimeTrend(data: any) {
  let url = BASE_URL + ENDPOINT.DASHBOARDMFRATETIMETREND;
  try {
    return await post(url, data)
      .then((response) => {
        //console.log("data::",data)
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}


async function getLymphedemaCasesDistricts(values) {
  let url = BASE_URL + ENDPOINT.GET_LYMPHEDEMA_CASES_DISTRICTS;
  try {
    return await post(url, values)
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

async function getHydroceleCasesDistricts(values) {
  let url = BASE_URL + ENDPOINT.GET_HYDROCELE_CASES_DISTRICTS;
  try {
    return await post(url, values)
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

async function getHydroceleSurgeriesDistricts(values) {
  let url = BASE_URL + ENDPOINT.GET_HYDROCELE_SURGERIES_DISTRICTS;
  try {
    return await post(url, values)
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

async function getMFPositiveCasesDistricts(values) {
  let url = BASE_URL + ENDPOINT.GET_MFPOSITIVE_CASES_DISTRICTS;
  try {
    return await post(url, values)
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

async function getMDAIDACoverageAndConsumption(values) {
  let url = BASE_URL + ENDPOINT.GET_MDA_IDA_COVERAGE_CONSUMPTION;
  try {
    return await post(url, values)
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


async function getMMDPGraph(values) {
  let url = BASE_URL + ENDPOINT.GET_MMDP_GRAPH;
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

async function getFsuFcuNcPerformance(values) {
  let url = BASE_URL + ENDPOINT.GET_FSU_FCU_NC_PERFORMANCE;
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

async function getMdaTasActivityStatus(values) {
  let url = BASE_URL + ENDPOINT.GET_MDA_TAS_ACTIVITY_STATUS;
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

async function getAlertsForUser(values) {
  let url = BASE_URL + ENDPOINT.GET_ALERTS_FOR_USER;
  try {
    return await post(url, values)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("error:", error);
      });
  } catch (error) {
    console.error(error);
  }
}

const dashboardService = {
  DashboardBSCollectedToday,
  get_DashboardTodayEntry,
  DashboardLFThisMonth,
  DashboardMFPositive12Months,
  DashboardLFCases12Months,
  DashboardMONotVerified,
  DashboardFSUTargets,
  DashboardMFRates,
  DashboardDrugConsumption,
  DashboardMFRateTimeTrend,
  get_EndemicityTotalAllDistricts,
  get_DASHBOARDGetMFRateTimeTrendList,
  getLymphedemaCasesDistricts,
  getHydroceleCasesDistricts,
  getHydroceleSurgeriesDistricts,
  getMFPositiveCasesDistricts,
  getMDAIDACoverageAndConsumption,
  getMMDPGraph,
  getMdaTasActivityStatus,
  getFsuFcuNcPerformance,
  getAlertsForUser
};

export default dashboardService;

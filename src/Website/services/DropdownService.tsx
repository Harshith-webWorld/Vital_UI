import { get, post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import ENDPOINT from '../../helpers/Api';
import {objectToQueryString} from './utils';
async function getStateInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_STATE;
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
async function getOneStateInfo(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_GETONE_STATE + '/' + id;
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

async function getDistrictInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_DISTRICT;
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

async function getDistrictByVCU(id: any) {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_GET_DISTRICT_BY_VCU+`?unitId=${id}`;
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
async function getDistrictByFSU(id: any) {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_GET_DISTRICT_BY_FSU+`?unitId=${id}`;
  try {
    return await get(url)
      .then((response) => {
        console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
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
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getOneCorporation(id: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_CORPORATION_GETONE +
    `?districtId=${id}`;
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
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getOneFacility(id: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_FACILITY_GETONE +
    `?districtId=${id}`;
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
async function getFilterFacility(facilityType: any, districtId: any) {
  let url = BASE_URL + ENDPOINT.FACILITY_LIST + `?facilityType=${facilityType ? facilityType : ''}&districtId=${districtId ? districtId : ''}`;
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

async function getOneSubCenter(facilityId: any, districtId: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_SUBCENTER_GETONE +
    `?districtId=${districtId}&&facilityId=${facilityId}`;
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

async function getOneWard(corporationId: any, districtId: any) {
  let url;
  url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_WARD_GETONE +
    `?districtId=${districtId}&&corporationId=${corporationId}`;
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

// async function getVillage(districtId: any, facilityId: any, subCenterId: any) {
//   let url =
//     BASE_URL +
//     ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE_GETONE +
//     `?districtId=${districtId}&&facilityId=${facilityId}&&subCenterId=${subCenterId}`;
//   try {
//     return await get(url)
//       .then((response) => {
//         return response;
//       })
//       .catch((error) => {
//         console.log('error::', error);
//       });
//   } catch (error) {
//     console.error(error);
//   }
// }
async function getVillage(params: any) {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE_GETONE;
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

async function getOneVillage(facilityId: any, districtId: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE_GETONE +
    `?districtId=${districtId}&&facilityId=${facilityId}`;
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

async function getOneVillageByTaluka(talukaId: any, districtId: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE_GETONEBYTALUKAID +
    `?districtId=${districtId}&talukaId=${talukaId}`;
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

async function getOneVillageBySubCenter(
  districtId: any,
  facilityId: any,
  subCenterId: any,
) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE_GETONEBYSUBCENTERID +
    `?districtId=${districtId}&facilityId=${facilityId}&subCenterId=${subCenterId}`;
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
async function getVillageDropdown(
  talukaId: any,
  districtId: any,
  facilityId: any,
  subCenterId,
) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE_GETONE +
    `?districtId=${districtId}&&talukaId=${talukaId}&&facilityId=${facilityId}&&subCenterId=${subCenterId}`;
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

async function getOneZone(corporationId: any, districtId: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_ZONE_GETONE +
    `?districtId=${districtId}&&corporationId=${corporationId}`;
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

async function getOneVillageStepper(talukaId: any, id: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE +
    `?districtId=${id}&&talukaId=${talukaId}`;
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
async function getCorporationInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_CORPORATION;
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
async function getTalukaInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_TALUKA;
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
async function getFacilityInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_FACILITY;
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
async function getFacilityInfoDropDown(param) {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_FACILITY;
  try {
    return await post(url, param)
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
async function getSubcenterInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_SUBCENTER;
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
async function getWardInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_WARD;
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
async function getVillageInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE;
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
async function getUnitOfAction() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_UNITACTION;
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

async function getUnitAction() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_UNITACTION;
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
async function getZoneInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_ZONE;
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

async function getAllVerticalControlUnits() {
  let url = BASE_URL + ENDPOINT.VERTICAL_CONTROL_UNIT_LIST;
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

async function getAllVerticalControlFieldUnits() {
  let url = BASE_URL + ENDPOINT.VERTICAL_CONTROL_FIELD_UNIT_LIST;
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

async function getNameOfUnit(categoryOptionCode, categoryOptionEnum) {
  let url =
    BASE_URL +
    ENDPOINT.VERTICAL_CONTROL_UNIT_LIST +
    '?unitType=' +
    categoryOptionCode;
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
async function getNameOfFieldUnit(categoryOptionEnum) {
  let url =
    BASE_URL +
    ENDPOINT.VERTICAL_CONTROL_FIELD_UNIT_LIST +
    '?id=' +
    categoryOptionEnum;
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
async function getDesignationInfo() {
  let url = BASE_URL + ENDPOINT.DESIGNATION_LIST;
  try {
    return await get(url)
      .then((response) => {
        //console.log("get value the",JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getSelectedVillage(villageId) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE +
    '?districtId=' +
    villageId;
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

async function getOneDistrictInfo(districtId) {
  let url =
    BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_LIST_DISTRICT + '?id=' + districtId;
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
async function getNameActionFiledUnit(id?: any) {
  let url = BASE_URL + ENDPOINT.NAME_UNIT_FILED+`?id=${id ? id : ""}`;
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
async function getFilterFieldUnit(fieldUnitType) {
  let url =
    BASE_URL + ENDPOINT.NAME_UNIT_FILED + '?fieldUnitType=' + fieldUnitType;
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
async function getDetailsSurvey(id: any) {
  let url =
    BASE_URL + ENDPOINT.WEBSITE_DROPDOWN_UNITACTION + `?categoryCode=${id}`;
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

async function getVillagebyDistrict(id: any) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_DROPDOWN_LIST_VILLAGE_GETBYDISTRICT +
    `?districtId=${id}`;
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
const DropdownService = {
  getStateInfo,
  getDistrictInfo,
  getCorporationInfo,
  getTalukaInfo,
  getFacilityInfo,
  getSubcenterInfo,
  getWardInfo,
  getVillageInfo,
  getZoneInfo,
  getUnitAction,
  getUnitOfAction,
  getNameOfUnit,
  getDesignationInfo,
  getOneDistrict,
  getOneCorporation,
  getOneTaluka,
  getOneFacility,
  getOneSubCenter,
  getOneWard,
  getVillage,
  getOneVillage,
  getOneVillageBySubCenter,
  getOneVillageByTaluka,
  getOneZone,
  getSelectedVillage,
  getOneDistrictInfo,
  getNameActionFiledUnit,
  getNameOfFieldUnit,
  getOneVillageStepper,
  getDetailsSurvey,
  getFilterFacility,
  getFilterFieldUnit,
  getOneStateInfo,
  getVillagebyDistrict,
  getVillageDropdown,
  getAllVerticalControlFieldUnits,
  getAllVerticalControlUnits,
  getFacilityInfoDropDown,
  getDistrictByVCU,
  getDistrictByFSU
};

export default DropdownService;

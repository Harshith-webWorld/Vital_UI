import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { post, get, publicGet } from '../../../helpers/fetchServicesMethods';
import history from '../../../helpers/history';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, IP_INFO_URL } from '../../../helpers/config';
import DropdownService from '../../services/DropdownService';
import DexieOfflineDataBase, {
  DropdownDBNotExists,
  DropdownDBExists,
} from '../../../helpers/Offline/OfflineDropdownServices';

let signInfo: any = {};
export const onSignin = (values:any, callback?:any) => async (dispatch) => {
  // fetch(IP_INFO_URL).then(async (res) => {
  console.log('Process.env onSignin:', process.env);
  console.log(
    'REACT_APP_IP_INFO_URL onSignin:',
    process.env.REACT_APP_IP_INFO_URL
  );
  publicGet(IP_INFO_URL)
    .then(async (res) => {
      console.log('res---------', res);
      let clientIp = res;
      values.ip = clientIp.ip;
      console.log('onSignin-ip-: ', clientIp);
      return await post(BASE_URL + '/auth/login', values).then(
        async (response) => {
          if (response.status) {
            dispatch(signin(response));
            sessionStorage.setItem('userToken', response && response.token);
            toast.success(response.message, {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push('/WebDashboard');
            const dbExist =
              await DexieOfflineDataBase.checkOfflineDropdownDBExist();
            if (dbExist === DropdownDBExists) {
              const corporationCount =
                await DexieOfflineDataBase.countCorporation();
              if (corporationCount > 0) {
                const corporationId: any =
                  await DropdownService.getCorporationInfo();
                if (corporationId && corporationId.data) {
                  let response =
                    await DexieOfflineDataBase.bulkUpdateCorporation(
                      corporationId.data
                    );
                  console.log(
                    'Offline DB corporation updated List Saved',
                    response
                  );
                }
              } else {
                const corporationId: any =
                  await DropdownService.getCorporationInfo();
                if (corporationId && corporationId.data) {
                  let response =
                    await DexieOfflineDataBase.addCorporationOffline(
                      corporationId.data
                    );
                  console.log('Offline DB corporation List Saved', response);
                }
              }
              const talukaCount = await DexieOfflineDataBase.countTaluka();
              if (talukaCount > 0) {
                const talukaId: any = await DropdownService.getTalukaInfo();
                if (talukaId && talukaId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateTaluka(
                    talukaId.data
                  );
                  console.log('Offline DB taluka updated List Saved', response);
                }
              } else {
                const talukaId: any = await DropdownService.getTalukaInfo();
                if (talukaId && talukaId.data) {
                  let response = await DexieOfflineDataBase.addTalukaOffline(
                    talukaId.data
                  );
                  console.log('Offline DB taluka List Saved', response);
                }
              }
              const facilityCount = await DexieOfflineDataBase.countFacility();
              if (facilityCount > 0) {
                const facilityId: any = await DropdownService.getFacilityInfo();
                if (facilityId && facilityId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateFacility(
                    facilityId.data
                  );
                  console.log(
                    'Offline DB facility updated List Saved',
                    response
                  );
                }
              } else {
                const facilityId: any = await DropdownService.getFacilityInfo();
                if (facilityId && facilityId.data) {
                  let response = await DexieOfflineDataBase.addFacilityOffline(
                    facilityId.data
                  );
                  console.log('Offline DB facility List Saved', response);
                }
              }
              const subCenterCount =
                await DexieOfflineDataBase.countSubCenter();
              if (subCenterCount > 0) {
                const subCenterId: any =
                  await DropdownService.getSubcenterInfo();
                if (subCenterId && subCenterId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateSubCenter(
                    subCenterId.data
                  );
                  console.log(
                    'Offline DB subcenter updated List Saved',
                    response
                  );
                }
              } else {
                const subCenterId: any =
                  await DropdownService.getSubcenterInfo();
                if (subCenterId && subCenterId.data) {
                  let response = await DexieOfflineDataBase.addSubCenterOffline(
                    subCenterId.data
                  );
                  console.log('Offline DB subcenter List Saved', response);
                }
              }
              const wardCount = await DexieOfflineDataBase.countWard();
              if (wardCount > 0) {
                const wardId: any = await DropdownService.getWardInfo();
                if (wardId && wardId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateWard(
                    wardId.data
                  );
                  console.log('Offline DB ward updated List Saved', response);
                }
              } else {
                const wardId: any = await DropdownService.getWardInfo();
                if (wardId && wardId.data) {
                  let response = await DexieOfflineDataBase.addWardOffline(
                    wardId.data
                  );
                  console.log('Offline DB ward List Saved', response);
                }
              }
              const villageCount = await DexieOfflineDataBase.countVillage();
              if (villageCount > 0) {
                const villageId: any = await DropdownService.getVillageInfo();
                if (villageId && villageId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateVillage(
                    villageId.data
                  );
                  console.log(
                    'Offline DB villege updated List Saved',
                    response
                  );
                }
              } else {
                const villageId: any = await DropdownService.getVillageInfo();
                if (villageId && villageId.data) {
                  let response = await DexieOfflineDataBase.addVillageOffline(
                    villageId.data
                  );
                  console.log('Offline DB villege List Saved', response);
                }
              }
              const zoneCount = await DexieOfflineDataBase.countZone();
              if (zoneCount > 0) {
                const zoneData: any = await DropdownService.getZoneInfo();
                if (zoneData && zoneData.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateZone(
                    zoneData.data
                  );
                  console.log('Offline DB zone updated List Saved', response);
                }
              } else {
                const zoneData: any = await DropdownService.getZoneInfo();
                if (zoneData && zoneData.data) {
                  let response = await DexieOfflineDataBase.addZoneOffline(
                    zoneData.data
                  );
                  console.log('Offline DB zone List Saved', response);
                }
              }
              const catagoryOptionCount =
                await DexieOfflineDataBase.countCatagoryOption();
              if (catagoryOptionCount > 0) {
                const resp: any = await DropdownService.getUnitAction();
                if (resp && resp.data) {
                  const catagoryOptionResponse =
                    await DexieOfflineDataBase.bulkUpdateCatagoryOption(
                      resp.data
                    );
                  console.log(
                    'Offline DB Catagory updated List Saved',
                    catagoryOptionResponse
                  );
                }
              } else {
                const resp: any = await DropdownService.getUnitAction();
                if (resp && resp.data) {
                  const catagoryOptionResponse =
                    await DexieOfflineDataBase.addCatagoryOption(resp.data);
                  console.log(
                    'Offline DB Catagory List Saved',
                    catagoryOptionResponse
                  );
                }
              }
              const statesCount = await DexieOfflineDataBase.countStates();
              if (statesCount > 0) {
                const statesResponse = await DropdownService.getStateInfo();
                if (statesResponse && statesResponse.data) {
                  const stateResp = await DexieOfflineDataBase.bulkUpdateStates(
                    statesResponse.data
                  );
                  console.log(
                    'Offline DB States updated List Saved',
                    stateResp
                  );
                }
              } else {
                const statesResponse = await DropdownService.getStateInfo();
                if (statesResponse && statesResponse.data) {
                  const stateResp = await DexieOfflineDataBase.addStates(
                    statesResponse.data
                  );
                  console.log('Offline DB States List Saved', stateResp);
                }
              }
              const districtsCount =
                await DexieOfflineDataBase.countDistricts();
              if (districtsCount > 0) {
                const districtsResponse =
                  await DropdownService.getDistrictInfo();
                if (districtsResponse && districtsResponse.data) {
                  const districtResp =
                    await DexieOfflineDataBase.bulkUpdateDistricts(
                      districtsResponse.data
                    );
                  console.log(
                    'Offline DB Districts updated List Saved',
                    districtResp
                  );
                }
              } else {
                const districtsResponse =
                  await DropdownService.getDistrictInfo();
                if (districtsResponse && districtsResponse.data) {
                  const districtResp = await DexieOfflineDataBase.addDistricts(
                    districtsResponse.data
                  );
                  console.log('Offline DB Districts List Saved', districtResp);
                }
              }
              const verticalControlFieldUnitsCount =
                await DexieOfflineDataBase.countVerticalControlFieldUnits();
              if (verticalControlFieldUnitsCount > 0) {
                const verticalControlFieldUnitsResponse =
                  await DropdownService.getAllVerticalControlFieldUnits();
                if (
                  verticalControlFieldUnitsResponse &&
                  verticalControlFieldUnitsResponse.data
                ) {
                  const ControlFieldUnitResp =
                    await DexieOfflineDataBase.bulkUpdateVerticalControlFieldUnits(
                      verticalControlFieldUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlFieldUnit updated List Saved',
                    ControlFieldUnitResp
                  );
                }
              } else {
                const verticalControlFieldUnitsResponse =
                  await DropdownService.getAllVerticalControlFieldUnits();
                if (
                  verticalControlFieldUnitsResponse &&
                  verticalControlFieldUnitsResponse.data
                ) {
                  const ControlFieldUnitResp =
                    await DexieOfflineDataBase.addVerticalControlFieldUnitsOffline(
                      verticalControlFieldUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlFieldUnit List Saved',
                    ControlFieldUnitResp
                  );
                }
              }
              const verticalControlUnitsCount =
                await DexieOfflineDataBase.countVerticalControlUnits();
              if (verticalControlUnitsCount > 0) {
                const verticalControlUnitsResponse =
                  await DropdownService.getAllVerticalControlUnits();
                if (
                  verticalControlUnitsResponse &&
                  verticalControlUnitsResponse.data
                ) {
                  const ControlUnitResp =
                    await DexieOfflineDataBase.bulkUpdateVerticalControlUnits(
                      verticalControlUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlUnit updated List Saved',
                    ControlUnitResp
                  );
                }
              } else {
                const verticalControlUnitsResponse =
                  await DropdownService.getAllVerticalControlUnits();
                if (
                  verticalControlUnitsResponse &&
                  verticalControlUnitsResponse.data
                ) {
                  const ControlUnitResp =
                    await DexieOfflineDataBase.addVerticalControlUnitsOffline(
                      verticalControlUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlUnit List Saved',
                    ControlUnitResp
                  );
                }
              }
              const desiganationCount =
                await DexieOfflineDataBase.countDesignation();
              if (desiganationCount > 0) {
                const designationResponse =
                  await DropdownService.getDesignationInfo();
                if (designationResponse && designationResponse.data) {
                  const designationResp =
                    await DexieOfflineDataBase.bulkUpdateDesiganation(
                      designationResponse.data
                    );
                  console.log(
                    'Offline DB designation updated List Saved',
                    designationResp
                  );
                }
              } else {
                const designationResponse =
                  await DropdownService.getDesignationInfo();
                if (designationResponse && designationResponse.data) {
                  const designationResp =
                    await DexieOfflineDataBase.addDesignation(
                      designationResponse.data
                    );
                  console.log(
                    'Offline DB designation List Saved',
                    designationResp
                  );
                }
              }
              toast.success('Offline Dropdown Data Saved', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-message',
              });
            } else if (dbExist === DropdownDBNotExists) {
              toast.error('Dropdown DB Not Exists', {
                position: toast.POSITION.TOP_CENTER,
              });
            }
          } else {
            callback(true)
            toast.error(response.message, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }
      );
    })
    .catch(async (error) => {
      console.log('IP_INFO_URL_onSignin: ', error.response);
      return await post(BASE_URL + '/auth/login', values).then(
        async (response) => {
          if (response.status) {
            dispatch(signin(response));
            sessionStorage.setItem('userToken', response && response.token);
            toast.success(response.message, {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push('/WebDashboard');
            const dbExist =
              await DexieOfflineDataBase.checkOfflineDropdownDBExist();
            if (dbExist === DropdownDBExists) {
              const corporationCount =
                await DexieOfflineDataBase.countCorporation();
              if (corporationCount > 0) {
                const corporationId: any =
                  await DropdownService.getCorporationInfo();
                if (corporationId && corporationId.data) {
                  let response =
                    await DexieOfflineDataBase.bulkUpdateCorporation(
                      corporationId.data
                    );
                  console.log(
                    'Offline DB corporation updated List Saved',
                    response
                  );
                }
              } else {
                const corporationId: any =
                  await DropdownService.getCorporationInfo();
                if (corporationId && corporationId.data) {
                  let response =
                    await DexieOfflineDataBase.addCorporationOffline(
                      corporationId.data
                    );
                  console.log('Offline DB corporation List Saved', response);
                }
              }
              const talukaCount = await DexieOfflineDataBase.countTaluka();
              if (talukaCount > 0) {
                const talukaId: any = await DropdownService.getTalukaInfo();
                if (talukaId && talukaId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateTaluka(
                    talukaId.data
                  );
                  console.log('Offline DB taluka updated List Saved', response);
                }
              } else {
                const talukaId: any = await DropdownService.getTalukaInfo();
                if (talukaId && talukaId.data) {
                  let response = await DexieOfflineDataBase.addTalukaOffline(
                    talukaId.data
                  );
                  console.log('Offline DB taluka List Saved', response);
                }
              }
              const facilityCount = await DexieOfflineDataBase.countFacility();
              if (facilityCount > 0) {
                const facilityId: any = await DropdownService.getFacilityInfo();
                if (facilityId && facilityId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateFacility(
                    facilityId.data
                  );
                  console.log(
                    'Offline DB facility updated List Saved',
                    response
                  );
                }
              } else {
                const facilityId: any = await DropdownService.getFacilityInfo();
                if (facilityId && facilityId.data) {
                  let response = await DexieOfflineDataBase.addFacilityOffline(
                    facilityId.data
                  );
                  console.log('Offline DB facility List Saved', response);
                }
              }
              const subCenterCount =
                await DexieOfflineDataBase.countSubCenter();
              if (subCenterCount > 0) {
                const subCenterId: any =
                  await DropdownService.getSubcenterInfo();
                if (subCenterId && subCenterId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateSubCenter(
                    subCenterId.data
                  );
                  console.log(
                    'Offline DB subcenter updated List Saved',
                    response
                  );
                }
              } else {
                const subCenterId: any =
                  await DropdownService.getSubcenterInfo();
                if (subCenterId && subCenterId.data) {
                  let response = await DexieOfflineDataBase.addSubCenterOffline(
                    subCenterId.data
                  );
                  console.log('Offline DB subcenter List Saved', response);
                }
              }
              const wardCount = await DexieOfflineDataBase.countWard();
              if (wardCount > 0) {
                const wardId: any = await DropdownService.getWardInfo();
                if (wardId && wardId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateWard(
                    wardId.data
                  );
                  console.log('Offline DB ward updated List Saved', response);
                }
              } else {
                const wardId: any = await DropdownService.getWardInfo();
                if (wardId && wardId.data) {
                  let response = await DexieOfflineDataBase.addWardOffline(
                    wardId.data
                  );
                  console.log('Offline DB ward List Saved', response);
                }
              }
              const villageCount = await DexieOfflineDataBase.countVillage();
              if (villageCount > 0) {
                const villageId: any = await DropdownService.getVillageInfo();
                if (villageId && villageId.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateVillage(
                    villageId.data
                  );
                  console.log(
                    'Offline DB villege updated List Saved',
                    response
                  );
                }
              } else {
                const villageId: any = await DropdownService.getVillageInfo();
                if (villageId && villageId.data) {
                  let response = await DexieOfflineDataBase.addVillageOffline(
                    villageId.data
                  );
                  console.log('Offline DB villege List Saved', response);
                }
              }
              const zoneCount = await DexieOfflineDataBase.countZone();
              if (zoneCount > 0) {
                const zoneData: any = await DropdownService.getZoneInfo();
                if (zoneData && zoneData.data) {
                  let response = await DexieOfflineDataBase.bulkUpdateZone(
                    zoneData.data
                  );
                  console.log('Offline DB zone updated List Saved', response);
                }
              } else {
                const zoneData: any = await DropdownService.getZoneInfo();
                if (zoneData && zoneData.data) {
                  let response = await DexieOfflineDataBase.addZoneOffline(
                    zoneData.data
                  );
                  console.log('Offline DB zone List Saved', response);
                }
              }
              const catagoryOptionCount =
                await DexieOfflineDataBase.countCatagoryOption();
              if (catagoryOptionCount > 0) {
                const resp: any = await DropdownService.getUnitAction();
                if (resp && resp.data) {
                  const catagoryOptionResponse =
                    await DexieOfflineDataBase.bulkUpdateCatagoryOption(
                      resp.data
                    );
                  console.log(
                    'Offline DB Catagory updated List Saved',
                    catagoryOptionResponse
                  );
                }
              } else {
                const resp: any = await DropdownService.getUnitAction();
                if (resp && resp.data) {
                  const catagoryOptionResponse =
                    await DexieOfflineDataBase.addCatagoryOption(resp.data);
                  console.log(
                    'Offline DB Catagory List Saved',
                    catagoryOptionResponse
                  );
                }
              }
              const statesCount = await DexieOfflineDataBase.countStates();
              if (statesCount > 0) {
                const statesResponse = await DropdownService.getStateInfo();
                if (statesResponse && statesResponse.data) {
                  const stateResp = await DexieOfflineDataBase.bulkUpdateStates(
                    statesResponse.data
                  );
                  console.log(
                    'Offline DB States updated List Saved',
                    stateResp
                  );
                }
              } else {
                const statesResponse = await DropdownService.getStateInfo();
                if (statesResponse && statesResponse.data) {
                  const stateResp = await DexieOfflineDataBase.addStates(
                    statesResponse.data
                  );
                  console.log('Offline DB States List Saved', stateResp);
                }
              }
              const districtsCount =
                await DexieOfflineDataBase.countDistricts();
              if (districtsCount > 0) {
                const districtsResponse =
                  await DropdownService.getDistrictInfo();
                if (districtsResponse && districtsResponse.data) {
                  const districtResp =
                    await DexieOfflineDataBase.bulkUpdateDistricts(
                      districtsResponse.data
                    );
                  console.log(
                    'Offline DB Districts updated List Saved',
                    districtResp
                  );
                }
              } else {
                const districtsResponse =
                  await DropdownService.getDistrictInfo();
                if (districtsResponse && districtsResponse.data) {
                  const districtResp = await DexieOfflineDataBase.addDistricts(
                    districtsResponse.data
                  );
                  console.log('Offline DB Districts List Saved', districtResp);
                }
              }
              const verticalControlFieldUnitsCount =
                await DexieOfflineDataBase.countVerticalControlFieldUnits();
              if (verticalControlFieldUnitsCount > 0) {
                const verticalControlFieldUnitsResponse =
                  await DropdownService.getAllVerticalControlFieldUnits();
                if (
                  verticalControlFieldUnitsResponse &&
                  verticalControlFieldUnitsResponse.data
                ) {
                  const ControlFieldUnitResp =
                    await DexieOfflineDataBase.bulkUpdateVerticalControlFieldUnits(
                      verticalControlFieldUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlFieldUnit updated List Saved',
                    ControlFieldUnitResp
                  );
                }
              } else {
                const verticalControlFieldUnitsResponse =
                  await DropdownService.getAllVerticalControlFieldUnits();
                if (
                  verticalControlFieldUnitsResponse &&
                  verticalControlFieldUnitsResponse.data
                ) {
                  const ControlFieldUnitResp =
                    await DexieOfflineDataBase.addVerticalControlFieldUnitsOffline(
                      verticalControlFieldUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlFieldUnit List Saved',
                    ControlFieldUnitResp
                  );
                }
              }
              const verticalControlUnitsCount =
                await DexieOfflineDataBase.countVerticalControlUnits();
              if (verticalControlUnitsCount > 0) {
                const verticalControlUnitsResponse =
                  await DropdownService.getAllVerticalControlUnits();
                if (
                  verticalControlUnitsResponse &&
                  verticalControlUnitsResponse.data
                ) {
                  const ControlUnitResp =
                    await DexieOfflineDataBase.bulkUpdateVerticalControlUnits(
                      verticalControlUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlUnit updated List Saved',
                    ControlUnitResp
                  );
                }
              } else {
                const verticalControlUnitsResponse =
                  await DropdownService.getAllVerticalControlUnits();
                if (
                  verticalControlUnitsResponse &&
                  verticalControlUnitsResponse.data
                ) {
                  const ControlUnitResp =
                    await DexieOfflineDataBase.addVerticalControlUnitsOffline(
                      verticalControlUnitsResponse.data
                    );
                  console.log(
                    'Offline DB verticalControlUnit List Saved',
                    ControlUnitResp
                  );
                }
              }
              const desiganationCount =
                await DexieOfflineDataBase.countDesignation();
              if (desiganationCount > 0) {
                const designationResponse =
                  await DropdownService.getDesignationInfo();
                if (designationResponse && designationResponse.data) {
                  const designationResp =
                    await DexieOfflineDataBase.bulkUpdateDesiganation(
                      designationResponse.data
                    );
                  console.log(
                    'Offline DB designation updated List Saved',
                    designationResp
                  );
                }
              } else {
                const designationResponse =
                  await DropdownService.getDesignationInfo();
                if (designationResponse && designationResponse.data) {
                  const designationResp =
                    await DexieOfflineDataBase.addDesignation(
                      designationResponse.data
                    );
                  console.log(
                    'Offline DB designation List Saved',
                    designationResp
                  );
                }
              }
              toast.success('Offline Dropdown Data Saved', {
                position: toast.POSITION.TOP_CENTER,
              });
            } else if (dbExist === DropdownDBNotExists) {
              toast.error('Dropdown DB Not Exists', {
                position: toast.POSITION.TOP_CENTER,
              });
            }
          } else {
            toast.error(response.message, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }
      );
    });
  // .catch((error) => {
  //   toast.error('SignIn Failed',{position: toast.POSITION.TOP_CENTER});
  //   console.log("error::", error);

  // return dispatch(loginError(error));
  // dispatch(showMessage({ message: error }));
  // });
  // });
};

export const onSignout = () => async (dispatch) => {
  try {
    return dispatch(signout(undefined));
  } catch (e: any) {
    return console.error(e.message);
  }
};

export const userRoleScreenActivitiesUpdate = (values) => async (dispatch) => {
  try {
    return dispatch(signinRoleUpdate(values));
  } catch (e: any) {
    return console.error(e.message);
  }
};

export const signinSlice = createSlice({
  name: 'signin',
  initialState: signInfo,
  reducers: {
    signin: (state, action) => action.payload,

    signout: (state, action) => (state = action),

    signinRoleUpdate: (state, action) => {
      state.data.userRoleScreenActivities = action.payload;
    },
  },
  // extraReducers: {
  //   [onSignin.fulfilled.toString()]: (state: any, action: any) => {
  //     console.log("fulfilled:: ", action.payload);
  //     if (action.payload && action.payload.token) {
  //       localStorage.setItem("SigninToken", action.payload.token);
  //       state.entities = action.payload;
  //     }

  //   },
  //   [onSignin.rejected.toString()]: (state: any, action: any) => {
  //     console.log("rejected:: ", action.payload);

  //     state.entities = action.payload;
  //   }

  // }
});
export const { signin, signout, signinRoleUpdate } = signinSlice.actions;

export default signinSlice.reducer;

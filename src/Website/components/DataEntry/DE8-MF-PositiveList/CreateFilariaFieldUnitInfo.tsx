import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { mfPositiveList } from './MFPositiveStepperConfig';
import { mfPositiveInterface } from '../../../interfaces/FormMFPositive';
import DropdownService from '../../../services/DropdownService';
import MfPositiveService from '../../../services/MfPositiveService';
import history from '../../../../helpers/history';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import commonFunction from '../../../../helpers/common/common';
import { toast } from 'react-toastify';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import mfPositiveDraftServices from '../../../draftServices/FormMFPositiveDraftServices';

const FilariaFieldUnitInfo = (props: any) => {
  const listDESheetName: any = props && props.listDESheetName;
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevZoneRef: any = React.useRef();
  const prevCorporationRef: any = React.useRef();
  const prevSubCenterRef: any = React.useRef();
  const selectTalukaRef: any = React.useRef();
  const selectZoneRef: any = React.useRef();
  const selectWardRef: any = React.useRef();
  const selectFacilityRef: any = React.useRef();
  const selectSubcenterRef: any = React.useRef();
  const selectCorporationRef: any = React.useRef();
  const selectNameOfFilariaFieldUnitRef: any = React.useRef();
  const selectNameOfUnitRef: any = React.useRef();
  const selectUnitActionRef: any = React.useRef();
  const selectVillageRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  let [districtIdValuesDisplay, setdistrictIdValuesDisplay] = useState([]);
  const [facilityId, setfacilityId] = useState();
  const [subCenterId, setsubCenterId] = useState();
  const [talukaId, settalukaId] = useState();
  const [zoneId, setzoneId] = useState();
  const [corporationId, setcorporationId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  let [unitAction, setUnitAction] = useState([]);
  let [nameOfUnitValues, setNameOfUnitValues] = useState([]);
  let TypeList = [
    { label: 'Fix', value: 1 },
    { label: 'Random', value: 2 },
  ];
  const [formData, setFormData] = useState<mfPositiveInterface>(mfPositiveList);
  const location: any = useLocation();
  let isOnline = window.navigator.onLine;

  let NoneList = [{ label: 'None', value: 0 }];
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);
  const months = [
    { month: 1, monthName: 'JAN' },
    { month: 2, monthName: 'FEB' },
    { month: 3, monthName: 'MAR' },
    { month: 4, monthName: 'APR' },
    { month: 5, monthName: 'MAY' },
    { month: 6, monthName: 'JUN' },
    { month: 7, monthName: 'JUL' },
    { month: 8, monthName: 'AUG' },
    { month: 9, monthName: 'SEP' },
    { month: 10, monthName: 'OCT' },
    { month: 11, monthName: 'NOV' },
    { month: 12, monthName: 'DEC' },
  ];
  const currentYear = new Date().getFullYear();
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(currentYear, currentYear - 50, -1);

  useEffect(() => {
    getDistricts();
    getDropDownData();
    getFieldUnitInfo();
  }, []);

  useEffect(() => {
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevTalukaRef.current = talukaId;
    prevZoneRef.current = zoneId;
    prevCorporationRef.current = corporationId;
    prevSubCenterRef.current = subCenterId;
  });

  const getFieldUnitInfo = async () => {
    let unitOfActionValues = await getDropDownData();
    let recordId;
    if (location && location.state && location.state.mfId) {
      recordId = location.state.mfId;
      if (recordId) {
        const getOneResult: any = await MfPositiveService.getOneMfPositiveList(
          recordId
        );
        if (getOneResult && getOneResult.data[0]) {
          getDistrictValues(getOneResult.data[0].districtId);
          getCorporationValues(
            getOneResult.data[0].corporationId,
            getOneResult.data[0].districtId
          );
          await getFacilityValues(
            getOneResult.data[0].facilityId,
            getOneResult.data[0].districtId
          );
          getSubCenterValues(
            getOneResult.data[0].subCenterId,
            getOneResult.data[0].facilityId,
            getOneResult.data[0].districtId
          );
          // getTalukaValues(
          //   getOneResult.data[0].talukaId,
          //   getOneResult.data[0].districtId
          // );

          filterFieldUnit(getOneResult.data[0].nameOfUnit, unitOfActionValues);
          filterNameOfUnit(
            getOneResult.data[0].unitOfAction,
            unitOfActionValues
          );
          setFormData(getOneResult.data[0]);
        }
      }
    } else {
      if (location && location.state && location.state.UUID) {
        recordId = location.state.UUID;
      } else {
        recordId = props.mfPositiveLineListUUID;
      }
      if (recordId) {
        const getOneResult: any =
          await mfPositiveDraftServices.getOneMFPositiveLineList(recordId);
        if (getOneResult) {
          getOneResult.corporationId =
            typeof getOneResult.corporationId === 'string'
              ? 0
              : getOneResult.corporationId;
          getDistrictValues(getOneResult.districtId);
          getCorporationValues(
            getOneResult.corporationId,
            getOneResult.districtId
          );
          await getFacilityValues(
            getOneResult.facilityId,
            getOneResult.districtId
          );
          getSubCenterValues(
            getOneResult.subCenterId,
            getOneResult.facilityId,
            getOneResult.districtId
          );
          // getTalukaValues(
          //   getOneResult.talukaId,
          //   getOneResult.districtId
          // );

          filterFieldUnit(getOneResult.nameOfUnit, unitOfActionValues);
          filterNameOfUnit(getOneResult.unitOfAction, unitOfActionValues);
          setFormData(getOneResult);
        }
      }
    }
  };
  async function getDropDownData() {
    const state: any = await DropdownService.getStateInfo();
    if (isOnline) {
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        setUnitAction(unitActionData.data);
      }
      if (unitActionData && unitActionData.data) {
        setAntigenId(unitActionData.data);
      }
      return unitActionData.data;
    } else {
      const unitActionDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      setUnitAction(unitActionDataOffline);
      setAntigenId(unitActionDataOffline);
      return unitActionDataOffline;
    }
  }

  let validSchema = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    month: Yup.number()
      .required('Required')
      .min(1, 'Required')
      .max(12, 'Required'),
    districtId: Yup.string().required('District is required').nullable(),
    corporationId: Yup.string().required('Corporation is required').nullable(),
    talukaId: Yup.string().required('Taluka is required').nullable(),
    villageId: Yup.string().required('Village is required').nullable(),
    subCenterId: Yup.string().required('subCenter is required').nullable(),
    facilityId: Yup.string().required('Facility is required').nullable(),
    unitOfAction: Yup.string()
      .required('Unit Of Action is required')
      .nullable(),
    nameOfUnit: Yup.string().required('Name Of Unit is required').nullable(),
    //zoneId: Yup.number().required("Zone is required").nullable(),
  });

  async function updateFieldUnitInfo(fieldInfo, id, IdType) {
    if (IdType === 'Id') {
      let response = await MfPositiveService.updateMfPositiveList(
        fieldInfo,
        id
      );
      if (response && response.data) {
        console.log('update patient info:: ', response.data);
        props.handleNext(response.data);
      }
    } else if (IdType === 'UUID') {
      console.log('fieldUnitINfo UUID ------', id);
      let draftResponse =
        await mfPositiveDraftServices.updateMFPositiveLineList(id, fieldInfo);
      console.log('fieldUnitINfo UUID', draftResponse);
      if (draftResponse) {
        props.handleNext(draftResponse);
      }
    }
  }

  async function saveFieldUnitInfo(fieldInfo) {
    let draftResponse = await mfPositiveDraftServices.addMFPositiveLineList(
      fieldInfo
    );
    if (draftResponse) {
      console.log('add fieldUnitInfo', draftResponse);
      let get = await mfPositiveDraftServices.getOneMFPositiveLineList(
        draftResponse
      );
      props.handleNext(get);
    }
  }
  // const[hideTas,setHideTas]=useState(false)
  //   const handleBSCollection =(e)=>{
  //     if(e.label === "TAS"){
  //       setHideTas(false)
  //       //console.log("TAS",hideTas)

  //     }
  //     else{
  //       setHideTas(true)
  //       //console.log("TASF",hideTas)
  //     }
  //     console.log("OnChange",hideTas)
  //   }

  const onSubmit = async (values) => {
    console.log('onSubmit', values);
    values.nameOfFilariaFieldUnit = values.nameOfFilariaFieldUnit
      ? values.nameOfFilariaFieldUnit
      : '0';
    values.nameOfUnit = values.nameOfUnit ? values.nameOfUnit : '0';
    values.totalPopulationVillage = values.totalPopulationVillage
      ? values.totalPopulationVillage
      : 0;
    values.totalNoOfHousesInArea = values.totalNoOfHousesInArea
      ? values.totalNoOfHousesInArea
      : 0;
    values.populationCoveredByUnit = values.populationCoveredByUnit
      ? values.populationCoveredByUnit
      : 0;
    values.targetForCollectionOfNBS = values.targetForCollectionOfNBS
      ? values.targetForCollectionOfNBS
      : 0;
    setIsDisabled(true);
    if (location && location.state && location.state.view) {
      props.handleNext(values);
    } else {
      values.districtId = values.districtId == 0 ? '0' : values.districtId;
      values.corporationId =
        values.corporationId == 0 ? '0' : values.corporationId;
      values.talukaId = values.talukaId == 0 ? '0' : values.talukaId;
      values.facilityId = values.facilityId == 0 ? '0' : values.facilityId;
      values.subCenterId = values.subCenterId == 0 ? '0' : values.subCenterId;
      values.wardId = values.wardId == 0 ? '0' : values.wardId;
      values.villageId = values.villageId == 0 ? '0' : values.villageId;
      values.zoneId = values.zoneId == 0 ? '0' : values.zoneId;

      console.log('after step1 values:: ', values);
      if (location && location.state && location.state.mfId) {
        values.lastModifiedBy = props && props.userSessionId;
        updateFieldUnitInfo(values, location.state.mfId, 'Id');
        setIsDisabled(false);
      } else if (location && location.state && location.state.UUID) {
        values.lastModifiedBy = props && props.userSessionId;
        updateFieldUnitInfo(values, location.state.UUID, 'UUID');
        setIsDisabled(false);
      } else {
        if (props.mfPositiveLineListUUID) {
          values.lastModifiedBy = props && props.userSessionId;
          updateFieldUnitInfo(values, props.mfPositiveLineListUUID, 'UUID');
          setIsDisabled(false);
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          saveFieldUnitInfo(values);
          setIsDisabled(false);
        }
      }
    }
  };

  // const onSubmit = async (values) => {
  //   values.nameOfFilariaFieldUnit = values.nameOfFilariaFieldUnit ? values.nameOfFilariaFieldUnit : "0"
  //   values.nameOfUnit = values.nameOfUnit ? values.nameOfUnit : "0"
  //   if (location && location.state && location.state.view) {
  //     props.handleNext(values);
  //   }
  //   else {
  //     values.districtId = values.districtId == 0 ? "0" : values.districtId;
  //     values.corporationId =
  //       values.corporationId == 0 ? "0" : values.corporationId;
  //     values.talukaId = values.talukaId == 0 ? "0" : values.talukaId;
  //     values.facilityId = values.facilityId == 0 ? "0" : values.facilityId;
  //     values.subCenterId = values.subCenterId == 0 ? "0" : values.subCenterId;
  //     values.wardId = values.wardId == 0 ? "0" : values.wardId;
  //     values.villageId = values.villageId == 0 ? "0" : values.villageId;
  //     values.zoneId = values.zoneId == 0 ? "0" : values.zoneId;
  //     values.totalPopulationVillage = values.totalPopulationVillage ? values.totalPopulationVillage : "0";
  //     values.totalNoOfHousesInArea = values.totalNoOfHousesInArea ? values.totalNoOfHousesInArea : "0";
  //     values.populationCoveredByUnit = values.populationCoveredByUnit ? values.populationCoveredByUnit : "0";
  //     values.targetForCollectionOfNBS = values.targetForCollectionOfNBS ? values.targetForCollectionOfNBS : "0";

  //     console.log("after step1 values:: ", values);
  //     if (location && location.state && location.state.mfId) {
  //       updateFieldUnitInfo(values, location.state.mfId);
  //     } else {
  //       let fieldUnitResponse;
  //       if(props.id){
  //         var id = props && props.id;
  //         values.lastModifiedBy = props && props.userSessionId;
  //         fieldUnitResponse = await MfPositiveService.postMfPositiveList(values);
  //       }else{
  //         values.createdBy = props && props.userSessionId;
  //         values.lastModifiedBy = 0;
  //         fieldUnitResponse = await MfPositiveService.postMfPositiveList(values);
  //       }
  //      setFormData({ ...formData, id: fieldUnitResponse.data.id });
  //       if(fieldUnitResponse && fieldUnitResponse.data){
  //         console.log("step 2:: fieldUnit post response:: ", formData);
  //         props.handleNext(fieldUnitResponse.data);
  //       }
  //     }
  //   }
  // };

  const formik = useFormik({
    initialValues: formData,
    validationSchema: validSchema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });

  let [nameofFiledValues, setNameOfFiledValues] = useState([]);
  let [districtIdValues, setDistrictIdValues] = useState([]);
  let [corporationIdValues, setCorporationIdValues] = useState([]);
  let [talukaIdValues, setTalukaIdValues] = useState([]);
  let [facilityIdValues, setFacilityIdValues] = useState([]);
  let [subCenterIdValues, setSubCenterIdValues] = useState([]);
  let [villageIdValues, setVillageIdValues] = useState([]);
  let [zoneIdValues, setZoneIdValues] = useState([]);
  let [wardIdValues, setWardIdValues] = useState([]);
  let [unitOfArea, setUnitOfArea] = useState([]);
  let [antigenId, setAntigenId] = useState([]);
  const prevDistrictIdValue = prevDistrictRef.current;
  const prevFacilityIdValue = prevFacilityRef.current;
  const prevTalukaIdValue = prevTalukaRef.current;
  const prevZoneIdValue = prevZoneRef.current;
  const prevCorporationIdValue = prevCorporationRef.current;
  const prevSubCenterIdValue = prevSubCenterRef.current;

  async function getDistricts() {
    if (isOnline) {
      const District: any = await DropdownService.getOneDistrict('14');
      if (District && District.data) {
        setDistrictIdValues(District.data);
      }
    } else {
      const DistrictOffline: any = await DexieOfflineDataBase.getOneDistrict(
        14
      );
      if (DistrictOffline) {
        setDistrictIdValues(DistrictOffline);
      }
    }
  }
  const YearNone = {
    label: 'Unknown Year',
    value: '',
  };

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];
  const monthList = months.map((item: any, i: any) => {
    return { label: item.monthName, value: item.month };
  });

  const nameOfUnit =
    nameOfUnitValues &&
    nameOfUnitValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });
  const nameOfFiledUnitValues =
    nameofFiledValues &&
    nameofFiledValues.map((item: any, i: any) => {
      return { label: item.fieldUnitName, value: item.id };
    });

  async function filterFieldUnit(option: any, nameOfUnitValues) {
    if (option && option.value) {
      let nameOfFieldUnitDataOffline: any;
      let nameOfFieldUnitData: any;
      if (isOnline) {
        nameOfFieldUnitData = await DropdownService.getNameOfFieldUnit(
          option.value
        );
      } else {
        nameOfFieldUnitDataOffline =
          await DexieOfflineDataBase.getNameOfFieldUnitOffline(option.value);
      }
      if (
        (nameOfFieldUnitData && nameOfFieldUnitData.data.length > 0) ||
        (nameOfFieldUnitDataOffline && nameOfFieldUnitDataOffline.length > 0)
      ) {
        selectNameOfFilariaFieldUnitRef.current.select.clearValue();
        let data: any;
        if (isOnline) {
          data = [
            OptionLabel.nameOfVerticalFieldUnitNone,
            ...nameOfFieldUnitData.data,
          ];
        } else {
          data = [
            OptionLabel.nameOfVerticalFieldUnitNone,
            ...nameOfFieldUnitDataOffline,
          ];
        }
        setNameOfFiledValues(data);
        formik.setFieldValue('nameOfFilariaFieldUnit', '');
      } else {
        selectNameOfFilariaFieldUnitRef.current.select.clearValue();
        let Data: any = [OptionLabel.nameOfVerticalFieldUnitNone];
        setNameOfFiledValues(Data);
        formik.setFieldValue('nameOfFilariaFieldUnit', 0);
      }
    } else if (option) {
      let nameOfFieldUnitDataOffline: any;
      let nameOfFieldUnitData: any;
      if (isOnline) {
        nameOfFieldUnitData = await DropdownService.getNameOfFieldUnit(option);
      } else {
        nameOfFieldUnitDataOffline =
          await DexieOfflineDataBase.getNameOfFieldUnitOffline(option);
      }
      console.log('nameOfFieldUnitData', nameOfFieldUnitData);
      if (nameOfFieldUnitData && nameOfFieldUnitData.data.length > 0) {
        let data: any;
        if (isOnline) {
          data = [
            OptionLabel.nameOfVerticalFieldUnitNone,
            ...nameOfFieldUnitData.data,
          ];
        } else {
          data = [
            OptionLabel.nameOfVerticalFieldUnitNone,
            ...nameOfFieldUnitDataOffline,
          ];
        }
        setNameOfFiledValues(data);
      } else {
        let Data: any = [OptionLabel.nameOfVerticalFieldUnitNone];
        setNameOfFiledValues(Data);
        formik.setFieldValue('nameOfFilariaFieldUnit', 0);
      }
    }
  }

  async function filterNameOfUnit(e: any, unitAction) {
    unitAction &&
      unitAction.map(async (item: any, i: any) => {
        if (e && e.value) {
          if (item.id == e.value && item.categoryCode === 1003) {
            let nameOfUnitOffline: any;
            let nameOfUnitData: any;
            if (isOnline) {
              nameOfUnitData = await DropdownService.getNameOfUnit(
                item.categoryOptionCode,
                item.categoryOptionEnum
              );
            } else {
              nameOfUnitOffline =
                await DexieOfflineDataBase.getNameOfUnitOffline(
                  item.categoryOptionCode
                );
            }
            if (
              (nameOfUnitData && nameOfUnitData.data.length > 0) ||
              (nameOfUnitOffline && nameOfUnitOffline.length > 0)
            ) {
              selectNameOfUnitRef.current.select.clearValue();
              let data: any;
              if (isOnline) {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitData.data];
              } else {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitOffline];
              }
              setNameOfUnitValues(data);
            } else {
              selectNameOfUnitRef.current.select.clearValue();
              let Data: any = [OptionLabel.nameOfUnitNone];
              setNameOfUnitValues(Data);
              formik.setFieldValue('nameOfUnit', 0);
            }
          }
        } else {
          if (item.id == e && item.categoryCode === 1003) {
            let nameOfUnitOffline: any;
            let nameOfUnitData: any;
            if (isOnline) {
              nameOfUnitData = await DropdownService.getNameOfUnit(
                item.categoryOptionCode,
                item.categoryOptionEnum
              );
            } else {
              nameOfUnitOffline =
                await DexieOfflineDataBase.getNameOfUnitOffline(
                  item.categoryOptionCode
                );
            }
            if (
              (nameOfUnitData && nameOfUnitData.data.length > 0) ||
              (nameOfUnitOffline && nameOfUnitOffline.length > 0)
            ) {
              let data: any;
              if (isOnline) {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitData.data];
              } else {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitOffline];
              }
              setNameOfUnitValues(data);
            } else {
              let Data: any = [OptionLabel.nameOfUnitNone];
              setNameOfUnitValues(Data);
              formik.setFieldValue('nameOfUnit', 0);
            }
          }
        }
      });
  }

  async function filterdistrict(e: any) {
    let nameOfdistrictData: any;
    nameOfdistrictData = await DropdownService.getDistrictByVCU(e);
    console.log(nameOfdistrictData, 'trst');
    formik.setFieldValue('districtId', nameOfdistrictData.data.districtId);
    console.log(formik.values.unitOfAction, 'testt');
  }
  async function loadFsuData(e:any){
    var fsu = await DropdownService.getDistrictByFSU(e);
    if(fsu.data.length==1){
      formik.setFieldValue('districtId', fsu.data[0].id);
    }else{
     setdistrictIdValuesDisplay(modifyData(fsu.data))
    }
    console.log(fsu,"<--fsu district list")
  }
  const modifyData=(data)=>{
    return data.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    })
      }

  async function getDistrict(e: any) {
    setdistrictId(e && e.value);
    if (!((e && e.value) === prevDistrictIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('facilityId', 0);
        formik.setFieldValue('subCenterId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('zoneId', 0);
        formik.setFieldValue('corporationId', 0);
      }
      //corporation
      let corporationIdOffline: any;
      let corporationId: any;
      if (!isOnline) {
        corporationIdOffline = await DexieOfflineDataBase.getCorporationOffline(
          e && e.value
        );
      } else {
        corporationId = await DropdownService.getOneCorporation(e && e.value);
      }
      if (
        (corporationId &&
          corporationId.data &&
          corporationId.data.length > 0) ||
        (corporationIdOffline && corporationIdOffline.length > 0)
      ) {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any;
        if (!isOnline) {
          corporationData = [
            OptionLabel.corporationNone,
            ...corporationIdOffline,
          ];
        } else {
          corporationData = [
            OptionLabel.corporationNone,
            ...corporationId.data,
          ];
        }
        formik.setFieldValue('corporationId', '');
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('zoneId', 0);
        setCorporationIdValues(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any = [OptionLabel.corporationNone];
        setCorporationIdValues(corporationData);
        formik.setFieldValue('corporationId', 0);
      }

      //taluka
      let talukaIdOffline: any;
      let talukaId: any;
      if (!isOnline) {
        talukaIdOffline = await DexieOfflineDataBase.getTalukaOffline(
          e && e.value
        );
      } else {
        talukaId = await DropdownService.getOneTaluka(e && e.value);
      }
      console.log(talukaIdOffline);
      if (
        (talukaId && talukaId.data && talukaId.data.length > 0) ||
        (talukaIdOffline && talukaIdOffline.length > 0)
      ) {
        let talukaList: any;
        formik.setFieldValue('talukaId', '');
        formik.setFieldValue('villageId', 0);
        selectTalukaRef.current.select.clearValue();
        if (!isOnline) {
          talukaList = [OptionLabel.talukaNone, ...talukaIdOffline];
        } else {
          talukaList = [OptionLabel.talukaNone, ...talukaId.data];
        }
        setTalukaIdValues(talukaList);
      } else {
        selectTalukaRef.current.select.clearValue();
        let Data: any = [OptionLabel.talukaNone];
        setTalukaIdValues(Data);
        formik.setFieldValue('talukaId', 0);
      }

      //facility
      let facilityIdOffline: any;
      let facilityId: any;
      if (!isOnline) {
        facilityIdOffline = await DexieOfflineDataBase.getFacilityOffline(
          e && e.value
        );
      } else {
        facilityId = await DropdownService.getOneFacility(e && e.value);
      }
      console.log(facilityIdOffline);
      if (
        (facilityId && facilityId.data && facilityId.data.length > 0) ||
        (facilityIdOffline && facilityIdOffline.length > 0)
      ) {
        let facilityList: any;
        formik.setFieldValue('facilityId', '');
        formik.setFieldValue('subCenterId', 0);
        selectFacilityRef.current.select.clearValue();
        if (!isOnline) {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
        } else {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
        }
        setFacilityIdValues(facilityList);
      } else {
        selectFacilityRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setFacilityIdValues(Data);
        formik.setFieldValue('facilityId', 0);
      }
    }
  }

  async function getDistrictValues(e: any) {
    //corporation
    let corporationIdOffline: any;
    let corporationId: any;
    if (!isOnline) {
      corporationIdOffline = await DexieOfflineDataBase.getCorporationOffline(
        e
      );
    } else {
      corporationId = await DropdownService.getOneCorporation(e);
    }
    console.log('asdfghjkl', corporationId, corporationIdOffline);
    if (
      (corporationId && corporationId.data && corporationId.data.length > 0) ||
      (corporationIdOffline && corporationIdOffline.length > 0)
    ) {
      console.log('jjjjjj', corporationId, corporationIdOffline);
      let corporationData: any;
      if (!isOnline) {
        corporationData = [
          OptionLabel.corporationNone,
          ...corporationIdOffline,
        ];
      } else {
        corporationData = [OptionLabel.corporationNone, ...corporationId.data];
      }
      corporationData = [
        OptionLabel.corporationSelectLabel,
        ...corporationData,
      ];
      setCorporationIdValues(corporationData);
    } else {
      let Data: any = [OptionLabel.corporationNone];
      setCorporationIdValues(Data);
      formik.setFieldValue('corporationId', 0);
    }

    //taluka
    let talukaIdOffline: any;
    let talukaId: any;
    if (!isOnline) {
      talukaIdOffline = await DexieOfflineDataBase.getTalukaOffline(e);
    } else {
      talukaId = await DropdownService.getOneTaluka(e);
    }
    if (
      (talukaId && talukaId.data && talukaId.data.length > 0) ||
      (talukaIdOffline && talukaIdOffline.length > 0)
    ) {
      let talukaList: any;
      if (!isOnline) {
        talukaList = [OptionLabel.talukaNone, ...talukaIdOffline];
      } else {
        talukaList = [OptionLabel.talukaNone, ...talukaId.data];
      }
      setTalukaIdValues(talukaList);
    } else {
      let Data: any = [OptionLabel.talukaNone];
      setTalukaIdValues(Data);
      formik.setFieldValue('talukaId', 0);
    }

    //facility
    let facilityIdOffline: any;
    let facilityId: any;
    if (!isOnline) {
      facilityIdOffline = await DexieOfflineDataBase.getFacilityOffline(e);
    } else {
      facilityId = await DropdownService.getOneFacility(e);
    }
    if (
      (facilityId && facilityId.data && facilityId.data.length > 0) ||
      (facilityIdOffline && facilityIdOffline.length > 0)
    ) {
      let facilityList: any;
      if (!isOnline) {
        facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
      } else {
        facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
      }
      setFacilityIdValues(facilityList);
    } else {
      let Data: any = [OptionLabel.facilityNoneLabel];
      setFacilityIdValues(Data);
      formik.setFieldValue('facilityId', 0);
    }
  }

  async function getCorporation(e: any) {
    setcorporationId(e && e.value);
    if (!((e && e.value) === prevCorporationIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('zoneId', 0);
        formik.setFieldValue('wardId', 0);
        //formik.values.districtId = null;
      }
      let zoneId: any;
      let zoneIdOffline: any;
      if (!isOnline) {
        zoneIdOffline = await DexieOfflineDataBase.getZoneOffline(
          e && e.value,
          formik.values.districtId
        );
      } else {
        zoneId = await DropdownService.getOneZone(
          e && e.value,
          formik.values.districtId
        );
      }
      console.log('zone offline', zoneIdOffline);
      if (
        (zoneId && zoneId.data && zoneId.data.length > 0) ||
        (zoneIdOffline && zoneIdOffline.length > 0)
      ) {
        selectZoneRef.current.select.clearValue();
        formik.setFieldValue('zoneId', '');
        formik.setFieldValue('wardId', 0);
        let zoneList: any;
        if (!isOnline) {
          zoneList = [OptionLabel.zoneNoneLabel, ...zoneIdOffline];
        } else {
          zoneList = [OptionLabel.zoneNoneLabel, ...zoneId.data];
        }
        setZoneIdValues(zoneList);
      } else {
        selectZoneRef.current.select.clearValue();
        let Data: any = [OptionLabel.zoneNoneLabel];
        setZoneIdValues(Data);
        formik.setFieldValue('zoneId', 0);
      }
    }
  }

  async function getCorporationValues(e: any, id: any) {
    let zoneId: any;
    let zoneIdOffline: any;
    if (!isOnline) {
      zoneIdOffline = await DexieOfflineDataBase.getZoneOffline(e, id);
    } else {
      zoneId = await DropdownService.getOneZone(e, id);
    }
    if (
      (zoneId && zoneId.data && zoneId.data.length > 0) ||
      (zoneIdOffline && zoneIdOffline.length > 0)
    ) {
      let zoneList: any;
      if (!isOnline) {
        zoneList = [OptionLabel.zoneNoneLabel, ...zoneIdOffline];
      } else {
        zoneList = [OptionLabel.zoneNoneLabel, ...zoneId.data];
      }
      setZoneIdValues(zoneList);
    } else {
      let Data: any = [OptionLabel.zoneNoneLabel];
      setZoneIdValues(Data);
      formik.setFieldValue('zoneId', 0);
    }
  }

  // async function getTaluka(e: any) {
  //   settalukaId(e && e.value)
  //   if (!((e && e.value) === prevTalukaIdValue)) {
  //     if ((e && e.value) === null) {
  //       formik.setFieldValue("villageId", 0);
  //     }
  //     let Village: any;
  //     let VillageIdOffline: any;
  //     if (!isOnline) {
  //       VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e &&
  //         e.value,
  //         formik.values.districtId
  //       );
  //     } else {
  //       Village = await DropdownService.getOneVillage(e &&
  //         e.value,
  //         formik.values.districtId
  //       );
  //     }
  //     console.log("village offline", VillageIdOffline)
  //     if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //       selectVillageRef.current.select.clearValue();
  //       formik.setFieldValue("villageId", "");
  //       let villagelist: any;
  //       if (!isOnline) {
  //         villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //       } else {
  //         villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //       }
  //       setVillageIdValues(villagelist);
  //     } else {
  //       selectVillageRef.current.select.clearValue();
  //       let Data: any = [OptionLabel.villageNoneLabel];
  //       setVillageIdValues(Data);
  //       formik.setFieldValue("villageId", 0);
  //     }
  //   }
  // }

  // async function getTalukaValues(e: any, id: any) {
  //   if (e) {
  //     let Village: any;
  //     let VillageIdOffline: any;
  //     if (!isOnline) {
  //       VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e, id);
  //     } else {
  //       Village = await DropdownService.getOneVillage(e, id);
  //     }
  //     if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //       let villagelist: any;
  //       if (!isOnline) {
  //         villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //       } else {
  //         villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //       }
  //       setVillageIdValues(villagelist);
  //     }
  //   }
  // }

  async function getSubCenter(e: any) {
    if (e && e.value) {
      setsubCenterId(e && e.value);
      if (!((e && e.value) === prevSubCenterIdValue)) {
        if ((e && e.value) === null) {
          // formik.setFieldValue("villageId", 0);
        }
        let villageId: any;
        let villageIdOffline: any;
        if (!isOnline) {
          villageIdOffline =
            await DexieOfflineDataBase.getVillageBySubCenterOffline(
              formik.values.districtId,
              formik.values.facilityId,
              e && e.value
            );
        } else {
          villageId = await DropdownService.getOneVillageBySubCenter(
            formik.values.districtId,
            formik.values.facilityId,
            e && e.value
          );
        }
        if (
          (villageId && villageId.data && villageId.data.length > 0) ||
          (villageIdOffline && villageIdOffline.length > 0)
        ) {
          formik.setFieldValue('villageId', '');
          selectVillageRef.current.select.clearValue();
          let villagelist: any;
          if (!isOnline) {
            villagelist = [OptionLabel.villageNoneLabel, ...villageIdOffline];
          } else {
            villagelist = [OptionLabel.villageNoneLabel, ...villageId.data];
          }
          setVillageIdValues(villagelist);
        }
        // else {
        //   selectWardRef.current.select.clearValue();
        //   let Data: any = [OptionLabel.villageNoneLabel];
        //   setvillageIdValues(Data);
        //   formik.setFieldValue("villageId", 0);
        // }
      }
    }
  }

  async function getSubCenterValues(e: any, facilityId: any, districtId: any) {
    if (e) {
      let villageId: any;
      let villageIdOffline: any;
      if (!isOnline) {
        villageIdOffline =
          await DexieOfflineDataBase.getVillageBySubCenterOffline(
            districtId,
            facilityId,
            e
          );
      } else {
        villageId = await DropdownService.getOneVillageBySubCenter(
          districtId,
          facilityId,
          e
        );
      }
      if (
        (villageId && villageId.data && villageId.data.length > 0) ||
        (villageIdOffline && villageIdOffline.length > 0)
      ) {
        // selectVillageRef.current.select.clearValue();
        let villagelist: any;
        if (!isOnline) {
          villagelist = [OptionLabel.villageNoneLabel, ...villageIdOffline];
        } else {
          villagelist = [OptionLabel.villageNoneLabel, ...villageId.data];
        }
        setVillageIdValues(villagelist);
      } else {
        // selectWardRef.current.select.clearValue();
        let Data: any = [OptionLabel.villageNoneLabel];
        setVillageIdValues(Data);
        formik.setFieldValue('villageId', 0);
      }
    }
  }

  async function getFacility(e: any) {
    setfacilityId(e && e.value);
    if (!((e && e.value) === prevFacilityIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('subCenterId', 0);
        formik.setFieldValue('villageId', 0);
      }
      let Subcenter: any;
      let SubcenterOffline: any;
      if (isOnline) {
        Subcenter = await DropdownService.getOneSubCenter(
          e && e.value,
          formik.values.districtId
        );
      } else {
        SubcenterOffline = await DexieOfflineDataBase.getSubCenterOffline(
          e && e.value,
          formik.values.districtId
        );
      }
      console.log('subbbbb', SubcenterOffline);
      if (
        (Subcenter && Subcenter.data && Subcenter.data.length > 0) ||
        (SubcenterOffline && SubcenterOffline.length > 0)
      ) {
        selectSubcenterRef.current.select.clearValue();
        formik.setFieldValue('subCenterId', '');
        let subcenterlist: any;
        if (!isOnline) {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...SubcenterOffline];
        } else {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...Subcenter.data];
        }
        setSubCenterIdValues(subcenterlist);
      } else {
        selectSubcenterRef.current.select.clearValue();
        let Data: any = [OptionLabel.subCenterNoneLabel];
        setSubCenterIdValues(Data);
        formik.setFieldValue('subCenterId', 0);
      }

      let Village: any;
      let VillageIdOffline: any;
      if (!isOnline) {
        VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(
          e && e.value,
          formik.values.districtId
        );
      } else {
        Village = await DropdownService.getOneVillage(
          e && e.value,
          formik.values.districtId
        );
      }
      console.log('village offline', VillageIdOffline);
      if (
        (Village && Village.data && Village.data.length > 0) ||
        (VillageIdOffline && VillageIdOffline.length > 0)
      ) {
        selectVillageRef.current.select.clearValue();
        formik.setFieldValue('villageId', '');
        let villagelist: any;
        if (!isOnline) {
          villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
        } else {
          villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
        }
        setVillageIdValues(villagelist);
      } else {
        selectVillageRef.current.select.clearValue();
        let Data: any = [OptionLabel.villageNoneLabel];
        setVillageIdValues(Data);
        formik.setFieldValue('villageId', 0);
      }
    }
  }

  async function getFacilityValues(e: any, id: any) {
    let Subcenter: any;
    let SubcenterOffline: any;
    if (isOnline) {
      Subcenter = await DropdownService.getOneSubCenter(e, id);
    } else {
      SubcenterOffline = await DexieOfflineDataBase.getSubCenterOffline(e, id);
    }
    if (
      (Subcenter && Subcenter.data && Subcenter.data.length > 0) ||
      (SubcenterOffline && SubcenterOffline.length > 0)
    ) {
      let subcenterlist: any;
      if (!isOnline) {
        subcenterlist = [OptionLabel.subCenterNoneLabel, ...SubcenterOffline];
      } else {
        subcenterlist = [OptionLabel.subCenterNoneLabel, ...Subcenter.data];
      }
      setSubCenterIdValues(subcenterlist);
    } else {
      let Data: any = [OptionLabel.subCenterNoneLabel];
      setSubCenterIdValues(Data);
      formik.setFieldValue('subCenterId', 0);
    }
    let Village: any;
    let VillageIdOffline: any;
    if (!isOnline) {
      VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e, id);
    } else {
      Village = await DropdownService.getOneVillage(e, id);
    }
    if (
      (Village && Village.data && Village.data.length > 0) ||
      (VillageIdOffline && VillageIdOffline.length > 0)
    ) {
      let villagelist: any;
      if (!isOnline) {
        villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
      } else {
        villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
      }
      setVillageIdValues(villagelist);
    } else {
      let Data: any = [OptionLabel.villageNoneLabel];
      setVillageIdValues(Data);
      formik.setFieldValue('villageId', 0);
    }
  }

  const zoneIdList =
    zoneIdValues &&
    zoneIdValues.map((item: any, i: any) => {
      return { label: item.zoneName, value: item.id };
    });
  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const corporationIdList =
    corporationIdValues &&
    corporationIdValues.map((item: any, i: any) => {
      return { label: item.corporationName, value: item.id };
    });
  const talukaIdList =
    talukaIdValues &&
    talukaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const facilityIdList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const subCenterIdList =
    subCenterIdValues &&
    subCenterIdValues.map((item: any, i: any) => {
      return { label: item.subCenterName, value: item.id };
    });
  const villageIdList =
    villageIdValues &&
    villageIdValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });
  const wardIdList =
    wardIdValues &&
    wardIdValues.map((item: any, i: any) => {
      return { label: item.wardName, value: item.id };
    });

  let unitOfActionList: any = [];
  unitAction &&
    unitAction.map((item: any, i: any) => {
      if (item && item.categoryCode === 1003) {
        unitOfActionList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });
  const antigenDropDownData: any = [];
  antigenId &&
    antigenId.map((item: any, i: any) => {
      if (item && item.categoryCode == 1012) {
        antigenDropDownData.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid') {
      formik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    }
  };

  return (
    <div className='font-chng in-left'>
      <FormikProvider value={formik}>
        <form
          onClick={showToast}
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
        >
          <div className='card'>
            <div className='card-body'>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='unitOfAction'
                        className='form-label font-chng'
                      >
                        Unit of Action*
                      </label>
                      {unitAction && unitAction.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectUnitActionRef}
                          name='unitOfAction'
                          isClearable={true}
                          className={
                            formik.errors.unitOfAction &&
                            formik.touched.unitOfAction
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            unitOfActionList
                              ? unitOfActionList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.unitOfAction
                                )
                              : ''
                          }
                          options={unitOfActionList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'unitOfAction',
                              option && option.value
                            );
                            setdistrictIdValuesDisplay(modifyData(districtIdValues))
                            formik.setFieldValue('districtId','')
                            filterNameOfUnit(option, unitAction);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectUnitActionRef}
                          name='unitOfAction'
                          isClearable={true}
                          className={
                            formik.errors.unitOfAction &&
                            formik.touched.unitOfAction
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.unitOfAction
                                )
                              : ''
                          }
                          options={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'unitOfAction',
                              option && option.value
                            );
                            filterNameOfUnit(option, unitAction);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.unitOfAction
                          ? formik.errors.unitOfAction
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-3 col-md-6 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='nameOfUnit'
                        className='form-label font-chng'
                      >
                        Name of Unit*
                      </label>
                      {nameOfUnitValues && nameOfUnitValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectNameOfUnitRef}
                          className={
                            formik.errors.nameOfUnit &&
                            formik.touched.nameOfUnit
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='nameOfUnit'
                          isClearable={true}
                          value={
                            nameOfUnit
                              ? nameOfUnit.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.nameOfUnit
                                )
                              : ''
                          }
                          options={nameOfUnit}
                          onChange={(option: Option) => {
                            if(option!== null){
                            formik.setFieldValue(
                              'nameOfUnit',
                              option && option.value
                            );
                            formik.setFieldValue('districtId','')
                            setdistrictIdValuesDisplay(modifyData(districtIdValues))
                            filterFieldUnit(option, unitAction);
                            if (formik.values.unitOfAction != 14) {
                              filterdistrict(option.value);
                            }else{
                              loadFsuData(option.value);
                            }
                          }
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectNameOfUnitRef}
                          className={
                            formik.errors.nameOfUnit &&
                            formik.touched.nameOfUnit
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='nameOfUnit'
                          isClearable={true}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.nameOfUnit
                                )
                              : ''
                          }
                          options={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'nameOfUnit',
                              option && option.values
                            );
                            filterFieldUnit(option, unitAction);
                            formik.setFieldValue('districtId','')
                            // if (formik.values.unitOfAction != 14) {
                            //   filterdistrict(option.value);
                            // }
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.nameOfUnit
                          ? formik.errors.nameOfUnit
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='nameOfFilariaFieldUnit'
                        className='form-label'
                      >
                        Name of Filaria Field Unit
                      </label>

                      {nameofFiledValues && nameofFiledValues.length > 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectNameOfFilariaFieldUnitRef}
                          className={
                            formik.errors.nameOfFilariaFieldUnit &&
                            formik.touched.nameOfFilariaFieldUnit
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='nameOfFilariaFieldUnit'
                          isClearable={true}
                          value={
                            nameOfFiledUnitValues
                              ? nameOfFiledUnitValues.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.nameOfFilariaFieldUnit
                                )
                              : ''
                          }
                          options={nameOfFiledUnitValues}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'nameOfFilariaFieldUnit',
                              option && option.value
                            );
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectNameOfFilariaFieldUnitRef}
                          className={
                            formik.errors.nameOfFilariaFieldUnit &&
                            formik.touched.nameOfFilariaFieldUnit
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='nameOfFilariaFieldUnit  '
                          isClearable={true}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.nameOfFilariaFieldUnit
                                )
                              : ''
                          }
                          options={nameOfFiledUnitValues}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'nameOfFilariaFieldUnit',
                              option && option.value
                            );
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.nameOfFilariaFieldUnit
                          ? formik.errors.nameOfFilariaFieldUnit
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='districtId' className='form-label'>
                        District*
                      </label>
                      {districtIdValues && districtIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='districtId'
                          options={districtIdValuesDisplay}
                          isClearable={true}
                          //isClearable="true"
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            districtIdList
                              ? districtIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.districtId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='districtId'
                          //options={NoneList}
                          className='custom-select'
                          isClearable={true}
                          options={NoneList}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.districtId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.districtId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='corporationId' className='form-label'>
                        Corporation*
                      </label>
                      {corporationIdValues &&
                      corporationIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectCorporationRef}
                          options={corporationIdList}
                          isClearable='true'
                          className={
                            formik.errors.corporationId &&
                            formik.touched.corporationId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='corporationId'
                          value={
                            corporationIdList
                              ? corporationIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.corporationId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'corporationId',
                              option && option.value
                            );
                            getCorporation(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectCorporationRef}
                          name='corporationId'
                          isClearable='true'
                          className='custom-select'
                          options={NoneList}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.corporationId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'corporationId',
                              option && option.value
                            );
                            getCorporation(option);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.corporationId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='talukaId' className='form-label'>
                        Taluka*
                      </label>
                      {talukaIdValues && talukaIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectTalukaRef}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='talukaId'
                          isClearable='true'
                          options={talukaIdList}
                          value={
                            talukaIdList
                              ? talukaIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.talukaId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                            // getTaluka(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectTalukaRef}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='talukaId'
                          isClearable='true'
                          options={NoneList}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.talukaId
                                )
                              : 0
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                            // getTaluka(option);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.talukaId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='zoneId' className='form-label'>
                        Zone
                      </label>
                      {zoneIdValues && zoneIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectZoneRef}
                          options={zoneIdList}
                          isClearable='true'
                          className={
                            formik.errors.zoneId && formik.touched.zoneId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='zoneId'
                          value={
                            zoneIdList
                              ? zoneIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.zoneId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'zoneId',
                              option && option.value
                            );
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectZoneRef}
                          options={NoneList}
                          isClearable='true'
                          className={
                            formik.errors.zoneId && formik.touched.zoneId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='zoneId'
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.zoneId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'zoneId',
                              option && option.value
                            );
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.zoneId ? formik.errors.zoneId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='facilityId' className='form-label'>
                        Facility*
                      </label>
                      {facilityIdValues && facilityIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectFacilityRef}
                          options={facilityIdList}
                          isClearable='true'
                          className={
                            formik.errors.facilityId &&
                            formik.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='facilityId'
                          value={
                            facilityIdList
                              ? facilityIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.facilityId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'facilityId',
                              option && option.value
                            );
                            getFacility(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectFacilityRef}
                          options={NoneList}
                          isClearable='true'
                          className={
                            formik.errors.facilityId &&
                            formik.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='facilityId'
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.facilityId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'facilityId',
                              option && option.value
                            );
                            getFacility(option);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.facilityId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label'>
                        Sub Center*
                      </label>
                      {subCenterIdValues && subCenterIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectSubcenterRef}
                          options={subCenterIdList}
                          isClearable='true'
                          className={
                            formik.errors.subCenterId &&
                            formik.touched.subCenterId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='subCenterId'
                          value={
                            subCenterIdList
                              ? subCenterIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.subCenterId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'subCenterId',
                              option && option.value
                            );
                            getSubCenter(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectSubcenterRef}
                          options={NoneList}
                          isClearable='true'
                          className={
                            formik.errors.subCenterId &&
                            formik.touched.subCenterId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='subCenterId'
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option.value === formik.values.subCenterId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'subCenterId',
                              option && option.value
                            );
                            getSubCenter(option);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.subCenterId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label'>
                        Village*
                      </label>
                      {villageIdValues && villageIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectVillageRef}
                          options={villageIdList}
                          isClearable='true'
                          className={
                            formik.errors.villageId && formik.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='villageId'
                          value={
                            villageIdList
                              ? villageIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.villageId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'villageId',
                              option && option.value
                            );
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectVillageRef}
                          options={NoneList}
                          isClearable='true'
                          className={
                            formik.errors.villageId && formik.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='villageId'
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.villageId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'villageId',
                              option && option.value
                            );
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.villageId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='year' className='form-label font-chng'>
                        Year*
                      </label>

                      <Select
                        name='year'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        isClearable='true'
                        className={
                          formik.errors.year && formik.touched.year
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          yearList
                            ? yearList.find(
                                (option: any) =>
                                  option && option.value === formik.values.year
                              )
                            : ''
                        }
                        options={yearList}
                        onChange={(option: Option) => {
                          formik.setFieldValue('year', option && option.value);
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.year ? formik.errors.year : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='month' className='form-label font-chng'>
                        Month*
                      </label>
                      <Select
                        name='month'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        className={
                          formik.errors.month && formik.touched.month
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        options={monthList}
                        isClearable='true'
                        onChange={(option: Option) => {
                          formik.setFieldValue('month', option && option.value);
                        }}
                        value={
                          monthList
                            ? monthList.find(
                                (option: any) =>
                                  option && option.value == formik.values.month
                              )
                            : ''
                        }
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.month ? formik.errors.month : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='town' className='form-label'>
                        Town
                      </label>
                      <input
                        type='text'
                        onInput={(event) => commonFunction.onlyAlphabets(event)}
                        className='form-control'
                        name='town'
                        onChange={formik.handleChange}
                        value={formik.values.town ? formik.values.town : ''}
                      />
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='area' className='form-label'>
                        Area
                      </label>
                      <input
                        type='text'
                        name='area'
                        onInput={(event) => commonFunction.onlyAlphabets(event)}
                        className='form-control'
                        onChange={formik.handleChange}
                        onKeyPress={(e) => commonFunction.keyPress(e)}
                        value={formik.values.area}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalPopulationVillage'
                        className='form-label'
                      >
                        Total Population Village
                      </label>
                      <input
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        name='totalPopulationVillage'
                        onChange={formik.handleChange}
                        value={formik.values.totalPopulationVillage}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalNoOfHousesInArea'
                        className='form-label'
                      >
                        Total No of Houses in Area
                      </label>
                      <input
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        name='totalNoOfHousesInArea'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalNoOfHousesInArea}
                      />
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='bsCollectionAntigenTest'
                        className='form-label'
                      >
                        BS Collection
                      </label>

                      <Select
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        name='bsCollectionAntigenTest'
                        isClearable='true'
                        className='custom-select'
                        value={
                          antigenDropDownData
                            ? antigenDropDownData.find(
                                (option: any) =>
                                  option &&
                                  option.value ===
                                    formik.values.bsCollectionAntigenTest
                              )
                            : ''
                        }
                        options={antigenDropDownData}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            `bsCollectionAntigenTest`,
                            option && option.value
                          );
                          props.handleTas(option);
                        }}
                      ></Select>
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='populationCoveredByUnit'
                        className='form-label'
                      >
                        Population Covered
                      </label>
                      <input
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        name='populationCoveredByUnit'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.populationCoveredByUnit}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='targetForCollectionOfNBS'
                        className='form-label'
                      >
                        Target for Collection of NBS
                      </label>
                      <input
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        name='targetForCollectionOfNBS'
                        onChange={formik.handleChange}
                        value={formik.values.targetForCollectionOfNBS}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='fixOrRandom' className='form-label'>
                        Fix or Random
                      </label>
                      <Select
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        name='fixOrRandom'
                        className='custom-select'
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            `fixOrRandom`,
                            option && option.value
                          );
                        }}
                        value={
                          TypeList
                            ? TypeList.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.fixOrRandom
                              )
                            : ''
                        }
                        isClearable='true'
                        options={TypeList}
                      ></Select>
                    </div>
                  </div>
                </Row>
                <Row className='mb-3'>
                  <div className='col-md-3 col-xl-3'>
                    <div className='form-grp'>
                      <label
                        htmlFor='nameOfEU'
                        className='form-label font-chng'
                      >
                        Name of EU
                      </label>
                      <input
                        type='text'
                        // disabled={props.hideTas ? false : true}
                        className='form-control'
                        name='nameOfEU'
                        value={formik.values.nameOfEU}
                        onKeyPress={(e) => commonFunction.keyPress(e)}
                      />
                    </div>
                  </div>
                  <div className='col-md-3 col-xl-3'>
                    <div className='form-grp'>
                      <label
                        htmlFor='nameOfEA'
                        className='form-label font-chng'
                      >
                        Name of EA
                      </label>
                      <input
                        type='text'
                        // disabled={props.hideTas ? false : true}
                        className='form-control'
                        name='nameOfEA'
                        value={formik.values.nameOfEA}
                        onKeyPress={(e) => commonFunction.keyPress(e)}
                      />
                    </div>
                  </div>
                </Row>
              </fieldset>
              {/* <div className="form-grp text-right">
                <button
                  type="submit"
                  className="btn btn-outline-light"
                  onClick={() => history.push(listDESheetName)}
                >
                  Cancel
                </button>
                <Button id="Submitbtnid" type="submit" className="btn btn-secondary">
                  Next
                </Button>
              </div> */}
            </div>
          </div>
          <div className='buttongrouprightend mb-4'>
            <Button
              type='submit'
              // className=' btn-cancel'
              onClick={() => history.push(listDESheetName)}
              style={{
                marginRight: '10px',
                backgroundColor: '#34c38f',
                border: '0px',
                color: ' #ffffff',
                textTransform: 'none',
              }}
            >
              Cancel{' '}
            </Button>
            <Button
              id='Submitbtnid'
              type='submit'
              // className='btn-cancel'
              disabled={isDisabled}
              style={{
                backgroundColor: '#34c38f',
                border: '0px',
                color: ' #ffffff',
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default FilariaFieldUnitInfo;

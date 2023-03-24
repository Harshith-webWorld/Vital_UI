import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  useFormik,
  FieldArray,
  FormikProvider,
} from 'formik';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation } from 'react-router-dom';
//import { ToastContainer } from "react-toastify";
import history from '../../../../helpers/history';
import DropdownService from '../../../services/DropdownService';
import Delete from '../../../assets/img/LEFP_Images/deletesection.png';
import Button from 'react-bootstrap/Button';
import { EntomologicalLarvicidal } from '../../../interfaces/FormEntomologicalLarvicidalInterface';
import EntomologicalLarvicidalService from '../../../services/FormEntomologicalLarvicidalService';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import moment from 'moment';
import entomologicalDraftServices from '../../../draftServices/FormEntomologicalDraftservice';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

const AddEntomologicalLarvicidal: React.FC<any> = (props) => {
  const location = useLocation<any>();
  let [StateIdValues, setStateValues] = useState([]);
  let [districtIdValues, setDistrictValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subCenterIdValues, setsubCenterIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  let [unitAction, setUnitAction] = useState([]);
  let [mosquitotypeAction, setMosquitoTypeAction] = useState([]);
  let [larvicideAction, setLarvicideAction] = useState([]);
  let [nameOfUnitValues, setNameOfUnitValues] = useState([]);
  let [nameofFiledValues, setNameOfFiledValues] = useState([]);
  const [districtId, setdistrictId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [facilityId, setfacilityId] = useState();
  const [talukaId, settalukaId] = useState();
  const [subCenterId, setsubCenterId] = useState();
  const [typeOfUnit, setTypeOfUnit] = useState();
  const [maxValidation, setmaxValidation] = useState(false);
  const [addValue, setAddValue] = useState<any>();
  const [density, setDensity] = useState(0);
  const [densityOther, setDensityOther] = useState(0);
  const [showDensity, setShowDensity] = useState(false);
  const listDESheetName: any = props && props.listDESheetName;
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthsText = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const currentYear = new Date().getFullYear();
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(currentYear, currentYear - 50, -1);
  let NoneList = [{ label: 'None', value: 0 }];
  const [symbolsArr] = useState(['e', 'E', '+', '-', 'Enter']);
  const currentdate = moment(new Date()).format('yyyy-MM-DD');
  let measurementValue = [
    // { label: "Select....", value: 0 },
    { label: 'Ltr.', value: 'Ltr.' },
    { label: 'Kg.', value: 'Kg.' },
    { label: 'Number.', value: 'Number.' },
  ];
  let isOnline = window.navigator.onLine;
  let [districtIdValuesDisplay, setdistrictIdValuesDisplay] = useState([]);
  const [initialValues, setInitialvalues] = useState<EntomologicalLarvicidal>({
    year: '',
    month: '',
    typeOfUnit: '',
    nameOfUnit: '',
    districtId: '',
    talukaId: '',
    facilityId: '',
    subCenterId: '',
    villageId: '',
    town: '',
    dateOfSurvey: currentdate,
    fixedOrRandom: '',
    totalTimeSpentHrs: 0,
    totalTimeSpentMinutes: 0,
    mosqDissectedCulexQui: 0,
    totalNoPositiveMosq1to3Stage: '',
    totalNoPositiveMosq3Stage: '',
    breedingPlacesChecked: '',
    totalNoOfDipsTaken: '',
    noOfPosVePlaceIIIandIVStage: '',
    noOfPosVePlaceForPupae: '',
    totalCulexLarvaeCount1to4Stage: '',
    totalCulexPupaeCount: '',
    totalAnLarvaeCount: '',
    noOfWellsBioControl: '',
    noOfTankBioControl: '',
    noOfCanalsBioControl: '',
    noOfLocGuppyIntro: '',
    noOfPendingLocTreatment: '',
    noOfVentPipesCovered: '',
    larvicideNameId: 0,
    measurement: '',
    openingBalance: '',
    receivedDuringMonth: '',
    consumedDuringMonth: '',
    balanceEndOfMonth: '',
    noOfMenWorkingSFW: '',
    noOfMenWorkingFW: '',
    canalisationWork: '',
    desiltingWork: '',
    deweedingWork: '',
    fillingWork: '',
    otherWork: '',
    isActive: true,
    entomologicalDataCounts: [
      {
        entomologicalLarvicidalListId: 0,
        mosquitoTypeId: 0,
        noOfMosquitoCollectedMale: 0,
        noOfMosquitoCollectedFemale: 0,
        noOfMosquitoCollectedTotal: 0,
        density: 0,
        densityOther: 0,
        isActive: true,
      },
    ],
  });

  useEffect(() => {
    getData();
  }, []);

  const validSchema = Yup.object().shape({
    year: Yup.string().required('Year is Required').nullable(),
    month: Yup.number().min(1, 'Required').required('Required').nullable(),
    typeOfUnit: Yup.string().required('TypeUnit is Required').nullable(),
    nameOfUnit: Yup.string().required('NameUnit is Required').nullable(),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('District is required').nullable(),
    }),
    talukaId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Taluka is required').nullable(),
    }),
    facilityId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Facility is required').nullable(),
    }),
    subCenterId: Yup.string().required().nullable(),
    villageId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Village is required').nullable(),
    }),
  });

  const mosquitohandle = (e) => {
    if (e.label == 'Other') {
      setShowDensity(true);
      //e.preventDefault();

      // e.persist()
    } else if (
      e.label == 'Culex' ||
      e.label == 'Anopheles' ||
      e.label == 'Aedes'
    ) {
      setShowDensity(false);
    }
  };
  async function loadFsuData(e:any){
    var fsu = await DropdownService.getDistrictByFSU(e);
    if(fsu.data.length==1){
      formik.setFieldValue('districtId', fsu.data[0].id);
    }else{
     setdistrictIdValuesDisplay(modifyData(fsu.data))
    }
    console.log(fsu,"<--fsu district list")
  }
  const larvicideList: any = [];
  larvicideAction &&
    larvicideAction.map((item: any, i: any) => {
      if (item && item.categoryCode === 1021) {
        larvicideList.push({ label: item.categoryOptionName, value: item.id });
      }
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

  const nameOfUnit =
    nameOfUnitValues &&
    nameOfUnitValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  const mosquitotypeList: any = [];
  mosquitotypeAction &&
    mosquitotypeAction.map((item: any, i: any) => {
      if (item && item.categoryCode === 1017) {
        mosquitotypeList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  async function getData() {
    const unitActionData = await getDropDownData();
    const densityData = await getUnitActionData();
    if (location.state && location.state.id) {
      let densityTotal: any = [];
      const id: any = location.state.id;
      const response =
        await EntomologicalLarvicidalService.getoneEntomologicalLarvicidal(id);
      response.data[0].entomologicalDataCounts.forEach((item: any, index) => {
        densityTotal.push(item.noOfMosquitoCollectedTotal);
        densityTotal.map((item: any, index: any) => {
          densityData.forEach((el: any) => {
            let densityEditMin = response.data[0].totalTimeSpentMinutes / 60;
            let TotalTimeEdit =
              response.data[0].totalTimeSpentHrs + densityEditMin;
            // let densityEdit = (item / TotalTimeEdit) * 10
            // let densityEditOther = (item / TotalTimeEdit) * 1
            let densityEdit = 0;
            let densityEditOther = 0;
            if (TotalTimeEdit) {
              densityEdit = (item / TotalTimeEdit) * 10;
              densityEditOther = (item / TotalTimeEdit) * 1;
            }
            if (
              el.id ===
              response.data[0].entomologicalDataCounts[`${index}`]
                .mosquitoTypeId
            ) {
              if (el.categoryOptionName === 'Other') {
                formik.setFieldValue(
                  `entomologicalDataCounts.[${index}].density`,
                  densityEditOther
                );
              } else {
                formik.setFieldValue(
                  `entomologicalDataCounts.[${index}].density`,
                  densityEdit
                );
              }
            }
          });
        });
      });
      if (response && response.data) {
        let Data: any = response && response.data && response.data[0];
        getDistrictValues(response.data[0].districtId);
        // getTalukaValues(response.data[0].talukaId, response.data[0].districtId);
        await getFacilityValues(
          response.data[0].facilityId,
          response.data[0].districtId
        );
        getSubCenterValues(Data.subCenterId, Data.facilityId, Data.districtId);
        Data.fixedOrRandom = boolean2str(Data.fixedOrRandom);
        if (unitActionData) {
          filterNameOfUnit(response.data[0].typeOfUnit, unitActionData);
        }
        setInitialvalues(Data);
      }
    } else if (location.state && location.state.UUID) {
      const id: any = location.state.UUID;
      const response = await entomologicalDraftServices.getOneEntomological(id);
      if (response) {
        let Data: any = response;
        getDistrictValues(response.districtId);
        // getTalukaValues(response.talukaId, response.districtId);
        await getFacilityValues(response.facilityId, response.districtId);
        getSubCenterValues(
          response.subCenterId,
          response.facilityId,
          response.districtId
        );
        Data.fixedOrRandom = boolean2str(Data.fixedOrRandom);
        if (unitActionData) {
          filterNameOfUnit(response.typeOfUnit, unitActionData);
        }
        setInitialvalues(Data);
      }
    }
  }

  let nameofUnitRef: any = useRef();
  let typeofUnitRef: any = useRef();

  async function filterNameOfUnit(e: any, optionTableValues) {
    optionTableValues &&
      optionTableValues.map(async (item: any, i: any) => {
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
              nameofUnitRef.current.select.clearValue();
              let data: any;
              if (isOnline) {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitData.data];
              } else {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitOffline];
              }
              setNameOfUnitValues(data);
              //formik.setFieldValue("nameOfUnit", "")
            } else {
              nameofUnitRef.current.select.clearValue();
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
    console.log(formik.values.typeOfUnit, 'testt');
  }

  const districtList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const talukaList =
    talukaIdValues &&
    talukaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const facilityList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const subcenterList =
    subCenterIdValues &&
    subCenterIdValues.map((item: any, i: any) => {
      return { label: item.subCenterName, value: item.id };
    });
  const villageList =
    villageIdValues &&
    villageIdValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });
  const yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  const monthList = months.map((month: any, i: any) => {
    return { label: monthsText[i], value: month };
  });
  async function deleteFieldArray(row) {
    if (row.id) {
      const response =
        await EntomologicalLarvicidalService.deleteEntomologicalLarvicidalFieldArray(
          row.id
        );
    }
  }

  let selectTalukaRef: any = useRef();
  let selectFacilityRef: any = useRef();
  let selectVillageRef: any = useRef();
  let selectSubcenterRef: any = useRef();

  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevTypeOfUnitRef: any = React.useRef();
  const prevSubCenterRef: any = React.useRef();

  useEffect(() => {
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevTalukaRef.current = talukaId;
    prevTypeOfUnitRef.current = typeOfUnit;
    prevSubCenterRef.current = subCenterId;
  });
  const prevDistrictIdValue = prevDistrictRef.current;
  const prevFacilityIdValue = prevFacilityRef.current;
  const prevTalukaIdValue = prevTalukaRef.current;
  const prevTypeOfUnitValue = prevTypeOfUnitRef.current;
  const prevSubCenterIdValue = prevSubCenterRef.current;

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
      /* //corporation
      let corporationIdOffline: any;
      let corporationId: any;
      if (!isOnline) {
        corporationIdOffline = await DexieOfflineDataBase.getCorporationOffline(e && e.value)
      } else {
        corporationId = await DropdownService.getOneCorporation(e && e.value)
      }
  
      if (corporationId && corporationId.data && corporationId.data.length > 0 || corporationIdOffline && corporationIdOffline.length > 0) {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any;
        if (!isOnline) {
          corporationData = [OptionLabel.corporationNone, ...corporationIdOffline];
        } else {
          corporationData = [OptionLabel.corporationNone, ...corporationId.data];
        }
        formik.setFieldValue("corporationId", "");
        formik.setFieldValue("wardId", 0);
        formik.setFieldValue("zoneId", 0);
        setcorporationIdValues(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any = [OptionLabel.corporationNone];
        setcorporationIdValues(corporationData);
        formik.setFieldValue("corporationId", 0);
      }
  */
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
        settalukaIdValues(talukaList);
      } else {
        selectTalukaRef.current.select.clearValue();
        let Data: any = [OptionLabel.talukaNone];
        settalukaIdValues(Data);
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
        setfacilityIdValues(facilityList);
      } else {
        selectFacilityRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setfacilityIdValues(Data);
        formik.setFieldValue('facilityId', 0);
      }
    }
  }

  async function getDistrictValues(e: any) {
    //corporation
    /*  let corporationIdOffline: any;
     let corporationId: any;
     if (!isOnline) {
       corporationIdOffline = await DexieOfflineDataBase.getCorporationOffline(e)
     } else {
       corporationId = await DropdownService.getOneCorporation(e)
     }
     if (corporationId && corporationId.data && corporationId.data.length > 0 || corporationIdOffline && corporationIdOffline.length > 0) {
       let corporationData: any;
       if (!isOnline) {
         corporationData = [OptionLabel.corporationNone, ...corporationIdOffline];
       } else {
         corporationData = [OptionLabel.corporationNone, ...corporationId.data];
       }
       setcorporationIdValues(corporationData);
     } else {
       let Data: any = [OptionLabel.corporationSelectLabel];
       setcorporationIdValues(Data);
       formik.setFieldValue("corporationId", 0);
     } */

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
      settalukaIdValues(talukaList);
    } else {
      let Data: any = [OptionLabel.talukaNone];
      settalukaIdValues(Data);
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
      setfacilityIdValues(facilityList);
    } else {
      let Data: any = [OptionLabel.facilityNoneLabel];
      setfacilityIdValues(Data);
      formik.setFieldValue('facilityId', 0);
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
  //       VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e && e.value, formik.values.districtId);
  //     } else {
  //       Village = await DropdownService.getOneVillage(e && e.value, formik.values.districtId);
  //     }

  //     if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //       selectVillageRef.current.select.clearValue();
  //       formik.setFieldValue("villageId", "");
  //       let villagelist: any;
  //       if (!isOnline) {
  //         villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //       } else {
  //         villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //       }
  //       setvillageIdValues(villagelist);
  //     } else {
  //       selectVillageRef.current.select.clearValue();
  //       let Data: any = [OptionLabel.villageNoneLabel];
  //       setvillageIdValues(Data);
  //       formik.setFieldValue("villageId", 0);
  //     }
  //   }
  // }

  // async function getTalukaValues(e: any, id: any) {
  //   if (location && location.state && location.state.id) {
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
  //       setvillageIdValues(villagelist);
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
          setvillageIdValues(villagelist);
        }
        // else {
        //   selectVillageRef.current.select.clearValue();
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
        setvillageIdValues(villagelist);
      }
      // else {
      //   // selectVillageRef.current.select.clearValue();
      //   let Data: any = [OptionLabel.villageNoneLabel];
      //   setvillageIdValues(Data);
      //   formik.setFieldValue("villageId", 0);
      // }
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
        setsubCenterIdValues(subcenterlist);
      } else {
        selectSubcenterRef.current.select.clearValue();
        let Data: any = [OptionLabel.subCenterNoneLabel];
        setsubCenterIdValues(Data);
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
        setvillageIdValues(villagelist);
      } else {
        selectVillageRef.current.select.clearValue();
        let Data: any = [OptionLabel.villageNoneLabel];
        setvillageIdValues(Data);
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
    Subcenter = await DropdownService.getOneSubCenter(e, id);
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
      setsubCenterIdValues(subcenterlist);
    } else {
      let Data: any = [OptionLabel.subCenterNoneLabel];
      setsubCenterIdValues(Data);
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
      setvillageIdValues(villagelist);
    } else {
      let Data: any = [OptionLabel.villageNoneLabel];
      setvillageIdValues(Data);
      formik.setFieldValue('villageId', 0);
    }
  }

  async function getDropDownData() {
    const state: any = await DropdownService.getStateInfo();
    if (isOnline) {
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        setUnitAction(unitActionData.data);
      }

      if (unitActionData && unitActionData.data) {
        setMosquitoTypeAction(unitActionData.data);
      }

      if (unitActionData && unitActionData.data) {
        setLarvicideAction(unitActionData.data);
      }

      const District: any = await DropdownService.getDistrictInfo();
      if (District && District.data) {
        setDistrictValues(District.data);
        setdistrictIdValuesDisplay(modifyData(District.data))
      }
      return unitActionData.data;
    } else {
      const unitActionData: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (unitActionData) {
        setUnitAction(unitActionData);
        setMosquitoTypeAction(unitActionData);
        setLarvicideAction(unitActionData);
      }
      const districtIdOffline: any = await DexieOfflineDataBase.getDistricts();
      if (districtIdOffline) {
        setDistrictValues(districtIdOffline);
      }
      return unitActionData;
    }
  }
  const modifyData=(data)=>{
    return data.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    })
      }
  async function getUnitActionData() {
    if (isOnline) {
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        return unitActionData.data;
      }
    }
  }

  const boolean2str = (value) => {
    if (value === true) return 'true';
    if (value === false) return 'false';
    return value;
  };

  // const handleWheelEvent = (e: any) => {
  //   e.target.blur();
  // }

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      values.totalTimeSpentHrs = values.totalTimeSpentHrs
        ? values.totalTimeSpentHrs
        : 0;
      values.totalTimeSpentMinutes = values.totalTimeSpentMinutes
        ? values.totalTimeSpentMinutes
        : 0;
      values.totalNoPositiveMosq1to3Stage = values.totalNoPositiveMosq1to3Stage
        ? values.totalNoPositiveMosq1to3Stage
        : 0;
      values.totalNoPositiveMosq3Stage = values.totalNoPositiveMosq3Stage
        ? values.totalNoPositiveMosq3Stage
        : 0;
      values.totalNoOfDipsTaken = values.totalNoOfDipsTaken
        ? values.totalNoOfDipsTaken
        : 0;
      values.noOfPosVePlaceIIIandIVStage = values.noOfPosVePlaceIIIandIVStage
        ? values.noOfPosVePlaceIIIandIVStage
        : 0;
      values.noOfPosVePlaceForPupae = values.noOfPosVePlaceForPupae
        ? values.noOfPosVePlaceForPupae
        : 0;
      values.totalCulexLarvaeCount1to4Stage =
        values.totalCulexLarvaeCount1to4Stage
          ? values.totalCulexLarvaeCount1to4Stage
          : 0;
      values.totalCulexPupaeCount = values.totalCulexPupaeCount
        ? values.totalCulexPupaeCount
        : 0;
      values.totalAnLarvaeCount = values.totalAnLarvaeCount
        ? values.totalAnLarvaeCount
        : 0;
      values.noOfWellsBioControl = values.noOfWellsBioControl
        ? values.noOfWellsBioControl
        : 0;
      values.noOfTankBioControl = values.noOfTankBioControl
        ? values.noOfTankBioControl
        : 0;
      values.noOfCanalsBioControl = values.noOfCanalsBioControl
        ? values.noOfCanalsBioControl
        : 0;
      values.noOfLocGuppyIntro = values.noOfLocGuppyIntro
        ? values.noOfLocGuppyIntro
        : 0;
      values.noOfPendingLocTreatment = values.noOfPendingLocTreatment
        ? values.noOfPendingLocTreatment
        : 0;
      values.noOfVentPipesCovered = values.noOfVentPipesCovered
        ? values.noOfVentPipesCovered
        : 0;
      values.openingBalance = values.openingBalance ? values.openingBalance : 0;
      values.receivedDuringMonth = values.receivedDuringMonth
        ? values.receivedDuringMonth
        : 0;
      values.consumedDuringMonth = values.consumedDuringMonth
        ? values.consumedDuringMonth
        : 0;
      values.balanceEndOfMonth = values.balanceEndOfMonth
        ? values.balanceEndOfMonth
        : 0;
      values.noOfMenWorkingSFW = values.noOfMenWorkingSFW
        ? values.noOfMenWorkingSFW
        : 0;
      values.noOfMenWorkingFW = values.noOfMenWorkingFW
        ? values.noOfMenWorkingFW
        : 0;
      values.canalisationWork = values.canalisationWork
        ? values.canalisationWork
        : 0;
      values.desiltingWork = values.desiltingWork ? values.desiltingWork : 0;
      values.deweedingWork = values.deweedingWork ? values.deweedingWork : 0;
      values.fillingWork = values.fillingWork ? values.fillingWork : 0;
      values.otherWork = values.otherWork ? values.otherWork : 0;
      setInitialvalues(values);
      setIsDisabled(true);
      if (values && values.status === 'Active') {
        if (location && location.state && location.state.id) {
          values.districtId = values.districtId == 0 ? '0' : values.districtId;
          values.talukaId = values.talukaId == 0 ? '0' : values.talukaId;
          values.facilityId = values.facilityId == 0 ? '0' : values.facilityId;
          values.subCenterId =
            values.subCenterId == 0 ? '0' : values.subCenterId;
          values.villageId = values.villageId == 0 ? '0' : values.villageId;
          formik.setFieldValue('nameOfUnit', values.nameOfUnit);
          values.lastModifiedBy = props && props.userSessionId;
          values.entomologicalDataCounts.map((values: any) => {
            if (values && values.id) {
              values.lastModifiedBy = props && props.userSessionId;
            } else {
              values.createdBy = props && props.userSessionId;
              values.lastModifiedBy = 0;
            }
          });
          let response =
            await EntomologicalLarvicidalService.updateEntomologicalLarvicidal(
              values,
              location.state.id
            );
          setIsDisabled(false);
          toast.success('Form Submitted Successfully', {
            position: toast.POSITION.TOP_CENTER,
            className: 'toast-message',
          });
          history.push(listDESheetName);
        } else {
          values.districtId = values.districtId == 0 ? '0' : values.districtId;
          values.talukaId = values.talukaId == 0 ? '0' : values.talukaId;
          values.facilityId = values.facilityId == 0 ? '0' : values.facilityId;
          values.subCenterId =
            values.subCenterId == 0 ? '0' : values.subCenterId;
          values.villageId = values.villageId == 0 ? '0' : values.villageId;
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          values.entomologicalDataCounts.map((values: any) => {
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
          });
          if (values && values.entomologicalUUID) {
            setIsDisabled(true);
            let UUID = values.entomologicalUUID;
            let response =
              await EntomologicalLarvicidalService.postEntomologicalLarvicidal(
                values
              );
            setIsDisabled(false);

            let deleteResponse =
              await entomologicalDraftServices.deleteEntomological(UUID);
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
              className: 'toast-message',
            });
            history.push(listDESheetName);
          } else {
            let response =
              await EntomologicalLarvicidalService.postEntomologicalLarvicidal(
                values
              );
            if (response.data) {
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
                className: 'toast-message',
              });
            }
            history.push(listDESheetName);
          }
        }
      } else if (values && values.status === 'Draft') {
        if (location.state && location.state.UUID) {
          setIsDisabled(true);
          const id: any = location.state.UUID;
          values.districtId = values.districtId == 0 ? '0' : values.districtId;
          values.talukaId = values.talukaId == 0 ? '0' : values.talukaId;
          values.facilityId = values.facilityId == 0 ? '0' : values.facilityId;
          values.subCenterId =
            values.subCenterId == 0 ? '0' : values.subCenterId;
          values.villageId = values.villageId == 0 ? '0' : values.villageId;
          values.lastModifiedBy = props && props.userSessionId;
          const response = await entomologicalDraftServices.updateEntomological(
            id,
            values
          );
          setIsDisabled(false);
          if (response) {
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
              className: 'toast-message',
            });
            history.push(listDESheetName);
          }
        } else {
          setIsDisabled(true);
          values.districtId = values.districtId == 0 ? '0' : values.districtId;
          values.talukaId = values.talukaId == 0 ? '0' : values.talukaId;
          values.facilityId = values.facilityId == 0 ? '0' : values.facilityId;
          values.subCenterId =
            values.subCenterId == 0 ? '0' : values.subCenterId;
          values.villageId = values.villageId == 0 ? '0' : values.villageId;
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          let response = await entomologicalDraftServices.addEntomological(
            values
          );
          setIsDisabled(false);
          if (response) {
            //alert.success(response.message)
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
              className: 'toast-message',
            });
            history.push(listDESheetName);
          }
        }
      }
    },
  });
  const clearDensity = () => {
    setDensity(0);
    setDensityOther(0);
  };

  function addField(arrayHelpers) {
    const index = arrayHelpers.form.values.entomologicalDataCounts.length;
    setDensity(0);
    if (index == 1) {
      arrayHelpers.push({
        mosquitoTypeId: 0,
        noOfMosquitoCollectedMale: 0,
        noOfMosquitoCollectedFemale: 0,
        noOfMosquitoCollectedTotal: 0,
        density: 0,
        densityOther: 0,
      });
    }
  }

  let DynamicArray = () => {
    return (
      <FieldArray
        name='entomologicalDataCounts'
        render={(arrayHelpers) => (
          <div className='in-left'>
            {formik.values.entomologicalDataCounts &&
              formik.values.entomologicalDataCounts?.map(
                (familyMembers, index) => (
                  <div className='row' key={index}>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            className='form-label pt-md'
                            htmlFor={`mosquitoTypeId`}
                          >
                            Mosquito Species
                          </label>
                          <Select
                            name={`entomologicalDataCounts.[${index}].mosquitoTypeId`}
                            isClearable={true}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            id='density'
                            placeholder={mosquitotypeList ? 'Select' : 'None'}
                            value={
                              mosquitotypeList
                                ? mosquitotypeList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.entomologicalDataCounts[
                                          index
                                        ].mosquitoTypeId
                                  )
                                : ''
                            }
                            options={mosquitotypeList}
                            onChange={(option: Option, e) => {
                              formik.setFieldValue(
                                `entomologicalDataCounts.[${index}].mosquitoTypeId`,
                                option && option.value
                              );
                              // mosquitohandle(option)
                              let total =
                                formik.values.entomologicalDataCounts[index]
                                  .noOfMosquitoCollectedMale +
                                formik.values.entomologicalDataCounts[index]
                                  .noOfMosquitoCollectedFemale;
                              let timeMin =
                                formik.values.totalTimeSpentMinutes / 60;
                              let TotalTime =
                                formik.values.totalTimeSpentHrs + timeMin;
                              let density = 0;
                              let densityOther = 0;
                              if (TotalTime) {
                                density = (total / TotalTime) * 10;
                                densityOther = (total / TotalTime) * 1;
                              }
                              if (option.label === 'Other') {
                                formik.setFieldValue(
                                  `entomologicalDataCounts.[${index}].density`,
                                  densityOther
                                );
                              } else {
                                formik.setFieldValue(
                                  `entomologicalDataCounts.[${index}].density`,
                                  density
                                );
                              }
                            }}
                          ></Select>
                        </div>
                      </div>

                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            className='form-label'
                            htmlFor={`entomologicalDataCounts`}
                          >
                            No of Mosquito Collected
                          </label>
                          <div className='row'>
                            <div className='col-xl-6 col-md-6 col-12'>
                              <label
                                className='form-label'
                                htmlFor={`noOfMosquitoCollectedMale`}
                              >
                                M
                              </label>
                              <Field
                                name={`entomologicalDataCounts.[${index}].noOfMosquitoCollectedMale`}
                                type='number'
                                onWheel={(e) =>
                                  commonFunction.handleWheelEvent(e)
                                }
                                min='0'
                                onKeyUp={(e) =>
                                  e.keyCode === 38 && e.preventDefault()
                                }
                                onKeyDown={(e) =>
                                  e.keyCode === 40 && e.preventDefault()
                                }
                                onKeyPress={(e) =>
                                  symbolsArr.includes(e.key) &&
                                  e.preventDefault()
                                }
                                className='form-control'
                                onChange={(e: any, option: any) => {
                                  let num: number = parseInt(e.target.value);
                                  let mTypeId =
                                    formik.values.entomologicalDataCounts[index]
                                      .mosquitoTypeId;
                                  let total =
                                    num +
                                    formik.values.entomologicalDataCounts[index]
                                      .noOfMosquitoCollectedFemale;
                                  let timeMin =
                                    formik.values.totalTimeSpentMinutes / 60;
                                  let TotalTime =
                                    formik.values.totalTimeSpentHrs + timeMin;
                                  let density = 0;
                                  let densityOther = 0;
                                  if (TotalTime) {
                                    density = (total / TotalTime) * 10;
                                    densityOther = (total / TotalTime) * 1;
                                  }
                                  let mosquitoIdData = mosquitotypeList.filter(
                                    (obj) => {
                                      return (
                                        obj.value ===
                                        formik.values.entomologicalDataCounts[
                                          index
                                        ].mosquitoTypeId
                                      );
                                    }
                                  );
                                  if (
                                    mosquitoIdData.length &&
                                    mosquitoIdData[index]?.label === 'Other'
                                  ) {
                                    formik.setFieldValue(
                                      `entomologicalDataCounts.[${index}].density`,
                                      densityOther
                                    );
                                  } else {
                                    formik.setFieldValue(
                                      `entomologicalDataCounts.[${index}].density`,
                                      density
                                    );
                                  }
                                  formik.setFieldValue(
                                    `entomologicalDataCounts.[${index}].noOfMosquitoCollectedTotal`,
                                    total
                                  );
                                }}
                              />
                            </div>
                            <div className='col-xl-6 col-md-6 col-12'>
                              <label
                                className='form-label'
                                htmlFor={`noOfMosquitoCollectedFemale`}
                              >
                                F
                              </label>
                              <Field
                                name={`entomologicalDataCounts.[${index}].noOfMosquitoCollectedFemale`}
                                type='number'
                                min='0'
                                onWheel={(e) =>
                                  commonFunction.handleWheelEvent(e)
                                }
                                onKeyUp={(e) =>
                                  e.keyCode === 38 && e.preventDefault()
                                }
                                onKeyDown={(e) =>
                                  e.keyCode === 40 && e.preventDefault()
                                }
                                onKeyPress={(e) =>
                                  symbolsArr.includes(e.key) &&
                                  e.preventDefault()
                                }
                                className='form-control'
                                onChange={(e: any, option: any) => {
                                  let mTypeId =
                                    formik.values.entomologicalDataCounts[index]
                                      .mosquitoTypeId;
                                  let num: number = parseInt(e.target.value);
                                  let total =
                                    formik.values.entomologicalDataCounts[index]
                                      .noOfMosquitoCollectedMale + num;
                                  let timeMin =
                                    formik.values.totalTimeSpentMinutes / 60;
                                  let TotalTime =
                                    formik.values.totalTimeSpentHrs + timeMin;
                                  let density = 0;
                                  let densityOther = 0;
                                  if (TotalTime) {
                                    density = (total / TotalTime) * 10;
                                    densityOther = (total / TotalTime) * 1;
                                  }
                                  formik.setFieldValue(
                                    `entomologicalDataCounts.[${index}].noOfMosquitoCollectedTotal`,
                                    total
                                  );

                                  let mosquitoIdData = mosquitotypeList.filter(
                                    (obj) => {
                                      return (
                                        obj.value ===
                                        formik.values.entomologicalDataCounts[
                                          index
                                        ].mosquitoTypeId
                                      );
                                    }
                                  );

                                  if (
                                    mosquitoIdData.length &&
                                    mosquitoIdData[index]?.label === 'Other'
                                  ) {
                                    formik.setFieldValue(
                                      `entomologicalDataCounts.[${index}].density`,
                                      densityOther
                                    );
                                  } else {
                                    formik.setFieldValue(
                                      `entomologicalDataCounts.[${index}].density`,
                                      density
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            className='form-label pt-md'
                            htmlFor={`noOfMosquitoCollectedTotal`}
                          >
                            Total
                          </label>
                          <Field
                            name={`entomologicalDataCounts.[${index}].noOfMosquitoCollectedTotal`}
                            type='text'
                            className='form-control'
                            value={
                              formik.values.entomologicalDataCounts[index]
                                .noOfMosquitoCollectedTotal
                            }
                            disabled={true}
                          />
                        </div>
                      </div>
                      {showDensity ? (
                        <div className='col-md-6 col-xl-3  col-12'>
                          <div className='form-grp'>
                            <label
                              className='form-label pt-md'
                              htmlFor={'density'}
                            >
                              Density Other
                            </label>
                            <Field
                              name={`entomologicalDataCounts.[${index}].densityOther`}
                              type='text'
                              className='form-control'
                              id='density1'
                              value={
                                formik.values.totalTimeSpentMinutes / 60 +
                                formik.values.totalTimeSpentHrs
                                  ? formik.values.entomologicalDataCounts[
                                      index
                                    ]?.densityOther?.toFixed(2)
                                  : 0
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='col-md-6 col-xl-3  col-12'>
                          <div className='form-grp'>
                            <label
                              className='form-label pt-md'
                              htmlFor={`entomologicalDataCounts.[${index}].density`}
                            >
                              Density
                            </label>
                            <Field
                              name={`entomologicalDataCounts.[${index}].density`}
                              type='text'
                              id='density2'
                              className='form-control'
                              value={
                                formik.values.totalTimeSpentMinutes / 60 +
                                formik.values.totalTimeSpentHrs
                                  ? formik.values.entomologicalDataCounts[
                                      index
                                    ]?.density?.toFixed(2)
                                  : 0
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}

                      <div
                        className='col-md-6 offset-xl-9 col-xl-3 col-12 ento-btn d-flex flex-row-reverse'
                        style={{ alignItems: 'baseline' }}
                      >
                        {location.state && location.state.view ? (
                          ''
                        ) : (
                          <>
                            <button
                              className='btn font-chng'
                              type='button'
                              // disabled={!index}
                              style={{
                                display: 'inline-block',
                                float: 'right',
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                //clearDensity();
                                deleteFieldArray(familyMembers);
                                arrayHelpers.remove(index);
                                addField(arrayHelpers);
                              }}
                            >
                              <img src={Delete} className='mt-l' />
                            </button>
                            {formik.values.entomologicalDataCounts.length -
                              1 ===
                              index && (
                              <Button
                                type='button'
                                variant='secondary'
                                className='font-chng'
                                style={{
                                  display: 'inline-block',
                                }}
                                onClick={() => {
                                  arrayHelpers.push({
                                    mosquitoTypeId: 0,
                                    noOfMosquitoCollectedMale: 0,
                                    noOfMosquitoCollectedFemale: 0,
                                    noOfMosquitoCollectedTotal: 0,
                                  });
                                }}
                              >
                                Add
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </Row>
                  </div>
                )
              )}
          </div>
        )}
      />
    );
  };

  const showToast = (event) => {
    if (event.target.id == 'Submitbtnid') {
      formik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
            className: 'toast-message',
          });
        }
      });
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/WebDashboard');
          }}
          className='font-chng'
        >
          Data Entry
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/entomological-larvicidal');
          }}
          className='font-chng'
        >
          Entomological and Larvicidal
        </Breadcrumb.Item>
        {location.state && location.state.view ? (
          <Breadcrumb.Item active>View</Breadcrumb.Item>
        ) : (location.state && location.state.id) ||
          (location.state && location.state.UUID) ? (
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>Add</Breadcrumb.Item>
        )}
      </Breadcrumb>
      <FormikProvider value={formik}>
        <form
          name='AddEntomologicalLarvicidal'
          onClick={showToast}
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
        >
          <fieldset
            disabled={location.state && location.state.view ? true : false}
          >
            <div className='card'>
              <h4 className='formtitlenew'>Unit Details</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
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
                        isClearable={true}
                        as='select'
                        type='select'
                        //isDisabled
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
                  <div className='col-md-6 col-xl-3  col-12'>
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
                        isClearable={true}
                        className={
                          formik.errors.month && formik.touched.month
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          monthList
                            ? monthList.find(
                                (option: any) =>
                                  option && option.value === formik.values.month
                              )
                            : ''
                        }
                        options={monthList}
                        onChange={(option: Option) => {
                          formik.setFieldValue('month', option && option.value);
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.month ? formik.errors.month : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='typeOfUnit'
                        className='form-label font-chng'
                      >
                        Type of Unit*
                      </label>
                      {unitAction && unitAction.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='typeOfUnit'
                          isClearable={true}
                          className={
                            formik.errors.typeOfUnit &&
                            formik.touched.typeOfUnit
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            unitOfActionList
                              ? unitOfActionList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.typeOfUnit
                                )
                              : ''
                          }
                          options={unitOfActionList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'typeOfUnit',
                              option && option.value
                            );
                            formik.setFieldValue('districtId','')
                            filterNameOfUnit(option, unitAction);
                            setdistrictIdValuesDisplay(modifyData(districtIdValues))
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='typeOfUnit'
                          isClearable={true}
                          className={
                            formik.errors.typeOfUnit &&
                            formik.touched.typeOfUnit
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            unitOfActionList
                              ? unitOfActionList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.typeOfUnit
                                )
                              : ''
                          }
                          options={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'typeOfUnit',
                              option && option.value
                            );
                            filterNameOfUnit(option, unitAction);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.typeOfUnit
                          ? formik.errors.typeOfUnit
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
                          ref={nameofUnitRef}
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
                          onChange={(option: Option, e: any) => {
                            if(option!== null){
                            formik.setFieldValue(
                              'nameOfUnit',
                              option && option.value
                            );
                            setdistrictIdValuesDisplay(modifyData(districtIdValues))
                            formik.setFieldValue('districtId','')
                            if (formik.values.typeOfUnit != '14') {
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
                          ref={nameofUnitRef}
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
                          options={NoneList}
                          defaultValue={NoneList}
                          onChange={(option: Option, e: any) => {
                            formik.setFieldValue(
                              'nameOfUnit',
                              option && option.value
                            );
                            formik.setFieldValue('districtId','')
                            //filterNameOfUnit(option,unitAction);
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
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='districtId'
                        className='form-label font-chng'
                      >
                        District*
                      </label>
                      {districtIdValues && districtIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='districtId'
                          isClearable={true}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          options={districtIdValuesDisplay}
                          value={
                            districtList
                              ? districtList.find(
                                  (option) =>
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
                          isClearable={true}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          options={NoneList}
                          value={
                            districtList
                              ? districtList.find(
                                  (option) =>
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
                        {formik.errors.districtId
                          ? formik.errors.districtId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='talukaId'
                        className='form-label font-chng'
                      >
                        Taluka*
                      </label>
                      {talukaIdValues && talukaIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectTalukaRef}
                          name='talukaId'
                          isClearable={true}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            talukaList
                              ? talukaList.find(
                                  (option) =>
                                    option.value === formik.values.talukaId
                                )
                              : ''
                          }
                          options={talukaList}
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
                          name='talukaId'
                          isClearable={true}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            talukaList
                              ? talukaList.find(
                                  (option) =>
                                    option.value === formik.values.talukaId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
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
                        {formik.errors.talukaId ? formik.errors.talukaId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='facilityId'
                        className='form-label font-chng'
                      >
                        Facility*
                      </label>
                      {facilityIdValues && facilityIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectFacilityRef}
                          name='facilityId'
                          isClearable={true}
                          className={
                            formik.errors.facilityId &&
                            formik.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            facilityList
                              ? facilityList.find(
                                  (option) =>
                                    option.value === formik.values.facilityId
                                )
                              : ''
                          }
                          options={facilityList}
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
                          name='facilityId'
                          isClearable={true}
                          className={
                            formik.errors.facilityId &&
                            formik.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            facilityList
                              ? facilityList.find(
                                  (option) =>
                                    option.value === formik.values.facilityId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
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
                        {formik.errors.facilityId
                          ? formik.errors.facilityId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='subCenterId'
                        className='form-label font-chng'
                      >
                        Subcenter*
                      </label>
                      {subCenterIdValues && subCenterIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='subCenterId'
                          ref={selectSubcenterRef}
                          isClearable={true}
                          className={
                            formik.errors.subCenterId &&
                            formik.touched.subCenterId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            subcenterList
                              ? subcenterList.find(
                                  (option) =>
                                    option.value === formik.values.subCenterId
                                )
                              : ''
                          }
                          options={subcenterList}
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
                          name='subCenterId'
                          isClearable={true}
                          className={
                            formik.errors.subCenterId &&
                            formik.touched.subCenterId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            subcenterList
                              ? subcenterList.find(
                                  (option) =>
                                    option.value === formik.values.subCenterId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
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
                        {formik.errors.subCenterId
                          ? formik.errors.subCenterId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='villageId'
                        className='form-label font-chng'
                      >
                        Village*
                      </label>
                      {villageIdValues && villageIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='villageId'
                          ref={selectVillageRef}
                          isClearable={true}
                          className={
                            formik.errors.villageId && formik.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            villageList
                              ? villageList.find(
                                  (option) =>
                                    option.value === formik.values.villageId
                                )
                              : ''
                          }
                          options={villageList}
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
                          name='villageId'
                          ref={selectVillageRef}
                          isClearable={true}
                          className={
                            formik.errors.villageId && formik.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            villageList
                              ? villageList.find(
                                  (option) =>
                                    option.value === formik.values.villageId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'villageId',
                              option && option.value
                            );
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.villageId ? formik.errors.villageId : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='mosqDissectedCulexQui'
                        className='form-label mt-l font-chng'
                      >
                        Town
                      </label>
                      <input
                        name='town'
                        type='text'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.town}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='dateOfSurvey'
                        className='form-label font-chng'
                      >
                        Date of Survey
                      </label>
                      <input
                        type='date'
                        className='form-control'
                        name='dateOfSurvey'
                        value={formik.values.dateOfSurvey}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp form-view'>
                      <div
                        role='group'
                        aria-labelledby='my-radio-group'
                        className='form-radio pt-md'
                      >
                        <label className='form-label font-chng'>
                          <Field
                            type='radio'
                            name='fixedOrRandom'
                            onChange={formik.handleChange}
                            defaultChecked={
                              formik.values.fixedOrRandom === 'Fixed'
                            }
                            value='Fixed'
                          />
                          Fixed
                        </label>
                        <label className='form-label font-chng'>
                          <Field
                            type='radio'
                            name='fixedOrRandom'
                            onChange={formik.handleChange}
                            defaultChecked={
                              formik.values.fixedOrRandom == 'Random'
                            }
                            value='Random'
                          />
                          Random
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalTimeSpentHrs'
                        className='form-label font-chng'
                      >
                        Total Time Spent (Hrs.)
                      </label>
                      <input
                        name='totalTimeSpentHrs'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 || e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        onKeyPress={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalTimeSpentHrs}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalTimeSpentMinutes'
                        className='form-label font-chng'
                      >
                        Total Time Spent (Min.)
                      </label>
                      <input
                        name='totalTimeSpentMinutes'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyPress={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        onKeyUp={(e) => e.keyCode === 38 && e.preventDefault()}
                        onKeyDown={(e) =>
                          e.keyCode === 40 && e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalTimeSpentMinutes}
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </div>
            <div className='card form-view'>
              <h4 className='formtitlenew font-chng'>Entomological Data</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div>{DynamicArray()}</div>
                </Row>
              </div>
              <h4 className='formtitlenew font-chng'>
                Mosquito Breeding Places
              </h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-xl-3 col-md-6 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='mosqDissectedCulexQui'
                        className='form-label mt-l font-chng'
                      >
                        Mosq. Dissected Culex qui
                      </label>
                      <input
                        name='mosqDissectedCulexQui'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyUp={(e) => e.keyCode === 38 && e.preventDefault()}
                        onKeyDown={(e) =>
                          e.keyCode === 40 && e.preventDefault()
                        }
                        onKeyPress={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.mosqDissectedCulexQui}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalNoPositiveMosq1to3Stage'
                        className='form-label font-chng'
                      >
                        Total No of Positive Mosquito 1,2,3 Stage of Larva
                      </label>
                      <input
                        name='totalNoPositiveMosq1to3Stage'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyUp={(e) => e.keyCode === 38 && e.preventDefault()}
                        onKeyDown={(e) =>
                          e.keyCode === 40 && e.preventDefault()
                        }
                        onKeyPress={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalNoPositiveMosq1to3Stage}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalNoPositiveMosq3Stage'
                        className='form-label mt-s font-chng'
                      >
                        Total No of Positive Mosquito 3 Stage of Larva
                      </label>
                      <input
                        name='totalNoPositiveMosq3Stage'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyUp={(e) => e.keyCode === 38 && e.preventDefault()}
                        onKeyDown={(e) =>
                          e.keyCode === 40 && e.preventDefault()
                        }
                        onKeyPress={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalNoPositiveMosq3Stage}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='breedingPlacesChecked'
                        className='form-label font-chng'
                      >
                        Breeding Locations Checked
                      </label>
                      <input
                        name='breedingPlacesChecked'
                        type='text'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.breedingPlacesChecked}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalNoOfDipsTaken'
                        className='form-label mt-s font-chng'
                      >
                        Total No of Dips taken
                      </label>
                      <input
                        name='totalNoOfDipsTaken'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyUp={(e) => e.keyCode === 38 && e.preventDefault()}
                        onKeyDown={(e) =>
                          e.keyCode === 40 && e.preventDefault()
                        }
                        onKeyPress={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalNoOfDipsTaken}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfPosVePlaceIIIandIVStage'
                        className='form-label font-chng'
                      >
                        Total No of +Ve Location for III & IV Stage
                      </label>
                      <input
                        name='noOfPosVePlaceIIIandIVStage'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyUp={(e) => e.keyCode === 38 && e.preventDefault()}
                        onKeyDown={(e) =>
                          e.keyCode === 40 && e.preventDefault()
                        }
                        onKeyPress={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfPosVePlaceIIIandIVStage}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfPosVePlaceForPupae'
                        className='form-label font-chng'
                      >
                        Total No of Positive Location for Pupae
                      </label>
                      <input
                        name='noOfPosVePlaceForPupae'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfPosVePlaceForPupae}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalCulexLarvaeCount1to4Stage'
                        className='form-label font-chng'
                      >
                        Total Culex Larvae count 1 to 4 Stage
                      </label>
                      <input
                        name='totalCulexLarvaeCount1to4Stage'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalCulexLarvaeCount1to4Stage}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalCulexPupaeCount'
                        className='form-label mt-s font-chng'
                      >
                        Total Culex Pupae count
                      </label>
                      <input
                        name='totalCulexPupaeCount'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalCulexPupaeCount}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalAnLarvaeCount'
                        className='form-label mt-s font-chng'
                      >
                        Anopheles Larvae Count
                      </label>
                      <input
                        name='totalAnLarvaeCount'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.totalAnLarvaeCount}
                      />
                    </div>
                  </div>
                </Row>
              </div>
              <h4 className='formtitlenew'>Biological Control</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfWellsBioControl'
                        className='form-label font-chng'
                      >
                        {' '}
                        No of Wells Bio Control
                      </label>
                      <input
                        name='noOfWellsBioControl'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfWellsBioControl}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfTankBioControl'
                        className='form-label font-chng'
                      >
                        {' '}
                        No of Tank Bio Control
                      </label>
                      <input
                        name='noOfTankBioControl'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfTankBioControl}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfCanalsBioControl'
                        className='form-label font-chng'
                      >
                        {' '}
                        No of Canals Bio Control
                      </label>
                      <input
                        name='noOfCanalsBioControl'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfCanalsBioControl}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfLocGuppyIntro'
                        className='form-label font-chng'
                      >
                        {' '}
                        No of Location Guppy Intro
                      </label>
                      <input
                        name='noOfLocGuppyIntro'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfLocGuppyIntro}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfPendingLocTreatment'
                        className='form-label font-chng'
                      >
                        {' '}
                        No of Pending Locations for Treatment
                      </label>
                      <input
                        name='noOfPendingLocTreatment'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfPendingLocTreatment}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfVentPipesCovered'
                        className='form-label mt-s font-chng'
                      >
                        {' '}
                        No of Vent pipes Covered
                      </label>
                      <input
                        name='noOfVentPipesCovered'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfVentPipesCovered}
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </div>
            <div className='card'>
              <h4 className='formtitlenew'>Larvicide Stock Details</h4>
              <div className='card-body form-view'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='larvicideNameId'
                        className='form-label mt-s font-chng'
                      >
                        Larvicide Name
                      </label>
                      <Select
                        name='larvicideNameId'
                        isClearable={true}
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        placeholder={larvicideList ? 'Select' : 'None'}
                        className={
                          formik.errors.larvicideNameId &&
                          formik.touched.larvicideNameId
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          larvicideList
                            ? larvicideList.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.larvicideNameId
                              )
                            : ''
                        }
                        options={larvicideList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'larvicideNameId',
                            option && option.value
                          );
                        }}
                      ></Select>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='measurement'
                        className='form-label mt-s font-chng'
                      >
                        Measurement
                      </label>
                      <Select
                        name='measurement'
                        isClearable={true}
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        placeholder={measurementValue ? 'Select' : 'None'}
                        className={
                          formik.errors.measurement &&
                          formik.touched.measurement
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          measurementValue
                            ? measurementValue.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.measurement
                              )
                            : ''
                        }
                        options={measurementValue}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'measurement',
                            option && option.value
                          );
                        }}
                      ></Select>
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='openingBalance'
                        className='form-label mt-s font-chng'
                      >
                        Quantity
                      </label>
                      <input
                        name='openingBalance'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        onChange={(e) => {
                          let opening = parseInt(e.target.value);
                          let balance: any =
                            Number(formik.values.receivedDuringMonth) +
                            opening -
                            formik.values.consumedDuringMonth;
                          if (isNaN(balance)) {
                            balance = '';
                            formik.setFieldValue('balanceEndOfMonth', '');
                          } else {
                            formik.setFieldValue('balanceEndOfMonth', balance);
                          }
                        }}
                        className='form-control'
                        value={formik.values.openingBalance}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='receivedDuringMonth'
                        className='form-label mt-s font-chng'
                      >
                        Received During the Month
                      </label>
                      <input
                        name='receivedDuringMonth'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        onChange={(e) => {
                          let received = parseInt(e.target.value);
                          let balance: any =
                            Number(formik.values.openingBalance) +
                            received -
                            formik.values.consumedDuringMonth;
                          if (isNaN(balance)) {
                            balance = '';
                            formik.setFieldValue('balanceEndOfMonth', '');
                          } else {
                            formik.setFieldValue('balanceEndOfMonth', balance);
                          }
                        }}
                        className='form-control'
                        value={formik.values.receivedDuringMonth}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='consumedDuringMonth'
                        className='form-label font-chng'
                      >
                        Consumed During the Month
                      </label>
                      <input
                        name='consumedDuringMonth'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        onChange={(e) => {
                          let consumed = parseInt(e.target.value);
                          let balance: any =
                            Number(formik.values.openingBalance) +
                            formik.values.receivedDuringMonth -
                            consumed;
                          if (isNaN(balance)) {
                            balance = '';
                            formik.setFieldValue('balanceEndOfMonth', '');
                          } else {
                            formik.setFieldValue('balanceEndOfMonth', balance);
                          }
                        }}
                        className='form-control'
                        value={formik.values.consumedDuringMonth}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='balanceEndOfMonth'
                        className='form-label font-chng'
                      >
                        Balance End of Month
                      </label>
                      <input
                        name='balanceEndOfMonth'
                        type='number'
                        min='0'
                        disabled
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onChange={formik.handleChange}
                        value={formik.values.balanceEndOfMonth}
                        //  value={((formik.values.receivedDuringMonth + formik.values.openingBalance) - formik.values.consumedDuringMonth)}
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </div>
          </fieldset>
          <div className='card'>
            <fieldset
              disabled={location.state && location.state.view ? true : false}
            >
              <h4 className='formtitlenew font-chng'>Larvicide Activities</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfMenWorkingSFW'
                        className='form-label font-chng'
                      >
                        No of men working SFW
                      </label>
                      <input
                        name='noOfMenWorkingSFW'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfMenWorkingSFW}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='noOfMenWorkingFW'
                        className='form-label font-chng'
                      >
                        No of men working FW
                      </label>
                      <input
                        name='noOfMenWorkingFW'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.noOfMenWorkingFW}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='canalisationWork'
                        className='form-label font-chng'
                      >
                        Canalisation Work
                      </label>
                      <input
                        name='canalisationWork'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.canalisationWork}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='desiltingWork'
                        className='form-label font-chng'
                      >
                        Desilting Work
                      </label>
                      <input
                        name='desiltingWork'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.desiltingWork}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='deweedingWork'
                        className='form-label font-chng'
                      >
                        Deweeding Work
                      </label>
                      <input
                        name='deweedingWork'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.deweedingWork}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='fillingWork'
                        className='form-label font-chng'
                      >
                        Filling Work
                      </label>
                      <input
                        name='fillingWork'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            symbolsArr.includes(e.key) ||
                            e.keyCode === 38) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.fillingWork}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='otherWork'
                        className='form-label font-chng'
                      >
                        Other Work
                      </label>
                      <input
                        name='otherWork'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          (e.keyCode === 40 ||
                            e.keyCode === 38 ||
                            symbolsArr.includes(e.key)) &&
                          e.preventDefault()
                        }
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.otherWork}
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </fieldset>

            {/* <div className="form-grp text-right">
              <button
                type="submit"
                onClick={() => history.push(listDESheetName)}
                className="enabled-button btn btn-outline-light font-chng"
              >
                Cancel
              </button>
              {((location.state && !location.state.view) || (!location.state)) && (!(location.state && location.state.id)) &&
                <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary"
                  disabled={location && location.state && location.state.id ? true : false}
                  onClick={() => {
                    formik.setFieldValue("status", "Draft");
                  }}
                  style={{ marginRight: 10 }}
                >Save As Draft</button>}
              {((location.state && !location.state.view) || (!location.state)) && isOnline &&
                <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary"
                  disabled={!isOnline}
                  onClick={() => {
                    formik.setFieldValue("status", "Active");
                  }}

                >Save</button>
              }

            </div> */}
          </div>
          <div className='buttongrouprightend mb-4'>
            <Button
              type='submit'
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
            {((location.state && !location.state.view) || !location.state) &&
              !(location.state && location.state.id) && (
                <button
                  id='Submitbtnid'
                  type='submit'
                  disabled={
                    location && location.state && location.state.id
                      ? true
                      : false
                  }
                  onClick={() => {
                    formik.setFieldValue('status', 'Draft');
                  }}
                  className='btn font-chng'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Save as Draft
                </button>
              )}
            {((location.state && !location.state.view) || !location.state) &&
              isOnline && (
                <button
                  id='Submitbtnid'
                  type='submit'
                  className='btn font-chng'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  disabled={!isOnline ? (isDisabled ? true : false) : false}
                  onClick={() => {
                    formik.setFieldValue('status', 'Active');
                  }}
                >
                  Save
                </button>
              )}
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};
export default AddEntomologicalLarvicidal;

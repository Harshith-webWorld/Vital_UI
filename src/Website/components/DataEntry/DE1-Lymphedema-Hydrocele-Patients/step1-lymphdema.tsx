import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import DropdownService from '../../../services/DropdownService';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
// import Button from 'react-bootstrap/Button';
import { Field, FieldArray, FormikProvider, useFormik } from 'formik';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineList,
  months,
  years,
  wardNone,
  villageNone,
  zoneNone,
  talukaNone,
  corporationNone,
} from './Form1-stepper-config';
import { LymphedemaLineList } from '../../../interfaces/FormLymphedema';
import LymphedemaPatientInfoService from '../../../services/FormLymphedemaService';
import * as Yup from 'yup';
import Select, { Option } from 'react-select';
import history from '../../../../helpers/history';
import NumberFormat from 'react-number-format';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { toast } from 'react-toastify';
import commonFunction from '../../../../helpers/common/common';
import lymphedemaLineListDraftServices from '../../../draftServices/FormLymphdemaHydroceleDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import { isValidDate } from '../../../../Components/constant';
import { Button } from '@material-ui/core';
import moment from 'moment';

const Step1 = (props: any) => {
  const listDESheetName: any = props && props.listDESheetName;
  const { setGenderState } = props;
  const [formdata, setFormData] = useState<LymphedemaLineList>(LineList);
  const location: any = useLocation();
  const phoneRegExp = /^([ ]*[0-9\(\)\/\+\-]+[ ]*)*$/;
  const PincodeRegExp = /^[1-9][0-9]{5}$/;
  let isOnline = window.navigator.onLine;
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevSubCenterRef: any = React.useRef();
  const prevCorporationRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  const [facilityId, setfacilityId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [talukaId, settalukaId] = useState();
  const [subCenterId, setsubCenterId] = useState();
  const [corporationId, setcorporationId] = useState();
  let selectCorporationRef: any = useRef();
  let selectZoneRef: any = useRef();
  let selectWardRef: any = useRef();
  let selectTalukaRef: any = useRef();
  let selectFacilityRef: any = useRef();
  let selectVillageRef: any = useRef();
  let selectSubcenterRef: any = useRef();
  const selectNameOfFilariaFieldUnitRef: any = React.useRef();
  const selectNameOfUnitRef: any = React.useRef();
  const selectYearRef: any = React.useRef();
  const selectMonthRef: any = React.useRef();
  const selectDistrictRef: any = React.useRef();
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);
  const [isBirth, setIsBirth] = useState(true);

  useEffect(() => {
    getpostcontent();
    getPatientInfo();
    getUnitActionData();
    
    // getState(defaultStateValue[0]);
  }, []);
  useEffect(() => {
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevTalukaRef.current = talukaId;
    prevSubCenterRef.current = subCenterId;
    prevCorporationRef.current = corporationId;
  });
  const prevDistrictIdValue = prevDistrictRef.current;
  const prevFacilityIdValue = prevFacilityRef.current;
  const prevTalukaIdValue = prevTalukaRef.current;
  const prevSubCenterIdValue = prevSubCenterRef.current;
  const prevCorporationIdValue = prevCorporationRef.current;

  const boolean2str = (value) => {
    if (value === true) return 'true';
    if (value === false) return 'false';
    return value;
  };

  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  // if (signinInfo?.data?.districtId) {
  //   setFormData({ ...formdata, districtId: signinInfo.data.districtId })
  // }
  // console.log("Admin signin", signinInfo)
  const handleIsFromBirth = (e) => {
    if (e.target.value == 'true') {
      setIsBirth(true);
      selectYearRef.current.select.clearValue();
      selectMonthRef.current.select.clearValue();
    } else {
      setIsBirth(false);
    }
  };

  const stayinInMonthList = months.map((item: any, i: any) => {
    return { label: item.monthName, value: item.month };
  });

  const generateStayingInMonthOptions = (year) => {
    let isCurrentYear = new Date().getFullYear() === year;
    let options = months.map((item: any, i: any) => {
      if (!isCurrentYear) {
        return { label: item.monthName, value: item.month };
      } else {
        return {
          label: item.monthName,
          value: item.month,
          isDisabled: new Date().getMonth() + 1 < item.month,
        };
      }
    });
    return options;
  };

  const processStayingInYears = ({ stayingInYears }) => {
    if (stayingInYears === null || stayingInYears === 0) {
      return null;
    }
    if (stayingInYears.toString().length === 4) {
      return stayingInYears;
    } else {
      return +moment().subtract(stayingInYears, 'year').format('YYYY');
    }
  };

  const processStayingInMonths = ({ stayingInMonths }) => {
    if (stayingInMonths === null || stayingInMonths === 0) {
      return null;
    } else {
      return stayingInMonths;
    }
  };

  const getDateDetails = (year, month) => {
    let currentDate = moment();
    let stayingIndDate = moment([year, month - 1]);
    let localYear = currentDate.diff(stayingIndDate, 'year');
    stayingIndDate.add(localYear, 'years');
    var localMonth = currentDate.diff(stayingIndDate, 'months');
    stayingIndDate.add(localMonth, 'months');
    return (
      localYear +
      ` year${localYear > 1 ? 's' : ''} ` +
      localMonth +
      ` month${localMonth > 1 ? 's' : ''}`
    );
  };

  const getPatientInfo = async () => {
    let unitActionData = await getUnitActionData();
    let recordId;
    if (location && location.state && location.state.id) {
      recordId = location.state.id;
      if (recordId) {
        const getOneResult: any =
          await LymphedemaPatientInfoService.getStep1Info(recordId);
        getDistrictValues(getOneResult.data[0].districtId);
        getCorporationValues(
          getOneResult.data[0].corporationId,
          getOneResult.data[0].districtId
        );
        await getFacilityValues(
          getOneResult.data[0].facilityId,
          getOneResult.data[0].districtId
        );
        // getTalukaValues(getOneResult.data[0].talukaId, getOneResult.data[0].districtId);
        getSubCenterValues(
          getOneResult.data[0].subCenterId,
          getOneResult.data[0].facilityId,
          getOneResult.data[0].districtId
        );
        if (getOneResult.data[0]) {
          console.log('getPatientInformation:: ', getOneResult.data[0]);
          filterNameOfUnit(getOneResult.data[0].unitOfAction, unitActionData);
          filterFieldUnit(getOneResult.data[0].nameOfUnit, unitActionData);
          let updatedFormData = { ...getOneResult.data[0] };
          updatedFormData.stayingInYears =
            processStayingInYears(updatedFormData);
          updatedFormData.stayingInMonths =
            processStayingInMonths(updatedFormData);
          setFormData(updatedFormData);
          updatedFormData.isFromBirth = boolean2str(
            updatedFormData.isFromBirth
          );
          if (
            updatedFormData.isFromBirth == 'true' ||
            updatedFormData.isFromBirth == true
          ) {
            setIsBirth(true);
          } else {
            setIsBirth(false);
          }

          //console.log("IsFrom Birth",getOneResult.data[0].isFromBirth)
        }
      }
    } else {
      if (location && location.state && location.state.UUID) {
        recordId = location.state.UUID;
        let draftGet: any =
          await lymphedemaLineListDraftServices.getOneLymphedemaLineList(
            recordId
          );
        getDistrictValues(draftGet.districtId);
        getCorporationValues(draftGet.corporationId, draftGet.districtId);
        await getFacilityValues(draftGet.facilityId, draftGet.districtId);
        // getTalukaValues(draftGet.talukaId, draftGet.districtId);
        getSubCenterValues(
          draftGet.subCenterId,
          draftGet.facilityId,
          draftGet.districtId
        );
        filterNameOfUnit(draftGet.unitOfAction, unitActionData);
        filterFieldUnit(draftGet.nameOfUnit, unitActionData);
        setFormData(draftGet);
        draftGet.isFromBirth = boolean2str(draftGet.isFromBirth);
        if (draftGet.isFromBirth == 'true') {
          setIsBirth(true);
        } else {
          setIsBirth(false);
        }
      } else {
        recordId = props.lymphedemaLineListUUID;
        if (recordId) {
          let draftGet: any =
            await lymphedemaLineListDraftServices.getOneLymphedemaLineList(
              recordId
            );
          console.log('___draftGet', draftGet);
          getDistrictValues(draftGet.districtId);
          getCorporationValues(draftGet.corporationId, draftGet.districtId);
          await getFacilityValues(draftGet.facilityId, draftGet.districtId);
          // getTalukaValues(draftGet.talukaId, draftGet.districtId);
          getSubCenterValues(
            draftGet.subCenterId,
            draftGet.facilityId,
            draftGet.districtId
          );
          filterNameOfUnit(draftGet.unitOfAction, unitActionData);
          filterFieldUnit(draftGet.nameOfUnit, unitActionData);
          setFormData(draftGet);
          draftGet.isFromBirth = boolean2str(draftGet.isFromBirth);
          if (draftGet.isFromBirth == 'true') {
            setIsBirth(true);
          } else {
            setIsBirth(false);
          }
        }
      }
    }
  };

  let NoneList = [{ label: 'None', value: 0 }];

  async function savePatientInformation(patientInfo) {
    let draftResponse =
      await lymphedemaLineListDraftServices.addLymphedemaLineList(patientInfo);
    if (draftResponse) {
      let get = await lymphedemaLineListDraftServices.getOneLymphedemaLineList(
        draftResponse
      );
      props.handleNext(get);
    }
    // let response =
    // await LymphedemaPatientInfoService.postLymphedemaPatientInformation( patientInfo);
    // if (response && response.data) {
    // console.log("post patient info:: ", response.data);
    // props.handleNext(response.data);
    // }
  }
  async function updatePatientInformation(patientInfo, id, idType) {
    if (idType === 'id') {
      let response =
        await LymphedemaPatientInfoService.updateLymphedemaPatientInformation(
          patientInfo,
          id
        );
      if (response && response.data) {
        console.log('put patient info:: ', response.data);
        props.handleNext(response.data);
      }
    } else if (idType === 'UUID') {
      let draftResponse =
        await lymphedemaLineListDraftServices.updateLymphedemaLineList(
          id,
          patientInfo
        );
      if (draftResponse) {
        console.log('put patient info:: ', draftResponse);
        props.handleNext(draftResponse);
      }
    }
  }

  const onSubmit = async (values) => {
    setGenderState(values.gender);
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
      values.permanentAddressCity =
        values.permanentAddressCity == 0 ? '0' : values.permanentAddressCity;
      console.log('after step1 values:: ', values);
      setIsDisabled(true);
      if (location && location.state && location.state.id) {
        values.lastModifiedBy = props && props.userSessionId;
        updatePatientInformation(values, location.state.id, 'id');
        setIsDisabled(false);
      } else if (location && location.state && location.state.UUID) {
        values.lastModifiedBy = props && props.userSessionId;
        updatePatientInformation(values, location.state.UUID, 'UUID');
        setIsDisabled(false);
      } else {
        if (props.lymphedemaLineListUUID) {
          values.lastModifiedBy = props && props.userSessionId;
          updatePatientInformation(
            values,
            props.lymphedemaLineListUUID,
            'UUID'
          );
          setIsDisabled(false);
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          savePatientInformation(values);
          setIsDisabled(false);
        }
      }
    }
  };

  let validSchema = Yup.object().shape({
    year: Yup.string().required('Year is required').nullable(),
    month: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Month is required').nullable(),
    }),
    nameOfPatient: Yup.string()
      .required('Name Of Patient is required')
      .nullable(),
    patientRegistrationDate: Yup.date().required(
      'Patient registration date is required'
    ),
    patientMobileNumber: Yup.string()
      .test(
        'oneOfRequired',
        'Mobile Number or Asha Number should be entered',
        (item, testContext) => {
          return (
            testContext.parent.patientMobileNumber ||
            testContext.parent.ashaMobileNumber
          );
        }
      )
      .min(12, 'Invalid Phone Number')
      .nullable(),

    ashaMobileNumber: Yup.string()
      .test(
        'oneOfRequired',
        'Mobile Number should be entered',
        (item, testContext) => {
          return (
            testContext.parent.patientMobileNumber ||
            testContext.parent.ashaMobileNumber
          );
        }
      )
      .min(12, 'Invalid Phone Number')
      .nullable(),
    secondaryContactNumber: Yup.string()
      .min(12, 'Invalid Phone Number')
      .nullable(),
    permanentAddressPINCode: Yup.string().min(6, 'Invalid PIN Code').nullable(),
    unitOfAction: Yup.string()
      .required('Unit Of Action is required')
      .nullable(),
    nameOfUnit: Yup.string().required('Name Of Unit is required').nullable(),
    nameOfFiledUnit: Yup.string()
      .required('Name Of Field Unit is required')
      .nullable(),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('district is required').nullable(),
    }),
    corporationId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('corporation is required').nullable(),
    }),
    talukaId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('taluka is required').nullable(),
    }),
    // zoneId: Yup.string()
    // .when([], {
    //   is: 0,
    //   then: Yup.string().required("zone is required").nullable(),
    // })
    // ,
    facilityId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('facility is required').nullable(),
    }),
    subCenterId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('subcenter is required').nullable(),
    }),
    wardId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('ward is required').nullable(),
    }),
    villageId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('village is required').nullable(),
    }),
    gender: Yup.string().required('Gender is required').nullable(),
    headOfFamily: Yup.string()
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
      .nullable(),
    stayingInYears: Yup.string()
      .when('isFromBirth', {
        is: 'false',
        then: Yup.string().required('Years is required').nullable(),
      })
      .nullable(),
    stayingInMonths: Yup.string()
      .when('isFromBirth', {
        is: 'false',
        then: Yup.string().required('Months is required').nullable(),
      })
      .nullable(),
  });
  const formik = useFormik({
    initialValues: formdata,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: onSubmit,
  });

  let [stateIdValues, setstateIdValues] = useState([]);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [districtIdValuesDisplay, setdistrictIdValuesDisplay] = useState([]);
  let [corporationIdValues, setcorporationIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subCenterIdValues, setsubCenterIdValues] = useState([]);
  let [wardIdValues, setwardIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  let [zoneIdValues, setzoneIdValues] = useState([]);
  let [optionTableValues, setOptionTableValues] = useState([]);
  let [nameOfUnitValues, setNameOfUnitValues] = useState([]);
  let [nameofFiledValues, setNameOfFiledValues] = useState([]);
  let [cityIdValues, setcityIdValues] = useState([]);

  const genderList =
    optionTableValues &&
    optionTableValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1000) {
        return (
          <label className='form-label' key={i}>
            <input
              type='radio'
              name='gender'
              className={
                formik.errors.gender && formik.touched.gender
                  ? 'form-radio is-invalid'
                  : 'form-radio'
              }
              value={item.id}
              checked={Number(formik.values.gender) === Number(item.id)}
              onChange={(event: any) => {
                formik.setFieldValue('gender', event.target.value);
              }}
            />
            {item.categoryOptionName}
          </label>
        );
      }
    });

  const stateIdList =
    stateIdValues &&
    stateIdValues.map((item: any, i: any) => {
      return { label: item.stateName, value: item.id };
    });
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

  const cityIdList =
    cityIdValues &&
    cityIdValues.map((item: any, i: any) => {
      return {
        label: item.districtName,
        value: item.districtName,
        stateId: item.stateId,
      };
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
  const wardIdList =
    wardIdValues &&
    wardIdValues.map((item: any, i: any) => {
      return { label: item.wardName, value: item.id };
    });
  const villageIdList =
    villageIdValues &&
    villageIdValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
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
  const unitOfActionList: any = [];
  optionTableValues &&
    optionTableValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1003) {
        unitOfActionList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });
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

  const ageYearsList: any = [];
  Array.from(Array(100), (e, i: any) => {
    ageYearsList.push({ label: i + 1, value: i + 1 });
  });

  const ageMonthsList: any = [];
  Array.from(Array(11), (e, i: any) => {
    ageMonthsList.push({ label: i + 1, value: i + 1 });
  });
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
            console.log('name of unit', nameOfUnitData);
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
              //formik.setFieldValue("nameOfUnit", "")
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
  async function filterFieldUnit(e: any, nameOfUnitValues) {
    if (e && e.value) {
      let nameOfFieldUnitDataOffline: any;
      let nameOfFieldUnitData: any;
      if (isOnline) {
        nameOfFieldUnitData = await DropdownService.getNameOfFieldUnit(e.value);
      } else {
        nameOfFieldUnitDataOffline =
          await DexieOfflineDataBase.getNameOfFieldUnitOffline(e.value);
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
        formik.setFieldValue('nameOfFiledUnit', '');
      } else {
        let Data: any = [OptionLabel.nameOfVerticalFieldUnitNone];
        setNameOfFiledValues(Data);
        formik.setFieldValue('nameOfFiledUnit', 0);
      }
    } else if (e) {
      let nameOfFieldUnitDataOffline: any;
      let nameOfFieldUnitData: any;
      if (isOnline) {
        nameOfFieldUnitData = await DropdownService.getNameOfFieldUnit(e);
      } else {
        nameOfFieldUnitDataOffline =
          await DexieOfflineDataBase.getNameOfFieldUnitOffline(e);
      }
      if (
        (nameOfFieldUnitData &&
          nameOfFieldUnitData.data &&
          nameOfFieldUnitData.data.length > 0) ||
        (nameOfFieldUnitDataOffline && nameOfFieldUnitDataOffline.length > 0)
      ) {
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
        formik.setFieldValue('nameOfFiledUnit', 0);
      }
    }
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

  async function getDistrict(e: any) {
    // if ((e && e.value) === null) {
    // formik.setFieldValue("talukaId", 0);
    // formik.setFieldValue("facilityId", 0);
    // formik.setFieldValue("subCenterId", 0);
    // formik.setFieldValue("villageId", 0);
    // formik.setFieldValue("wardId", 0);
    // formik.setFieldValue("zoneId", 0);
    // formik.setFieldValue("corporationId", 0);
    // }
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
        setcorporationIdValues(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any = [OptionLabel.corporationNone];
        setcorporationIdValues(corporationData);
        formik.setFieldValue('corporationId', 0);
        // formik.setFieldValue("wardId", 0);
        // formik.setFieldValue("zoneId", 0);
      }
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
        formik.setFieldValue('talukaId', '');
        formik.setFieldValue('villageId', 0);
        selectTalukaRef.current.select.clearValue();
        let talukaList: any;
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
        formik.setFieldValue('facilityId', '');
        formik.setFieldValue('subCenterId', 0);
        selectFacilityRef.current.select.clearValue();
        let facilityList: any;
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
    if (e) {
      let corporationIdOffline: any;
      let corporationId: any;
      if (!isOnline) {
        corporationIdOffline = await DexieOfflineDataBase.getCorporationOffline(
          e
        );
      } else {
        corporationId = await DropdownService.getOneCorporation(e);
      }
      if (
        (corporationId &&
          corporationId.data &&
          corporationId.data.length > 0) ||
        (corporationIdOffline && corporationIdOffline.length > 0)
      ) {
        // selectCorporationRef.current.select.clearValue();
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
        corporationData = [
          OptionLabel.corporationSelectLabel,
          ...corporationData,
        ];
        setcorporationIdValues(corporationData);
      } else {
        // selectCorporationRef.current.select.clearValue();
        let Data: any = [OptionLabel.corporationSelectLabel];
        setcorporationIdValues(Data);
        formik.setFieldValue('corporationId', 0);
      }
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
        // selectTalukaRef.current.select.clearValue();
        let talukaList: any;
        if (!isOnline) {
          talukaList = [OptionLabel.talukaNone, ...talukaIdOffline];
        } else {
          talukaList = [OptionLabel.talukaNone, ...talukaId.data];
        }
        settalukaIdValues(talukaList);
      } else {
        // selectTalukaRef.current.select.clearValue();
        let Data: any = [OptionLabel.talukaNone];
        settalukaIdValues(Data);
        formik.setFieldValue('talukaId', 0);
      }

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
        // selectFacilityRef.current.select.clearValue();
        let facilityList: any;
        if (!isOnline) {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
        } else {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
        }
        setfacilityIdValues(facilityList);
      } else {
        // selectFacilityRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setfacilityIdValues(Data);
        formik.setFieldValue('facilityId', 0);
      }
    }
  }

  async function getCorporation(e: any) {
    if (e && e.value) {
      setcorporationId(e && e.value);

      if (!((e && e.value) === prevCorporationIdValue)) {
        if ((e && e.value) === null) {
          formik.setFieldValue('zoneId', 0);
          formik.setFieldValue('wardId', 0);
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
        if (
          (zoneId && zoneId.data && zoneId.data.length > 0) ||
          (zoneIdOffline && zoneIdOffline.length > 0)
        ) {
          formik.setFieldValue('zoneId', '');
          formik.setFieldValue('wardId', 0);
          selectZoneRef.current.select.clearValue();
          let zoneList: any;
          if (!isOnline) {
            zoneList = [OptionLabel.zoneNoneLabel, ...zoneIdOffline];
          } else {
            zoneList = [OptionLabel.zoneNoneLabel, ...zoneId.data];
          }
          setzoneIdValues(zoneList);
        } else {
          selectZoneRef.current.select.clearValue();
          let Data: any = [OptionLabel.zoneNoneLabel];
          setzoneIdValues(Data);
          formik.setFieldValue('zoneId', 0);
        }

        let wardId: any;
        let wardIdOffline: any;
        if (!isOnline) {
          wardIdOffline = await DexieOfflineDataBase.getWardOffline(
            e && e.value,
            formik.values.districtId
          );
        } else {
          wardId = await DropdownService.getOneWard(
            e && e.value,
            formik.values.districtId
          );
        }
        if (
          (wardId && wardId.data && wardId.data.length > 0) ||
          (wardIdOffline && wardIdOffline.length > 0)
        ) {
          formik.setFieldValue('wardId', '');
          selectWardRef.current.select.clearValue();
          let wardlist: any;
          if (!isOnline) {
            wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline];
          } else {
            wardlist = [OptionLabel.wardNoneLabel, ...wardId.data];
          }
          setwardIdValues(wardlist);
        } else {
          selectWardRef.current.select.clearValue();
          let Data: any = [OptionLabel.wardNoneLabel];
          setwardIdValues(Data);
          formik.setFieldValue('wardId', 0);
        }
      }
    }
  }
  async function getCorporationValues(e: any, id: any) {
    if (e) {
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
        // selectZoneRef.current.select.clearValue();
        let zoneList: any;
        if (!isOnline) {
          zoneList = [OptionLabel.zoneNoneLabel, ...zoneIdOffline];
        } else {
          zoneList = [OptionLabel.zoneNoneLabel, ...zoneId.data];
        }
        setzoneIdValues(zoneList);
      } else {
        // selectZoneRef.current.select.clearValue();
        let Data: any = [OptionLabel.zoneNoneLabel];
        setzoneIdValues(Data);
        formik.setFieldValue('zoneId', 0);
      }

      let wardId: any;
      let wardIdOffline: any;
      if (!isOnline) {
        wardIdOffline = await DexieOfflineDataBase.getWardOffline(e, id);
      } else {
        wardId = await DropdownService.getOneWard(e, id);
      }
      if (
        (wardId && wardId.data && wardId.data.length > 0) ||
        (wardIdOffline && wardIdOffline.length > 0)
      ) {
        // formik.setFieldValue("wardId", "");
        // selectWardRef.current.select.clearValue();
        let wardlist: any;
        if (!isOnline) {
          wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline];
        } else {
          wardlist = [OptionLabel.wardNoneLabel, ...wardId.data];
        }
        setwardIdValues(wardlist);
      } else {
        // selectWardRef.current.select.clearValue();
        let Data: any = [OptionLabel.wardNoneLabel];
        setwardIdValues(Data);
        formik.setFieldValue('wardId', 0);
      }
    }
  }

  // async function getTaluka(e: any) {
  // if (e && e.value) {
  //   settalukaId(e && e.value)

  //   if (!((e && e.value) === prevTalukaIdValue)) {
  //   if ((e && e.value) === null) {
  //   formik.setFieldValue("villageId", 0);
  //   }
  //   let Village: any;
  //   let VillageIdOffline: any;
  //   if (!isOnline) {
  //   VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e &&
  //     e.value,
  //     formik.values.districtId
  //   );
  //   } else {
  //   Village = await DropdownService.getOneVillage(e &&
  //     e.value,
  //     formik.values.districtId
  //   );
  //   }
  //   if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //   formik.setFieldValue("villageId", "");
  //   selectVillageRef.current.select.clearValue();
  //   let villagelist: any;
  //   if (!isOnline) {
  //     villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //   } else {
  //     villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //   }
  //   setvillageIdValues(villagelist);
  //   } else {
  //   selectVillageRef.current.select.clearValue();
  //   let Data: any = [OptionLabel.villageNoneLabel];
  //   setvillageIdValues(Data);
  //   formik.setFieldValue("villageId", 0);
  //   }
  //   }
  // }
  // }
  // async function getTalukaValues(e: any, id: any) {
  // if (e) {
  //   let Village: any;
  //   let VillageIdOffline: any;
  //   if (!isOnline) {
  //   VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e, id);
  //   } else {
  //   Village = await DropdownService.getOneVillage(e, id);
  //   }
  //   console.log(Village)
  //   console.log(e)
  //   if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //   // selectVillageRef.current.select.clearValue();
  //   let villagelist: any;
  //   if (!isOnline) {
  //   villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //   } else {
  //   villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //   }
  //   setvillageIdValues(villagelist);
  //   } else {
  //   // selectVillageRef.current.select.clearValue();
  //   let Data: any = [OptionLabel.villageNoneLabel];
  //   setvillageIdValues(Data);
  //   formik.setFieldValue("villageId", 0);
  //   }
  // }
  // }

  async function getFacility(e: any) {
    if (e && e.value) {
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
          formik.setFieldValue('subCenterId', '');
          selectSubcenterRef.current.select.clearValue();
          let subcenterlist: any;
          if (!isOnline) {
            subcenterlist = [
              OptionLabel.subCenterNoneLabel,
              ...SubcenterOffline,
            ];
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
          formik.setFieldValue('villageId', '');
          selectVillageRef.current.select.clearValue();
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
  }

  async function getFacilityValues(e: any, id: any) {
    if (e) {
      let Subcenter: any;
      let SubcenterOffline: any;
      if (isOnline) {
        Subcenter = await DropdownService.getOneSubCenter(e, id);
      } else {
        SubcenterOffline = await DexieOfflineDataBase.getSubCenterOffline(
          e,
          id
        );
      }
      if (
        (Subcenter && Subcenter.data && Subcenter.data.length > 0) ||
        (SubcenterOffline && SubcenterOffline.length > 0)
      ) {
        // selectSubcenterRef.current.select.clearValue();
        let subcenterlist: any;
        if (!isOnline) {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...SubcenterOffline];
        } else {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...Subcenter.data];
        }
        setsubCenterIdValues(subcenterlist);
      } else {
        // selectSubcenterRef.current.select.clearValue();
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
      console.log(Village);
      console.log(e);
      if (
        (Village && Village.data && Village.data.length > 0) ||
        (VillageIdOffline && VillageIdOffline.length > 0)
      ) {
        // selectVillageRef.current.select.clearValue();
        let villagelist: any;
        if (!isOnline) {
          villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
        } else {
          villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
        }
        setvillageIdValues(villagelist);
      } else {
        // selectVillageRef.current.select.clearValue();
        let Data: any = [OptionLabel.villageNoneLabel];
        setvillageIdValues(Data);
        formik.setFieldValue('villageId', 0);
      }
    }
  }

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
        // selectVillageRef.current.select.clearValue();
        // let Data: any = [OptionLabel.villageNoneLabel];
        // setvillageIdValues(Data);
        // formik.setFieldValue("villageId", 0);
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
      // // selectVillageRef.current.select.clearValue();
      // let Data: any = [OptionLabel.villageNoneLabel];
      // setvillageIdValues(Data);
      // formik.setFieldValue("villageId", 0);
      // }
    }
  }
  async function getUnitActionData() {
    if (isOnline) {
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        return unitActionData.data;
      }
    } else {
      const genderDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderDataOffline) {
        return genderDataOffline;
      }
    }
  }

  async function getpostcontent() {
    if (isOnline) {
      const stateId: any = await DropdownService.getStateInfo();
      if (stateId && stateId.data) {
        setstateIdValues(stateId.data);
      }
      const districtId: any = await DropdownService.getDistrictInfo();
      if (districtId && districtId.data && districtId.data.length > 0) {
        setdistrictIdValues(districtId.data);
        setdistrictIdValuesDisplay(modifyData(districtId.data))
        setcityIdValues(districtId.data);
      }
      const genderdata: any = await DropdownService.getUnitAction();
      if (genderdata && genderdata.data) {
        setOptionTableValues(genderdata.data);
      }
    } else if (!isOnline) {
      const genderDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderDataOffline) {
        console.log('genderDataOffline', genderDataOffline);
        setOptionTableValues(genderDataOffline);
      }
      const stateIdOffline = await DexieOfflineDataBase.getStates();
      if (stateIdOffline) {
        setstateIdValues(stateIdOffline);
      }
      const districtIdOffline = await DexieOfflineDataBase.getDistricts();
      if (districtIdOffline) {
        setdistrictIdValues(districtIdOffline);
        setcityIdValues(districtIdOffline);
      }
    }
  }

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
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };
  const modifyData=(data)=>{
return data.map((item: any, i: any) => {
  return { label: item.districtName, value: item.id };
})
  }

  let patientInformation = () => {
    return (
      <div className='in-left'>
        <FormikProvider value={formik}>
          <form
            onClick={showToast}
            onSubmit={formik.handleSubmit}
            onChange={formik.handleChange}
          >
            <fieldset
              disabled={location.state && location.state.view ? true : false}
            >
              <div className='card'>
                <div className='card-body '>
                  <Row className='mb-3 cardpadding '>
                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='unitOfAction'
                          className='form-label font-chng'
                        >
                          Unit of action*
                        </label>
                        {optionTableValues && optionTableValues.length !== 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            className={
                              formik.errors.unitOfAction &&
                              formik.touched.unitOfAction
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='unitOfAction'
                            isClearable='true'
                            value={
                              unitOfActionList
                                ? unitOfActionList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.unitOfAction
                                  )
                                : ''
                            }
                            options={unitOfActionList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'unitOfAction',
                                option && option.value
                              );
                              formik.setFieldValue('districtId','')
                              filterNameOfUnit(option, optionTableValues);
                              setdistrictIdValuesDisplay(modifyData(districtIdValues))
                            }}
                          ></Select>
                        ) : (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            className={
                              formik.errors.unitOfAction &&
                              formik.touched.unitOfAction
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='unitOfAction'
                            isClearable='true'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.unitOfAction
                                  )
                                : ''
                            }
                            options={NoneList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'unitOfAction',
                                option && option.value
                              );
                              filterNameOfUnit(option, optionTableValues);
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
                        {nameOfUnit && nameOfUnit.length !== 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
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
                            isClearable='true'
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
                                filterFieldUnit(option, optionTableValues);
                                setdistrictIdValuesDisplay(modifyData(districtIdValues))
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
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectNameOfUnitRef}
                            className={
                              formik.errors.nameOfUnit &&
                              formik.touched.nameOfUnit
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            options={NoneList}
                            isClearable='true'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option) =>
                                      option &&
                                      option.value === formik.values.nameOfUnit
                                  )
                                : ''
                            }
                            onChange={(option: Option) => {
                              console.log('select 2')
                              formik.setFieldValue(
                                'nameOfUnit',
                                option && option.value
                              );
                              formik.setFieldValue('districtId','')
                              filterFieldUnit(option, optionTableValues);
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
                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfFiledUnit'
                          className='form-label font-chng'
                        >
                          Name of Field Unit*
                        </label>
                        {nameOfFiledUnitValues &&
                        nameOfFiledUnitValues.length > 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectNameOfFilariaFieldUnitRef}
                            className={
                              formik.errors.nameOfFiledUnit &&
                              formik.touched.nameOfFiledUnit
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='nameOfFiledUnit'
                            isClearable='true'
                            value={
                              nameOfFiledUnitValues
                                ? nameOfFiledUnitValues.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.nameOfFiledUnit
                                  )
                                : ''
                            }
                            options={nameOfFiledUnitValues}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'nameOfFiledUnit',
                                option && option.value
                              );
                            }}
                          ></Select>
                        ) : (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectNameOfFilariaFieldUnitRef}
                            className={
                              formik.errors.nameOfFiledUnit &&
                              formik.touched.nameOfFiledUnit
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            options={NoneList}
                            isClearable='true'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.nameOfFiledUnit
                                  )
                                : ''
                            }
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'nameOfFiledUnit',
                                option && option.value
                              );
                            }}
                          ></Select>
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors.nameOfFiledUnit
                            ? formik.errors.nameOfFiledUnit
                            : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='districtId'
                          className='form-label font-chng'
                        >
                          District*
                        </label>
                        {districtIdValues && districtIdValues.length !== 0 ? (
                          <Select
                            name='districtId'
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            options={districtIdValuesDisplay}
                            isClearable='true'
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
                            isSearchable='true'
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
                            name='districtId'
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            //options={NoneList}
                            className='custom-select'
                            options={NoneList}
                            isClearable='true'
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
                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='corporationId'
                          className='form-label font-chng'
                        >
                          Corporation*
                        </label>
                        {corporationIdValues &&
                        corporationIdValues.length !== 0 ? (
                          <Select
                            ref={selectCorporationRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
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
                                      option.value ===
                                        formik.values.corporationId
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
                            ref={selectCorporationRef}
                            name='corporationId'
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            options={NoneList}
                            defaultValue={NoneList}
                            isClearable={true}
                            value={
                              corporationIdList
                                ? corporationIdList.find(
                                    (option: any) =>
                                      option.value ===
                                      formik.values.corporationId
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
                            className={
                              formik.errors.corporationId &&
                              formik.touched.corporationId
                                ? 'custom-select is-invalid'
                                : 'custom-select font-chng'
                            }
                          ></Select>
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.corporationId : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6 -12'>
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
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectTalukaRef}
                            className={
                              formik.errors.talukaId && formik.touched.talukaId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            isClearable='true'
                            name='talukaId'
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
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectTalukaRef}
                            className={
                              formik.errors.talukaId && formik.touched.talukaId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='talukaId'
                            options={NoneList}
                            isClearable='true'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option) => option && option.value === 0
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
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.talukaId : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='zoneId'
                          className='form-label font-chng'
                        >
                          Zone
                        </label>
                        {zoneIdValues && zoneIdValues.length !== 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
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
                              // getZone(option);
                            }}
                          ></Select>
                        ) : (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
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
                                    (option) => option && option.value === 0
                                  )
                                : ''
                            }
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'zoneId',
                                option && option.value
                              );
                              // getZone(option);
                            }}
                          ></Select>
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.zoneId : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='town' className='form-label font-chng'>
                          Town
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          name='town'
                          value={formik.values.town}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Ward*
                        </label>
                        {wardIdValues && wardIdValues.length !== 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectWardRef}
                            options={wardIdList}
                            className={
                              formik.errors.wardId && formik.touched.wardId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='wardId'
                            isClearable='true'
                            value={
                              wardIdList
                                ? wardIdList.find(
                                    (option) =>
                                      option &&
                                      option.value === formik.values.wardId
                                  )
                                : ''
                            }
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'wardId',
                                option && option.value
                              );
                            }}
                          ></Select>
                        ) : (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectWardRef}
                            options={NoneList}
                            className={
                              formik.errors.wardId && formik.touched.wardId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='wardId'
                            isClearable='true'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option) => option && option.value === 0
                                  )
                                : ''
                            }
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'wardId',
                                option && option.value
                              );
                            }}
                          ></Select>
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.wardId : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='area' className='form-label font-chng'>
                          Area
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          name='area'
                          value={formik.values.area}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Facility*
                        </label>
                        {facilityIdValues && facilityIdValues.length !== 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
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
                              location.state && location.state.view
                                ? true
                                : false
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
                                    (option) => option && option.value == 0
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
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Sub Center*
                        </label>
                        {subCenterIdValues && subCenterIdValues.length !== 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
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
                              location.state && location.state.view
                                ? true
                                : false
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
                                    (option) => option && option.value === 0
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
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Village*
                        </label>
                        {villageIdValues && villageIdValues.length !== 0 ? (
                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectVillageRef}
                            options={villageIdList}
                            isClearable='true'
                            className={
                              formik.errors.villageId &&
                              formik.touched.villageId
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
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectVillageRef}
                            options={NoneList}
                            isClearable='true'
                            className={
                              formik.errors.villageId &&
                              formik.touched.villageId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='villageId'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option) => option && option.value === 0
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
                        )}{' '}
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.villageId : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Year*
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className={
                            formik.errors.year && formik.touched.year
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='year'
                          isClearable='true'
                          value={
                            yearList
                              ? yearList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.year
                                )
                              : ''
                          }
                          options={yearList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'year',
                              option && option.value
                            );
                          }}
                        ></Select>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.year : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Month*
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className={
                            formik.errors.month && formik.touched.month
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='month'
                          isClearable='true'
                          value={
                            monthList
                              ? monthList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.month
                                )
                              : ''
                          }
                          options={monthList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'month',
                              option && option.value
                            );
                          }}
                        ></Select>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.month : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Name of Patient*
                        </label>
                        <input
                          type='text'
                          className={
                            formik.errors.nameOfPatient &&
                            formik.touched.nameOfPatient
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='nameOfPatient'
                          value={formik.values.nameOfPatient}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onChange={formik.handleChange}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.nameOfPatient : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='gender'
                          className='form-label font-chng'
                        >
                          Gender*
                        </label>
                        <div
                          role='group'
                          aria-labelledby='my-radio-group'
                          className={
                            formik.errors.gender && formik.touched.gender
                              ? 'form-radio is-invalid'
                              : 'form-radio'
                          }
                        >
                          {genderList}
                        </div>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.gender : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='patientRegistrationDate'
                          className='form-label font-chng'
                        >
                          Patient registration date*
                        </label>
                        <input
                          type='date'
                          max={isValidDate}
                          className={
                            formik.errors.patientRegistrationDate &&
                            formik.touched.patientRegistrationDate
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='patientRegistrationDate'
                          value={formik.values.patientRegistrationDate}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.patientRegistrationDate
                            : ''}
                        </div>
                      </div>
                    </div>{' '}
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Head of Family
                        </label>
                        <input
                          type='text'
                          className={
                            formik.errors.headOfFamily &&
                            formik.touched.headOfFamily
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='headOfFamily'
                          value={formik.values.headOfFamily}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onChange={formik.handleChange}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.headOfFamily : ''}
                        </div>
                      </div>
                    </div>
                    <h5 className='inner-title'>
                      Patient's Age(In Complete Years)
                    </h5>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Years
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className='custom-select'
                          name='ageYears'
                          isClearable='true'
                          value={
                            ageYearsList
                              ? ageYearsList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.ageYears
                                )
                              : ''
                          }
                          options={ageYearsList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'ageYears',
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Months
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className='custom-select'
                          name='ageMonths'
                          isClearable='true'
                          value={
                            ageMonthsList
                              ? ageMonthsList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.ageMonths
                                )
                              : ''
                          }
                          options={ageMonthsList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'ageMonths',
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='patientMobileNumber'
                          className='form-label font-chng'
                        >
                          Patient's Mobile Number*
                        </label>
                        <NumberFormat
                          className={
                            formik.errors.patientMobileNumber &&
                            formik.touched.patientMobileNumber
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='patientMobileNumber'
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
                          value={formik.values.patientMobileNumber}
                          onChange={formik.handleChange}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.patientMobileNumber
                            : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='ashaMobileNumber'
                          className='form-label font-chng'
                        >
                          Asha Mobile Number*
                        </label>
                        <NumberFormat
                          className={
                            formik.errors.ashaMobileNumber &&
                            formik.touched.ashaMobileNumber
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='ashaMobileNumber'
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
                          value={formik.values.ashaMobileNumber}
                          onChange={formik.handleChange}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.ashaMobileNumber : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Secondary Mobile Number
                        </label>
                        <NumberFormat
                          className={
                            formik.errors.secondaryContactNumber &&
                            formik.touched.secondaryContactNumber
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='secondaryContactNumber'
                          value={formik.values.secondaryContactNumber}
                          onChange={formik.handleChange}
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.secondaryContactNumber
                            : ''}
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </fieldset>
            <div className='card' style={{ marginTop: '10px' }}>
              <div
                className='formtitlenew font-chng'
                style={{ marginLeft: '33px' }}
              >
                Permanent Address{' '}
              </div>{' '}
              <div className='card-body'>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <Row className='mb-3 cardpadding'>
                    <div className='col-xl-6 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Address Line 1
                        </label>
                        <textarea
                          className='form-control'
                          name='permanentAddressLine1'
                          value={formik.values.permanentAddressLine1}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-xl-6 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Address Line 2
                        </label>
                        <textarea
                          className='form-control'
                          name='permanentAddressLine2'
                          value={formik.values.permanentAddressLine2}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          State
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          options={stateIdList}
                          className='custom-select'
                          name='permanentAddressState'
                          isClearable='true'
                          value={
                            stateIdList
                              ? stateIdList.find(
                                  (option) =>
                                    option &&
                                    option.value ===
                                      formik.values.permanentAddressState
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            selectDistrictRef.current.select.clearValue();
                            formik.setFieldValue(
                              'permanentAddressState',
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          District
                        </label>
                        {cityIdValues && cityIdValues.length !== 0 ? (
                          <Select
                            name='permanentAddressCity'
                            isDisabled={
                              formik.values.permanentAddressState != 14 ||
                              (location.state && location.state.view)
                                ? true
                                : false
                            }
                            ref={selectDistrictRef}
                            styles={commonFunction.customStyles}
                            options={cityIdList.filter(
                              (city) =>
                                city.stateId ===
                                formik.values.permanentAddressState
                            )}
                            isClearable='true'
                            className={
                              formik.errors.permanentAddressCity &&
                              formik.touched.permanentAddressCity
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            value={
                              cityIdList
                                ? cityIdList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.permanentAddressCity
                                  )
                                : ''
                            }
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'permanentAddressCity',
                                option && option.value
                              );
                              // getDistrict(option);
                            }}
                          ></Select>
                        ) : (
                          <Select
                            name='permanentAddressCity'
                            styles={commonFunction.customStyles}
                            className='custom-select'
                            options={NoneList}
                            isClearable='true'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.permanentAddressCity
                                  )
                                : ''
                            }
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'permanentAddressCity',
                                option && option.value
                              );
                              // getDistrict(option);
                            }}
                          ></Select>
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.permanentAddressCity
                            : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Pincode
                        </label>
                        <input
                          type='text'
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          //onKeyPress={(event)=>commonFunction.validateNum(event)}
                          onInput={maxLengthCheck}
                          className={
                            formik.errors.permanentAddressPINCode &&
                            formik.touched.permanentAddressPINCode
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          maxLength={6}
                          name='permanentAddressPINCode'
                          value={
                            formik.values.permanentAddressPINCode
                              ? formik.values.permanentAddressPINCode
                              : ''
                          }
                          onChange={formik.handleChange}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.permanentAddressPINCode
                            : ''}
                        </div>
                      </div>
                    </div>
                    <h5 className='inner-title font-chng'>
                      Staying at the current address for last how many years?
                    </h5>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='isFromBirth'
                          className='form-label font-chng'
                        >
                          Is from Birth
                        </label>
                        <div
                          role='group'
                          aria-labelledby='my-radio-group'
                          className='form-radio'
                        >
                          <label className='form-label font-chng'>
                            <Field
                              type='radio'
                              name='isFromBirth'
                              value='true'
                              onChange={(e) => handleIsFromBirth(e)}
                              defaultChecked={
                                formik.values.isFromBirth === 'true'
                              }
                            />
                            Yes
                          </label>
                          <label className='form-label font-chng'>
                            <Field
                              type='radio'
                              name='isFromBirth'
                              value='false'
                              onChange={(e) => handleIsFromBirth(e)}
                              defaultChecked={
                                formik.values.isFromBirth === 'false'
                              }
                            />
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Years
                        </label>
                        <Select
                          isDisabled={
                            isBirth
                              ? true
                              : false || (location.state && location.state.view)
                              ? true
                              : false
                          }
                          ref={selectYearRef}
                          styles={commonFunction.customStyles}
                          className={
                            formik.errors.stayingInYears &&
                            formik.touched.stayingInYears
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='stayingInYears'
                          isClearable='true'
                          value={
                            yearList
                              ? yearList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.stayingInYears
                                )
                              : ''
                          }
                          options={yearList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'stayingInYears',
                              option && option.value
                            );
                            formik.setFieldValue('stayingInMonths', null);
                            selectMonthRef.current.select.clearValue();
                          }}
                        ></Select>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.stayingInYears : ''}
                        </div>
                        {!isBirth &&
                          !!formik.values.stayingInYears &&
                          formik.values.stayingInMonths && (
                            <label className='form-label font-chng'>
                              {getDateDetails(
                                formik.values.stayingInYears,
                                formik.values.stayingInMonths
                              )}
                            </label>
                          )}
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6  col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Months
                        </label>
                        <Select
                          isDisabled={
                            isBirth
                              ? true
                              : false ||
                                !formik.values.stayingInYears ||
                                (location.state && location.state.view)
                              ? true
                              : false
                          }
                          ref={selectMonthRef}
                          styles={commonFunction.customStyles}
                          className={
                            formik.errors.stayingInMonths &&
                            formik.touched.stayingInMonths
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='stayingInMonths'
                          isClearable='true'
                          value={
                            monthList
                              ? monthList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.stayingInMonths
                                )
                              : ''
                          }
                          options={generateStayingInMonthOptions(
                            formik.values.stayingInYears
                          )}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'stayingInMonths',
                              option && option.value
                            );
                          }}
                        ></Select>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.stayingInMonths : ''}
                        </div>
                      </div>
                    </div>
                  </Row>
                </fieldset>
              </div>
            </div>
            <div className='buttongrouprightend'>
              <Button
                type='submit'
                className=' btn-cancel'
                onClick={() => history.push(listDESheetName)}
                style={{
                  marginRight: '10px',
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Cancel
              </Button>
              {/* <Button
                id='Submitbtnid'
                type='submit'
                className='btn-cancel'
                style={{
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Next
              </Button> */}
              <button
                type='submit'
                id='Submitbtnid'
                disabled={isDisabled}
                className='btn font-chng'
                style={{
                  // marginRight: '10px',
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                  textTransform: 'none',
                }}
              >
                Save
              </button>
            </div>
          </form>
        </FormikProvider>
      </div>
    );
  };

  return <div> {patientInformation()}</div>;
};

export default Step1;

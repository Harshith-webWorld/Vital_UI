import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import history from '../../../../helpers/history';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useFormik, FormikProvider, FieldArray, Field } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { number, boolean, date } from 'yup';
import Delete from '../../../assets/img/LEFP_Images/deletesection.png';
import Button from 'react-bootstrap/Button';
import Select, { Option } from 'react-select';
import DropdownService from '../../../services/DropdownService';
import moment from 'moment';
import { MultiSelect } from 'react-multi-select-component';

import {
  postMDAEvalList,
  postMDAEvalListFamilyMember,
  postMDAEvalListPerson,
} from '../../../interfaces/FormPostMDAEvalList';
import postMDAList from '../../../services/postMDAEvalList.service';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { FormatListBulletedOutlined, SmsFailedSharp } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import AddPostMdaDraftServices from '../../../draftServices/FormAddPostMdaDraftServices';

const AddPostMDAThirdParty: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  const location = useLocation<any>();
  useEffect(() => {
    getEditData();
    getpostcontent();
  }, []);

  const prevStateRef: any = React.useRef();
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevZoneRef: any = React.useRef();
  const prevCorporationRef: any = React.useRef();
  const prevSubCenterRef: any = React.useRef();
  useEffect(() => {
    prevStateRef.current = stateId;
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevTalukaRef.current = talukaId;
    prevCorporationRef.current = corporationId;
    prevSubCenterRef.current = subCenterId;
  });
  const prevStateIdValue = prevStateRef.current;
  const prevDistrictIdValue = prevDistrictRef.current;
  const prevFacilityIdValue = prevFacilityRef.current;
  const prevTalukaIdValue = prevTalukaRef.current;
  const prevSubCenterIdValue = prevSubCenterRef.current;
  const prevCorporationIdValue = prevCorporationRef.current;
  const currentdate = moment(new Date()).format('yyyy-MM-DD');
  let [stateIdValues, setstateIdValues] = useState([]);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [corporationIdValues, setcorporationIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subCenterIdValues, setsubCenterIdValues] = useState([]);
  let [wardIdValues, setwardIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  let [genderPersonValues, setgenderPersonValues] = useState([]);
  let [genderFamilyValues, setgenderFamilyValues] = useState([]);
  const [readShow, setReadShow] = useState(true);
  const [sideEffectShow, setSideEffectShow] = useState(true);
  const [remedyShow, setRemedyShow] = useState(true);
  const [familyShow, setFamilyShow] = useState(true);
  const [drugShow, setDrugShow] = useState(false);
  const [drugAdminShow, setDrugAdminShow] = useState(true);
  const [doseShow, setDoseShow] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [
    whereReadOrSeeInfoselectedOption,
    setwhereReadOrSeeInfoselectedOption,
  ] = useState([]);
  let [othersWhereseeinfo, setOthersWhereseeinfo] = useState(false);
  let [showOthersWhereseeinfo, setshowOthersWhereseeinfo] = useState(false);

  const [detailsOfSideEffects, setdetailsOfSideEffects] = useState([]);
  const [detailsofSideSelectedOption, setdetailsofSideSelectedOption] =
    useState([]);
  let [othersdetailsofSideeffect, setOthersdetailsofSideeffect] =
    useState(false);
  const [othersReason, setothersReason] = useState(false);

  const [showOthersRemedyTaken, setShowOtherRemedyTaken] = useState(false);
  const [showOthersDetailsofEffect, setShowOthersDetailofEffect] =
    useState(false);
  const [showOthersMostEffective, setShowOthersMostEffective] = useState(false);
  const [hideSwallowData, setHideSwallowData] = useState(false);
  const [hideReservedrugData, setHideReserveddrugData] = useState(false);
  const [hideRemedyTakenData, setHideRemedyTakenData] = useState(false);

  const [stateId, setstateId] = useState();
  const [districtId, setdistrictId] = useState();
  const [facilityId, setfacilityId] = useState();
  const [talukaId, settalukaId] = useState();
  const [subCenterId, setsubCenterId] = useState();
  const [corporationId, setcorporationId] = useState();
  const elephantitisHydrocele = ['Elephantitis', 'Hydrocele'];
  let selectDistrictRef: any = useRef();
  let selectCorporationRef: any = useRef();
  let selectZoneRef: any = useRef();
  let selectWardRef: any = useRef();
  let selectTalukaRef: any = useRef();
  let selectFacilityRef: any = useRef();
  let selectVillageRef: any = useRef();
  let selectSubcenterRef: any = useRef();
  let isOnline = window.navigator.onLine;
  let selectAdminRef: any = useRef();
  let selectYearRef: any = useRef();
  let selectGenderRef: any = useRef();
  let selectSideEffectRef: any = useRef();
  let selectRemedyRef: any = useRef();
  let selectMonthRef: any = useRef();
  let selectDrugAdminRef: any = useRef();
  let selectElephantitisRef: any = useRef();

  let ReasonNotSwallowValues = [
    {
      label: 'No. information about LF/MDA/DEC',
      value: 'No. information about LF/MDA/DEC',
    },
    { label: 'Fear of drug', value: 'Fear of drug' },
    {
      label: "Beneficiaries on empty stomach at the time of DD's visit",
      value: "Beneficiaries on empty stomach at the time of DD's visit",
    },
    { label: 'Side reactions of drugs', value: 'Side reactions of drugs' },
    { label: 'Director Of Health(II)', value: 'Director Of Health(II)' },
    {
      label: 'Beneficiaries not suffering from LF, Why they should take DEC ?',
      value: 'Beneficiaries not suffering from LF, Why they should take DEC ?',
    },
    {
      label: "Complications of previous year's MDA ",
      value: "Complications of previous year's MDA",
    },
    { label: 'Others - specify', value: 'Others - specify' },
  ];

  let ReservationDrugAdminValues = [
    { label: 'ANM', value: 'ANM' },
    { label: 'Health Worker (Male)', value: 'Health Worker (Male)' },
    { label: 'Anganwadi Worker', value: 'Anganwadi Worker' },
    { label: 'Side reactions of drugs', value: 'Side reactions of drugs' },
    { label: 'NGO', value: 'NGO' },
    { label: 'Volunteer', value: 'Volunteer' },
    { label: 'Student', value: 'Student' },
    { label: 'Others - specify', value: 'Others - specify' },
  ];

  const whereReadOrSeeOptions = [
    { label: 'ANM', value: 'ANM' },
    { label: 'Health Worker (Male)', value: 'Health Worker (Male)' },
    { label: 'Anganwadi Worker', value: 'Anganwadi Worker' },
    { label: 'Volunteer', value: 'Volunteer' },
    { label: 'Miking', value: 'Miking' },
    { label: 'Davandi', value: 'Davandi' },
    { label: 'Radio', value: 'Radio' },
    { label: 'TV', value: 'TV' },
    { label: 'Newspapers', value: 'Newspapers' },
    { label: 'Handbills', value: 'Handbills' },
    { label: 'Others', value: 'Others' },
  ];

  const detailsOfSideEffectsOptions = [
    { label: 'Nausea, vomiting', value: 'Nausea, vomiting' },
    { label: 'Headache', value: 'Headache' },
    { label: 'Fever', value: 'Fever' },
    { label: 'Rash', value: 'Rash' },
    { label: 'Dehydration', value: 'Dehydration' },
    { label: 'Fainting attact', value: 'Fainting attact' },
    { label: 'Others - specify', value: 'Others - specify' },
  ];

  const detailsOfRemedyTakenOptions = [
    { label: 'PHC', value: 'PHC' },
    {
      label: 'Rural Hospital /Govt. Hospital',
      value: 'Rural Hospital /Govt. Hospital',
    },
    { label: 'Private practitioners', value: 'Private practitioners' },
    { label: 'Others', value: 'Others' },
  ];

  const changeWhereReadorSee = (selected: any) => {
    setwhereReadOrSeeInfoselectedOption(selected);
    if (!(selected.length === 0)) {
      selected.forEach((element: any) => {
        if (element && element.value === 'Others') {
          formik.setFieldValue(
            'whereReadOrSeeInfoOthers',
            formik.values.whereReadOrSeeInfoOthers
          );
          setshowOthersWhereseeinfo(true);
        } else {
          setshowOthersWhereseeinfo(false);
          formik.setFieldValue('whereReadOrSeeInfoOthers', '');
        }
      });
    } else {
      setshowOthersWhereseeinfo(false);
    }
  };
  const changeDetailsofSideEffect = (selected: any) => {
    setdetailsofSideSelectedOption(selected);
    if (!(selected.length === 0)) {
      selected.forEach((element: any) => {
        if (element && element.value === 'Others - specify') {
          formik.setFieldValue(
            'detailsOfSideEffectsOther',
            formik.values.detailsOfSideEffectsOther
          );

          setShowOthersDetailofEffect(true);
        } else {
          setShowOthersDetailofEffect(false);
          formik.setFieldValue('detailsOfSideEffectsOther', '');
        }
      });
    } else {
      setShowOthersDetailofEffect(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );

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
  //     const currentYear = (new Date()).getFullYear();
  // const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
  const years = range(currentYear, currentYear - 50, -1);
  let NoneList = [{ label: 'None', value: 0 }];
  let defaultStateValue = [{ label: 'Maharastra', value: 14 }];
  let [formdata, setformdata] = useState<postMDAEvalList>({
    stateId: 14,
    year: '',
    month: '',
    districtId: '',
    corporationId: '',
    talukaId: '',
    facilityId: '',
    subCenterId: '',
    wardId: '',
    villageId: '',
    urbanArea: '',
    nameOfInvestigator: '',
    dateOfInvestigation: currentdate,
    nameOfHeadOfFamily: '',
    nameOfPersonInterviewed: '',
    totalMembersInFamily: '',
    noMembersInterviewed: '',
    mdaUndertakenOnFrom: currentdate,
    mdaUndertakenOnTo: currentdate,
    isDECTabletsRecovered: 'false',
    noDECTabletsRecovered: '',
    resonNotTakingDrug: '',
    isDrugAdministeredInHouse: 'false',
    isDDEnsureSwallowInPresence: 'false',
    isDrugSwallowInDDPresence: 'false',
    reasonForNotSwallowDrug: '',
    reasonForNotSwallowDrugOther: '',
    isDDPersuadeSwallowDrug: 'false',
    isHelpedDDInDrugCompliance: 'false',
    isReservationAboutDD: 'false',
    reservationDrugAdmin: '',
    speciFyResponsibilityOfDD: '',
    isDDExplainToYouDetails: 'false',
    approachShouldFollow: 0,
    resonToFollowApproach: '',
    isPriorInfoAboutMDAwithDE: 'false',
    sourceOfInformation: '',
    isReadOrSeeAnyInfo: 'false',
    whereReadOrSeeInfo: '',
    whichIsMostEffective: '',
    isYouExperienceSideEffects: 'false',
    detailsOfSideEffects: '',
    isYouSeekRemedy: 'false',
    detailsOfRemedyTaken: '',
    IsYouReceiveTreatmentOtherAilment: 'false',
    IsAnyFamilySufferLF: 'false',
    OtherRelevantInfoOnMDA: '',
    DateOfEvaluation: currentdate,
    IsVerifiedByInvestigator: 'false',
    // Remarks: "1",
    isActive: true,
    postMDAEvalListFMembers: [
      {
        nameOfPatient: '',
        sex: 0,
        ageYears: 0,
        ageMonths: 0,
        elephantitisOrHydrocele: '',
        isActive: true,
      },
    ],
    postMDAEvalListPersons: [
      {
        namePersonsEligibleForMDA: '',
        ageYears: 0,
        ageMonths: 0,
        sex: 0,
        noOfDECTabletsConsumed: 0,
        noOfDECTabletsRecovered: 0,
        isActive: true,
      },
    ],
  });

  async function deletePerson(row) {
    if (row.id) {
      const response = await postMDAList.deleteperson(row.id);
      // console.log("Reponse", response)
    }
  }
  async function deleteFamilymember(row) {
    if (row.id) {
      const response = await postMDAList.deletefamilymember(row.id);
      // console.log("Reponse", response)
    }
  }

  const ageYearsList: any = [];
  Array.from(Array(30), (e, i: any) => {
    ageYearsList.push({ label: i + 1, value: i + 1 });
  });

  const ageMonthsList: any = [];
  Array.from(Array(11), (e, i: any) => {
    ageMonthsList.push({ label: i + 1, value: i + 1 });
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

  const ReadOnly = (e) => {
    if (e.target.value == 'false') {
      setReadShow(true);
    } else {
      setReadShow(false);
    }
  };
  const SideEffectHandle = (e) => {
    if (e.target.value == 'false') {
      //selectSideEffectRef.current.select.clearValue()

      setSideEffectShow(true);
    } else {
      setSideEffectShow(false);
    }
  };
  const remedyHandle = (e) => {
    if (e.target.value == 'false') {
      selectRemedyRef.current.select.clearValue();
      setRemedyShow(true);
    } else {
      setRemedyShow(false);
    }
  };
  const familyHandle = (e) => {
    if (e.target.value == 'false') {
      formik.setFieldValue('postMDAEvalListFMembers[0].nameOfPatient', '');
      formik.setFieldValue('OtherRelevantInfoOnMDA', '');
      selectYearRef.current.select.clearValue();
      selectMonthRef.current.select.clearValue();
      selectGenderRef.current.select.clearValue();
      selectElephantitisRef.current.select.clearValue();

      setFamilyShow(true);
    } else {
      setFamilyShow(false);
    }
  };
  const handleDrugAdmin = (e) => {
    if (e.target.value == 'false') {
      setDrugShow(false);
    } else {
      selectDrugAdminRef.current.select.clearValue();
      setDrugShow(true);
    }
  };
  const handleAdmin = (e) => {
    if (e.target.value == 'false') {
      selectAdminRef.current.select.clearValue();
      formik.setFieldValue('speciFyResponsibilityOfDD', '');

      setDrugAdminShow(true);
    } else {
      setDrugAdminShow(false);
    }
  };
  const handleDose = (e) => {
    if (e.target.value == 'false') {
      formik.setFieldValue('sourceOfInformation', '');
      setDoseShow(true);
    } else {
      setDoseShow(false);
    }
  };

  async function getState(e: any) {
    setstateId(e && e.value);
    if (!((e && e.value) === prevStateIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('districtId', 0);
      }

      let districtIdOffline: any;
      let districtId: any;
      if (!isOnline) {
        districtIdOffline = await DexieOfflineDataBase.getOneDistrict(
          e && e.value
        );
      } else {
        districtId = await DropdownService.getOneDistrict(e && e.value);
      }
      console.log(districtId, districtIdOffline);

      if (
        (districtId && districtId.data && districtId.data.length > 0) ||
        (districtIdOffline && districtIdOffline.length > 0)
      ) {
        //selectDistrictRef.current.select.clearValue();
        let districtData: any;
        if (!isOnline) {
          districtData = [OptionLabel.districtNone, ...districtIdOffline];
        } else {
          districtData = [OptionLabel.districtNone, ...districtId.data];
        }
        districtData = [OptionLabel.districtSelectLabel, ...districtData];
        formik.setFieldValue('districtId', '');
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('facilityId', 0);
        formik.setFieldValue('subCenterId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('corporationId', 0);
        setdistrictIdValues(districtData);
      } else {
        let districtData: any;
        //selectDistrictRef.current.select.clearValue();
        districtData = [OptionLabel.districtNone];
        setdistrictIdValues(districtData);
        formik.setFieldValue('districtId', 0);
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('facilityId', 0);
        formik.setFieldValue('subCenterId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('corporationId', 0);
      }
      // setdistrictIdValues(districtId.data)
    }
  }

  async function getStateValues(e: any) {
    if (e) {
      let districtIdvalueOffline: any;
      let districtIdvalue: any;
      if (!isOnline) {
        districtIdvalueOffline = await DexieOfflineDataBase.getOneDistrict(e);
      } else {
        districtIdvalue = await DropdownService.getOneDistrict(e);
      }
      console.log(districtIdvalue, districtIdvalueOffline);

      if (
        (districtIdvalue &&
          districtIdvalue.data &&
          districtIdvalue.data.length > 0) ||
        (districtIdvalueOffline && districtIdvalueOffline.length > 0)
      ) {
        let districtData: any;
        if (!isOnline) {
          districtData = [OptionLabel.districtNone, ...districtIdvalueOffline];
        } else {
          districtData = [OptionLabel.districtNone, ...districtIdvalue.data];
        }

        setdistrictIdValues(districtData);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setdistrictIdValues(districtData);
        //formik.setFieldValue("districtId", 0);
        formik.setFieldValue('districtId', 0);
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('facilityId', 0);
        formik.setFieldValue('subCenterId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('corporationId', 0);
      }
    }
    // setDistrictValues(districtId.data)
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
        //formik.setFieldValue("zoneId", 0);
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
      console.log(corporationId, corporationIdOffline);

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
        //formik.setFieldValue("zoneId", 0);
        setcorporationIdValues(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any = [OptionLabel.corporationNone];
        setcorporationIdValues(corporationData);
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
      (corporationId && corporationId.data && corporationId.data.length > 0) ||
      (corporationIdOffline && corporationIdOffline.length > 0)
    ) {
      let corporationData: any;
      if (!isOnline) {
        corporationData = [
          OptionLabel.corporationNone,
          ...corporationIdOffline,
        ];
      } else {
        corporationData = [OptionLabel.corporationNone, ...corporationId.data];
      }
      setcorporationIdValues(corporationData);
    } else {
      let Data: any = [OptionLabel.corporationSelectLabel];
      setcorporationIdValues(Data);
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

  async function getCorporation(e: any) {
    setcorporationId(e && e.value);
    // console.log("current value", e && e.value)
    // console.log("previous value", prevCorporationIdValue)
    if (!((e && e.value) === prevCorporationIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('wardId', 0);
      }
      let wardIdOffline: any;
      let wardId: any;
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
      console.log('ward offline', wardIdOffline);

      if (
        (wardId && wardId.data && wardId.data.length > 0) ||
        (wardIdOffline && wardIdOffline.length > 0)
      ) {
        selectWardRef.current.select.clearValue();
        //formik.setFieldValue("zoneId", 0);
        formik.setFieldValue('wardId', '');
        let wardlist: any;
        if (!isOnline) {
          wardlist = [OptionLabel.zoneNoneLabel, ...wardIdOffline];
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

  async function getCorporationValues(e: any, districtId: any) {
    let wardIdOffline: any;
    let wardId: any;
    if (!isOnline) {
      wardIdOffline = await DexieOfflineDataBase.getWardOffline(e, districtId);
    } else {
      wardId = await DropdownService.getOneWard(e, districtId);
    }

    if (
      (wardId && wardId.data && wardId.data.length > 0) ||
      (wardIdOffline && wardIdOffline.length > 0)
    ) {
      let wardlist: any;
      if (!isOnline) {
        wardlist = [OptionLabel.zoneNoneLabel, ...wardIdOffline];
      } else {
        wardlist = [OptionLabel.zoneNoneLabel, ...wardId.data];
      }
      setwardIdValues(wardlist);
    } else {
      let Data: any = [OptionLabel.wardNoneLabel];
      setwardIdValues(Data);
      formik.setFieldValue('wardId', 0);
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
  //     console.log("village offline", VillageIdOffline);

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

  async function getFacility(e: any) {
    setfacilityId(e && e.value);
    if (!((e && e.value) === prevFacilityIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('subCenterId', 0);
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

  async function getpostcontent() {
    if (isOnline) {
      //state
      const stateId: any = await DropdownService.getStateInfo();
      if (stateId && stateId.data) {
        setstateIdValues(stateId.data);
      }
      //district
      const districtId: any = await DropdownService.getDistrictInfo();
      if (districtId && districtId.data && districtId.data.length > 0) {
        setdistrictIdValues(districtId.data);
      }
      //Genderperson
      const genderPersonData: any = await DropdownService.getUnitAction();
      if (genderPersonData && genderPersonData.data) {
        setgenderPersonValues(genderPersonData.data);
      }
      //Genderfamily data
      const genderFamilyData: any = await DropdownService.getUnitAction();
      if (genderFamilyData && genderFamilyData.data) {
        setgenderFamilyValues(genderFamilyData.data);
      }
    } else {
      //State
      const stateIdOffline: any = await DexieOfflineDataBase.getStates();
      if (stateIdOffline) {
        setstateIdValues(stateIdOffline);
      }
      //districtId
      const districtIdOffline: any = await DexieOfflineDataBase.getDistricts();
      if (districtIdOffline) {
        setdistrictIdValues(districtIdOffline);
      }
      //Genderperson  getCatagoryOption
      const genderPersonDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderPersonDataOffline) {
        setgenderPersonValues(genderPersonDataOffline);
      }
      //Genderfamily data
      const genderFamilyDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderFamilyDataOffline) {
        setgenderFamilyValues(genderFamilyDataOffline);
      }
    }
  }

  const stateIdList =
    stateIdValues &&
    stateIdValues.map((item: any, i: any) => {
      return { label: item.stateName, value: item.id };
    });
  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  let corporationIdList =
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
  const elephantitisList = elephantitisHydrocele.map(
    (elephantitisHydrocele: any, i: any) => {
      return { label: elephantitisHydrocele, value: elephantitisHydrocele };
    }
  );

  /*   async function getEditData() {
      if (location.state && location.state.id) {
        const id: any = location.state.id;
        const response = await postMDAList.getOneEvalList(id);
        console.log("responseeeeeeeee", response);
        console.log(response.data[0].reasonForNotSwallowDrug);
  
        if (response) {
          getStateValues(response.data[0].stateId);
          getDistrictValues(
            response.data[0].districtId
          );
          getCorporationValues(
            response.data[0].corporationId,
            response.data[0].districtId
          );
          getTalukaValues(response.data[0].talukaId, response.data[0].districtId);
          getFacilityValues(
            response.data[0].facilityId,
            response.data[0].districtId
          );
          if (response.data[0].reasonForNotSwallowDrug === "Others - specify") {
            setHideSwallowData(true);
  
            //   setHideCommunityData(true)
          } else {
            setHideSwallowData(false);
          }
          if (response.data[0].reservationDrugAdmin === "Others - specify") {
            setHideReserveddrugData(true);
            //   setHideCommunityData(true)
          } else {
            setHideReserveddrugData(false);
          }
  
          if (response.data[0].detailsOfRemedyTaken === "Others") {
            setHideRemedyTakenData(true);
            //   setHideCommunityData(true)
          } else {
            setHideRemedyTakenData(false);
          }
          console.log(response.data);
  
          let arr: any = response.data;
          // console.log("EditId", arr[0]);
          if (arr[0].isDECTabletsRecovered == null) {
            arr[0].isDECTabletsRecovered = "";
          } else {
            arr[0].isDECTabletsRecovered = arr[0].isDECTabletsRecovered
              ? "true"
              : "false";
          }
          if (arr[0].isDrugAdministeredInHouse == null) {
            arr[0].isDrugAdministeredInHouse = "";
          } else {
            arr[0].isDrugAdministeredInHouse = arr[0].isDrugAdministeredInHouse
              ? "true"
              : "false";
          }
  
          if (arr[0].approachShouldFollow == null) {
            arr[0].isDrugSwallowInDDPresence = "";
          } else {
            arr[0].approachShouldFollow = arr[0].approachShouldFollow.toString();
          }
          if (arr[0].isDrugSwallowInDDPresence == null) {
            arr[0].isDrugSwallowInDDPresence = "";
          } else {
            arr[0].isDrugSwallowInDDPresence = arr[0].isDrugSwallowInDDPresence
              ? "true"
              : "false";
          }
          if (arr[0].isDDPersuadeSwallowDrug == null) {
            arr[0].isDDPersuadeSwallowDrug = "";
          } else {
            arr[0].isDDPersuadeSwallowDrug = arr[0].isDDPersuadeSwallowDrug
              ? "true"
              : "false";
          }
          if (arr[0].isHelpedDDInDrugCompliance == null) {
            arr[0].isHelpedDDInDrugCompliance = "";
          } else {
            arr[0].isHelpedDDInDrugCompliance = arr[0].isHelpedDDInDrugCompliance
              ? "true"
              : "false";
          }
          if (arr[0].isDDExplainToYouDetails == null) {
            arr[0].isDDExplainToYouDetails = "";
          } else {
            arr[0].isDDExplainToYouDetails = arr[0].isDDExplainToYouDetails
              ? "true"
              : "false";
          }
          if (arr[0].isPriorInfoAboutMDAwithDE == null) {
            arr[0].isPriorInfoAboutMDAwithDE = "";
          } else {
            arr[0].isPriorInfoAboutMDAwithDE = arr[0].isPriorInfoAboutMDAwithDE
              ? "true"
              : "false";
          }
          if (arr[0].isReadOrSeeAnyInfo == null) {
            arr[0].isReadOrSeeAnyInfo = "";
          } else {
            arr[0].isReadOrSeeAnyInfo = arr[0].isReadOrSeeAnyInfo
              ? "true"
              : "false";
          }
          if (arr[0].isYouSeekRemedy == null) {
            arr[0].isYouSeekRemedy = "";
          } else {
            arr[0].isYouSeekRemedy = arr[0].isYouSeekRemedy ? "true" : "false";
          }
          if (arr[0].IsAnyFamilySufferLF == null) {
            arr[0].IsAnyFamilySufferLF = "";
          } else {
            arr[0].IsAnyFamilySufferLF = arr[0].IsAnyFamilySufferLF
              ? "true"
              : "false";
          }
          if (arr[0].IsYouReceiveTreatmentOtherAilment == null) {
            arr[0].IsYouReceiveTreatmentOtherAilment = "";
          } else {
            arr[0].IsYouReceiveTreatmentOtherAilment = arr[0]
              .IsYouReceiveTreatmentOtherAilment
              ? "true"
              : "false";
          }
          if (arr[0].isYouExperienceSideEffects == null) {
            arr[0].isYouExperienceSideEffects = "";
          } else {
            arr[0].isYouExperienceSideEffects = arr[0].isYouExperienceSideEffects
              ? "true"
              : "false";
          }
          if (arr[0].IsVerifiedByInvestigator == null) {
            arr[0].IsVerifiedByInvestigator = "";
          } else {
            arr[0].IsVerifiedByInvestigator = arr[0].IsVerifiedByInvestigator
              ? "true"
              : "false";
          }
          if (arr[0].isReservationAboutDD == null) {
            arr[0].isReservationAboutDD = "";
          } else {
            arr[0].isReservationAboutDD = arr[0].isReservationAboutDD
              ? "true"
              : "false";
          }
          if (arr[0].isDDEnsureSwallowInPresence == null) {
            arr[0].isDDEnsureSwallowInPresence = "";
          } else {
            arr[0].isDDEnsureSwallowInPresence = arr[0]
              .isDDEnsureSwallowInPresence
              ? "true"
              : "false";
          }
  
          setformdata(arr[0]);
          let str: any = arr[0].whereReadOrSeeInfo;
          let arr1: any = str && str.split(",");
          let test: any = [];
          for (let i = 0; arr1 && i < arr1.length; i++) {
            whereReadOrSeeOptions.forEach((element: any) => {
              if (element.value === arr1[i]) {
                if (element.value === "Others") {
                  setshowOthersWhereseeinfo(true);
                } else {
                  setshowOthersWhereseeinfo(false);
                }
                // if (arr[i] === "Others") {
                //   setOthersCoMorbity(true);
                // } else if (!(arr[i] === "Others")) {
                //   setOthersCoMorbity(false);
                // }
                test.push(element);
              }
            });
          }
          setwhereReadOrSeeInfoselectedOption(test);
  
          let str2: any = arr[0].detailsOfSideEffects;
          let arr2: any = str2 && str2.split(",");
          let test2: any = [];
          for (let i = 0; arr2 && i < arr2.length; i++) {
            detailsOfSideEffectsOptions.forEach((element: any) => {
              if (element.value === arr2[i]) {
                if (element.value === "Others - specify") {
                  setShowOthersDetailofEffect(true);
                } else {
                  setShowOthersDetailofEffect(false);
                }
                // if (arr[i] === "Others") {
                //   setOthersCoMorbity(true);
                // } else if (!(arr[i] === "Others")) {
                //   setOthersCoMorbity(false);
                // }
                test2.push(element);
              }
            });
          }
          setdetailsofSideSelectedOption(test2);
          // console.log("qwertyuiop,...........", formdata);
        }
      }
    } */

  async function getEditData() {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await postMDAList.getOneEvalList(id);
      console.log('responseeeeeeeee', response);
      console.log(response.data[0].reasonForNotSwallowDrug);

      if (response && response.data) {
        getStateValues(response.data[0].stateId);
        console.log('response.data[0].stateId', response.data[0].stateId);
        getDistrictValues(response.data[0].districtId);
        getCorporationValues(
          response.data[0].corporationId,
          response.data[0].districtId
        );
        // getTalukaValues(
        //   response.data[0].talukaId,
        //   response.data[0].districtId
        // );
        await getFacilityValues(
          response.data[0].facilityId,
          response.data[0].districtId
        );

        getSubCenterValues(
          response.data[0].subCenterId,
          response.data[0].facilityId,
          response.data[0].districtId
        );

        if (response.data[0].reasonForNotSwallowDrug === 'Others - specify') {
          setHideSwallowData(true);

          //   setHideCommunityData(true)
        } else {
          setHideSwallowData(false);
        }
        if (response.data[0].reservationDrugAdmin === 'Others - specify') {
          setHideReserveddrugData(true);
          //   setHideCommunityData(true)
        } else {
          setHideReserveddrugData(false);
        }

        if (response.data[0].detailsOfRemedyTaken === 'Others') {
          setHideRemedyTakenData(true);
          //   setHideCommunityData(true)
        } else {
          setHideRemedyTakenData(false);
        }
        console.log(response.data);

        let arr: any = response.data;
        // console.log("EditId", arr[0]);
        if (arr[0].isDECTabletsRecovered == null) {
          arr[0].isDECTabletsRecovered = '';
        } else {
          arr[0].isDECTabletsRecovered = arr[0].isDECTabletsRecovered
            ? 'true'
            : 'false';
        }

        if (arr[0].isDrugAdministeredInHouse == null) {
          arr[0].isDrugAdministeredInHouse = '';
        } else {
          arr[0].isDrugAdministeredInHouse = arr[0].isDrugAdministeredInHouse
            ? 'true'
            : 'false';
        }

        if (arr[0].approachShouldFollow == null) {
          arr[0].isDrugSwallowInDDPresence = '';
        } else {
          arr[0].approachShouldFollow = arr[0].approachShouldFollow.toString();
        }

        if (arr[0].isDrugSwallowInDDPresence == null) {
          arr[0].isDrugSwallowInDDPresence = '';
        } else {
          arr[0].isDrugSwallowInDDPresence = arr[0].isDrugSwallowInDDPresence
            ? 'true'
            : 'false';
        }

        if (arr[0].isDDPersuadeSwallowDrug == null) {
          arr[0].isDDPersuadeSwallowDrug = '';
        } else {
          arr[0].isDDPersuadeSwallowDrug = arr[0].isDDPersuadeSwallowDrug
            ? 'true'
            : 'false';
        }

        if (arr[0].isHelpedDDInDrugCompliance == null) {
          arr[0].isHelpedDDInDrugCompliance = '';
        } else {
          arr[0].isHelpedDDInDrugCompliance = arr[0].isHelpedDDInDrugCompliance
            ? 'true'
            : 'false';
        }

        if (arr[0].isDDExplainToYouDetails == null) {
          arr[0].isDDExplainToYouDetails = '';
        } else {
          arr[0].isDDExplainToYouDetails = arr[0].isDDExplainToYouDetails
            ? 'true'
            : 'false';
        }

        if (arr[0].isPriorInfoAboutMDAwithDE == null) {
          arr[0].isPriorInfoAboutMDAwithDE = '';
        } else {
          arr[0].isPriorInfoAboutMDAwithDE = arr[0].isPriorInfoAboutMDAwithDE
            ? 'true'
            : 'false';
        }

        if (arr[0].isReadOrSeeAnyInfo == null) {
          arr[0].isReadOrSeeAnyInfo = '';
        } else {
          arr[0].isReadOrSeeAnyInfo = arr[0].isReadOrSeeAnyInfo
            ? 'true'
            : 'false';
        }

        if (arr[0].isYouSeekRemedy == null) {
          arr[0].isYouSeekRemedy = '';
        } else {
          arr[0].isYouSeekRemedy = arr[0].isYouSeekRemedy ? 'true' : 'false';
        }
        if (arr[0].IsAnyFamilySufferLF == null) {
          arr[0].IsAnyFamilySufferLF = '';
        } else {
          arr[0].IsAnyFamilySufferLF = arr[0].IsAnyFamilySufferLF
            ? 'true'
            : 'false';
        }
        if (arr[0].IsYouReceiveTreatmentOtherAilment == null) {
          arr[0].IsYouReceiveTreatmentOtherAilment = '';
        } else {
          arr[0].IsYouReceiveTreatmentOtherAilment = arr[0]
            .IsYouReceiveTreatmentOtherAilment
            ? 'true'
            : 'false';
        }
        if (arr[0].isYouExperienceSideEffects == null) {
          arr[0].isYouExperienceSideEffects = '';
        } else {
          arr[0].isYouExperienceSideEffects = arr[0].isYouExperienceSideEffects
            ? 'true'
            : 'false';
        }
        if (arr[0].IsVerifiedByInvestigator == null) {
          arr[0].IsVerifiedByInvestigator = '';
        } else {
          arr[0].IsVerifiedByInvestigator = arr[0].IsVerifiedByInvestigator
            ? 'true'
            : 'false';
        }
        if (arr[0].isReservationAboutDD == null) {
          arr[0].isReservationAboutDD = '';
        } else {
          arr[0].isReservationAboutDD = arr[0].isReservationAboutDD
            ? 'true'
            : 'false';
        }
        if (arr[0].isDDEnsureSwallowInPresence == null) {
          arr[0].isDDEnsureSwallowInPresence = '';
        } else {
          arr[0].isDDEnsureSwallowInPresence = arr[0]
            .isDDEnsureSwallowInPresence
            ? 'true'
            : 'false';
        }

        if (arr[0].isReadOrSeeAnyInfo == 'false') {
          setReadShow(true);
        } else {
          setReadShow(false);
        }
        if (arr[0].isYouExperienceSideEffects == 'false') {
          setSideEffectShow(true);
        } else {
          setSideEffectShow(false);
        }
        if (arr[0].isYouSeekRemedy == 'false') {
          selectRemedyRef.current.select.clearValue();
          setRemedyShow(true);
        } else {
          setRemedyShow(false);
        }
        if (arr[0].IsAnyFamilySufferLF == 'false') {
          formik.setFieldValue('postMDAEvalListFMembers[0].nameOfPatient', '');
          formik.setFieldValue('OtherRelevantInfoOnMDA', '');
          selectYearRef.current.select.clearValue();
          selectMonthRef.current.select.clearValue();
          selectGenderRef.current.select.clearValue();
          selectElephantitisRef.current.select.clearValue();

          setFamilyShow(true);
        } else {
          setFamilyShow(false);
        }
        if (arr[0].approachShouldFollow == 'false') {
          setDrugShow(false);
        } else {
          selectDrugAdminRef.current.select.clearValue();
          setDrugShow(true);
        }
        if (arr[0].isReservationAboutDD == 'false') {
          selectAdminRef.current.select.clearValue();
          formik.setFieldValue('speciFyResponsibilityOfDD', '');

          setDrugAdminShow(true);
        } else {
          setDrugAdminShow(false);
        }
        if (arr[0].isPriorInfoAboutMDAwithDE == 'false') {
          formik.setFieldValue('sourceOfInformation', '');
          setDoseShow(true);
        } else {
          setDoseShow(false);
        }

        setformdata(arr[0]);
        let str: any = arr[0].whereReadOrSeeInfo;
        let arr1: any = str && str.split(',');
        let test: any = [];
        for (let i = 0; arr1 && i < arr1.length; i++) {
          whereReadOrSeeOptions.forEach((element: any) => {
            if (element.value === arr1[i]) {
              if (element.value === 'Others') {
                setshowOthersWhereseeinfo(true);
              } else {
                setshowOthersWhereseeinfo(false);
              }
              // if (arr[i] === "Others") {
              //   setOthersCoMorbity(true);
              // } else if (!(arr[i] === "Others")) {
              //   setOthersCoMorbity(false);
              // }
              test.push(element);
            }
          });
        }
        setwhereReadOrSeeInfoselectedOption(test);

        let str2: any = arr[0].detailsOfSideEffects;
        let arr2: any = str2 && str2.split(',');
        let test2: any = [];
        for (let i = 0; arr2 && i < arr2.length; i++) {
          detailsOfSideEffectsOptions.forEach((element: any) => {
            if (element.value === arr2[i]) {
              if (element.value === 'Others - specify') {
                setShowOthersDetailofEffect(true);
              } else {
                setShowOthersDetailofEffect(false);
              }
              // if (arr[i] === "Others") {
              //   setOthersCoMorbity(true);
              // } else if (!(arr[i] === "Others")) {
              //   setOthersCoMorbity(false);
              // }
              test2.push(element);
            }
          });
        }
        setdetailsofSideSelectedOption(test2);
        // console.log("qwertyuiop,...........", formdata);
        setformdata(response.data[0]);
      }
    } else if (location.state && location.state.UUID) {
      const id: any = location.state.UUID;
      console.log(id);
      const response = await AddPostMdaDraftServices.getOnePostMdaEval(id);
      console.log('Draft response', response);
      if (response) {
        getStateValues(response.stateId);
        console.log('response.stateId', response.stateId);
        getDistrictValues(response.districtId);
        getCorporationValues(response.corporationId, response.districtId);
        // getTalukaValues(
        //   response.talukaId,
        //   response.districtId
        // );
        await getFacilityValues(response.facilityId, response.districtId);

        getSubCenterValues(
          response.subCenterId,
          response.facilityId,
          response.districtId
        );

        if (response.reasonForNotSwallowDrug === 'Others - specify') {
          setHideSwallowData(true);

          //   setHideCommunityData(true)
        } else {
          setHideSwallowData(false);
        }
        if (response.reservationDrugAdmin === 'Others - specify') {
          setHideReserveddrugData(true);
          //   setHideCommunityData(true)
        } else {
          setHideReserveddrugData(false);
        }

        if (response.detailsOfRemedyTaken === 'Others') {
          setHideRemedyTakenData(true);
          //   setHideCommunityData(true)
        } else {
          setHideRemedyTakenData(false);
        }
        console.log(response.data);

        let arr: any = response;
        // console.log("EditId", arr[0]);
        if (
          arr.isDECTabletsRecovered == null ||
          arr.isDECTabletsRecovered == ''
        ) {
          arr.isDECTabletsRecovered = '';
        } else {
          arr.isDECTabletsRecovered = arr.isDECTabletsRecovered
            ? 'true'
            : 'false';
        }

        if (
          arr.isDrugAdministeredInHouse == null ||
          arr.isDrugAdministeredInHouse == ''
        ) {
          arr.isDrugAdministeredInHouse = '';
        } else {
          arr.isDrugAdministeredInHouse = arr.isDrugAdministeredInHouse
            ? 'true'
            : 'false';
        }

        if (
          arr.approachShouldFollow == null ||
          arr.isDrugSwallowInDDPresence == ''
        ) {
          arr.isDrugSwallowInDDPresence = '';
        } else {
          arr.approachShouldFollow = arr.approachShouldFollow.toString();
        }

        if (
          arr.isDrugSwallowInDDPresence == null ||
          arr.isDrugSwallowInDDPresence == ''
        ) {
          arr.isDrugSwallowInDDPresence = '';
        } else {
          arr.isDrugSwallowInDDPresence = arr.isDrugSwallowInDDPresence
            ? 'true'
            : 'false';
        }

        if (
          arr.isDDPersuadeSwallowDrug == null ||
          arr.isDDPersuadeSwallowDrug == ''
        ) {
          arr.isDDPersuadeSwallowDrug = '';
        } else {
          arr.isDDPersuadeSwallowDrug = arr.isDDPersuadeSwallowDrug
            ? 'true'
            : 'false';
        }

        if (
          arr.isHelpedDDInDrugCompliance == null ||
          arr.isHelpedDDInDrugCompliance == ''
        ) {
          arr.isHelpedDDInDrugCompliance = '';
        } else {
          arr.isHelpedDDInDrugCompliance = arr.isHelpedDDInDrugCompliance
            ? 'true'
            : 'false';
        }

        if (
          arr.isDDExplainToYouDetails == null ||
          arr.isDDExplainToYouDetails == ''
        ) {
          arr.isDDExplainToYouDetails = '';
        } else {
          arr.isDDExplainToYouDetails = arr.isDDExplainToYouDetails
            ? 'true'
            : 'false';
        }

        if (
          arr.isPriorInfoAboutMDAwithDE == null ||
          arr.isPriorInfoAboutMDAwithDE == ''
        ) {
          arr.isPriorInfoAboutMDAwithDE = '';
        } else {
          arr.isPriorInfoAboutMDAwithDE = arr.isPriorInfoAboutMDAwithDE
            ? 'true'
            : 'false';
        }

        if (arr.isReadOrSeeAnyInfo == null || arr.isReadOrSeeAnyInfo == '') {
          arr.isReadOrSeeAnyInfo = '';
        } else {
          arr.isReadOrSeeAnyInfo = arr.isReadOrSeeAnyInfo ? 'true' : 'false';
        }

        if (arr.isYouSeekRemedy == null || arr.isYouSeekRemedy == '') {
          arr.isYouSeekRemedy = '';
        } else {
          arr.isYouSeekRemedy = arr.isYouSeekRemedy ? 'true' : 'false';
        }
        if (arr.IsAnyFamilySufferLF == null || arr.IsAnyFamilySufferLF == '') {
          arr.IsAnyFamilySufferLF = '';
        } else {
          arr.IsAnyFamilySufferLF = arr.IsAnyFamilySufferLF ? 'true' : 'false';
        }
        if (
          arr.IsYouReceiveTreatmentOtherAilment == null ||
          arr.IsYouReceiveTreatmentOtherAilment == ''
        ) {
          arr.IsYouReceiveTreatmentOtherAilment = '';
        } else {
          arr.IsYouReceiveTreatmentOtherAilment =
            arr.IsYouReceiveTreatmentOtherAilment ? 'true' : 'false';
        }
        if (
          arr.isYouExperienceSideEffects == null ||
          arr.isYouExperienceSideEffects == ''
        ) {
          arr.isYouExperienceSideEffects = '';
        } else {
          arr.isYouExperienceSideEffects = arr.isYouExperienceSideEffects
            ? 'true'
            : 'false';
        }
        if (
          arr.IsVerifiedByInvestigator == null ||
          arr.IsVerifiedByInvestigator == ''
        ) {
          arr.IsVerifiedByInvestigator = '';
        } else {
          arr.IsVerifiedByInvestigator = arr.IsVerifiedByInvestigator
            ? 'true'
            : 'false';
        }
        if (
          arr.isReservationAboutDD == null ||
          arr.isReservationAboutDD == ''
        ) {
          arr.isReservationAboutDD = '';
        } else {
          arr.isReservationAboutDD = arr.isReservationAboutDD
            ? 'true'
            : 'false';
        }
        if (
          arr.isDDEnsureSwallowInPresence == null ||
          arr.isDDEnsureSwallowInPresence == ''
        ) {
          arr.isDDEnsureSwallowInPresence = '';
        } else {
          arr.isDDEnsureSwallowInPresence = arr.isDDEnsureSwallowInPresence
            ? 'true'
            : 'false';
        }
        if (arr.isReadOrSeeAnyInfo == 'false') {
          setReadShow(true);
        } else {
          setReadShow(false);
        }
        if (arr.isYouExperienceSideEffects == 'false') {
          setSideEffectShow(true);
        } else {
          setSideEffectShow(false);
        }
        if (arr.isYouSeekRemedy == 'false') {
          selectRemedyRef.current.select.clearValue();
          setRemedyShow(true);
        } else {
          setRemedyShow(false);
        }
        if (arr.IsAnyFamilySufferLF == 'false') {
          formik.setFieldValue('postMDAEvalListFMembers.nameOfPatient', '');
          formik.setFieldValue('OtherRelevantInfoOnMDA', '');
          selectYearRef.current.select.clearValue();
          selectMonthRef.current.select.clearValue();
          selectGenderRef.current.select.clearValue();
          selectElephantitisRef.current.select.clearValue();

          setFamilyShow(true);
        } else {
          setFamilyShow(false);
        }
        if (arr.approachShouldFollow == 'false') {
          setDrugShow(false);
        } else {
          selectDrugAdminRef.current.select.clearValue();
          setDrugShow(true);
        }
        if (arr.isReservationAboutDD == 'false') {
          selectAdminRef.current.select.clearValue();
          formik.setFieldValue('speciFyResponsibilityOfDD', '');

          setDrugAdminShow(true);
        } else {
          setDrugAdminShow(false);
        }
        if (arr.isPriorInfoAboutMDAwithDE == 'false') {
          formik.setFieldValue('sourceOfInformation', '');
          setDoseShow(true);
        } else {
          setDoseShow(false);
        }

        setformdata(arr);
        let str: any = arr.whereReadOrSeeInfo;
        let arr1: any = str && str.split(',');
        let test: any = [];
        for (let i = 0; arr1 && i < arr1.length; i++) {
          whereReadOrSeeOptions.forEach((element: any) => {
            if (element.value === arr1[i]) {
              if (element.value === 'Others') {
                setshowOthersWhereseeinfo(true);
              } else {
                setshowOthersWhereseeinfo(false);
              }
              // if (arr[i] === "Others") {
              //   setOthersCoMorbity(true);
              // } else if (!(arr[i] === "Others")) {
              //   setOthersCoMorbity(false);
              // }
              test.push(element);
            }
          });
        }
        setwhereReadOrSeeInfoselectedOption(test);

        let str2: any = arr.detailsOfSideEffects;
        let arr2: any = str2 && str2.split(',');
        let test2: any = [];
        for (let i = 0; arr2 && i < arr2.length; i++) {
          detailsOfSideEffectsOptions.forEach((element: any) => {
            if (element.value === arr2[i]) {
              if (element.value === 'Others - specify') {
                setShowOthersDetailofEffect(true);
              } else {
                setShowOthersDetailofEffect(false);
              }
              // if (arr[i] === "Others") {
              //   setOthersCoMorbity(true);
              // } else if (!(arr[i] === "Others")) {
              //   setOthersCoMorbity(false);
              // }
              test2.push(element);
            }
          });
        }
        setdetailsofSideSelectedOption(test2);
        // console.log("qwertyuiop,...........", formdata);
        setformdata(response);
      }
    }
  }

  const validSchema = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    month: Yup.number().min(1, 'Required').required('Required').nullable(),
    stateId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('State is required').nullable(),
    }),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('District is required').nullable(),
    }),
    corporationId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Corporation is required').nullable(),
    }),
    talukaId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Taluka is required').nullable(),
    }),
    facilityId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Facility is required').nullable(),
    }),
    subCenterId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Subcenter is required').nullable(),
    }),
    wardId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Ward is required').nullable(),
    }),
    villageId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Village is required').nullable(),
    }),
    postMDAEvalListPersons: Yup.array().of(
      Yup.object().shape({
        sex: Yup.string().required('Required').nullable(),
      })
    ),
    mdaUndertakenOnFrom: Yup.date().nullable(),
    mdaUndertakenOnTo: Yup.date()
      .min(
        Yup.ref('mdaUndertakenOnFrom'),
        ({ min }) =>
          `Date Of MDA Under Taken To should always be greater than Date Of MDA Under Taken From `
      )
      .nullable(),
  });
  const boolean2str = (value) => {
    // console.log("typeof value", typeof value);

    if (value === true) return 'true';
    if (value === false) return 'false';
    return value;
  };

  const valueDetails = (values: any) => {
    values.totalMembersInFamily = values.totalMembersInFamily
      ? values.totalMembersInFamily
      : 0;
    values.noMembersInterviewed = values.noMembersInterviewed
      ? values.noMembersInterviewed
      : 0;
    values.noOfDECTabletsConsumed = values.noOfDECTabletsConsumed
      ? values.noOfDECTabletsConsumed
      : 0;
    values.noOfDECTabletsRecovered = values.noOfDECTabletsRecovered
      ? values.noOfDECTabletsRecovered
      : 0;
    values.noDECTabletsRecovered = values.noDECTabletsRecovered
      ? values.noDECTabletsRecovered
      : 0;
    values.districtId = values.districtId == 0 ? 0 : values.districtId;
    values.corporationId = values.corporationId == 0 ? 0 : values.corporationId;
    values.talukaId = values.talukaId == 0 ? 0 : values.talukaId;
    values.facilityId = values.facilityId == 0 ? 0 : values.facilityId;
    values.subCenterId = values.subCenterId == 0 ? 0 : values.subCenterId;
    values.wardId = values.wardId == 0 ? 0 : values.wardId;
    values.villageId = values.villageId == 0 ? 0 : values.villageId;
  };

  const formik = useFormik({
    initialValues: formdata,
    validationSchema: validSchema,
    enableReinitialize: true,

    onSubmit: async (values: any) => {
      console.log('DE5 Values', values);
      values.totalMembersInFamily = values.totalMembersInFamily
        ? values.totalMembersInFamily
        : 0;
      values.noMembersInterviewed = values.noMembersInterviewed
        ? values.noMembersInterviewed
        : 0;
      values.noOfDECTabletsConsumed = values.noOfDECTabletsConsumed
        ? values.noOfDECTabletsConsumed
        : 0;
      values.noOfDECTabletsRecovered = values.noOfDECTabletsRecovered
        ? values.noOfDECTabletsRecovered
        : 0;
      values.noDECTabletsRecovered = values.noDECTabletsRecovered
        ? values.noDECTabletsRecovered
        : 0;
      values.stateId = values.stateId == 0 ? 0 : values.stateId;
      values.districtId = values.districtId == 0 ? 0 : values.districtId;
      values.corporationId =
        values.corporationId == 0 ? 0 : values.corporationId;
      values.talukaId = values.talukaId == 0 ? 0 : values.talukaId;
      values.facilityId = values.facilityId == 0 ? 0 : values.facilityId;
      values.subCenterId = values.subCenterId == 0 ? 0 : values.subCenterId;
      values.wardId = values.wardId == 0 ? 0 : values.wardId;
      values.villageId = values.villageId == 0 ? 0 : values.villageId;

      if (values && values.status === 'Active') {
        if (location && location.state && location.state.id) {
          values.lastModifiedBy = props && props.userSessionId;
          values.postMDAEvalListFMembers.map((val: any) => {
            if (val && val.id) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          values.postMDAEvalListPersons.map((val: any) => {
            if (val && val.id) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          let arr: any = [];
          setIsDisabled(true);
          let Type: any;
          whereReadOrSeeInfoselectedOption.forEach((element: any) => {
            arr.push(element.value);
            Type = arr.join(',');
            values.whereReadOrSeeInfo = Type;
          });
          console.log('form HF values:: ', values);

          let arrDetail: any = [];

          let Type2: any;
          detailsofSideSelectedOption.forEach((element: any) => {
            arrDetail.push(element.value);
            Type2 = arrDetail.join(',');
            values.detailsOfSideEffects = Type2;
          });
          console.log('form HF values:: ', values);

          const response = await postMDAList.editEvalList(
            location.state.id,
            values
          );
          setIsDisabled(false);
          // console.log("Message", response.message);
          if (response && response.data) {
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push(listDESheetName);
          }
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;

          values.postMDAEvalListFMembers.map((val: any) => {
            if (val && val.postMDAEvalListId) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          values.postMDAEvalListPersons.map((val: any) => {
            if (val && val.postMDAEvalListId) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          setIsDisabled(true);
          let arr: any = [];

          let Type: any;
          whereReadOrSeeInfoselectedOption.forEach((element: any) => {
            arr.push(element.value);
            Type = arr.join(',');
            values.whereReadOrSeeInfo = Type;
          });
          console.log('form HF values:: ', values);

          let arrDetail: any = [];

          let Type2: any;
          detailsofSideSelectedOption.forEach((element: any) => {
            arrDetail.push(element.value);
            Type2 = arrDetail.join(',');
            values.detailsOfSideEffects = Type2;
          });
          console.log('form HF values:: ', values);

          if (values && values.postMdaEvalUUID) {
            let UUID = values.postMdaEvalUUID;
            console.log('values', values);
            console.log('values.postMdaEvalUUID', values.postMdaEvalUUID);
            let response = await postMDAList.postEvalList(values);
            setIsDisabled(false);
            if (response && response.data) {
              let deleteResponse =
                await AddPostMdaDraftServices.deletePostMdaEval(UUID);
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
              history.push(listDESheetName);
            }
          } else {
            let response = await postMDAList.postEvalList(values);
            setIsDisabled(false);
            if (response.data) {
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
            }
            console.log('create Response  ::', response);
            history.push(listDESheetName);
          }
        }
      } else if (values && values.status === 'Draft') {
        if (location.state && location.state.UUID) {
          const id: any = location.state.UUID;
          values.postMDAEvalListFMembers.map((val: any) => {
            if (val && val.postMDAEvalListId) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          values.postMDAEvalListPersons.map((val: any) => {
            if (val && val.postMDAEvalListId) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          let arr: any = [];

          let Type: any;
          whereReadOrSeeInfoselectedOption.forEach((element: any) => {
            arr.push(element.value);
            Type = arr.join(',');
            values.whereReadOrSeeInfo = Type;
          });
          console.log('form HF values:: ', values);

          let arrDetail: any = [];

          let Type2: any;
          detailsofSideSelectedOption.forEach((element: any) => {
            arrDetail.push(element.value);
            Type2 = arrDetail.join(',');
            values.detailsOfSideEffects = Type2;
          });
          console.log('form HF values:: ', values);
          values.lastModifiedBy = props && props.userSessionId;

          const response = await AddPostMdaDraftServices.updatePostMdaEval(
            id,
            values
          );
          console.log(response);
          if (response) {
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push(listDESheetName);
          }
        } else {
          values.postMDAEvalListFMembers.map((val: any) => {
            if (val && val.postMDAEvalListId) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          values.postMDAEvalListPersons.map((val: any) => {
            if (val && val.postMDAEvalListId) {
              val.lastModifiedBy = props && props.userSessionId;
            } else {
              val.createdBy = props && props.userSessionId;
              val.lastModifiedBy = 0;
            }
          });
          let arr: any = [];

          let Type: any;
          whereReadOrSeeInfoselectedOption.forEach((element: any) => {
            arr.push(element.value);
            Type = arr.join(',');
            values.whereReadOrSeeInfo = Type;
          });
          console.log('form HF values:: ', values);

          let arrDetail: any = [];

          let Type2: any;
          detailsofSideSelectedOption.forEach((element: any) => {
            arrDetail.push(element.value);
            Type2 = arrDetail.join(',');
            values.detailsOfSideEffects = Type2;
          });
          console.log('form HF values:: ', values);
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          let response = await AddPostMdaDraftServices.addPostMdaEval(values);
          console.log(response);
          if (response) {
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push(listDESheetName);
          }
        }
      }
    },
  });

  const genderPersonList = (index) =>
    //console.log("formik.values.postMDAEvalListPersons[index].sex ",formik.values.postMDAEvalListPersons[index].sex )

    // let indexx:number = parseInt(index);
    genderPersonValues &&
    genderPersonValues.map((item: any, i: any) => {
      let id: number = parseInt(item.id);
      if (item && item.categoryCode === 1000) {
        return (
          <label className='form-label font-chng' key={i}>
            <input
              type='radio'
              name={`postMDAEvalListPersons[${index}].sex`}
              value={item.id}
              checked={
                Number(formik.values.postMDAEvalListPersons[index].sex) === id
              }
              // className={(formik.errors.postMDAEvalListPersons && formik.errors.postMDAEvalListPersons[index] && formik.errors.postMDAEvalListPersons[index]['sex'] &&
              // formik.touched.postMDAEvalListPersons && formik.touched.postMDAEvalListPersons[index] && formik.touched.postMDAEvalListPersons[index]['sex'] ? "form-radio is-invalid" : "form-radio")}
              onChange={(event: any) => {
                formik.setFieldValue(
                  `postMDAEvalListPersons[${index}].sex`,
                  event
                );
              }}
            />
            &nbsp;&nbsp;
            {item.categoryOptionName} &nbsp;&nbsp;
          </label>
        );
      }
    });

  const genderFamilyList: any = [];
  genderFamilyValues &&
    genderFamilyValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1000) {
        genderFamilyList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  function addField(arrayHelpers) {
    const index = arrayHelpers.form.values.postMDAEvalListPersons.length;
    if (index == 1) {
      arrayHelpers.push({
        nameOfPatient: '',
        sex: 0,
        ageYears: 0,
        ageMonths: 0,
        elephantitisOrHydrocele: '',
      });
    }
  }

  function addField1(arrayHelpers) {
    const index = arrayHelpers.form.values.postMDAEvalListFMembers.length;
    if (index == 1) {
      arrayHelpers.push({
        namePersonsEligibleForMDA: '',
        ageYears: 0,
        ageMonths: 0,
        age: 0,
        sex: 0,
        noOfDECTabletsConsumed: 0,
        noOfDECTabletsRecovered: 0,
      });
    }
  }

  let formPersonFieldArray = () => {
    return (
      <FieldArray
        name='postMDAEvalListPersons'
        render={(arrayHelpers) => (
          <div>
            {formik.values.postMDAEvalListPersons?.map((listPersons, index) => (
              <div className='row' key={index}>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <Row className='mb-3'>
                    <div className='col-md-4 col-xl-3 col-xs-12'>
                      <div className='form-grp'>
                        <label
                          className='form-label font-chng'
                          htmlFor='namePersonsEligibleForMDA'
                        >
                          Name
                        </label>
                        <Field
                          className='form-control'
                          name={`postMDAEvalListPersons[${index}].namePersonsEligibleForMDA`}
                          value={
                            formik.values.postMDAEvalListPersons[index]
                              .namePersonsEligibleForMDA
                          }
                          type='text'
                          onChange={formik.handleChange}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                        />
                      </div>
                    </div>

                    <div className='col-md-4 col-xl-3 col-xs-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='ageYears'
                          className='form-label font-chng'
                        >
                          Age - Years
                        </label>

                        <Select
                          name={`postMDAEvalListPersons[${index}].ageYears`}
                          isClearable='true'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className='custom-select'
                          value={
                            ageYearsList
                              ? ageYearsList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.postMDAEvalListPersons[
                                        index
                                      ].ageYears
                                )
                              : ''
                          }
                          options={ageYearsList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              `postMDAEvalListPersons[${index}].ageYears`,
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>

                    <div className='col-md-4 col-xl-3 col-xs-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='ageMonths'
                          className='form-label font-chng'
                        >
                          Age - Months
                        </label>

                        <Select
                          name={`postMDAEvalListPersons[${index}].ageMonths`}
                          isClearable='true'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className='custom-select'
                          value={
                            ageMonthsList
                              ? ageMonthsList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.postMDAEvalListPersons[
                                        index
                                      ].ageMonths
                                )
                              : ''
                          }
                          options={ageMonthsList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              `postMDAEvalListPersons[${index}].ageMonths`,
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-md-4 col-xl-3 col-xs-12'>
                      <div className='form-grp'>
                        <label htmlFor='sex' className='form-label font-chng'>
                          Gender*
                        </label>
                        <div role='group' aria-labelledby='my-radio-group'>
                          {genderPersonList(index)}
                        </div>
                        <div
                          className={
                            formik.errors.postMDAEvalListPersons &&
                            formik.errors.postMDAEvalListPersons[index] &&
                            formik.errors.postMDAEvalListPersons[index][
                              'sex'
                            ] &&
                            formik.touched.postMDAEvalListPersons &&
                            formik.touched.postMDAEvalListPersons[index] &&
                            formik.touched.postMDAEvalListPersons[index]['sex']
                              ? 'text-danger'
                              : 'invalid-feedback'
                          }
                        >
                          {formik.errors.postMDAEvalListPersons &&
                          formik.errors.postMDAEvalListPersons[index] &&
                          formik.errors.postMDAEvalListPersons[index]['sex']
                            ? formik.errors.postMDAEvalListPersons[index]['sex']
                            : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-4 col-xl-3 col-xs-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='noOfDECTabletsConsumed'
                          className='form-label font-chng'
                        >
                          Number of DEC tablets Consumed
                        </label>
                        <Field
                          name={`postMDAEvalListPersons[${index}].noOfDECTabletsConsumed`}
                          value={
                            formik.values.postMDAEvalListPersons[index]
                              .noOfDECTabletsConsumed
                          }
                          onChange={formik.handleChange}
                          //onInput={(event)=>commonFunction.onlyAlphabets(event)}
                          // onKeyPress={(e) => commonFunction.keyPress(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          className='form-control'
                        />
                      </div>
                    </div>

                    <div className='col-md-4 col-xl-3 col-xs-12'>
                      <div className='form-grp'>
                        <label
                          className='form-label font-chng'
                          htmlFor='noOfDECTabletsRecovered'
                        >
                          Number of DEC tablets Recovered
                        </label>
                        <Field
                          name={`postMDAEvalListPersons[${index}].noOfDECTabletsRecovered`}
                          value={
                            formik.values.postMDAEvalListPersons[index]
                              .noOfDECTabletsRecovered
                          }
                          onChange={formik.handleChange}
                          // onInput={(event)=>commonFunction.onlyAlphabets(event)}
                          //onKeyPress={(e) => commonFunction.keyPress(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          className='form-control'
                        />
                      </div>
                    </div>
                    <div className='col-md-4 col-xl-3 col-xs-12'></div>
                    <div className='col-md-4 col-xl-3 col-xs-12 mopt-btn'>
                      {location && location.state && location.state.view ? (
                        ''
                      ) : (
                        // <div className="col-md-12">
                        <div className='form-grp m-3'>
                          {formik.values.postMDAEvalListPersons.length - 1 ===
                            index && (
                            <Button
                              type='button'
                              className='fnt-btn btn btn-secondary'
                              style={{ display: 'inline-block' }}
                              // type="button"
                              // className="btn btn-secondary pt-xs font-chng"
                              onClick={() =>
                                arrayHelpers.push({
                                  namePersonsEligibleForMDA: '',
                                  ageYears: 0,
                                  ageMonths: 0,
                                  age: '',
                                  sex: '',
                                  noOfDECTabletsConsumed: 0,
                                  noOfDECTabletsRecovered: 0,
                                })
                              }
                            >
                              Add
                            </Button>
                          )}
                          <button
                            type='button'
                            // className="btn pt-xs font-chng"
                            style={{ display: 'inline-block', float: 'right' }}
                            className='btn'
                            disabled={index ? false : true}
                            onClick={(e) => {
                              e.preventDefault();
                              deletePerson(listPersons);
                              arrayHelpers.remove(index);
                              addField1(arrayHelpers);
                            }}
                          >
                            <img src={Delete} />
                          </button>
                        </div>
                        // </div>
                      )}
                    </div>
                    {/* {location && location.state && location.state.view ? (
                      ""
                    ) : (
                      <div className="col-md-12 text-right">
                        <button
                          type="button"
                          className="btn pt-xs font-chng"
                          onClick={(e) => {
                            e.preventDefault();
                            deletePerson(listPersons);
                            arrayHelpers.remove(index);
                            addField(arrayHelpers);
                          }}
                        >
                          <img src={Delete} />
                        </button>
                        {formik.values.postMDAEvalListPersons.length - 1 ===
                          index && (
                            <Button
                              type="button"
                              className="btn btn-secondary pt-xs font-chng"
                              onClick={() =>
                                arrayHelpers.push({
                                  namePersonsEligibleForMDA: "",
                                  ageYears: 0,
                                  ageMonths: 0,
                                  age: "",
                                  sex: "",
                                  noOfDECTabletsConsumed: "",
                                  noOfDECTabletsRecovered: "",
                                })
                              }
                            >
                              Add
                            </Button>
                          )}
                      </div>
                    )} */}
                  </Row>
                </fieldset>
              </div>
            ))}
          </div>
        )}
      />
    );
  };
  let formFamilyFieldArray = () => {
    return (
      <FieldArray
        name='postMDAEvalListFMembers'
        render={(arrayHelpers) => (
          <div>
            {formik.values.postMDAEvalListFMembers?.map(
              (familyMembers, index) => (
                <div className='row' key={index}>
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <Row className='mb-3'>
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='nameOfPatient'
                            className='form-label font-chng'
                          >
                            Name of the family Members
                          </label>
                          <Field
                            name={`postMDAEvalListFMembers[${index}].nameOfPatient`}
                            disabled={familyShow ? true : false}
                            value={
                              formik.values.postMDAEvalListFMembers[index]
                                .nameOfPatient
                            }
                            onChange={formik.handleChange}
                            onKeyPress={(e) => commonFunction.keyPress(e)}
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            type='text'
                            className='form-control'
                          />
                        </div>
                      </div>

                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='ageYears'
                            className='form-label font-chng'
                          >
                            Years
                          </label>

                          <Select
                            name={`postMDAEvalListFMembers[${index}].ageYears`}
                            ref={selectYearRef}
                            isClearable='true'
                            isDisabled={familyShow ? true : false}
                            styles={commonFunction.customStyles}
                            className='custom-select'
                            value={
                              ageYearsList
                                ? ageYearsList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.postMDAEvalListFMembers[
                                          index
                                        ].ageYears
                                  )
                                : ''
                            }
                            options={ageYearsList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `postMDAEvalListFMembers.${index}.ageYears`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>

                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='ageMonths'
                            className='form-label font-chng'
                          >
                            Months
                          </label>

                          <Select
                            name={`postMDAEvalListFMembers[${index}].ageMonths`}
                            ref={selectMonthRef}
                            isClearable='true'
                            isDisabled={familyShow ? true : false}
                            styles={commonFunction.customStyles}
                            className='custom-select'
                            value={
                              ageMonthsList
                                ? ageMonthsList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.postMDAEvalListFMembers[
                                          index
                                        ].ageMonths
                                  )
                                : ''
                            }
                            options={ageMonthsList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `postMDAEvalListFMembers.${index}.ageMonths`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label htmlFor='sex' className='form-label font-chng'>
                            Gender
                          </label>

                          <Select
                            component='select'
                            ref={selectGenderRef}
                            isDisabled={familyShow ? true : false}
                            styles={commonFunction.customStyles}
                            name={`postMDAEvalListFMembers[${index}].sex`}
                            className='custom-select'
                            value={
                              genderFamilyList
                                ? genderFamilyList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.postMDAEvalListFMembers[
                                          index
                                        ].sex
                                  )
                                : ''
                            }
                            options={genderFamilyList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `postMDAEvalListFMembers[${index}].sex`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>

                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='elephantitisOrHydrocele'
                            className='form-label font-chng'
                          >
                            Elephantitis/Hydrocele
                          </label>
                          <Select
                            isDisabled={familyShow ? true : false}
                            ref={selectElephantitisRef}
                            styles={commonFunction.customStyles}
                            name={`postMDAEvalListFMembers.${index}.elephantitisOrHydrocele`}
                            className='custom-select'
                            value={
                              elephantitisList
                                ? elephantitisList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.postMDAEvalListFMembers[
                                          index
                                        ].elephantitisOrHydrocele
                                  )
                                : ''
                            }
                            options={elephantitisList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `postMDAEvalListFMembers.${index}.elephantitisOrHydrocele`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>
                      <div className='col-xl-3 col-md-6 col-12'></div>
                      <div className='col-xl-3 col-md-6 col-12'></div>
                      {location && location.state && location.state.view ? (
                        ''
                      ) : (
                        <div className='col-xl-3 col-md-6 col-12 mopt-btn'>
                          <div className='form-grp m-3'>
                            {formik.values.postMDAEvalListFMembers.length -
                              1 ===
                              index && (
                              <Button
                                type='button'
                                className='fnt-btn btn btn-secondary'
                                style={{ display: 'inline-block' }}
                                onClick={() =>
                                  arrayHelpers.push({
                                    nameOfPatient: '',
                                    sex: 0,
                                    ageYears: 0,
                                    ageMonths: 0,
                                    elephantitisOrHydrocele: '',
                                  })
                                }
                              >
                                Add
                              </Button>
                            )}
                            <button
                              type='button'
                              style={{
                                display: 'inline-block',
                                float: 'right',
                                paddingRight: '0px',
                              }}
                              className='btn'
                              disabled={index ? false : true}
                              onClick={(e) => {
                                e.preventDefault();
                                deleteFamilymember(familyMembers);
                                arrayHelpers.remove(index);
                                addField(arrayHelpers);
                              }}
                            >
                              <img src={Delete} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Row>
                  </fieldset>
                </div>
              )
            )}
          </div>
        )}
      />
    );
  };

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

  const handleChangeData = (e) => {
    if (e && e.value == 'Others - specify') {
      setHideSwallowData(true);
    } else {
      setHideSwallowData(false);
    }
  };

  const handleChangeData1 = (e) => {
    if (e && e.value == 'Others - specify') {
      setHideReserveddrugData(true);
    } else {
      setHideSwallowData(false);
      setHideReserveddrugData(false);
    }
  };
  const handleChangeData2 = (e) => {
    if (e && e.value == 'Others') {
      setHideRemedyTakenData(true);
    } else {
      setHideRemedyTakenData(false);
    }
  };

  function selectSideEffects(e) {
    //   alert('calling');
    if (e === 'true') {
      setshowOthersWhereseeinfo(true);
      setOthersWhereseeinfo(false);
    } else if (e === 'false') {
      setshowOthersWhereseeinfo(false);
      formik.setFieldValue('whereReadOrSeeInfo', '');
      formik.setFieldValue('whereReadOrSeeInfoOthers', '');
      setwhereReadOrSeeInfoselectedOption([]);
    }
  }

  function selectSideEffects2(e) {
    //   alert('calling');
    if (e === 'true') {
      setShowOthersDetailofEffect(true);
      setOthersdetailsofSideeffect(false);
    } else if (e === 'false') {
      setShowOthersDetailofEffect(false);
      formik.setFieldValue('detailsOfSideEffects', '');
      formik.setFieldValue('detailsOfSideEffectsOther', '');
      setdetailsofSideSelectedOption([]);
    }
  }
  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/WebDashboard');
          }}
          className='font-chng'
        >
          Data Entry
        </Breadcrumb.Item>
        {/* <Breadcrumb.Item href="">Pre-MDA</Breadcrumb.Item> */}
        <Breadcrumb.Item
          onClick={() => {
            history.push('/post-mda-thirdparty-evaluation');
          }}
          className='font-chng'
        >
          Third Party Evaluation for MDA
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
          onClick={showToast}
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
        >
          <div>
            <fieldset
              disabled={location.state && location.state.view ? true : false}
            >
              <div className='card'>
                <h4 className='formtitlenew font-chng'>
                  Third Party Evaluation for MDA
                </h4>

                <div className='card-body'>
                  <Row className='mb-4'>
                    <Col className='md-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='stateId'
                          className='form-label font-chng'
                        >
                          State*
                        </label>
                        {/* {stateIdValues && stateIdValues.length !== 0 ? */}
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          options={stateIdList}
                          className={
                            formik.errors.stateId && formik.touched.stateId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            stateIdList
                              ? stateIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.stateId
                                )
                              : ''
                          }
                          name='stateId'
                          isClearable={true}
                          defaultValue={defaultStateValue}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'stateId',
                              option && option.value
                            );
                            getState(option);
                          }}
                        />
                        {/* :
                          <Select name="stateId" isDisabled={location.state && location.state.view ? true : false}
                            styles={commonFunction.customStyles}

                            options={NoneList}
                            isClearable={true}
                            value={NoneList ? NoneList.find(option => option.value === formik.values.stateId) : ''}
                            onChange={(option: Option) => {
                              formik.setFieldValue("stateId", option && option.value);
                              getState(option);
                            }}
                            className={(formik.errors.stateId && formik.touched.stateId ? "custom-select is-invalid"
                              : "custom-select")} >
                          </Select>
                        } */}

                        <div className='invalid-feedback'>
                          {formik.errors.stateId ? formik.errors.stateId : ''}
                        </div>
                      </div>
                    </Col>
                    <Col className='md-3'>
                      <div className='form-group'>
                        <label
                          htmlFor='districtId'
                          className='form-label font-chng'
                        >
                          district*
                        </label>
                        {districtIdValues && districtIdValues.length !== 0 ? (
                          <Select
                            ref={selectDistrictRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='districtId'
                            options={districtIdList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'districtId',
                                option && option.value
                              );
                              getDistrict(option);
                            }}
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
                                      option.value === formik.values.districtId
                                  )
                                : ''
                            }
                          ></Select>
                        ) : (
                          <Select
                            ref={selectDistrictRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='districtId'
                            options={NoneList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'districtId',
                                option && option.value
                              );
                              getDistrict(option);
                            }}
                            className={
                              formik.errors.districtId &&
                              formik.touched.districtId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.districtId
                                  )
                                : ''
                            }
                          ></Select>
                        )}
                        <div className='invalid-feedback'>
                          {formik.errors.districtId
                            ? formik.errors.districtId
                            : ''}
                        </div>
                      </div>
                    </Col>
                    <Col className='md-3'>
                      <div className='form-group'>
                        <label
                          htmlFor='corporationId'
                          className='form-label font-chng'
                        >
                          corporation*
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
                            name='corporationId'
                            value={
                              corporationIdList
                                ? corporationIdList.find(
                                    (option) =>
                                      option.value ===
                                      formik.values.corporationId
                                  )
                                : ''
                            }
                            options={corporationIdList}
                            isClearable={true}
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
                                : 'custom-select'
                            }
                          ></Select>
                        ) : (
                          <Select
                            ref={selectCorporationRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='corporationId'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option && option.value === 0
                                  )
                                : ''
                            }
                            options={NoneList}
                            isClearable={true}
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
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className='invalid-feedback'>
                          {formik.errors.corporationId
                            ? formik.errors.corporationId
                            : ''}
                        </div>
                      </div>
                    </Col>
                    <Col className='md-3'>
                      <div className='form-group'>
                        <label
                          htmlFor='talukaId'
                          className='form-label font-chng'
                        >
                          taluka*
                        </label>
                        {talukaIdValues && talukaIdValues.length !== 0 ? (
                          <Select
                            ref={selectTalukaRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='talukaId'
                            value={
                              talukaIdList
                                ? talukaIdList.find(
                                    (option) =>
                                      option &&
                                      option.value === formik.values.talukaId
                                  )
                                : ''
                            }
                            options={talukaIdList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'talukaId',
                                option && option.value
                              );
                              // getTaluka(option);
                            }}
                            className={
                              formik.errors.talukaId && formik.touched.talukaId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        ) : (
                          <Select
                            ref={selectTalukaRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='talukaId'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option && option.value === 0
                                  )
                                : ''
                            }
                            options={NoneList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'talukaId',
                                option && option.value
                              );
                              // getTaluka(option);
                            }}
                            className={
                              formik.errors.talukaId && formik.touched.talukaId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className='invalid-feedback'>
                          {formik.errors.talukaId ? formik.errors.talukaId : ''}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className='mb-4'>
                    <Col className='md-3'>
                      <div className='form-group'>
                        <label
                          htmlFor='facilityId'
                          className='form-label font-chng'
                        >
                          facility*
                        </label>
                        {facilityIdValues && facilityIdValues.length !== 0 ? (
                          <Select
                            ref={selectFacilityRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='facilityId'
                            value={
                              facilityIdList
                                ? facilityIdList.find(
                                    (option) =>
                                      option.value === formik.values.facilityId
                                  )
                                : ''
                            }
                            options={facilityIdList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'facilityId',
                                option && option.value
                              );
                              getFacility(option);
                            }}
                            className={
                              formik.errors.facilityId &&
                              formik.touched.facilityId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        ) : (
                          <Select
                            ref={selectFacilityRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='facilityId'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option && option.value === 0
                                  )
                                : ''
                            }
                            options={NoneList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'facilityId',
                                option && option.value
                              );
                              getFacility(option);
                            }}
                            className={
                              formik.errors.facilityId &&
                              formik.touched.facilityId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className='invalid-feedback'>
                          {formik.errors.facilityId
                            ? formik.errors.facilityId
                            : ''}
                        </div>
                      </div>
                    </Col>
                    <Col className='md-3'>
                      <div className='form-group'>
                        <label
                          htmlFor='subCenterId'
                          className='form-label font-chng'
                        >
                          subCenter*
                        </label>
                        {subCenterIdValues && subCenterIdValues.length !== 0 ? (
                          <Select
                            ref={selectSubcenterRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='subCenterId'
                            isClearable={true}
                            value={
                              subCenterIdList
                                ? subCenterIdList.find(
                                    (option) =>
                                      option.value === formik.values.subCenterId
                                  )
                                : ''
                            }
                            options={subCenterIdList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'subCenterId',
                                option && option.value
                              );
                              getSubCenter(option);
                            }}
                            className={
                              formik.errors.subCenterId &&
                              formik.touched.subCenterId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        ) : (
                          <Select
                            ref={selectSubcenterRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='subCenterId'
                            isClearable={true}
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option && option.value === 0
                                  )
                                : ''
                            }
                            options={NoneList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'subCenterId',
                                option && option.value
                              );
                              getSubCenter(option);
                            }}
                            className={
                              formik.errors.subCenterId &&
                              formik.touched.subCenterId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className='invalid-feedback'>
                          {formik.errors.subCenterId
                            ? formik.errors.subCenterId
                            : ''}
                        </div>
                      </div>
                    </Col>
                    <Col className='md-3'>
                      <div className='form-group'>
                        <label
                          htmlFor='villageId'
                          className='form-label font-chng'
                        >
                          village*
                        </label>
                        {villageIdValues && villageIdValues.length !== 0 ? (
                          <Select
                            ref={selectVillageRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='villageId'
                            value={
                              villageIdList
                                ? villageIdList.find(
                                    (option) =>
                                      option.value === formik.values.villageId
                                  )
                                : ''
                            }
                            options={villageIdList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'villageId',
                                option && option.value
                              );
                            }}
                            className={
                              formik.errors.villageId &&
                              formik.touched.villageId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        ) : (
                          <Select
                            ref={selectVillageRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='villageId'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option && option.value === 0
                                  )
                                : ''
                            }
                            options={NoneList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'villageId',
                                option && option.value
                              );
                            }}
                            className={
                              formik.errors.villageId &&
                              formik.touched.villageId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className='invalid-feedback'>
                          {formik.errors.villageId
                            ? formik.errors.villageId
                            : ''}
                        </div>
                      </div>
                    </Col>
                    <Col className='md-3'>
                      <div className='form-group'>
                        <label
                          htmlFor='wardId'
                          className='form-label font-chng'
                        >
                          ward*
                        </label>
                        {wardIdValues && wardIdValues.length !== 0 ? (
                          <Select
                            ref={selectWardRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='wardId'
                            value={
                              wardIdList
                                ? wardIdList.find(
                                    (option) =>
                                      option.value === formik.values.wardId
                                  )
                                : ''
                            }
                            options={wardIdList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'wardId',
                                option && option.value
                              );
                            }}
                            className={
                              formik.errors.wardId && formik.touched.wardId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        ) : (
                          <Select
                            ref={selectWardRef}
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='wardId'
                            value={
                              NoneList
                                ? NoneList.find(
                                    (option: any) =>
                                      option && option.value === 0
                                  )
                                : ''
                            }
                            options={NoneList}
                            isClearable={true}
                            defaultValue={NoneList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'wardId',
                                option && option.value
                              );
                            }}
                            className={
                              formik.errors.wardId && formik.touched.wardId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className='invalid-feedback'>
                          {formik.errors.wardId ? formik.errors.wardId : ''}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row className='mb-3'>
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
                            formik.setFieldValue(
                              'month',
                              option && option.value
                            );
                          }}
                          value={
                            monthList
                              ? monthList.find(
                                  (option: any) =>
                                    option &&
                                    option.value == formik.values.month
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
                        <label
                          htmlFor='urbanArea'
                          className='form-label font-chng'
                        >
                          Urban Area
                        </label>
                        <input
                          name='urbanArea'
                          value={
                            formik.values.urbanArea
                              ? formik.values.urbanArea
                              : ''
                          }
                          onChange={formik.handleChange}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          type='text'
                          className='form-control'
                        />
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfInvestigator'
                          className='form-label font-chng'
                        >
                          Name of Investigator
                        </label>
                        <input
                          name='nameOfInvestigator'
                          value={
                            formik.values.nameOfInvestigator
                              ? formik.values.nameOfInvestigator
                              : ''
                          }
                          onChange={formik.handleChange}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          type='text'
                          className='form-control'
                        ></input>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='dateOfInvestigation'
                          className='form-label font-chng'
                        >
                          Date of Investigation
                        </label>
                        <input
                          name='dateOfInvestigation'
                          value={
                            formik.values.dateOfInvestigation
                              ? formik.values.dateOfInvestigation
                              : ''
                          }
                          onChange={formik.handleChange}
                          type='date'
                          className='form-control'
                        ></input>
                      </div>
                    </div>
                  </Row>

                  <Row className='mb-3'>
                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfHeadOfFamily'
                          className='form-label font-chng'
                        >
                          Name of head of Family
                        </label>
                        <input
                          name='nameOfHeadOfFamily'
                          value={
                            formik.values.nameOfHeadOfFamily
                              ? formik.values.nameOfHeadOfFamily
                              : ''
                          }
                          onChange={formik.handleChange}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          type='text'
                          className='form-control'
                        ></input>
                      </div>
                    </div>
                    {/* </Row>

                  <Row className="mb-3"> */}
                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfPersonInterviewed'
                          className='form-label font-chng'
                        >
                          Name of Person Interviewed
                        </label>
                        <input
                          name='nameOfPersonInterviewed'
                          value={
                            formik.values.nameOfPersonInterviewed
                              ? formik.values.nameOfPersonInterviewed
                              : ''
                          }
                          onChange={formik.handleChange}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          type='text'
                          className='form-control'
                        ></input>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='totalMembersInFamily'
                          className='form-label font-chng'
                        >
                          Total Members in the Family
                        </label>
                        <input
                          name='totalMembersInFamily'
                          value={formik.values.totalMembersInFamily}
                          onChange={formik.handleChange}
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          className='form-control'
                        ></input>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='noMembersInterviewed'
                          className='form-label font-chng'
                        >
                          Number of Members interviewed
                        </label>
                        <input
                          name='noMembersInterviewed'
                          value={formik.values.noMembersInterviewed}
                          onChange={formik.handleChange}
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          className='form-control'
                        ></input>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>

              <div className='card'>
                <div className='card-body form-view'>
                  {formPersonFieldArray()}
                </div>
              </div>
            </fieldset>
            <div className='card post-wrap' style={{ padding: '40px' }}>
              <div className='card-body'>
                <Row className='mb-3'>
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <div className='col-md-6 col-xl-6'>
                      <div className='form-grp'>
                        <span className='q-no font-chng'>Q. 1.</span>
                        <label
                          htmlFor='mdaUndertakenOnFrom'
                          className='form-label font-chng'
                        >
                          MDA was undertaken From
                        </label>
                        <input
                          name='mdaUndertakenOnFrom'
                          value={
                            formik.values.mdaUndertakenOnFrom
                              ? formik.values.mdaUndertakenOnFrom
                              : ''
                          }
                          onChange={formik.handleChange}
                          type='date'
                          className={
                            formik.errors.mdaUndertakenOnFrom &&
                            formik.touched.mdaUndertakenOnFrom
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                        ></input>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-6'>
                      <div className='form-grp'>
                        <label
                          htmlFor='mdaUndertakenOnTo'
                          className='form-label font-chng'
                        >
                          MDA was undertaken To
                        </label>
                        <input
                          name='mdaUndertakenOnTo'
                          value={
                            formik.values.mdaUndertakenOnTo
                              ? formik.values.mdaUndertakenOnTo
                              : ''
                          }
                          className={
                            formik.errors.mdaUndertakenOnTo &&
                            formik.touched.mdaUndertakenOnTo
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          onChange={formik.handleChange}
                          type='date'
                        ></input>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.mdaUndertakenOnTo : ''}
                        </div>
                      </div>
                    </div>

                    <Row>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
                            1.1) Whether DEC tablets recovered from family
                            members
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDECTabletsRecovered'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDECTabletsRecovered === 'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDECTabletsRecovered'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDECTabletsRecovered ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
                            Number of tablets recovered
                          </label>
                          <input
                            name='noDECTabletsRecovered'
                            value={formik.values.noDECTabletsRecovered}
                            onChange={formik.handleChange}
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            //   onInput={(event)=>commonFunction.onlyAlphabets(event)}
                            // onKeyPress={(e) => commonFunction.keyPress(e)}
                            className='form-control'
                            disabled={
                              formik.values.isDECTabletsRecovered === 'true'
                                ? false
                                : true
                            }
                          ></input>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-12 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 2.</span>
                          <label className='form-label font-chng'>
                            Why did the particular person in your family had not
                            taken the drug ?
                          </label>
                          <textarea
                            name='resonNotTakingDrug'
                            value={
                              formik.values.resonNotTakingDrug
                                ? formik.values.resonNotTakingDrug
                                : ''
                            }
                            onChange={formik.handleChange}
                            className='form-control'
                          />
                        </div>
                      </div>
                    </Row>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 3.</span>
                          <label className='form-label font-chng'>
                            Did the drug administrator came to your house and
                            administered the drug ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDrugAdministeredInHouse'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDrugAdministeredInHouse ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDrugAdministeredInHouse'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDrugAdministeredInHouse ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 4.</span>
                          <label className='form-label font-chng'>
                            Did he ensure that you and your family members
                            actually swallow the drug in his /her presence ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDDEnsureSwallowInPresence'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDDEnsureSwallowInPresence ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDDEnsureSwallowInPresence'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDDEnsureSwallowInPresence ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 5.</span>
                          <label className='form-label font-chng'>
                            Did you or any member of your family swallow the
                            tablets in the presence of drug administrator ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDrugSwallowInDDPresence'
                                onChange={(e) => handleDrugAdmin(e)}
                                defaultChecked={
                                  formik.values.approachShouldFollow == 0
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDrugSwallowInDDPresence'
                                onChange={(e) => handleDrugAdmin(e)}
                                defaultChecked={
                                  formik.values.approachShouldFollow === 1
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 6.</span>
                          <label className='form-label font-chng'>
                            If No, what are the reasons for not swallowing the
                            drug before the drug administrator ?
                          </label>

                          <Select
                            name='reasonForNotSwallowDrug'
                            isDisabled={drugShow ? true : false}
                            ref={selectDrugAdminRef}
                            styles={commonFunction.customStyles}
                            className='custom-select'
                            // value={formik.values.typeOfTASSB}
                            // onChange={(e) => handleChangeData(e)}
                            isClearable='true'
                            // onChange={(e) => hidesourcerounddist(e)}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'reasonForNotSwallowDrug',
                                option && option.value
                              );
                              handleChangeData(option);
                            }}
                            value={
                              ReasonNotSwallowValues
                                ? ReasonNotSwallowValues.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.reasonForNotSwallowDrug
                                  )
                                : ''
                            }
                            options={ReasonNotSwallowValues}
                          ></Select>

                          {/* <Select
                      className="custom-select"
                      name="reasonForNotSwallowDrug"
                      isClearable="true"
                      onChange={(option: Option) => {
                        formik.setFieldValue("reasonForNotSwallowDrug", option && option.value);
                                              }}
                      value={
                        ReasonNotSwallowValues
                          ? ReasonNotSwallowValues.find(
                              (option: any) =>
                                option && option.value === formik.values.reasonForNotSwallowDrug
                            )
                          : ""
                      }
                      options={ReasonNotSwallowValues}
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                    /> */}

                          {/* <textarea
                            name="resonForNotSwallowDrug"
                            value={
                              formik.values.resonForNotSwallowDrug
                                ? formik.values.resonForNotSwallowDrug
                                : ""
                            }
                            onChange={formik.handleChange}
                            className="form-control"
                          /> */}
                        </div>
                      </div>
                    </Row>

                    {hideSwallowData && (
                      <div className='col-xl-6 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='reasonForNotSwallowDrugOther'
                            className='form-label font-chng'
                          >
                            Other Specify
                          </label>
                          <input
                            type='text'
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            className='form-control'
                            name='reasonForNotSwallowDrugOther'
                            value={formik.values.reasonForNotSwallowDrugOther}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                    )}

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 7.</span>
                          <label className='form-label font-chng'>
                            Did the drug administrator persuade swallowing of
                            the drug in his presence ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDDPersuadeSwallowDrug'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDDPersuadeSwallowDrug ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDDPersuadeSwallowDrug'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDDPersuadeSwallowDrug ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 8.</span>
                          <label className='form-label font-chng'>
                            Did you help the drug administrator for drug
                            compliance in your mohalla or village?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isHelpedDDInDrugCompliance'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isHelpedDDInDrugCompliance ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isHelpedDDInDrugCompliance'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isHelpedDDInDrugCompliance ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 9.</span>
                          <label className='form-label font-chng'>
                            Do you have any reservation about the drug
                            administrator ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isReservationAboutDD'
                                onChange={(e) => handleAdmin(e)}
                                defaultChecked={
                                  formik.values.isReservationAboutDD === 'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isReservationAboutDD'
                                onChange={(e) => handleAdmin(e)}
                                defaultChecked={
                                  formik.values.isReservationAboutDD === 'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <div className='form-grp'>
                      <div className='d-flex'>
                        <div className='pe-3'>
                          <span className='q-no font-chng'>Q. 10.</span>
                          <label className='form-label font-chng'>
                            If Yes, Specify reservation about the drug
                            administrator
                          </label>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-6'>
                        {/* <input
                            type="text"
                            onInput={(event)=>commonFunction.onlyAlphabets(event)}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                            name="reservationDrugAdmin"
                            value={
                              formik.values.reservationDrugAdmin
                                ? formik.values.reservationDrugAdmin
                                : ""
                            }
                            onChange={formik.handleChange}
                            className="form-control"
                          /> */}

                        {/* <Select
                      className="custom-select"
                      name="reservationDrugAdmin"
                      isClearable="true"
                      onChange={(option: Option) => {
                        formik.setFieldValue("reservationDrugAdmin", option && option.value);
                                              }}
                      value={
                        ReservationDrugAdminValues
                          ? ReservationDrugAdminValues.find(
                              (option: any) =>
                                option && option.value === formik.values.reservationDrugAdmin
                            )
                          : ""
                      }
                      options={ReservationDrugAdminValues}
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                    /> */}

                        <Select
                          name='reservationDrugAdmin'
                          isDisabled={drugAdminShow ? true : false}
                          ref={selectAdminRef}
                          styles={commonFunction.customStyles}
                          className='custom-select'
                          // value={formik.values.typeOfTASSB}
                          // onChange={(e) => handleChangeData(e)}
                          isClearable='true'
                          // onChange={(e) => hidesourcerounddist(e)}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'reservationDrugAdmin',
                              option && option.value
                            );
                            handleChangeData1(option);
                          }}
                          value={
                            ReservationDrugAdminValues
                              ? ReservationDrugAdminValues.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.reservationDrugAdmin
                                )
                              : ''
                          }
                          options={ReservationDrugAdminValues}
                        ></Select>
                      </div>
                    </div>

                    {hideReservedrugData && (
                      <div className='col-xl-6 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='reservationDrugAdminOther'
                            className='form-label font-chng'
                          >
                            Other Specify
                          </label>
                          <input
                            type='text'
                            disabled={drugAdminShow ? true : false}
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            className='form-control'
                            name='reservationDrugAdminOther'
                            value={formik.values.reservationDrugAdminOther}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                    )}

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <label className='form-label font-chng'>
                            In your opinion, Who should be given the
                            responsibility of DEC drug administration ?
                          </label>
                          <textarea
                            name='speciFyResponsibilityOfDD'
                            disabled={drugAdminShow ? true : false}
                            value={
                              formik.values.speciFyResponsibilityOfDD
                                ? formik.values.speciFyResponsibilityOfDD
                                : ''
                            }
                            onChange={formik.handleChange}
                            className='form-control'
                          />
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 11.</span>
                          <label className='form-label font-chng'>
                            Did the drug administrator explain to you or your
                            family members about why the DEC drug is being
                            administered ? Other details like regarding drug
                            intake on elimination of LF and the details of
                            transmission ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDDExplainToYouDetails'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDDExplainToYouDetails ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isDDExplainToYouDetails'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.isDDExplainToYouDetails ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 12.</span>
                          <label className='form-label font-chng'>
                            According to you, which approach should be followed
                            ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='approachShouldFollow'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.approachShouldFollow === 0
                                }
                                value='0'
                              />
                              House to house administration of DEC drug
                            </label>
                            <div role='group' aria-labelledby='my-radio-group'>
                              <label className='form-label font-chng'>
                                <Field
                                  type='radio'
                                  name='approachShouldFollow'
                                  onChange={formik.handleChange}
                                  defaultChecked={
                                    formik.values.approachShouldFollow === 1
                                  }
                                  value='1'
                                />
                                Booth Approach
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <label className='form-label font-chng'>Why?</label>
                          <textarea
                            name='resonToFollowApproach'
                            value={
                              formik.values.resonToFollowApproach
                                ? formik.values.resonToFollowApproach
                                : ''
                            }
                            onChange={formik.handleChange}
                            className='form-control'
                          />
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 13.</span>
                          <label className='form-label font-chng'>
                            Did you have prior information about MDA with DEC,
                            recommended dosages, contraindications and side
                            reactions of DEC ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isPriorInfoAboutMDAwithDE'
                                onChange={(e) => handleDose(e)}
                                defaultChecked={
                                  formik.values.isPriorInfoAboutMDAwithDE ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isPriorInfoAboutMDAwithDE'
                                onChange={(e) => handleDose(e)}
                                defaultChecked={
                                  formik.values.isPriorInfoAboutMDAwithDE ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 14.</span>
                          <label className='form-label font-chng'>
                            If Yes, What are the sources of information ?
                          </label>
                          <textarea
                            disabled={doseShow ? true : false}
                            name='sourceOfInformation'
                            value={
                              formik.values.sourceOfInformation
                                ? formik.values.sourceOfInformation
                                : ''
                            }
                            onChange={formik.handleChange}
                            className='form-control'
                          />
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 15.</span>
                          <label className='form-label font-chng'>
                            Did you read or see any banner, Poster, newspaper,
                            advertisement, Handbill, Mike announcement, street
                            play, drama, TV/Radio sports etc. on MDA ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isReadOrSeeAnyInfo'
                                onChange={(e) => ReadOnly(e)}
                                defaultChecked={
                                  formik.values.isReadOrSeeAnyInfo === 'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isReadOrSeeAnyInfo'
                                onChange={(e) => ReadOnly(e)}
                                defaultChecked={
                                  formik.values.isReadOrSeeAnyInfo === 'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>
                    {/* {showOthersWhereseeinfo && ( */}

                    <>
                      <div className='mb-3 d-flex'>
                        <div className='pe-3'>
                          <div className='form-grp'>
                            <span className='q-no font-chng'>Q. 16.</span>
                            <label className='form-label font-chng'>
                              If Yes, Where ?
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-6'>
                        <MultiSelect
                          disabled={readShow ? true : false}
                          options={whereReadOrSeeOptions}
                          value={whereReadOrSeeInfoselectedOption}
                          onChange={changeWhereReadorSee}
                          labelledBy='Select'
                        />
                      </div>
                      <br></br>

                      {/* )} */}
                      {showOthersWhereseeinfo && (
                        <div className='col-xl-6 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='whereReadOrSeeInfoOthers'
                              className='form-label font-chng'
                            >
                              Other Specify
                            </label>
                            <input
                              type='text'
                              disabled={readShow ? true : false}
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              className='form-control'
                              name='whereReadOrSeeInfoOthers'
                              value={formik.values.whereReadOrSeeInfoOthers}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </div>
                      )}

                      <Row className='mb-3'>
                        <label className='form-label font-chng'>
                          Which are the most effective ones ? (Specify in the
                          order of Priority with comma)
                        </label>
                        <div className='col-md-6 col-xl-6'>
                          <div className='form-grp'>
                            <Select
                              className='custom-select'
                              name='whichIsMostEffective'
                              isClearable='true'
                              // isDisabled={readShow?true:false}
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  'whichIsMostEffective',
                                  option && option.value
                                );
                              }}
                              value={
                                whereReadOrSeeOptions
                                  ? whereReadOrSeeOptions.find(
                                      (option: any) =>
                                        option &&
                                        option.value ===
                                          formik.values.whichIsMostEffective
                                    )
                                  : ''
                              }
                              options={whereReadOrSeeOptions}
                              isDisabled={readShow ? true : false}
                            />
                            {/* <input
                            type="text"
                        //     onInput={(event)=>commonFunction.onlyAlphabets(event)}
                        //  onKeyPress={(e) => commonFunction.keyPress(e)}
                            className="form-control"
                            name="whichIsMostEffective"
                            value={
                              formik.values.whichIsMostEffective
                                ? formik.values.whichIsMostEffective
                                : ""
                            }
                            onChange={formik.handleChange}
                          /> */}
                          </div>
                        </div>
                      </Row>
                    </>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 17.</span>
                          <label className='form-label font-chng'>
                            Did you or any member of your family experience any
                            side effects of DEC ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isYouExperienceSideEffects'
                                // onChange={formik.handleChange}
                                onChange={(e) => {
                                  SideEffectHandle(e);
                                }}
                                onClick={() =>
                                  setSideEffectShow((prevState) => !prevState)
                                }
                                defaultChecked={
                                  formik.values.isYouExperienceSideEffects ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isYouExperienceSideEffects'
                                //  onChange={formik.handleChange}
                                onChange={(e) => {
                                  SideEffectHandle(e);
                                }}
                                onClick={() =>
                                  setSideEffectShow((prevState) => !prevState)
                                }
                                defaultChecked={
                                  formik.values.isYouExperienceSideEffects ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <label className='form-label font-chng'>
                            <span className='q-no font-chng'>Q. 18</span>
                            Number of Members ExperienceSideEffects
                          </label>
                          <div className='col-md-12 col-xl-12'>
                            <input
                              type='number'
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                              // disabled ={formik.values.isYouExperienceSideEffects === "true" ? false : true}
                              name='noMembersExperienceSideEffects'
                              value={
                                formik.values.noMembersExperienceSideEffects
                              }
                              className='form-control'
                            />
                          </div>
                        </div>
                      </div>
                    </Row>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 19.</span>
                          <label className='form-label font-chng'>
                            If Yes, What kind of side effects and for how long ?
                          </label>
                          {/* <textarea
                            name="detailsOfSideEffects"
                            value={
                              formik.values.detailsOfSideEffects
                                ? formik.values.detailsOfSideEffects
                                : ""
                            }
                            onChange={formik.handleChange}
                            className="form-control"
                          /> */}
                          <MultiSelect
                            //ref={selectSideEffectRef}
                            //filterOptions={selectSideEffectRef}
                            //disabled ={formik.values.isYouExperienceSideEffects === "true" ? false : true}
                            disabled={sideEffectShow ? true : false}
                            options={detailsOfSideEffectsOptions}
                            value={detailsofSideSelectedOption}
                            onChange={changeDetailsofSideEffect}
                            labelledBy='Select'
                          />
                        </div>
                      </div>
                    </Row>

                    {showOthersDetailsofEffect && (
                      <div className='col-xl-6 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='detailsOfSideEffectsOther'
                            className='form-label font-chng'
                          >
                            Other Specify
                          </label>
                          <input
                            type='text'
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            className='form-control'
                            name='detailsOfSideEffectsOther'
                            value={formik.values.detailsOfSideEffectsOther}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                    )}
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 20.</span>
                          <label className='form-label font-chng'>
                            Did you seek remedy for the same ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isYouSeekRemedy'
                                onChange={(e) => remedyHandle(e)}
                                defaultChecked={
                                  formik.values.isYouSeekRemedy === 'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='isYouSeekRemedy'
                                onChange={(e) => remedyHandle(e)}
                                defaultChecked={
                                  formik.values.isYouSeekRemedy === 'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 21.</span>
                          <label className='form-label font-chng'>
                            If Yes, Whom did you approach for seeking remedial
                            measures ? Did you consult Govt. Health Center/
                            Govt. Hospital or private practitioner ?
                          </label>
                          {/* <textarea
                            name="deatilsOfRemedyTaken"
                            value={
                              formik.values.deatilsOfRemedyTaken
                                ? formik.values.deatilsOfRemedyTaken
                                : ""
                            }
                            onChange={formik.handleChange}
                            className="form-control"
                          /> */}
                          {/*    
<Select
                      className="custom-select"
                      name="detailsOfRemedyTaken"
                      isClearable="true"
                      onChange={(option: Option) => {
                        formik.setFieldValue("detailsOfRemedyTaken", option && option.value);
                                              }}
                      value={
                        detailsOfRemedyTakenOptions
                          ? detailsOfRemedyTakenOptions.find(
                              (option: any) =>
                                option && option.value === formik.values.detailsOfRemedyTaken
                            )
                          : ""
                      }
                      options={detailsOfRemedyTakenOptions}
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                     
                    /> */}

                          <Select
                            name='detailsOfRemedyTaken'
                            isDisabled={remedyShow ? true : false}
                            ref={selectRemedyRef}
                            styles={commonFunction.customStyles}
                            className='custom-select'
                            // value={formik.values.typeOfTASSB}
                            // onChange={(e) => handleChangeData(e)}
                            isClearable='true'
                            // onChange={(e) => hidesourcerounddist(e)}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'detailsOfRemedyTaken',
                                option && option.value
                              );
                              handleChangeData2(option);
                            }}
                            value={
                              detailsOfRemedyTakenOptions
                                ? detailsOfRemedyTakenOptions.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.detailsOfRemedyTaken
                                  )
                                : ''
                            }
                            options={detailsOfRemedyTakenOptions}
                          ></Select>
                        </div>
                      </div>
                    </Row>

                    {hideRemedyTakenData && (
                      <div className='col-xl-6 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='detailsOfRemedyTakenOther'
                            className='form-label font-chng'
                          >
                            Other Specify
                          </label>
                          <input
                            type='text'
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            className='form-control'
                            name='detailsOfRemedyTakenOther'
                            value={formik.values.detailsOfRemedyTakenOther}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                    )}

                    <Row className='mb-3'>
                      <div className='col-md-12'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 22.</span>
                          <label className='form-label font-chng'>
                            Did you receive treatment for any other ailment
                            before experiencing side effects of DEC ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='IsYouReceiveTreatmentOtherAilment'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values
                                    .IsYouReceiveTreatmentOtherAilment ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='IsYouReceiveTreatmentOtherAilment'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values
                                    .IsYouReceiveTreatmentOtherAilment ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 23.</span>
                          <label className='form-label font-chng'>
                            Do anyone of your family members or neighbour or
                            person in your village suffer from LF disease ?
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='IsAnyFamilySufferLF'
                                onChange={(e) => familyHandle(e)}
                                defaultChecked={
                                  formik.values.IsAnyFamilySufferLF === 'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='IsAnyFamilySufferLF'
                                onChange={(e) => familyHandle(e)}
                                defaultChecked={
                                  formik.values.IsAnyFamilySufferLF === 'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>

                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <span className='q-no font-chng'>Q. 24.</span>
                          <label className='form-label font-chng'>
                            If Yes, Name the familyMembers
                          </label>
                        </div>
                      </div>
                      <div className='form-view'>{formFamilyFieldArray()}</div>
                    </Row>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-6'>
                        <div className='form-grp'>
                          <label className='form-label font-chng'>
                            Record any other relevant information on MDA
                          </label>
                          <textarea
                            disabled={familyShow ? true : false}
                            name='OtherRelevantInfoOnMDA'
                            value={
                              formik.values.OtherRelevantInfoOnMDA
                                ? formik.values.OtherRelevantInfoOnMDA
                                : ''
                            }
                            onChange={formik.handleChange}
                            className='form-control'
                          />
                        </div>
                      </div>
                    </Row>
                    <Row className='mb-3'>
                      <div className='col-md-4 col-xl-3'>
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
                            Date
                          </label>
                          <input
                            name='DateOfEvaluation'
                            value={
                              formik.values.DateOfEvaluation
                                ? formik.values.DateOfEvaluation
                                : ''
                            }
                            onChange={formik.handleChange}
                            type='date'
                            className='form-control'
                          ></input>
                        </div>
                      </div>
                      <div className='col-md-4 col-xl-3'>
                        <div className='form-grp'>
                          <label className='form-label font-chng'>
                            Verified by Investigator
                          </label>
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='IsVerifiedByInvestigator'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.IsVerifiedByInvestigator ===
                                  'true'
                                }
                                value='true'
                              />
                              Yes
                            </label>
                            <label className='form-label font-chng'>
                              <Field
                                type='radio'
                                name='IsVerifiedByInvestigator'
                                onChange={formik.handleChange}
                                defaultChecked={
                                  formik.values.IsVerifiedByInvestigator ===
                                  'false'
                                }
                                value='false'
                              />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </fieldset>
                  <Row className='mb-3'>
                    {/* <div className="form-grp text-right">
                      <button
                        type="submit"
                        className="btn btn-outline-light font-chng"
                        onClick={() => history.push(listDESheetName)}
                      >
                        Cancel
                      </button>
                      {((location.state && !location.state.view) || (!location.state)) &&
                        <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary font-chng"
                          disabled={location && location.state && location.state.id ? true : false}
                          onClick={() => {
                            formik.setFieldValue("status", "Draft");
                          }}
                          style={{ marginRight: 10 }}
                        >Save As Draft</button>}
                      {((location.state && !location.state.view) || (!location.state)) && isOnline &&
                        <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary font-chng"
                          disabled={!isOnline}
                          onClick={() => {
                            formik.setFieldValue("status", "Active");
                          }}
                        >Save</button>
                      }
                    </div> */}
                  </Row>
                </Row>
              </div>
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
              <i className='fas fa-arrow-left'></i>&nbsp; Back{' '}
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
                  className='btn font-chng'
                  onClick={() => {
                    formik.setFieldValue('status', 'Draft');
                  }}
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
                  disabled={!isOnline ? (isDisabled ? true : false) : false}
                  onClick={() => {
                    formik.setFieldValue('status', 'Active');
                  }}
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
              )}
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default AddPostMDAThirdParty;

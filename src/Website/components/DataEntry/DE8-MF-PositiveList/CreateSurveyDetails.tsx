import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { object } from 'yup/lib/locale';
import { FormikProvider, useFormik, Field } from 'formik';
import DropdownService from '../../../services/DropdownService';
import { positiveSurveyData } from '../../../interfaces/FormMFPositive';
import { mfSurveyData } from './MFPositiveStepperConfig';
import MfPositiveService from '../../../services/MfPositiveService';
import { useLocation } from 'react-router';
import moment from 'moment';
import { toast } from 'react-toastify';
import mfPositiveDraftServices from '../../../draftServices/FormMFPositiveDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import commonFunction from '../../../../helpers/common/common';

const SurveyDetails = (props: any) => {
  const [surveyInformation, setSurveyInfo] =
    useState<positiveSurveyData>(mfSurveyData);
  const { setBSState } = props;
  const [noOfBSFoundPositive, setNoOfBSFoundPositive] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [surveyDetail, setSurveyDetail] = useState([]);
  let isValidDate = moment().format('YYYY-MM-DD');

  let isOnline = window.navigator.onLine;
  const survey: any = {
    surveyInfo: [
      surveyInformation,
      surveyInformation,
      surveyInformation,
      surveyInformation,
      surveyInformation,
    ],
  };
  const [surveyInfoObject, setSurveyInfoObject] = useState<any>(survey);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const location: any = useLocation();
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);

  useEffect(() => {
    getSurveyInfo();
    getFieldUnitInfo();
  }, []);

  const getSurveyInfo = async () => {
    let getOneResult: any;
    let recordId;
    if (location && location.state && location.state.mfId) {
      getOneResult = await MfPositiveService.getMfPositiveSurveyList(
        location.state.mfId
      );
      if (getOneResult && getOneResult.data) {
        console.log('getSurveyInfo :: ', getOneResult.data);
        setSurveyInfoObject(getOneResult.data);
      }
    } else {
      if (location && location.state && location.state.UUID) {
        recordId = location.state.UUID;
      } else if (props && props.mfPositiveLineListUUID) {
        recordId = props.mfPositiveLineListUUID;
      }
      if (recordId) {
        getOneResult = await mfPositiveDraftServices.getOneMFPositiveLineList(
          recordId
        );
        if (getOneResult) {
          console.log('getSurveyInfo :: ', getOneResult);
          if (!(getOneResult && getOneResult.surveyInfo)) {
            getOneResult = survey;
            console.log('getOneResult', getOneResult);
          }
          setSurveyInfoObject(getOneResult);
        }
      }
    }
    getDropDown();
  };

  const getFieldUnitInfo = async () => {
    let recordId;
    if (location && location.state && location.state.mfId) {
      recordId = location.state.mfId;
      const getOneResult: any = await MfPositiveService.getOneMfPositiveList(
        recordId
      );
      if (getOneResult && getOneResult.data[0]) {
        setNoOfBSFoundPositive(getOneResult.data[0].noOfBSFoundPositive);
      }
    } else {
      if (location && location.state && location.state.UUID) {
        recordId = location.state.UUID;
      } else if (props && props.mfPositiveLineListUUID) {
        recordId = props.mfPositiveLineListUUID;
      }
      console.log('props1 back :: ', props);
      if (recordId) {
        const getOneResult: any =
          await mfPositiveDraftServices.getOneMFPositiveLineList(recordId);
        if (getOneResult) {
          setNoOfBSFoundPositive(getOneResult.noOfBSFoundPositive);
        }
      }
    }
  };

  async function getDropDown() {
    const id: any = 1013;
    if (isOnline) {
      const surveydetail: any = await DropdownService.getDetailsSurvey(id);
      if (surveydetail && surveydetail.data) {
        console.log('surveydetail.data', surveydetail.data);
        setSurveyDetail(surveydetail.data);
      }
    } else {
      const surveydetail: any =
        await DexieOfflineDataBase.getUnitActionCatagoryCodeOffline(id);
      if (surveydetail) {
        setSurveyDetail(surveydetail);
      }
    }
  }

  async function saveSurvey(postdata: any) {
    let id;
    if (location && location.state && location.state.id) {
      id = location.state.id;
      if (postdata && postdata.id) {
        postdata.lastModifiedBy = props && props.userSessionId;
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
      }
      let postResult = await MfPositiveService.updateMfPositiveSurveyList(
        postdata,
        id
      );
      if (postResult && postResult.data) {
        console.log('post HF Followups info:: ', postResult.data);
      }
    }
  }

  const onSubmit = async (values) => {
    setBSState(values.surveyInfo[1].dateOfAction);
    console.log(values, 'val');
    if (location && location.state && location.state.view) {
      props.handleNext(values);
    } else {
      let mfPositiveLineListId;

      let step1PropsData: any = {};
      step1PropsData = Object.assign({}, props);
      step1PropsData.noOfBSFoundPositive = noOfBSFoundPositive
        ? noOfBSFoundPositive
        : 0;
      step1PropsData.unitOfAction = step1PropsData.unitOfAction
        ? step1PropsData.unitOfAction
        : 0;
      step1PropsData.nameOfUnit = step1PropsData.nameOfUnit
        ? step1PropsData.nameOfUnit
        : 0;
      step1PropsData.town = step1PropsData.town ? step1PropsData.town : 0;
      step1PropsData.corporationId = step1PropsData.corporationId
        ? step1PropsData.corporationId
        : 0;
      step1PropsData.districtId = step1PropsData.districtId
        ? step1PropsData.districtId
        : 0;
      step1PropsData.facilityId = step1PropsData.facilityId
        ? step1PropsData.facilityId
        : 0;
      step1PropsData.subCenterId = step1PropsData.subCenterId
        ? step1PropsData.subCenterId
        : 0;
      step1PropsData.talukaId = step1PropsData.talukaId
        ? step1PropsData.talukaId
        : 0;
      step1PropsData.villageId = step1PropsData.villageId
        ? step1PropsData.villageId
        : 0;
      step1PropsData.createdBy = step1PropsData.createdBy
        ? step1PropsData.createdBy
        : 0;
      step1PropsData.lastModifiedBy = step1PropsData.lastModifiedBy
        ? step1PropsData.lastModifiedBy
        : 0;
      step1PropsData.nameOfFilariaFieldUnit =
        step1PropsData.nameOfFilariaFieldUnit
          ? step1PropsData.nameOfFilariaFieldUnit
          : 0;
      values.surveyInfo.forEach(function (value) {
        value.noOfPersonsMale0to4 = value.noOfPersonsMale0to4
          ? value.noOfPersonsMale0to4
          : 0;
        value.noOfPersonsMale5to14 = value.noOfPersonsMale5to14
          ? value.noOfPersonsMale5to14
          : 0;
        value.noOfPersonsMale15to39 = value.noOfPersonsMale15to39
          ? value.noOfPersonsMale15to39
          : 0;
        value.noOfPersonsMale40Plus = value.noOfPersonsMale40Plus
          ? value.noOfPersonsMale40Plus
          : 0;
        value.noOfPersonsFemale0to4 = value.noOfPersonsFemale0to4
          ? value.noOfPersonsFemale0to4
          : 0;
        value.noOfPersonsFemale5to14 = value.noOfPersonsFemale5to14
          ? value.noOfPersonsFemale5to14
          : 0;
        value.noOfPersonsFemale15to39 = value.noOfPersonsFemale15to39
          ? value.noOfPersonsFemale15to39
          : 0;
        value.noOfPersonsFemale40Plus = value.noOfPersonsFemale40Plus
          ? value.noOfPersonsFemale40Plus
          : 0;
        value.noOfPersonsTG0to4 = value.noOfPersonsTG0to4
          ? value.noOfPersonsTG0to4
          : 0;
        value.noOfPersonsTG5to14 = value.noOfPersonsTG5to14
          ? value.noOfPersonsTG5to14
          : 0;
        value.noOfPersonsTG15to39 = value.noOfPersonsTG15to39
          ? value.noOfPersonsTG15to39
          : 0;
        value.noOfPersonsTG40Plus = value.noOfPersonsTG40Plus
          ? value.noOfPersonsTG40Plus
          : 0;
      });
      if (
        values.surveyInfo[1].dateOfAction > values.surveyInfo[2].dateOfAction
      ) {
        setShowErrorMessage(true);
        return;
      }
      if (location && location.state && location.state.mfId) {
        setIsDisabled(true);
        step1PropsData = surveyInfoObject;
        values.lastModifiedBy = props && props.userSessionId;
        const fieldUnitResponse = await MfPositiveService.updateMfPositiveList(
          step1PropsData,
          location.state.mfId
        );
        setIsDisabled(false);
        if (fieldUnitResponse && fieldUnitResponse.data) {
          console.log(
            'step 2:: fieldUnit update response:: ',
            fieldUnitResponse.data
          );
          const getOneResult: any =
            await MfPositiveService.getOneMfPositiveList(location.state.mfId);
          setIsDisabled(true);
          setNoOfBSFoundPositive(getOneResult.data[0].noOfBSFoundPositive);
          values.lastModifiedBy = props && props.userSessionId;
          const surveyResponse =
            await MfPositiveService.updateMfPositiveSurveyList(
              values,
              location.state.mfId
            );
          setIsDisabled(false);
          if (surveyResponse && surveyResponse.data) {
            console.log(
              'step 2:: survey Details update response:: ',
              surveyResponse.data
            );
            props.handleNext(getOneResult.data[0]);
          }
        }
      } else if (location && location.state && location.state.UUID) {
        console.log('location.state.UUID', values);
        console.log('step1PropsData', props);
        mfPositiveLineListId = location.state.UUID;
        const step1GetOneResult: any =
          await mfPositiveDraftServices.getOneMFPositiveLineList(
            mfPositiveLineListId
          );
        console.log('step1GetOneResult', step1GetOneResult);
        step1GetOneResult.noOfBSFoundPositive = noOfBSFoundPositive;
        step1GetOneResult.surveyInfo = values.surveyInfo;
        const fieldUnitResponse: any =
          await mfPositiveDraftServices.updateMFPositiveLineList(
            mfPositiveLineListId,
            step1GetOneResult
          );
        props.handleNext(step1GetOneResult);
      } else {
        if (props.mfPositiveLineListSurveyUUID) {
          console.log('VAlue.Props.surveyUUID', values);
          mfPositiveLineListId = props.mfPositiveLineListId;
          values.lastModifiedBy = props && props.userSessionId;
          const step1GetOneResult: any =
            await mfPositiveDraftServices.getOneMFPositiveLineList(
              mfPositiveLineListId
            );
          console.log('step1GetOneResult', step1GetOneResult);
          step1GetOneResult.noOfBSFoundPositive = noOfBSFoundPositive;
          step1GetOneResult.surveyInfo = values.surveyInfo;
          const fieldUnitResponse: any =
            await mfPositiveDraftServices.updateMFPositiveLineList(
              mfPositiveLineListId,
              step1GetOneResult
            );
          props.handleNext(step1GetOneResult);
        } else {
          console.log('VAlue.UUID');
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          mfPositiveLineListId = props.mfPositiveLineListUUID;
          const step1GetOneResult: any =
            await mfPositiveDraftServices.getOneMFPositiveLineList(
              mfPositiveLineListId
            );
          console.log('step1GetOneResult', step1GetOneResult);
          step1GetOneResult.noOfBSFoundPositive = noOfBSFoundPositive;
          step1GetOneResult.surveyInfo = values.surveyInfo;
          const fieldUnitResponse: any =
            await mfPositiveDraftServices.updateMFPositiveLineList(
              mfPositiveLineListId,
              step1GetOneResult
            );
          props.handleNext(step1GetOneResult);

          /* values.mfPositiveLineListId = mfPositiveLineListId;
          console.log("mfPositiveLineId", values.mfPositiveLineId)
          const fieldUnitResponse: any = await mfPositiveDraftServices.updateMFPositiveLineList(mfPositiveLineId , step1PropsData);
          if (fieldUnitResponse) {
            console.log("step 2:: fieldUnit update response:: ", fieldUnitResponse);
            const getOneResult: any = await mfPositiveDraftServices.getOneMFPositiveLineList(
              mfPositiveLineId
            );
            setNoOfBSFoundPositive(getOneResult.noOfBSFoundPositive);
            values.lastModifiedBy = props && props.userSessionId;
            const surveyResponse = await mfPositiveDraftServices.addMFPositiveLineListSurvey(values);
            if (surveyResponse ) {
              console.log("step 2:: survey Details update response:: ", surveyResponse.data);
              props.handleNext(props);
            } */

          /*  let fieldUnitResponse, surveyResponse;
           if (step1PropsData.id) {
             values.lastModifiedBy = props && props.userSessionId;
             fieldUnitResponse = await MfPositiveService.updateMfPositiveList(step1PropsData, step1PropsData.id);
           }
           if (fieldUnitResponse && fieldUnitResponse.data) {
             values.createdBy = props && props.userSessionId;
             values.lastModifiedBy = 0;
             surveyResponse = await MfPositiveService.postMfPositiveSurveyList(values, step1PropsData.id);
             if (surveyResponse && surveyResponse.data) {
               console.log("step 2:: survey Details post response:: ", surveyResponse.data);
               props.handleNext(fieldUnitResponse.data);
             }
           } */
        }
      }
    }
  };

  // const onSubmit = async (values) => {
  //   if(location && location.state && location.state.view )
  //   {
  //     props.handleNext(values);
  //   }
  //   else{

  //   let step1PropsData:any ={};
  //   step1PropsData = Object.assign({}, props);
  //   step1PropsData.noOfBSFoundPositive = noOfBSFoundPositive? noOfBSFoundPositive:0;
  //   step1PropsData.unitOfAction = step1PropsData.unitOfAction ? step1PropsData.unitOfAction : 0;
  //   step1PropsData.nameOfUnit = step1PropsData.nameOfUnit ? step1PropsData.nameOfUnit : 0;
  //   step1PropsData.town = step1PropsData.town ? step1PropsData.town : 0;
  //   step1PropsData.corporationId = step1PropsData.corporationId ? step1PropsData.corporationId : 0;
  //   step1PropsData.districtId = step1PropsData.districtId ? step1PropsData.districtId : 0;
  //   step1PropsData.facilityId = step1PropsData.facilityId ? step1PropsData.facilityId : 0;
  //   step1PropsData.subCenterId = step1PropsData.subCenterId ? step1PropsData.subCenterId : 0;
  //   step1PropsData.talukaId = step1PropsData.talukaId ? step1PropsData.talukaId : 0;
  //   step1PropsData.villageId = step1PropsData.villageId ? step1PropsData.villageId : 0;
  //   step1PropsData.createdBy = step1PropsData.createdBy ? step1PropsData.createdBy : 0;
  //   step1PropsData.lastModifiedBy = step1PropsData.lastModifiedBy ? step1PropsData.lastModifiedBy : 0;
  //   step1PropsData.nameOfFilariaFieldUnit = step1PropsData.nameOfFilariaFieldUnit ? step1PropsData.nameOfFilariaFieldUnit : 0;
  //   values.surveyInfo.forEach(function (value) {

  //     value.noOfPersonsMale0to4 = value.noOfPersonsMale0to4? value.noOfPersonsMale0to4:0
  //     value.noOfPersonsMale5to14 = value.noOfPersonsMale5to14? value.noOfPersonsMale5to14:0
  //     value.noOfPersonsMale15to39 = value.noOfPersonsMale15to39? value.noOfPersonsMale15to39:0
  //     value.noOfPersonsMale40Plus = value.noOfPersonsMale40Plus? value.noOfPersonsMale40Plus:0
  //     value.noOfPersonsFemale0to4 = value.noOfPersonsFemale0to4? value.noOfPersonsFemale0to4:0
  //     value.noOfPersonsFemale5to14 = value.noOfPersonsFemale5to14? value.noOfPersonsFemale5to14:0
  //     value.noOfPersonsFemale15to39 = value.noOfPersonsFemale15to39? value.noOfPersonsFemale15to39:0
  //     value.noOfPersonsFemale40Plus = value.noOfPersonsFemale40Plus? value.noOfPersonsFemale40Plus:0
  //     value.noOfPersonsTG0to4 = value.noOfPersonsTG0to4? value.noOfPersonsTG0to4:0
  //     value.noOfPersonsTG5to14 = value.noOfPersonsTG5to14? value.noOfPersonsTG5to14:0
  //     value.noOfPersonsTG15to39 = value.noOfPersonsTG15to39? value.noOfPersonsTG15to39:0
  //     value.noOfPersonsTG40Plus = value.noOfPersonsTG40Plus? value.noOfPersonsTG40Plus:0
  //   });
  //     if(values.surveyInfo[1].dateOfAction > values.surveyInfo[2].dateOfAction){
  //       setShowErrorMessage(true)
  //       return;
  //     }
  //   if (location && location.state && location.state.mfId) {
  //     values.lastModifiedBy = props && props.userSessionId;
  //     const fieldUnitResponse = await MfPositiveService.updateMfPositiveList(step1PropsData,location.state.mfId);
  //     if(fieldUnitResponse && fieldUnitResponse.data){
  //       console.log("step 2:: fieldUnit update response:: ", fieldUnitResponse.data);
  //       const getOneResult: any = await MfPositiveService.getOneMfPositiveList(
  //         location.state.mfId
  //       );
  //       setNoOfBSFoundPositive(getOneResult.data[0].noOfBSFoundPositive);
  //       values.lastModifiedBy = props && props.userSessionId;
  //       const surveyResponse = await MfPositiveService.updateMfPositiveSurveyList(values,location.state.mfId);
  //       if(surveyResponse && surveyResponse.data){
  //         console.log("step 2:: survey Details update response:: ", surveyResponse.data);
  //         props.handleNext(getOneResult.data[0]);
  //       }
  //     }
  //   } else {

  //     let fieldUnitResponse,surveyResponse;
  //       if(step1PropsData.id){
  //         values.lastModifiedBy = props && props.userSessionId;
  //         fieldUnitResponse = await MfPositiveService.updateMfPositiveList(step1PropsData,step1PropsData.id);
  //       }
  //       if(fieldUnitResponse && fieldUnitResponse.data){
  //         values.createdBy = props && props.userSessionId;
  //         values.lastModifiedBy = 0;
  //           surveyResponse = await MfPositiveService.postMfPositiveSurveyList(values,step1PropsData.id);
  //         if(surveyResponse && surveyResponse.data){
  //           console.log("step 2:: survey Details post response:: ", surveyResponse.data);
  //           props.handleNext(fieldUnitResponse.data);
  //         }
  //       }
  //   }
  // }
  // };

  const formik = useFormik({
    initialValues: surveyInfoObject,
    onSubmit: onSubmit,
    enableReinitialize: true,
  });

  const preventEventChange = (e: any) => {
    e.target.blur();
  };
  async function changeNoOfBSFoundPositive(e: any) {
    setNoOfBSFoundPositive(e.target.value);
  }

  return (
    <div className='in-left'>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} onChange={formik.handleChange}>
          <div className='card'>
            {surveyDetail.map((details: any, index: any) => {
              let FormikIndex =
                formik.values.surveyInfo && formik.values.surveyInfo[index];
              if (FormikIndex) {
                FormikIndex.detailsOfSurveyId = details.id;
                let Total0to4 =
                  +FormikIndex.noOfPersonsTG0to4 +
                  +FormikIndex.noOfPersonsFemale0to4 +
                  +FormikIndex.noOfPersonsMale0to4;
                let Total5to14 =
                  +FormikIndex.noOfPersonsTG5to14 +
                  +FormikIndex.noOfPersonsFemale5to14 +
                  +FormikIndex.noOfPersonsMale5to14;
                let Total15to39 =
                  +FormikIndex.noOfPersonsTG15to39 +
                  +FormikIndex.noOfPersonsFemale15to39 +
                  +FormikIndex.noOfPersonsMale15to39;
                let Total40AndAbove =
                  +FormikIndex.noOfPersonsTG40Plus +
                  +FormikIndex.noOfPersonsFemale40Plus +
                  +FormikIndex.noOfPersonsMale40Plus;
                let TotalBScount =
                  +Total0to4 + +Total5to14 + +Total15to39 + +Total40AndAbove;
                let TotalMaleVerticalCount =
                  +FormikIndex.noOfPersonsMale0to4 +
                  +FormikIndex.noOfPersonsMale5to14 +
                  +FormikIndex.noOfPersonsMale15to39 +
                  +FormikIndex.noOfPersonsMale40Plus;
                let TotalFemaleVerticalCount =
                  +FormikIndex.noOfPersonsFemale0to4 +
                  +FormikIndex.noOfPersonsFemale5to14 +
                  +FormikIndex.noOfPersonsFemale15to39 +
                  +FormikIndex.noOfPersonsFemale40Plus;
                let TotalTGVerticalCount =
                  +FormikIndex.noOfPersonsTG0to4 +
                  +FormikIndex.noOfPersonsTG5to14 +
                  +FormikIndex.noOfPersonsTG15to39 +
                  +FormikIndex.noOfPersonsTG40Plus;

                return (
                  <>
                    <div key={index}>
                      <h4 className='formtitlenew font-chng'>
                        {details.id === FormikIndex.detailsOfSurveyId
                          ? details.categoryOptionName
                          : ''}
                      </h4>
                      <fieldset
                        disabled={
                          location.state && location.state.view ? true : false
                        }
                      >
                        <div className='card-body'>
                          <div className='table-input'>
                            <div className='col-md-12 col-xl-7 offset-xl-1 '>
                              <div className='table-responsive-md'>
                                <table className='table table-borderless font-chng'>
                                  <thead>
                                    <tr>
                                      <th>Age Group</th>
                                      <th>Male</th>
                                      <th>Female</th>
                                      <th>Transgender</th>
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <input
                                          type='hidden'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          value={
                                            FormikIndex.detailsOfSurveyId
                                              ? FormikIndex.detailsOfSurveyId
                                              : ''
                                          }
                                          name={`surveyInfo[${index}].detailsOfSurveyId`}
                                        />
                                        <input
                                          type='number'
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          className='form-control'
                                          placeholder='0 - <5'
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          value={
                                            FormikIndex.noOfPersonsMale0to4
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsMale0to4`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          value={
                                            FormikIndex.noOfPersonsFemale0to4
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsFemale0to4`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          value={FormikIndex.noOfPersonsTG0to4}
                                          name={`surveyInfo[${index}].noOfPersonsTG0to4`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control input-value'
                                          readOnly
                                          value={Total0to4}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          placeholder='5 - <15'
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          value={
                                            FormikIndex.noOfPersonsMale5to14
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsMale5to14`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          value={
                                            FormikIndex.noOfPersonsFemale5to14
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsFemale5to14`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          value={FormikIndex.noOfPersonsTG5to14}
                                          name={`surveyInfo[${index}].noOfPersonsTG5to14`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control input-value'
                                          readOnly
                                          value={Total5to14}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          placeholder='15 - <40'
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          value={
                                            FormikIndex.noOfPersonsMale15to39
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsMale15to39`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          value={
                                            FormikIndex.noOfPersonsFemale15to39
                                          }
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsFemale15to39`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          value={
                                            FormikIndex.noOfPersonsTG15to39
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsTG15to39`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control input-value'
                                          readOnly
                                          value={Total15to39}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <input
                                          type='number'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          placeholder='40 & Above'
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          value={
                                            FormikIndex.noOfPersonsMale40Plus
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsMale40Plus`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          value={
                                            FormikIndex.noOfPersonsFemale40Plus
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsFemale40Plus`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          className='form-control'
                                          value={
                                            FormikIndex.noOfPersonsTG40Plus
                                          }
                                          name={`surveyInfo[${index}].noOfPersonsTG40Plus`}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='number'
                                          className='form-control input-value'
                                          readOnly
                                          value={Total40AndAbove}
                                        />
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>
                                        <input
                                          readOnly
                                          className='form-control input-value'
                                          placeholder='Total'
                                        />
                                      </td>
                                      <td>
                                        <input
                                          readOnly
                                          className='form-control input-value'
                                          value={TotalMaleVerticalCount}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          readOnly
                                          className='form-control input-value'
                                          value={TotalFemaleVerticalCount}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          readOnly
                                          className='form-control input-value'
                                          value={TotalTGVerticalCount}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          readOnly
                                          className='form-control input-value'
                                          value={TotalBScount}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                {(details.categoryOptionCode === 'NPC' ||
                                  details.categoryOptionCode === 'NBSE' ||
                                  details.categoryOptionCode === 'NPS') && (
                                  <div className='col-md-6 col-12'>
                                    <div className='form-grp'>
                                      {details.categoryOptionCode === 'NPC' && (
                                        <label
                                          htmlFor='dateOfAction'
                                          className='form-label font-chng'
                                        >
                                          Date of Collection
                                        </label>
                                      )}
                                      {details.categoryOptionCode ===
                                        'NBSE' && (
                                        <label
                                          htmlFor='dateOfAction'
                                          className='form-label font-chng'
                                        >
                                          Date of Examined
                                        </label>
                                      )}
                                      {details.categoryOptionCode === 'NPS' && (
                                        <label
                                          htmlFor='dateOfAction'
                                          className='form-label font-chng'
                                        >
                                          Date of Surveyed
                                        </label>
                                      )}
                                      <input
                                        type='Date'
                                        max={isValidDate}
                                        className={
                                          showErrorMessage &&
                                          details.categoryOptionCode === 'NBSE'
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                        }
                                        value={FormikIndex.dateOfAction}
                                        name={`surveyInfo[${index}].dateOfAction`}
                                        onChange={formik.handleChange}
                                      />
                                      {showErrorMessage &&
                                      details.categoryOptionCode === 'NBSE' ? (
                                        <div className='error'>
                                          Date Of Examination should always be
                                          greater than Date Of Collection
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </>
                );
              }
            })}
            <fieldset
              disabled={location.state && location.state.view ? true : false}
            >
              <div
                className='col-md-6 col-xl-3 col-9'
                style={{ marginBottom: '20px' }}
              >
                <label className='form-label formtitlenew font-chng'>
                  No. Of BS Found Positive{' '}
                </label>
                <input
                  type='number'
                  name='noOfBSFoundPositive'
                  min='0'
                  onWheel={(e) => commonFunction.handleWheelEvent(e)}
                  onKeyDown={(e) =>
                    symbolsArr.includes(e.key) && e.preventDefault()
                  }
                  className='form-control'
                  value={noOfBSFoundPositive ? noOfBSFoundPositive : ''}
                  style={{ marginLeft: '15px' }}
                  onChange={(e) => {
                    changeNoOfBSFoundPositive(e);
                  }}
                />
              </div>
            </fieldset>
            {/* <div className="form-grp text-right">
              {props.activeStep !== 0 && (
                <Button
                  variant="contained"
                  onClick={() => props.handleBack(props)}
                  className="btn btn-outline-light font-chng"
                >
                  <i className="fas fa-arrow-left"></i>Back
                </Button>
              )}
              {props.activeStep !== props.steps.length - 1 &&
                props.activestep !== 0 ? (
                <Button type="submit" className="btn btn-secondary font-chng">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="btn btn-secondary font-chng">
                  Finish
                </Button>
              )}
            </div> */}
          </div>
          <div className='buttongrouprightend mb-4'>
            {props.activeStep !== 0 && (
              <Button
                variant='contained'
                onClick={() => props.handleBack(props)}
                style={{
                  marginRight: '10px',
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                  textTransform: 'none',
                }}
              >
                Back{' '}
              </Button>
            )}
            {props.activeStep !== props.steps.length - 1 &&
            props.activestep !== 0 ? (
              <Button
                type='submit'
                disabled={isDisabled}
                style={{
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                type='submit'
                disabled={isDisabled}
                style={{
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Finish
              </Button>
            )}
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default SurveyDetails;

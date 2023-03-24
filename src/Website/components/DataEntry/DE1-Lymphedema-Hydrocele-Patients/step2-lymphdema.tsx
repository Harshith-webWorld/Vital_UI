import Row from 'react-bootstrap/Row';
import { Button } from '@material-ui/core';
import { FormikProvider, useFormik, Field } from 'formik';
import { useLocation } from 'react-router-dom';
import {
  Symtoms,
  years,
  months,
  boolean2str,
  str2boolean,
} from './Form1-stepper-config';
import { DiseaseSymtoms } from '../../../interfaces/FormLymphedema';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import LymphedemaPatientInfoService from '../../../services/FormLymphedemaService';
import DropdownService from '../../../services/DropdownService';
import Select, { Option } from 'react-select';
import commonFunction from '../../../../helpers/common/common';
import lymphedemaLineListDraftServices from '../../../draftServices/FormLymphdemaHydroceleDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

const Step2 = (props: any) => {
  const { genderState } = props;
  const location: any = useLocation();
  let isOnline = window.navigator.onLine;
  let [optionTableValues, setOptionTableValues] = useState([]);
  const [formdata, setFormData] = useState<DiseaseSymtoms>(Symtoms);
  const [scrotumDetect, setScrotumDetect] = useState(false);
  const [scrotumRightChecked, setScrotumRightChecked] = useState(false);
  const [scrotumLeftChecked, setScrotumLeftChecked] = useState(false);
  const [legRightChecked, setLegRightChecked] = useState(false);
  const [legLeftChecked, setLegLeftChecked] = useState(false);
  const [handRightChecked, setHandRightChecked] = useState(false);
  const [handLeftChecked, setHandLeftChecked] = useState(false);
  const [breastRightChecked, setBreastRightChecked] = useState(false);
  const [breastLeftChecked, setBreastLeftChecked] = useState(false);
  const [othersChecked, setothersChecked] = useState(false);
  const [isLeg, setIsLeg] = useState(false);
  const [isHand, setIsHand] = useState(false);
  const [isScrotum, setIsScrotum] = useState(false);
  const [isBreast, setIsBreast] = useState(false);
  const [gender, setGender] = useState<any>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const selectDiseaseLastedYearsRef: any = React.useRef();
  const selectDiseaseLastedMonthsRef: any = React.useRef();

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  const monthList = months.map((item: any, i: any) => {
    return { label: item.monthName, value: item.month };
  });

  const processStayingInYears = ({ diseaseLastedYears }) => {
    if (diseaseLastedYears === null || diseaseLastedYears === 0) {
      return null;
    }
    if (diseaseLastedYears?.toString().length === 4) {
      return diseaseLastedYears;
    } else {
      return +moment().subtract(diseaseLastedYears, 'year').format('YYYY');
    }
  };

  const processStayingInMonths = ({ diseaseLastedMonths }) => {
    if (diseaseLastedMonths === null || diseaseLastedMonths === 0) {
      return null;
    } else {
      return diseaseLastedMonths;
    }
  };

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

  const getDateDetails = (year, month) => {
    let currentDate = moment();
    let stayingIndDate = moment([year, month - 1]);
    let localYear = currentDate.diff(stayingIndDate, 'year');
    stayingIndDate.add(localYear, 'years');
    var localMonth = currentDate.diff(stayingIndDate, 'months');
    stayingIndDate.add(localMonth, 'months');
    return (
      "Since "+localYear +
      ` year${localYear > 1 ? 's' : ''} ` +
      ` and ${localMonth} month${localMonth > 1 ? 's' : ''}`
    );
  };

  async function updatePatientInformation(patientInfo, id, idType) {
    if (idType === 'id') {
      let response =
        await LymphedemaPatientInfoService.updateLymphedemaPatientInformation(
          patientInfo,
          id
        );
      if (response && response.data) {
        props.handleNext(patientInfo);
      }
    } else if (idType === 'UUID') {
      let draftResponse =
        await lymphedemaLineListDraftServices.updateLymphedemaLineList(
          id,
          patientInfo
        );
      if (draftResponse) {
        props.handleNext(patientInfo);
      }
    }
  }
  async function getpostcontent() {
    if (isOnline) {
      const genderdata: any = await DropdownService.getUnitAction();
      if (genderdata && genderdata.data) {
        setOptionTableValues(genderdata.data);
      }
    } else {
      const genderDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderDataOffline) {
        setOptionTableValues(genderDataOffline);
      }
    }
  }

  const getPatientInfo = async () => {
    let recordId;
    if (location && location.state && location.state.id) {
      recordId = location.state.id;
      const getOneResult: any = await LymphedemaPatientInfoService.getStep1Info(
        recordId
      );
      if (getOneResult.data[0]) {
        setScrotumLeftChecked(getOneResult.data[0].isAffectedLeftScrotum);
        setScrotumRightChecked(getOneResult.data[0].isAffectedRightScrotum);
        setLegRightChecked(getOneResult.data[0].isAffectedRightLeg);
        setLegLeftChecked(getOneResult.data[0].isAffectedLeftLeg);
        setHandRightChecked(getOneResult.data[0].isAffectedRightHand);
        setHandLeftChecked(getOneResult.data[0].isAffectedLeftHand);
        setBreastLeftChecked(getOneResult.data[0].isAffectedLeftBreast);
        setBreastRightChecked(getOneResult.data[0].isAffectedRightBreast);
        setothersChecked(getOneResult.data[0].isAffectedOthers);
        getOneResult.data[0].isPresenceOfBlisters = boolean2str(
          getOneResult.data[0].isPresenceOfBlisters
        );
        setIsLeg(
          getOneResult.data[0].isAffectedRightLeg ||
            getOneResult.data[0].isAffectedLeftLeg
        );
        setIsHand(
          getOneResult.data[0].isAffectedRightHand ||
            getOneResult.data[0].isAffectedLeftHand
        );
        setIsScrotum(
          getOneResult.data[0].isAffectedLeftScrotum ||
            getOneResult.data[0].isAffectedRightScrotum
        );
        setIsBreast(
          getOneResult.data[0].isAffectedLeftBreast ||
            getOneResult.data[0].isAffectedRightBreast
        );
        let updatedFormData = { ...getOneResult.data[0] };
        updatedFormData.diseaseLastedYears =
          processStayingInYears(updatedFormData);
        updatedFormData.diseaseLastedMonths =
          processStayingInMonths(updatedFormData);
        setGender(updatedFormData.gender);
        setFormData(updatedFormData);
      }
    } else {
      if (location && location.state && location.state.UUID) {
        recordId = location.state.UUID;
      } else {
        recordId = props.lymphedemaLineListUUID;
      }
      if (recordId) {
        let getOne =
          await lymphedemaLineListDraftServices.getOneLymphedemaLineList(
            recordId
          );
        if (getOne) {
          setScrotumLeftChecked(str2boolean(getOne.isAffectedLeftScrotum));
          setScrotumRightChecked(str2boolean(getOne.isAffectedRightScrotum));
          setLegRightChecked(str2boolean(getOne.isAffectedRightLeg));
          setLegLeftChecked(str2boolean(getOne.isAffectedLeftLeg));
          setHandRightChecked(str2boolean(getOne.isAffectedRightHand));
          setHandLeftChecked(str2boolean(getOne.isAffectedLeftHand));
          setBreastLeftChecked(str2boolean(getOne.isAffectedLeftBreast));
          setBreastRightChecked(str2boolean(getOne.isAffectedRightBreast));
          setothersChecked(str2boolean(getOne.isAffectedOthers));
          console.log('getPatientInformation:: ', getOne);
          getOne.isPresenceOfBlisters = boolean2str(
            getOne.isPresenceOfBlisters
          );
          setIsLeg(getOne.isAffectedRightLeg || getOne.isAffectedLeftLeg);
          setIsHand(getOne.isAffectedRightHand || getOne.isAffectedLeftHand);
          setIsScrotum(
            getOne.isAffectedLeftScrotum || getOne.isAffectedRightScrotum
          );
          setIsBreast(
            getOne.isAffectedLeftBreast || getOne.isAffectedRightBreast
          );
          let updatedFormData = { ...getOne };
          updatedFormData.diseaseLastedYears =
            processStayingInYears(updatedFormData);
          updatedFormData.diseaseLastedMonths =
            processStayingInMonths(updatedFormData);
          setGender(updatedFormData.gender);
          setFormData(updatedFormData);
        }
      }
      // recordId = props.id;
      // console.log("props11:: ",props);
      // setFormData({
      //   formdata,
      //   ...props,
      // });
    }
  };
  useEffect(() => {
    getpostcontent();
    getPatientInfo();
  }, []);

  const scrotumRightHandleChange = (e) => {
    setScrotumRightChecked(!scrotumRightChecked);
    setothersChecked(false);
  };
  const scrotumLeftHandleChange = (e) => {
    setScrotumLeftChecked(!scrotumLeftChecked);
    setothersChecked(false);
  };
  const legRightHandleChange = (e) => {
    setLegRightChecked(!legRightChecked);
    setothersChecked(false);
  };

  const legLeftHandleChange = (e) => {
    setLegLeftChecked(!legLeftChecked);
    setothersChecked(false);
  };
  const handRightHandleChange = (e) => {
    setHandRightChecked(!handRightChecked);
    setothersChecked(false);
  };
  const handLeftHandleChange = (e) => {
    setHandLeftChecked(!handLeftChecked);
    setothersChecked(false);
  };
  const breastRightHandleChange = (e) => {
    setBreastRightChecked(!breastRightChecked);
    setothersChecked(false);
  };
  const breastLeftHandleChange = (e) => {
    setBreastLeftChecked(!breastLeftChecked);
    setothersChecked(false);
  };

  const legHandleChange = () => {
    if (isLeg) {
      setLegRightChecked(false);
      setLegLeftChecked(false);
      setothersChecked(false);
    }
    setIsLeg(!isLeg);
  };
  const HandHandleChange = () => {
    if (isHand) {
      setHandRightChecked(false);
      setHandLeftChecked(false);
      setothersChecked(false);
    }
    setIsHand(!isHand);
  };
  const ScrotumHandleChange = () => {
    if (isScrotum) {
      setScrotumRightChecked(false);
      setScrotumLeftChecked(false);
      setothersChecked(false);
    }
    setIsScrotum(!isScrotum);
  };
  const BreastHandleChange = () => {
    if (isBreast) {
      setBreastRightChecked(false);
      setBreastLeftChecked(false);
      setothersChecked(false);
    }
    setIsBreast(!isBreast);
  };

  const othersHandleChange = (e) => {
    if (othersChecked) {
      formik.setFieldValue('affectedOthersNotes', '');
    }

    setothersChecked(!othersChecked);
    setScrotumRightChecked(false);
    setScrotumLeftChecked(false);
    setLegRightChecked(false);
    setLegLeftChecked(false);
    setHandLeftChecked(false);
    setHandRightChecked(false);
    setBreastRightChecked(false);
    setBreastLeftChecked(false);
  };

  const onSubmit = async (values, actions) => {
    if (location && location.state && location.state.view) {
      props.handleNext(values);
    } else {
      let recordId;
      if (!values.isAffectedOthers) {
        values.affectedOthersNotes = null;
      }
      values.isAffectedRightScrotum = boolean2str(scrotumRightChecked);
      values.isAffectedLeftScrotum = boolean2str(scrotumLeftChecked);
      values.isAffectedRightHand = boolean2str(handRightChecked);
      values.isAffectedLeftHand = boolean2str(handLeftChecked);
      values.isAffectedRightBreast = boolean2str(breastRightChecked);
      values.isAffectedLeftBreast = boolean2str(breastLeftChecked);
      values.isAffectedRightLeg = boolean2str(legRightChecked);
      values.isAffectedLeftLeg = boolean2str(legLeftChecked);
      values.isAffectedOthers = boolean2str(othersChecked);
      values.lastModifiedBy = props && props.userSessionId;
      setIsDisabled(true);
      if (location && location.state && location.state.id) {
        recordId = location.state.id;
        await updatePatientInformation(values, recordId, 'id');
        setIsDisabled(false);
      } else if (location && location.state && location.state.UUID) {
        recordId = location.state.UUID;
        await updatePatientInformation(values, recordId, 'UUID');
        setIsDisabled(false);
      } else {
        recordId = props.lymphedemaLineListUUID;
        await updatePatientInformation(values, recordId, 'UUID');
        setIsDisabled(false);
      }
    }
  };
  const formik = useFormik({
    initialValues: formdata,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });

  const diseaseTypeList =
    optionTableValues &&
    optionTableValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1001) {
        return (
          <option key={item.categoryOptionEnum} value={item.categoryOptionEnum}>
            {item.categoryOptionName}
          </option>
        );
      }
    });
  // const monthList = months.map((item:any,i:any)=>{
  //   return{ label: item.monthName, value: item.month}
  // });
  const ageYearsList: any = [];
  Array.from(Array(100), (e, i: any) => {
    ageYearsList.push({ label: i + 1, value: i + 1 });
  });

  const ageMonthsList: any = [];
  Array.from(Array(11), (e, i: any) => {
    ageMonthsList.push({ label: i + 1, value: i + 1 });
  });

  const gradingList: any = [];
  optionTableValues &&
    optionTableValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1002) {
        gradingList.push({ label: item.categoryOptionName, value: item.id });
      }
    });

  let diseaseSymtoms = () => {
    return (
      <div className='in-left'>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} onChange={formik.handleChange}>
            <div className='card'>
              <div className='card-body'>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <Row className='mb-3 cardpadding'>
                    <div className='col-xl-2 pe-0 col-12 col-md-4'>
                      <div className='form-grp'>
                        <div className='form-radio'>
                          <label className='form-label font-chng'>
                            <input
                              type='checkbox'
                              name='isLeg'
                              onChange={legHandleChange}
                              checked={isLeg}
                            />
                            leg
                          </label>
                        </div>
                        {(isLeg || legLeftChecked || legRightChecked) && (
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <input
                                type='checkbox'
                                name='isAffectedLeftLeg'
                                onChange={(e: any) => legLeftHandleChange(e)}
                                checked={legLeftChecked === true}
                                value='true'
                              />
                              Left
                            </label>
                            <label className='form-label font-chng'>
                              <input
                                type='checkbox'
                                name='isAffectedRightLeg'
                                onChange={(e: any) => legRightHandleChange(e)}
                                checked={legRightChecked === true}
                                value='true'
                              />
                              Right
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='col-xl-2 pe-0 col-12 col-md-4'>
                      <div className='form-grp'>
                        <div className='form-radio'>
                          <label className='form-label font-chng'>
                            <input
                              type='checkbox'
                              name='isHand'
                              onChange={HandHandleChange}
                              checked={isHand}
                            />
                            Hand
                          </label>
                        </div>
                        {(isHand || handLeftChecked || handRightChecked) && (
                          <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'
                          >
                            <label className='form-label font-chng'>
                              <input
                                type='checkbox'
                                name='isAffectedLeftHand'
                                onChange={(e: any) => {
                                  handLeftHandleChange(e);
                                }}
                                checked={handLeftChecked === true}
                                value='true'
                              />
                              Left
                            </label>
                            <label className='form-label font-chng'>
                              <input
                                type='checkbox'
                                name='isAffectedRightHand'
                                onChange={(e: any) => {
                                  handRightHandleChange(e);
                                }}
                                checked={handRightChecked === true}
                                value='true'
                              />
                              Right
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    {([1, 3, '1', '3'].includes(genderState) ||
                      [1, 3, '1', '3'].includes(gender)) && (
                      <div className='col-xl-2 pe-0 col-12 col-md-4'>
                        <div className='form-grp'>
                          <div className='form-radio'>
                            <label className='form-label font-chng'>
                              <input
                                type='checkbox'
                                name='isScrotum'
                                onChange={ScrotumHandleChange}
                                checked={isScrotum}
                              />
                              Scrotum
                            </label>
                          </div>
                          {(isScrotum ||
                            scrotumLeftChecked ||
                            scrotumRightChecked) && (
                            <div
                              role='group'
                              aria-labelledby='my-radio-group'
                              className='form-radio'
                            >
                              <label className='form-label font-chng'>
                                <input
                                  type='checkbox'
                                  name='isAffectedLeftScrotum'
                                  onChange={(e: any) => {
                                    scrotumLeftHandleChange(e);
                                  }}
                                  checked={scrotumLeftChecked === true}
                                  value='true'
                                />
                                Left
                              </label>
                              <label className='form-label font-chng'>
                                <input
                                  type='checkbox'
                                  name='isAffectedRightScrotum'
                                  onChange={(e: any) => {
                                    scrotumRightHandleChange(e);
                                  }}
                                  checked={scrotumRightChecked === true}
                                  value='true'
                                />
                                Right
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {([2, 3, '2', '3'].includes(genderState) ||
                      [2, 3, '2', '3'].includes(gender)) && (
                      <div className='col-xl-2 pe-0 col-12 col-md-4'>
                        <div className='form-grp'>
                          <div className='form-radio'>
                            <label className='form-label font-chng'>
                              <input
                                type='checkbox'
                                name='isBreast'
                                onChange={BreastHandleChange}
                                checked={isBreast}
                              />
                              Breast
                            </label>
                          </div>
                          {(isBreast ||
                            breastLeftChecked ||
                            breastRightChecked) && (
                            <div
                              role='group'
                              aria-labelledby='my-radio-group'
                              className='form-radio'
                            >
                              <label className='form-label font-chng'>
                                <input
                                  type='checkbox'
                                  name='isAffectedLeftBreast'
                                  onChange={(e: any) =>
                                    breastLeftHandleChange(e)
                                  }
                                  checked={breastLeftChecked === true}
                                  value='true'
                                />
                                Left
                              </label>
                              <label className='form-label font-chng'>
                                <input
                                  type='checkbox'
                                  name='isAffectedRightBreast'
                                  onChange={(e: any) =>
                                    breastRightHandleChange(e)
                                  }
                                  checked={breastRightChecked === true}
                                  value='true'
                                />
                                Right
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className='col-xl-2 col-12 pe-0 col-md-4'>
                      <div className='form-grp'>
                        <div className='form-radio'>
                          <label className='form-label font-chng'>
                            <input
                              type='checkbox'
                              name='isAffectedOthers'
                              onChange={(e: any) => othersHandleChange(e)}
                              checked={othersChecked === true}
                              value='true'
                            />
                            Others
                          </label>
                          {/* <div
                            role='group'
                            aria-labelledby='my-radio-group'
                            className='form-radio'>
                            <label className='form-label font-chng'>
                              <input
                                type='checkbox'
                                name='isAffectedOthers'
                                onChange={(e: any) => othersHandleChange(e)}
                                checked={othersChecked === true}
                                value='true'
                              />
                            </label> */}
                        </div>
                      </div>
                    </div>
                  </Row>

                  {othersChecked ? (
                    <Row>
                      <div className='col-md-12 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='gender'
                            className='form-label font-chng'
                          >
                            Others Specify
                          </label>
                          <textarea
                            className='form-control'
                            name='affectedOthersNotes'
                            id='affectedOthersNotes'
                            value={formik.values.affectedOthersNotes}
                            onChange={formik.handleChange}
                          ></textarea>
                        </div>
                      </div>
                    </Row>
                  ) : null}
                </fieldset>
              </div>
            </div>
            <div className='card' style={{ marginTop: '10px' }}>
              <div className='card-body'>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <Row className='mb-3 cardpadding'>
                    {othersChecked ? (
                      <div className='col-md-6 col-xl-4 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
                            Disease Type
                          </label>

                          <input
                            disabled
                            className='form-control'
                            name='diseaseType'
                            onChange={formik.handleChange}
                            value={(formik.values.diseaseType = 'Others')}
                          />
                        </div>
                      </div>
                    ) : (legRightChecked ||
                        legLeftChecked ||
                        handLeftChecked ||
                        handRightChecked ||
                        breastLeftChecked ||
                        breastRightChecked) &&
                      (scrotumRightChecked || scrotumLeftChecked) ? (
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
                            Disease Type
                          </label>

                          <input
                            disabled
                            className='form-control'
                            name='diseaseType'
                            onChange={formik.handleChange}
                            value={
                              (formik.values.diseaseType =
                                'Lymphedema  and Hydrocele')
                            }
                          />
                        </div>
                      </div>
                    ) : scrotumLeftChecked || scrotumRightChecked ? (
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
                            Disease Type
                          </label>

                          <input
                            disabled
                            className='form-control'
                            name='diseaseType'
                            onChange={formik.handleChange}
                            value={(formik.values.diseaseType = 'Hydrocele')}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
                            Disease Type
                          </label>

                          <input
                            disabled
                            className='form-control'
                            name='diseaseType'
                            onChange={formik.handleChange}
                            value={(formik.values.diseaseType = 'Lymphedema')}
                          />
                        </div>
                      </div>
                    )}

                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Grading
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className='custom-select'
                          name='grading'
                          isClearable='true'
                          value={
                            gradingList
                              ? gradingList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.grading
                                )
                              : ''
                          }
                          options={gradingList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'grading',
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Presence of Blisters
                        </label>

                        <div
                          role='group'
                          aria-labelledby='my-radio-group'
                          className='form-radio'
                        >
                          <label
                            className='form-label'
                            htmlFor='isPresenceOfBlisters'
                          >
                            <Field
                              type='radio'
                              name='isPresenceOfBlisters'
                              defaultChecked={
                                formik.values.isPresenceOfBlisters === 'true'
                              }
                              onChange={formik.handleChange}
                              value='true'
                            />
                            Yes
                          </label>
                          <label
                            className='form-label'
                            htmlFor='isPresenceOfBlisters'
                          >
                            <Field
                              type='radio'
                              name='isPresenceOfBlisters'
                              onChange={formik.handleChange}
                              defaultChecked={
                                formik.values.isPresenceOfBlisters === 'false'
                              }
                              value='false'
                            />
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6 col-12'></div>
                    <h5 className='inner-title font-chng'>
                      Disease Started at
                    </h5>
                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Years
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          ref={selectDiseaseLastedYearsRef}
                          styles={commonFunction.customStyles}
                          className='custom-select'
                          name='diseaseLastedYears'
                          isClearable='true'
                          value={
                            yearList
                              ? yearList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.diseaseLastedYears
                                )
                              : ''
                          }
                          options={yearList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'diseaseLastedYears',
                              option && option.value
                            );
                            formik.setFieldValue('diseaseLastedMonths', null);
                            selectDiseaseLastedMonthsRef.current.select.clearValue();
                          }}
                        ></Select>
                        {!!formik.values.diseaseLastedYears &&
                          !!formik.values.diseaseLastedMonths && (
                            <label className='form-label font-chng'>
                              {getDateDetails(
                                formik.values.diseaseLastedYears,
                                formik.values.diseaseLastedMonths
                              )}
                            </label>
                          )}
                      </div>
                    </div>
                    <div className='col-xl-3 col-md-6 col-12'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label font-chng'>
                          Months
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          ref={selectDiseaseLastedMonthsRef}
                          styles={commonFunction.customStyles}
                          className={
                            formik.errors.diseaseLastedMonths &&
                            formik.touched.diseaseLastedMonths
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='diseaseLastedMonths'
                          isClearable='true'
                          value={
                            monthList
                              ? monthList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.diseaseLastedMonths
                                )
                              : ''
                          }
                          options={generateStayingInMonthOptions(
                            formik.values.diseaseLastedYears
                          )}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'diseaseLastedMonths',
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                  </Row>
                </fieldset>
              </div>
            </div>
            <div className='buttongrouprightend'>
              {props.activeStep !== 0 && (
                <Button
                  type='submit'
                  className=' btn-cancel'
                  onClick={() => props.handleBack(props)}
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
              )}
              <Button
                id='Submitbtnid'
                type='submit'
                className='btn-cancel'
                disabled={isDisabled}
                style={{
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                {props.activeStep !== props.steps.length - 1 &&
                props.activestep !== 0
                  ? 'Next'
                  : 'Finished'}
              </Button>
            </div>
          </form>
        </FormikProvider>
      </div>
    );
  };
  return <div>{diseaseSymtoms()}</div>;
};

export default Step2;

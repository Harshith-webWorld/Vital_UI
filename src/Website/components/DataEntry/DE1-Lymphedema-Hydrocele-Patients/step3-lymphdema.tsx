import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import { Button as ReactButton } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import { useLocation } from 'react-router-dom';
import { Survey, str2boolean } from './Form1-stepper-config';
import { LymphedemaLineListSurvey } from '../../../interfaces/FormLymphedema';
import React, { useEffect, useState } from 'react';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import DoctorImg from '../../../assets/img/LEFP_Images/Doctor_icon.png';
import DropdownService from '../../../services/DropdownService';
import LymphedemaPatientInfoService from '../../../services/FormLymphedemaService';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import * as Yup from 'yup';
import Select, { Option } from 'react-select';
import commonFunction from '../../../../helpers/common/common';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { toast } from 'react-toastify';
import { USER_ROLE_DATA_ENTRY } from '../../../../helpers/config';
import AccordionLymphedamaLIneListSurvey from './AccordionLymphedamaLIneListSurvey';
import lymphedemaLineListDraftServices from '../../../draftServices/FormLymphdemaHydroceleDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

const Step3 = (props: any, event: any) => {
  let NoneList = [{ label: 'None', value: 0 }];
  let isValidDate = moment().format('YYYY-MM-DD');
  // const selectNameOfFilariaFieldUnitRef: any = React.useRef();
  // const selectNameOfUnitRef: any = React.useRef();
  const userRole: any = props && props.signinUserRole;
  let isOnline = window.navigator.onLine;
  const [optionTableValues, setOptionTableValues] = useState([]);
  //console.log("",userRole[0].roleName)
  const [hide, setHide] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  useEffect(() => {
    if (userRole && userRole.roleName === USER_ROLE_DATA_ENTRY) {
      setHide(false);
      setHideButton(true);
    }
  }, []);

  const ExpandedComponent = (row) => {
    return <AccordionLymphedamaLIneListSurvey rowValues={row} />;
  };
  const surveyColumns = [
    {
      name: 'Survey Done Under',
      selector: (row: any) => {
        if (location && location.state && location.state.id) {
          return row.udCategoryOption && row.udCategoryOption.categoryOptionName
            ? row.udCategoryOption.categoryOptionName
            : 'Nil';
        } else {
          if (row.surveyDoneUnder === 0) {
            return 'None';
          } else {
            if (optionTableValues.length > 0) {
              const find: any = optionTableValues.find(
                ({ id }) => id === row.surveyDoneUnder
              );
              return find && find.categoryOptionName;
            } else {
              return 'empty';
            }
          }
        }
      },
    },
    {
      name: 'Survey Date',
      selector: 'dateOfSurvey',
    },

    {
      name: 'Is Verified?',
      selector: (row: any) => {
        if (location && location.state && location.state.id) {
          return row.isVerified ? 'Yes' : 'No';
        } else {
          return row.isVerified === true || row.isVerified === 'true'
            ? 'Yes'
            : 'No';
        }
      },
    },
    {
      name: 'Date Of Submission',
      selector: (row: any) => <div>{moment(row.createdAt).format('L')}</div>,
    },
    {
      name: 'Last Modified',
      selector: (row: any) => <div>{moment(row.updatedAt).format('L')}</div>,
    },

    {
      name: 'Actions',
      selector: 'Actions',
      cell: (row) => (
        <div data-tag='allowRowEvents'>
          {location && location.state && location.state.view && (
            <button
              className='btn tooltip-wrap'
              onClick={() => viewSurvey(row, 'view')}
            >
              <img src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
          )}
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button
                className='btn tooltip-wrap'
                onClick={() => updateSurvey(row, 'edit')}
              >
                <img alt='' src={editIcon} />
                <div className='tooltip'>
                  <div className='tooltip-inner font-chng'>Edit</div>
                </div>
              </button>
              <button
                className='btn tooltip-wrap'
                onClick={() => deleteSurvey(row)}
              >
                <img alt='' src={deleteIcon} />
                <div className='tooltip'>
                  <div className='tooltip-inner font-chng'>Delete</div>
                </div>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const location = useLocation<any>();
  const [hideSurveyList, setHideSurveyList] = useState(false);
  const [hideVerifiedMedical, setHideVerifiedMedical] = useState(false);
  const [check1, setCheck1] = useState(false);
  let [surveyList, setSurveyList] = useState([]);
  const [surveydata, setSurveyData] =
    useState<LymphedemaLineListSurvey>(Survey);
  const [surveyInitialdata, setSurveyInitialdata] =
    useState<LymphedemaLineListSurvey>(Survey);

  async function saveSurvey(postdata) {
    let id;
    if (location && location.state && location.state.id) {
      if (postdata && postdata.id) {
        postdata.lastModifiedBy = props && props.userSessionId;
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
      }
      let postResult = await LymphedemaPatientInfoService.postSurvey(postdata);
      if (postResult && postResult.data) {
        console.log('post HF Followups info:: ', postResult.data);
        showSurveyDetails();
      }
    } else if (location && location.state && location.state.UUID) {
      if (postdata && postdata.lymphedemaLineListSurveyUUID) {
        id = postdata.lymphedemaLineListSurveyUUID;
        postdata.lastModifiedBy = props && props.userSessionId;
        let updateResponse =
          await lymphedemaLineListDraftServices.updateLymphedemaLineListSurvey(
            id,
            postdata
          );
        if (updateResponse) {
          showSurveyDetails();
        }
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
        let addResponse =
          await lymphedemaLineListDraftServices.addLymphedemaLineListSurvey(
            postdata
          );
        if (addResponse) {
          showSurveyDetails();
        }
      }
    } else {
      if (postdata && postdata.lymphedemaLineListSurveyUUID) {
        id = postdata.lymphedemaLineListSurveyUUID;
        postdata.lastModifiedBy = props && props.userSessionId;
        let updateResponse =
          await lymphedemaLineListDraftServices.updateLymphedemaLineListSurvey(
            id,
            postdata
          );
        if (updateResponse) {
          showSurveyDetails();
        }
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
        let addResponse =
          await lymphedemaLineListDraftServices.addLymphedemaLineListSurvey(
            postdata
          );
        if (addResponse) {
          showSurveyDetails();
        }
      }
    }
  }

  let changeVerifiedMedicial = (e) => {
    if (e.target.value === 'true') {
      setHideVerifiedMedical(true);
      setCheck1(true)
    } else if (e.target.value === 'false') {
      setHideVerifiedMedical(false);
      setCheck1(false)
      formik.setFieldValue('verifiedByDoctorName', '');
      formik.setFieldValue('verifiedByDoctorPhone', '');
      formik.setFieldValue(
        'dateOfVerification',
        formik.values.dateOfVerification
      );
    }
  };

  const onSubmit = (values, actions) => {
    console.log('after values:: ', values);
    if (location && location.state && location.state.view) {
      props.handleNext(values);
    } else {
      values.isVerified = values.isVerified
        ? values.isVerified.toString()
        : 'false';
      let LymphedemaLineListId: any;
      setIsDisabled(true);
      if (location && location.state && location.state.id) {
        LymphedemaLineListId = location.state.id;
      } else if (location && location.state && location.state.UUID) {
        LymphedemaLineListId = location.state.UUID;
      } else {
        LymphedemaLineListId = props.lymphedemaLineListUUID;
      }
      values.lymphedemaLineListId = LymphedemaLineListId;
      saveSurvey(values);
      setIsDisabled(false);
    }
  };

  const validSchema = Yup.object().shape({
    surveyDoneUnder: Yup.string()
      .required('Survey Done Under is required')
      .nullable(),
    verifiedByDoctorPhone: Yup.string()
      .min(12, 'Invalid Phone Number')
      .nullable(),
  });
  const formik = useFormik({
    initialValues: surveydata,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: onSubmit,
  });
  function viewSurvey(row, action) {
    row.isVerified =
      typeof row.isVerified === 'string'
        ? str2boolean(row.isVerified)
        : row.isVerified;

    if (row.isVerified) {
      setCheck1(true);
      setHideVerifiedMedical(true);
    } else {
      setCheck1(false);
      setHideVerifiedMedical(false);
    }

    console.log(row.isVerified, 'test');

    hideSurveyDetails();
    setSurveyData(row);
  }

  function updateSurvey(row, action) {
    row.isVerified =
      typeof row.isVerified === 'string'
        ? str2boolean(row.isVerified)
        : row.isVerified;
    if (row.isVerified) {
      setCheck1(true);
      setHideVerifiedMedical(true);
    } else {
      setCheck1(false);
      setHideVerifiedMedical(false);
    }
    hideSurveyDetails();
    console.log('get survey', row);
    setSurveyData(row);
  }
  async function deleteSurvey(row) {
    if (location && location.state && location.state.id) {
      let deleteResult: any = await LymphedemaPatientInfoService.deleteSurvey(
        row
      );
      if (deleteResult.status === 200) {
        console.log('post HF info:: ', deleteResult);
        getSurveyDetails();
      }
    } else {
      console.log('delete uuid', row.lymphedemaLineListSurveyUUID);
      if (row && row.lymphedemaLineListSurveyUUID) {
        let deleteResult: any =
          await lymphedemaLineListDraftServices.deleteLymphedemaLineListSurvey(
            row.lymphedemaLineListSurveyUUID
          );
        if (deleteResult) {
          console.log('post HF info:: ', deleteResult);
          getSurveyDetails();
        }
      }
    }
  }

  async function getSurveyDetails() {
    console.log('get survey list', props);
    let LymphedemaLineListId: any;
    let surveyDetails: any;
    if (location && location.state && location.state.id) {
      LymphedemaLineListId = location.state.id;
      if (LymphedemaLineListId) {
        surveyDetails = await LymphedemaPatientInfoService.getSurveyDetails(
          LymphedemaLineListId
        );
      }
      if (
        (surveyDetails && surveyDetails.data) ||
        (surveyDetails && surveyDetails.message)
      ) {
        console.log('get survey info:: ', surveyDetails.data);
        setSurveyList(surveyDetails.data);
      }
    } else if (location && location.state && location.state.UUID) {
      LymphedemaLineListId = location.state.UUID;
      if (LymphedemaLineListId) {
        surveyDetails =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListSurvey(
            LymphedemaLineListId
          );
        if (surveyDetails) {
          setSurveyList(surveyDetails);
        }
      }
    } else {
      LymphedemaLineListId = props.lymphedemaLineListUUID;
      if (LymphedemaLineListId) {
        surveyDetails =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListSurvey(
            LymphedemaLineListId
          );
        if (surveyDetails) {
          setSurveyList(surveyDetails);
        }
      }
    }
  }

  useEffect(() => {
    getpostcontent();
    getSurveyDetails();
  }, []);

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
  const sureyDoneUnderList: any = [];
  optionTableValues &&
    optionTableValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1004) {
        sureyDoneUnderList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid3') {
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

  function addNew() {
    setCheck1(false);
    setHideVerifiedMedical(false);
    setHideSurveyList(true);
    formik.resetForm({ values: surveyInitialdata });
  }

  function hideSurveyDetails() {
    setHideSurveyList(true);
    formik.resetForm({ values: surveyInitialdata });
  }
  function showSurveyDetails() {
    setHideSurveyList(false);
    getSurveyDetails();
  }

  let step3SurveyList = () => {
    return (
      <div>
        {!hideSurveyList && (
          <div>
            <div className='card'>
              <div className='row'>
                <div className='col-md-10 col-12'>
                  <div
                    className='formtitlenew font-chng'
                    style={{ marginLeft: '33px' }}
                  >
                    Survey List{' '}
                  </div>{' '}
                </div>
                {location && location.state && location.state.view ? (
                  ''
                ) : (
                  <div className='col-md-2 col-12 text-right'>
                    <Button
                      variant='secondary'
                      className='mt-m font-chng mr10'
                      style={{ backgroundColor: '#19D895', border: 'none' }}
                      onClick={addNew}
                    >
                      <img src={plusImg} className='pe-2' alt='' />
                      Add New
                    </Button>
                  </div>
                )}
              </div>
              <div className='post-tablenew font-chng cus-table'>
                <DataTable
                  columns={surveyColumns}
                  data={surveyList}
                  expandableRows={true}
                  onRowExpandToggled={(expand, row) => {
                    console.log(expand);
                    console.log(row);
                  }}
                  expandOnRowClicked={false}
                  expandableRowsComponent={<ExpandedComponent />}
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                  }}
                />
              </div>
            </div>{' '}
            <div className='buttongrouprightend'>
              {props.activeStep !== 0 && (
                <ReactButton
                  type='submit'
                  className='btn-cancel'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  onClick={() => props.handleBack(props)}
                >
                  <i className='fas fa-arrow-left'></i> &nbsp;Back
                </ReactButton>
              )}
              {props.activeStep !== props.steps.length - 1 &&
              props.activestep !== 0 ? (
                <ReactButton
                  onClick={props.handleNext}
                  className='btn-cancel'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Next
                </ReactButton>
              ) : (
                <ReactButton type='submit' className='btn-cancel'>
                  Finish
                </ReactButton>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  let step3SurveyAdd = () => {
    return (
      <div className='in-left'>
        {hideSurveyList && (
          <div>
            <FormikProvider value={formik}>
              <form
                onClick={showToast}
                onSubmit={formik.handleSubmit}
                onChange={formik.handleChange}
              >
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <div className='card'>
                    <div
                      className='formtitlenew font-chng'
                      style={{ marginLeft: '33px' }}
                    >
                      Survey Details{' '}
                    </div>{' '}
                    <div className='card-body'>
                      <Row className='mb-3 cardpadding'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='surveyDoneUnder'
                              className='form-label font-chng'
                            >
                              Survey done Under*
                            </label>
                            <Select
                              isDisabled={
                                location.state && location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              className={
                                formik.errors.surveyDoneUnder &&
                                formik.touched.surveyDoneUnder
                                  ? 'custom-select is-invalid'
                                  : 'custom-select'
                              }
                              name='surveyDoneUnder'
                              isClearable='true'
                              value={
                                sureyDoneUnderList
                                  ? sureyDoneUnderList.find(
                                      (option: any) =>
                                        option &&
                                        option.value ===
                                          formik.values.surveyDoneUnder
                                    )
                                  : ''
                              }
                              options={sureyDoneUnderList}
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  'surveyDoneUnder',
                                  option && option.value
                                );
                              }}
                            ></Select>
                            <div className={'invalid-feedback'}>
                              {formik.errors.surveyDoneUnder
                                ? formik.errors.surveyDoneUnder
                                : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='dateOfSurvey'
                              className='form-label font-chng'
                            >
                              Date of Survey
                            </label>
                            {console.log(
                              moment().format('YYYY-MM-DD'),
                              'datttttettte'
                            )}
                            <input
                              type='date'
                              max={isValidDate}
                              className='form-control'
                              name='dateOfSurvey'
                              value={formik.values.dateOfSurvey}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </div>
                        {hideButton && (
                          <div className='buttongrouprightend'>
                            {props.activeStep !== 0 && (
                              <ReactButton
                                onClick={showSurveyDetails}
                                className='btn-cancel'
                              >
                                <i className='fas fa-arrow-left'></i> &nbsp;Back
                              </ReactButton>
                            )}
                            {!(
                              location &&
                              location.state &&
                              location.state.view
                            ) && (
                              <ReactButton
                                id='Submitbtnid3'
                                className='btn-cancel'
                                type='submit'
                              >
                                Submit
                              </ReactButton>
                            )}
                          </div>
                        )}
                      </Row>
                    </div>
                  </div>
                </fieldset>
                <>
                  {hide && (
                    <>
                      <div className='card' style={{ marginTop: '10px' }}>
                        <div
                          className='formtitlenew font-chng'
                          style={{ marginLeft: '33px' }}
                        >
                          Verified By
                        </div>
                        <div className='card-body'>
                          <fieldset
                            disabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                          >
                            <Row className='mb-3 cardpadding'>
                              <div className='col-md-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='isVerified'
                                    className='form-label font-chng'
                                  >
                                    Verified By Medical Officer
                                  </label>
                                  <div
                                    role='group'
                                    aria-labelledby='my-radio-group'
                                    className='form-radio'
                                  >
                                    <label
                                      className='form-label font-chng'
                                      htmlFor='isVerified'
                                    >
                                      <input
                                        type='radio'
                                        value='true'
                                        name='isVerified'
                                        onChange={(e) => {
                                          changeVerifiedMedicial(e);
                                        }}
                                        checked={check1}
                                      />
                                      Yes
                                    </label>
                                    <label
                                      className='form-label font-chng'
                                      htmlFor='isVerified'
                                    >
                                      <input
                                        type='radio'
                                        value='false'
                                        name='isVerified'
                                        onChange={(e) => {
                                          changeVerifiedMedicial(e);
                                        }}
                                        checked={!check1}
                                      />
                                      No
                                    </label>
                                  </div>
                                </div>
                              </div>
                              {hideVerifiedMedical && (
                                <Row>
                                  <div className='col-xl-3 col-md-6 col-12'>
                                    <div className='form-grp'>
                                      <label
                                        htmlFor='verifiedByDoctorName'
                                        className='form-label font-chng'
                                      >
                                        Doctor Name
                                      </label>
                                      <div className='input-group'>
                                        <div className='input-group-prepend'>
                                          <img src={DoctorImg} />
                                        </div>
                                        <input
                                          type='text'
                                          className='form-control'
                                          onInput={(event) =>
                                            commonFunction.onlyAlphabets(event)
                                          }
                                          name='verifiedByDoctorName'
                                          value={
                                            formik.values.verifiedByDoctorName
                                          }
                                          onKeyPress={(e) =>
                                            commonFunction.keyPress(e)
                                          }
                                          onChange={formik.handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-xl-3 col-md-6 col-12'>
                                    <div className='form-grp'>
                                      <label
                                        htmlFor='verifiedByDoctorPhone'
                                        className='form-label font-chng'
                                      >
                                        Doctor Phone Number
                                      </label>
                                      <NumberFormat
                                        className={
                                          formik.errors.verifiedByDoctorPhone &&
                                          formik.touched.verifiedByDoctorPhone
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                        }
                                        format='#### #### ##'
                                        mask=''
                                        placeholder='Phone Number Here'
                                        name='verifiedByDoctorPhone'
                                        value={
                                          formik.values.verifiedByDoctorPhone
                                        }
                                        onChange={formik.handleChange}
                                      />
                                      <div className={'invalid-feedback'}>
                                        {formik.errors
                                          ? formik.errors.verifiedByDoctorPhone
                                          : ''}
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-xl-3 col-md-6 col-12'>
                                    <div className='form-grp'>
                                      <label
                                        htmlFor='dateOfVerification'
                                        className='form-label font-chng'
                                      >
                                        Date of Verification
                                      </label>
                                      <input
                                        type='date'
                                        max={isValidDate}
                                        className='form-control'
                                        name='dateOfVerification'
                                        value={formik.values.dateOfVerification}
                                        onChange={formik.handleChange}
                                      />
                                    </div>
                                  </div>
                                </Row>
                              )}
                            </Row>
                          </fieldset>
                        </div>
                      </div>{' '}
                      <div
                        className='buttongrouprightend'
                        style={{ marginRight: '15px' }}
                      >
                        {props.activeStep !== 0 && (
                          <ReactButton
                            type='submit'
                            className='btn-cancel'
                            onClick={showSurveyDetails}
                            style={{
                              marginRight: '10px',
                              backgroundColor: '#34c38f',
                              border: '0px',
                              color: ' #ffffff',
                            }}
                          >
                            <i className='fas fa-arrow-left'></i>&nbsp; Back{' '}
                          </ReactButton>
                        )}
                        {!(
                          location &&
                          location.state &&
                          location.state.view
                        ) && (
                          <ReactButton
                            id='Submitbtnid'
                            type='submit'
                            className='btn-cancel'
                            disabled={isDisabled}
                            onClick={saveSurvey}
                            style={{
                              backgroundColor: '#34c38f',
                              border: '0px',
                              color: ' #ffffff',
                            }}
                          >
                            Submit
                          </ReactButton>
                        )}
                      </div>
                    </>
                  )}
                </>
              </form>
            </FormikProvider>
          </div>
        )}
      </div>
    );
  };
  let surveyDetails = () => {
    return (
      <div>
        {step3SurveyList()}

        {step3SurveyAdd()}
      </div>
    );
  };

  return <div>{surveyDetails()}</div>;
};

export default Step3;

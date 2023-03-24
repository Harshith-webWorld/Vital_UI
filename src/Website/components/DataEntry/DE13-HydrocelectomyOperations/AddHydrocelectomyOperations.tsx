import React, { useEffect, useState, useRef } from 'react';
import { useFormik, FormikProvider } from 'formik';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
import history from '../../../../helpers/history';
import HydrocelectomyOperationsService from '../../../services/FormHydrocelectomyOperationsService';
import DropdownService from '../../../services/DropdownService';
import { VerticalStockPosition } from '../../../interfaces/FormVerticalStockPositionInterface';
import Select, { Option } from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import HydrocelectomyOperationsDraftServices from '../../../draftServices/FormHydrocelectomyOperationsDraftService';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import Button from 'react-bootstrap/Button';

const AddHydrocelectomyOperations: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  let isOnline = window.navigator.onLine;
  const location = useLocation<any>();
  const [stateId, setstateId] = useState(14);
  const [isDisabled, setIsDisabled] = useState(false);
  let [districtValues, setDistrictValues] = useState([]);
  // let selectDistrictRef: any = useRef();
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);

  const currentYear = new Date().getFullYear();
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(currentYear, currentYear - 50, -1);
  let NoneList = [{ label: 'None', value: 0 }];
  let defaultStateValue = [{ label: 'Maharastra', value: 14 }];
  const [initialValues, setInitialvalues] = useState({
    year: '',
    stateId: 14,
    districtId: '',
    jan: '',
    feb: '',
    mar: '',
    apr: '',
    may: '',
    jun: '',
    jul: '',
    aug: '',
    sep: '',
    oct: '',
    nov: '',
    dec: '',
    isActive: true,
  });

  useEffect(() => {
    getData();
    getState(defaultStateValue[0]);
  }, []);

  const prevStateRef: any = React.useRef();
  useEffect(() => {
    prevStateRef.current = stateId;
  });
  const prevStateIdValue = prevStateRef.current;
  const validSchema = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    stateId: Yup.string().when([], {
      is: 0,
      then: Yup.string().nullable(),
    }),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    jan: Yup.number().positive('Value must be positive number'),
    feb: Yup.number().positive('Value must be positive number'),
    mar: Yup.number().positive('Value must be positive number'),
    apr: Yup.number().positive('Value must be positive number'),
    may: Yup.number().positive('Value must be positive number'),
    jun: Yup.number().positive('Value must be positive number'),
    jul: Yup.number().positive('Value must be positive number'),
    aug: Yup.number().positive('Value must be positive number'),
    sep: Yup.number().positive('Value must be positive number'),
    oct: Yup.number().positive('Value must be positive number'),
    nov: Yup.number().positive('Value must be positive number'),
    dec: Yup.number().positive('Value must be positive number'),
  });

  async function getState(e: any) {
    if (!(e === null)) {
      // setstateId(e && e.value);
      if (!((e && e.value) === prevStateIdValue)) {
        if (e === null) {
          formik.setFieldValue('districtId', 0);
        }
        let districtId: any;
        let offlineDistrictId: any;
        if (isOnline) {
          districtId = await DropdownService.getOneDistrict(e && e.value);
        } else {
          offlineDistrictId = await DexieOfflineDataBase.getOneDistrict(
            e && e.value
          );
        }
        if (
          (districtId && districtId.data && districtId.data.length > 0) ||
          (offlineDistrictId && offlineDistrictId.length > 0)
        ) {
          // selectDistrictRef.current.select.clearValue();
          // formik.setFieldValue("districtId", "");
          if (isOnline) {
            setDistrictValues(districtId.data);
          } else {
            setDistrictValues(offlineDistrictId);
          }
        } else {
          // selectDistrictRef.current.select.clearValue();
          let districtData: any = [OptionLabel.districtNone];
          setDistrictValues(districtData);
          formik.setFieldValue('districtId', 0);
        }
      } else {
        console.log('Same District Value');
      }
    } else {
      let districtData: any = [OptionLabel.districtNone];
      setDistrictValues(districtData);
      formik.setFieldValue('districtId', 0);
    }
  }

  async function getStateValues(e: any) {
    if (isOnline) {
      const districtId: any = await DropdownService.getOneDistrict(e);
      if (districtId && districtId.data && districtId.data.length > 0) {
        setDistrictValues(districtId.data);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setDistrictValues(districtData);
        formik.setFieldValue('districtId', 0);
      }
    } else {
      const districtId: any = await DexieOfflineDataBase.getOneDistrict(e);
      if (districtId && districtId.length > 0) {
        setDistrictValues(districtId);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setDistrictValues(districtData);
        formik.setFieldValue('districtId', 0);
      }
    }
  }

  const getData = async () => {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response =
        await HydrocelectomyOperationsService.getoneHydrocelectomyOperations(
          id
        );
      if (response) {
        getStateValues(stateId);
        let Data: any = response.data[0];
        for (const key in Data) {
          if (Object.prototype.hasOwnProperty.call(Data, key)) {
            const element = Data[key];
            if (Data[key] === 0) {
              Data[key] = '';
            }
          }
        }
        setInitialvalues(Data);
      }
    } else if (location.state && location.state.UUID) {
      const id: any = location.state.UUID;
      const response =
        await HydrocelectomyOperationsDraftServices.getOneHydrocelectomyOperations(
          id
        );
      if (response) {
        getStateValues(stateId);
        let Data: any = response;
        for (const key in Data) {
          if (Object.prototype.hasOwnProperty.call(Data, key)) {
            const element = Data[key];
            if (Data[key] === 0) {
              Data[key] = '';
            }
          }
        }
        setInitialvalues(Data);
      }
    }
  };

  const districtList =
    districtValues &&
    districtValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      values.jan = values.jan ? values.jan : 0;
      values.feb = values.feb ? values.feb : 0;
      values.mar = values.mar ? values.mar : 0;
      values.apr = values.apr ? values.apr : 0;
      values.may = values.may ? values.may : 0;
      values.jun = values.jun ? values.jun : 0;
      values.jul = values.jul ? values.jul : 0;
      values.aug = values.aug ? values.aug : 0;
      values.sep = values.sep ? values.sep : 0;
      values.oct = values.oct ? values.oct : 0;
      values.nov = values.nov ? values.nov : 0;
      values.dec = values.dec ? values.dec : 0;

      setInitialvalues(values);
      setIsDisabled(true);
      if (values && values.status === 'Active') {
        if (location && location.state && location.state.id) {
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          values.lastModifiedBy = props && props.userSessionId;
          delete values.stateId;
          delete values.status;
          delete values.updatedAt;
          delete values.createdAt;
          delete values.district;
          const response =
            await HydrocelectomyOperationsService.updateHydrocelectomyOperations(
              values,
              location.state.id
            );
          setIsDisabled(false);
          toast.success('Form Submitted Successfully', {
            position: toast.POSITION.TOP_CENTER,
          });
          history.push(listDESheetName);
        } else {
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = props && props.userSessionId;
          delete values.stateId;
          delete values.status;
          delete values.updatedAt;
          delete values.createdAt;
          delete values.district;

          if (values && values.HydrocelectomyOperationsUUID) {
            setIsDisabled(true);
            let UUID: any = values.HydrocelectomyOperationsUUID;
            delete values.HydrocelectomyOperationsUUID;
            let response =
              await HydrocelectomyOperationsService.postHydrocelectomyOperations(
                values
              );
            setIsDisabled(false);
            if (
              response &&
              response.status &&
              (response.status === 200 || response.status === 201)
            ) {
              let deleteResponse =
                await HydrocelectomyOperationsDraftServices.deleteHydrocelectomyOperations(
                  UUID
                );
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
              history.push(listDESheetName);
            }
          } else {
            let response =
              await HydrocelectomyOperationsService.postHydrocelectomyOperations(
                values
              );
            if (response.data) {
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
            }
            history.push(listDESheetName);
          }
        }
      } else if (values && values.status === 'Draft') {
        if (location.state && location.state.UUID) {
          setIsDisabled(true);
          const id: any = location.state.UUID;
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          values.lastModifiedBy = props && props.userSessionId;
          const response =
            await HydrocelectomyOperationsDraftServices.updateHydrocelectomyOperations(
              id,
              values
            );
          console.log(response);
          setIsDisabled(false);
          if (response) {
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push(listDESheetName);
          }
        } else {
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = props && props.userSessionId;
          let response =
            await HydrocelectomyOperationsDraftServices.addHydrocelectomyOperations(
              values
            );
          console.log(response);
          if (response) {
            //alert.success(response.message)
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push(listDESheetName);
          }
        }
      }
    },
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
    <FormikProvider value={formik}>
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
          <Breadcrumb.Item
            onClick={() => {
              history.push('/hydrocelectomy-operations');
            }}
            className='font-chng'
          >
            Hydrocelectomy Operations
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
        <form
          onClick={showToast}
          name='verticalunitstockposition'
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
        >
          <fieldset
            disabled={location.state && location.state.view ? true : false}
          >
            <div className='card'>
              <h4 className='formtitlenew font-chng'>
                Hydrocelectomy Operations
              </h4>
              {/* <h4 className="formtitlenew pt-4 font-chng">Unit Info</h4> */}
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='year' className='form-label font-chng'>
                        Year*
                      </label>
                      <Select
                        name='year'
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
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
                      <label
                        htmlFor='districtId'
                        className='form-label font-chng'
                      >
                        District*
                      </label>
                      {districtValues && districtValues.length !== 0 ? (
                        <Select
                          name='districtId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          isClearable={true}
                          value={
                            districtList
                              ? districtList.find((option) => {
                                  return (
                                    option.value === formik.values.districtId
                                  );
                                })
                              : ''
                          }
                          // ref={selectDistrictRef}
                          options={districtList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                          }}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      ) : (
                        <Select
                          name='districtId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          value={
                            NoneList
                              ? NoneList.find((option) => option.value === 0)
                              : ''
                          }
                          options={NoneList}
                          // ref={selectDistrictRef}
                          isClearable={true}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                          }}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      )}
                      <div className={'is-invalid invalid-feedback'}>
                        {formik.errors.districtId
                          ? formik.errors.districtId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='jan' className='form-label font-chng'>
                        Jan
                      </label>
                      <input
                        name='jan'
                        value={formik.values.jan}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.jan && formik.touched.jan
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.jan : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='feb' className='form-label font-chng'>
                        Feb
                      </label>
                      <input
                        name='feb'
                        value={formik.values.feb}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.feb && formik.touched.feb
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.feb : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='mar' className='form-label font-chng'>
                        Mar
                      </label>
                      <input
                        name='mar'
                        value={formik.values.mar}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.mar && formik.touched.mar
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.mar : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='apr' className='form-label font-chng'>
                        Apr
                      </label>
                      <input
                        name='apr'
                        value={formik.values.apr}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.apr && formik.touched.apr
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.apr : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='may' className='form-label font-chng'>
                        May
                      </label>
                      <input
                        name='may'
                        value={formik.values.may}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.may && formik.touched.may
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.may : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='jun' className='form-label font-chng'>
                        Jun
                      </label>
                      <input
                        name='jun'
                        value={formik.values.jun}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.jun && formik.touched.jun
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.jun : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='jul' className='form-label font-chng'>
                        Jul
                      </label>
                      <input
                        name='jul'
                        value={formik.values.jul}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.jul && formik.touched.jul
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.jul : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='aug' className='form-label font-chng'>
                        Aug
                      </label>
                      <input
                        name='aug'
                        value={formik.values.aug}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.aug && formik.touched.aug
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.aug : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='sep' className='form-label font-chng'>
                        Sep
                      </label>
                      <input
                        name='sep'
                        value={formik.values.sep}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.sep && formik.touched.sep
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.sep : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='oct' className='form-label font-chng'>
                        Oct
                      </label>
                      <input
                        name='oct'
                        value={formik.values.oct}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.oct && formik.touched.oct
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.oct : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='nov' className='form-label font-chng'>
                        Nov
                      </label>
                      <input
                        name='nov'
                        value={formik.values.nov}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.nov && formik.touched.nov
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.nov : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='dec' className='form-label font-chng'>
                        Dec
                      </label>
                      <input
                        name='dec'
                        value={formik.values.dec}
                        onChange={formik.handleChange}
                        type='number'
                        className={
                          formik.errors.dec && formik.touched.dec
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors ? formik.errors.dec : ''}
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
            </div>
          </fieldset>
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
                  className='btn font-chng'
                  type='submit'
                  disabled={
                    location && location.state && location.state.id
                      ? true
                      : false
                  }
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
      </div>
    </FormikProvider>
  );
};
export default AddHydrocelectomyOperations;

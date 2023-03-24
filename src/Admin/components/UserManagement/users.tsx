import React, { useState, useEffect, useRef } from 'react';
import loginLogo from '../../assets/images/mhlogo.png';
import { useFormik, FormikProvider } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import * as Yup from 'yup';
import moment from 'moment';
import DropdownService from '../../../helpers/services/admin-dropDownService';
import WebsiteDropdownService from '../../../Website/services/DropdownService';
import Button from 'react-bootstrap/Button';
import { UserManagementInterface } from '../../../helpers/interfaces/userManagementInterface';
import Select, { Option } from 'react-select';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import UserService from '../../../helpers/services/userService';
import history from '../../../helpers/history';
import { MultiSelect } from 'react-multi-select-component';
import { components } from 'react-select';
import NumberFormat from 'react-number-format';
import ReactHtmlParser from 'react-html-parser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OptionLabel from '../../../helpers/selectOptionLabel';
import commonFunction from '../../../helpers/common/common';

const UserManagement: React.FC = () => {
  useEffect(() => {
    getDropDownData();
    getUsersEditData();
  }, []);
  let RoleDatalist: any;
  let activityDataList: any;
  let isValidDate = moment().format('YYYY-MM-DD');
  const location = useLocation<any>();
  const [data, setData] = useState([]);
  // const [designationList, setDesignationList] = useState([]);
  // const [activityData, setActivityData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [screendata, setScreenData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [institution, setInstitution] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const currentdate = moment().format('yyyy-MM-DD');
  let selectInstitutionRef: any = useRef();
  let [institutionValues, setInstitutionValues] = useState([]);
  const govtIdProofList = [
    { label: 'Passport', value: 1 },
    { label: 'Adhaar', value: 2 },
    { label: 'PAN Card', value: 3 },
    { label: 'RationCard', value: 4 },
    { label: ' Driving License,', value: 5 },
  ];
  const [users, setUsers] = useState<UserManagementInterface>({
    fullName: '',
    userName: '',
    email: '',
    mobileNumber: '',
    DOB: '',
    gender: '',
    govtIdProof: null,
    govtIdProofno: '',
    // designationId: "",
    institutionTypeId: '',
    districtId: '',
    institutionId: '',
    remarks: '',
    isActive: true,
    // activitiId: "",
    roleId: '',
    screenId: [],
  });

  const validSchema = Yup.object().shape({
    fullName: Yup.string().required('required').nullable(),
    email: Yup.string()
      .email('Email is invalid')
      .nullable()
      .required('required'),
    mobileNumber: Yup.string().required('required').nullable(),
    DOB: Yup.string().required('required').nullable(),
    gender: Yup.string().required('required').nullable(),
    // govtIdProof: Yup.string()
    //     .required('required').nullable(),
    // govtIdProofno: Yup.string()
    //     .required('required').nullable(),
    // designationId: Yup.string()
    //     .required('required').nullable(),
    // districtId: Yup.number().min(1, 'required').required('required'),
    institutionTypeId: Yup.string().nullable().required('required').nullable(),
    // activitiId: Yup.string()
    //     .required('required').nullable(),
    institutionId: Yup.string().required('required').nullable(),
    roleId: Yup.string().required('required').nullable(),
    screenId: Yup.array()
      .min(1, 'required')
      .of(
        Yup.object().shape({
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
      ),
  });

  const formik = useFormik({
    initialValues: users,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      let response;
      values.screenId = selectedOption;
      values.institutionTypeId = values.institutionTypeId
        ? values.institutionTypeId
        : 0;
      values.institutionId = values.institutionId ? values.institutionId : 0;
      values.districtId = values.districtId ? values.districtId : null;
      // values.activitiId = values.activitiId ? values.activitiId : 0;
      // values.designationId = values.designationId ? values.designationId : 0;

      if (location && location.state && location.state.id) {
        response = await UserService.updateUser(values, location.state.id);
        if (response && response.data) {
          history.push('/listUsers');
        }
      } else {
        response = await UserService.postUsers(values);
        if (response && response.data) {
          history.push('/listUsers');
        }
        if (response.message === 'Email/UserName already exists') {
          toast.warn('User Already Exists', {
            position: toast.POSITION.TOP_CENTER,
            className: 'toast-message',
          });
        }
      }
    },
  });

  async function getDropDownData() {
    // const DesignationData: any = await DropdownService.getDesignation();
    // if (DesignationData && DesignationData.data) {
    //     setDesignationList(DesignationData.data);
    // }

    const unitActionData: any = await DropdownService.getUnitAction();
    if (unitActionData && unitActionData.data) {
      setData(unitActionData.data);
    }

    // const activityDataList = await DropdownService.getActivity();
    // if (activityDataList && activityDataList.data) {
    //     setActivityData(activityDataList.data);
    // }

    const districtDataList = await DropdownService.getDistrictList();
    if (districtDataList && districtDataList.data) {
      setDistrictsData(districtDataList.data);
    }

    const ScreenData: any = await DropdownService.getScreen();
    if (ScreenData && ScreenData.data) {
      setScreenData(ScreenData.data);
    }

    const RoleDatalist = await DropdownService.getRole();
    if (RoleDatalist && RoleDatalist.data) {
      setRoleData(RoleDatalist.data);
    }

    const InstitutionData: any = await DropdownService.getInstution();

    if (InstitutionData && InstitutionData.data) {
      setInstitution(InstitutionData.data);
    }
  }

  // const designation = designationList && designationList.map((item: any, i: any) => {
  //     return ({ label: item.designationName, value: item.id });
  // });
  const InstitutionList =
    institutionValues &&
    institutionValues.map((item: any, i: any) => {
      if (item.facilityName) {
        return { label: item.facilityName, value: item.id };
      } else if (item.nameOfControlUnit) {
        return { label: item.nameOfControlUnit, value: item.id };
      } else if (item.fieldUnitName) {
        return { label: item.fieldUnitName, value: item.id };
      } else if (item.districtName) {
        return { label: item.districtName, value: item.id };
      } else if (item.stateName) {
        return { label: item.stateName, value: item.id };
      }
    });
  // const activityList = activityData && activityData.map((item: any, i: any) => {
  //     return ({ label: item.activityName, value: item.id });
  // });
  const ScreenList =
    screendata &&
    screendata.map((item: any, i: any) => {
      return { label: item.screenName, value: item.id, urlPath: item.urlPath };
    });

  const DistrictList =
    districtsData &&
    districtsData.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id, isDistrict: true };
    });

  const RoleList =
    roleData &&
    roleData.map((item: any, i: any) => {
      return { label: item.roleName, value: item.id };
    });
  const InstitutionTypeList =
    institution &&
    institution.map((item: any, i: any) => {
      return {
        label: item.institutionTypeName,
        value: item.id,
        shortName: item.institutionTypeShortName,
      };
    });
  const getInstitutionType = async (optionValue: any) => {
    console.log(
      'chk institution',
      optionValue,
      formik.values.institutionTypeId,
      institution
    );
    console.log('chk institutionTypeId', formik.values.institutionTypeId);
    if (
      optionValue.isDistrict &&
      (formik.values.institutionTypeId == '1' ||
        formik.values.institutionTypeId == '2')
    ) {
      let shortName = institution.find(
        (item) => item.id === formik.values.institutionTypeId
      )?.institutionTypeShortName;
      const institutionFacilities: any =
        await WebsiteDropdownService.getFilterFacility(
          shortName,
          optionValue.value
        );
      if (
        institutionFacilities &&
        institutionFacilities.data &&
        institutionFacilities.data.length > 0
      ) {
        selectInstitutionRef.current.select.clearValue();
        let facilityList: any = [
          OptionLabel.facilityNoneLabel,
          ...institutionFacilities.data,
        ];
        setInstitutionValues(facilityList);
      } else {
        selectInstitutionRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setInstitutionValues(Data);
      }
    }
    if (optionValue.shortName === 'PHC') {
      console.log('institution', institution, optionValue);
      let shortName = institution.find(
        (item) => item.id === optionValue.value
      )?.institutionTypeShortName;
      const institutionTypeId: any =
        await WebsiteDropdownService.getFilterFacility(
          shortName,
          formik.values.districtId
        );
      if (
        institutionTypeId &&
        institutionTypeId.data &&
        institutionTypeId.data.length > 0
      ) {
        selectInstitutionRef.current.select.clearValue();
        let facilityList: any = [
          OptionLabel.facilityNoneLabel,
          ...institutionTypeId.data,
        ];
        setInstitutionValues(facilityList);
      } else {
        selectInstitutionRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setInstitutionValues(Data);
      }
    } else if (
      optionValue.shortName === 'NFCU' ||
      optionValue.shortName === 'FCU' ||
      optionValue.shortName === 'FSU' ||
      optionValue.shortName === 'MC' ||
      optionValue.shortName === 'DMO'
    ) {
      const institutionTypeId: any = await WebsiteDropdownService.getNameOfUnit(
        optionValue.shortName,
        ''
      );
      if (
        institutionTypeId &&
        institutionTypeId.data &&
        institutionTypeId.data.length > 0
      ) {
        selectInstitutionRef.current.select.clearValue();
        let facilityList: any = [
          OptionLabel.facilityNoneLabel,
          ...institutionTypeId.data,
        ];
        setInstitutionValues(facilityList);
      } else {
        selectInstitutionRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setInstitutionValues(Data);
      }
    } else if (optionValue.shortName === 'NC') {
      const institutionTypeId: any =
        await WebsiteDropdownService.getFilterFieldUnit(optionValue.shortName);
      if (
        institutionTypeId &&
        institutionTypeId.data &&
        institutionTypeId.data.length > 0
      ) {
        selectInstitutionRef.current.select.clearValue();
        let facilityList: any = [
          OptionLabel.facilityNoneLabel,
          ...institutionTypeId.data,
        ];
        setInstitutionValues(facilityList);
      } else {
        selectInstitutionRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setInstitutionValues(Data);
      }
    } else if (optionValue.shortName === 'D') {
      const institutionTypeId = await WebsiteDropdownService.getDistrictInfo();
      if (institutionTypeId) {
        setInstitutionValues(institutionTypeId.data);
      }
    } else if (
      optionValue.shortName === 'S' ||
      optionValue.shortName === 'ADHS'
    ) {
      const institutionTypeId = await WebsiteDropdownService.getStateInfo();
      if (institutionTypeId) {
        setInstitutionValues(institutionTypeId.data);
      }
    }
  };
  const getInstitutionWhenView = async (option: any, institutionId: any) => {
    let InstitutionData: any = await DropdownService.getInstution();
    InstitutionData.data.map(async (item: any, i: any) => {
      if (item.id === option) {
        if (item.institutionTypeShortName === 'PHC') {
          const institutionTypeId: any =
            await WebsiteDropdownService.getFilterFacility(
              item.institutionTypeShortName,
              formik.values.districtId
            );
          if (
            institutionTypeId &&
            institutionTypeId.data &&
            institutionTypeId.data.length > 0
          ) {
            selectInstitutionRef.current.select.clearValue();
            let facilityList: any = [
              OptionLabel.facilityNoneLabel,
              ...institutionTypeId.data,
            ];
            setInstitutionValues(facilityList);
            formik.setFieldValue('institutionId', institutionId);
          } else {
            selectInstitutionRef.current.select.clearValue();
            let Data: any = [OptionLabel.facilityNoneLabel];
            setInstitutionValues(Data);
          }
        } else if (
          item.institutionTypeShortName === 'NFCU' ||
          item.institutionTypeShortName === 'FCU' ||
          item.institutionTypeShortName === 'FSU' ||
          item.institutionTypeShortName === 'MC' ||
          item.institutionTypeShortName === 'DMO'
        ) {
          const institutionTypeId: any =
            await WebsiteDropdownService.getNameOfUnit(
              item.institutionTypeShortName,
              ''
            );
          if (
            institutionTypeId &&
            institutionTypeId.data &&
            institutionTypeId.data.length > 0
          ) {
            selectInstitutionRef.current.select.clearValue();
            let facilityList: any = [
              OptionLabel.facilityNoneLabel,
              ...institutionTypeId.data,
            ];
            setInstitutionValues(facilityList);
            formik.setFieldValue('institutionId', institutionId);
          } else {
            selectInstitutionRef.current.select.clearValue();
            let Data: any = [OptionLabel.facilityNoneLabel];
            setInstitutionValues(Data);
          }
        } else if (item.institutionTypeShortName === 'NC') {
          const institutionTypeId: any =
            await WebsiteDropdownService.getFilterFieldUnit(
              item.institutionTypeShortName
            );
          if (
            institutionTypeId &&
            institutionTypeId.data &&
            institutionTypeId.data.length > 0
          ) {
            selectInstitutionRef.current.select.clearValue();
            let facilityList: any = [
              OptionLabel.facilityNoneLabel,
              ...institutionTypeId.data,
            ];
            setInstitutionValues(facilityList);
            formik.setFieldValue('institutionId', institutionId);
          } else {
            selectInstitutionRef.current.select.clearValue();
            let Data: any = [OptionLabel.facilityNoneLabel];
            setInstitutionValues(Data);
          }
        } else if (item.institutionTypeShortName === 'D') {
          let institutionTypeId =
            await WebsiteDropdownService.getDistrictInfo();
          if (institutionTypeId) {
            setInstitutionValues(institutionTypeId.data);
            formik.setFieldValue('institutionId', institutionId);
          }
        } else if (
          item.institutionTypeShortName === 'S' ||
          item.institutionTypeShortName === 'ADHS'
        ) {
          let institutionTypeId = await WebsiteDropdownService.getStateInfo();
          if (institutionTypeId) {
            setInstitutionValues(institutionTypeId.data);
            formik.setFieldValue('institutionId', institutionId);
          }
        }
      }
    });
  };
  const screenHandleChange = (selected: any) => {
    setSelectedOption(selected);
    formik.setFieldValue('screenId', selected);
  };
  let handleOptions = (e) => {
    if (e && e.label) {
      getInstitutionType(e);
    }
  };
  const genderList =
    data &&
    data.map((item: any, i: any) => {
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
  async function getUsersEditData() {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await UserService.getOneUser(id);
      if (response && response.data) {
        setUsers(response.data[0]);
        await getInstitutionWhenView(
          response.data[0].institutionTypeId,
          response.data[0].institutionId
        );
      }
      let selectedScreens: any = [];
      let selectedActivity: any = [];
      let selectedRole: any = [];
      if (response.data[0].id) {
        const responseUserRoleActivities =
          await UserService.getUserRoleActivities(response.data[0].id);
        await responseUserRoleActivities.data.forEach(async (element: any) => {
          if (element.screen) {
            selectedScreens.push({
              label: element.screen.screenName,
              value: element.screen.id,
              id: element.screen.id,
              urlPath: element.screen.urlPath,
            });
            await setSelectedOption(selectedScreens);
          }
        });
        // await responseUserRoleActivities.data.forEach(async(element: any) => {
        //   if(element.activity){
        //  // setUsers({...response.data[0],activitiId: element.activity.id });
        //   //selectedActivity =[{label: element.activity.id , value: element.activity.id}];
        //   //await  setActivityData(selectedActivity);
        //   }});

        // await responseUserRoleActivities.data.forEach(async(element: any) => {
        //     if(element.role){
        //     setUsers({...response.data[0],roleId: element.role.id });
        //     selectedRole =[{label: element.role.roleName , value: element.role.id}];
        //     await  setRoleData(selectedRole);
        //     }

        //   });
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
            className: 'toast-message',
          });
        }
      });
    }
  };

  return (
    <div className='content add-page'>
      <div className='card'>
        <div className='card-header'>
          {location.state && location.state.view ? (
            <h4 className='card-title'>View User</h4>
          ) : location.state && location.state.id ? (
            <h4 className='formtitlenew font-chng'>Edit User</h4>
          ) : (
            <h4 className='formtitlenew font-chng'>Add User</h4>
          )}
        </div>

        <div className='card-body'>
          <ToastContainer />
          <form onClick={showToast} onSubmit={formik.handleSubmit}>
            <>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row>
                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='fullName' className='form-label'>
                        FullName*
                      </label>
                      <input
                        name='fullName'
                        type='text'
                        className={
                          formik.errors.fullName && formik.touched.fullName
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        onChange={formik.handleChange}
                        value={formik.values.fullName}
                        onInput={(event) => commonFunction.onlyAlphabets(event)}
                      />

                      <div className={'invalid-feedback'}>
                        {formik.errors.fullName ? formik.errors.fullName : ''}
                      </div>
                    </div>
                  </div>
                  {location && location.state && location.state.id && (
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='fullName' className='form-label'>
                          UserName*
                        </label>
                        <input
                          name='fullName'
                          type='text'
                          className={
                            formik.errors.userName && formik.touched.userName
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          onChange={formik.handleChange}
                          value={formik.values.userName}
                          disabled
                        />

                        <div className={'invalid-feedback'}>
                          {formik.errors.userName ? formik.errors.userName : ''}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label'>
                        Email*
                      </label>
                      <input
                        name='email'
                        type='text'
                        className={
                          formik.errors.email && formik.touched.email
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        onChange={formik.handleChange}
                        value={formik.values.email}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.email ? formik.errors.email : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='mobileNumber' className='form-label'>
                        MobileNumber*
                      </label>
                      <NumberFormat
                        name='mobileNumber'
                        format='#### #### ##'
                        mask=''
                        placeholder='Phone Number Here'
                        className={
                          formik.errors.mobileNumber &&
                          formik.touched.mobileNumber
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        onChange={formik.handleChange}
                        value={formik.values.mobileNumber}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.mobileNumber
                          ? formik.errors.mobileNumber
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp form-view'>
                      <label htmlFor='DOB' className='form-label mt-s'>
                        DOB*
                      </label>
                      <input
                        type='date'
                        className={
                          formik.errors.DOB && formik.touched.DOB
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        name='DOB'
                        value={formik.values.DOB}
                        onChange={formik.handleChange}
                        max={moment().format('YYYY-MM-DD')}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.DOB ? formik.errors.DOB : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='Gender' className='form-label'>
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
                        {formik.errors.gender ? formik.errors.gender : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='govtIdProof' className='form-label'>
                        GovtID Proof
                      </label>

                      <Select
                        className={
                          formik.errors.govtIdProof &&
                          formik.touched.govtIdProof
                            ? 'custom-control is-invalid'
                            : 'custom-control'
                        }
                        name='govtIdProof'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        isClearable='true'
                        value={
                          govtIdProofList
                            ? govtIdProofList.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.govtIdProof
                              )
                            : ''
                        }
                        options={govtIdProofList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'govtIdProof',
                            option && option.value
                          );
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.govtIdProof
                          ? formik.errors.govtIdProof
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='govtIdProofno' className='form-label'>
                        GovtID Proof No
                      </label>
                      <input
                        name='govtIdProofno'
                        type='text'
                        className={
                          formik.errors.govtIdProofno &&
                          formik.touched.govtIdProofno
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        value={
                          formik.values.govtIdProofno
                            ? formik.values.govtIdProofno
                            : ''
                        }
                        onChange={formik.handleChange}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.govtIdProofno
                          ? formik.errors.govtIdProofno
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='districtId' className='form-label'>
                        District
                      </label>

                      <Select
                        className={
                          formik.errors.districtId && formik.touched.districtId
                            ? 'custom-control is-invalid'
                            : 'custom-control'
                        }
                        name='districtId'
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        value={
                          DistrictList
                            ? DistrictList.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.districtId
                              )
                            : 0
                        }
                        options={DistrictList}
                        onChange={async (option: any) => {
                          formik.setFieldValue(
                            'districtId',
                            option && option.value
                          );
                          handleOptions(option);
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.districtId
                          ? formik.errors.districtId
                          : ''}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-md-4 col-xl-3">
                                        <div className="form-grp">
                                            <label htmlFor="designationId" className="form-label">Designations*</label>

                                            <Select
                                                className={(formik.errors.designationId && formik.touched.designationId ? 'custom-control is-invalid' : 'custom-control')}
                                                name="designationId"
                                                isDisabled={location.state && location.state.view ? true : false}
                                                isClearable="true"
                                                value={designation ? designation.find((option: any) => option && option.value === formik.values.designationId) : ""}
                                                options={designation}
                                                onChange={(option: Option) => {
                                                    formik.setFieldValue("designationId", option && option.value);
                                                }}
                                            ></Select>
                                            <div className={"invalid-feedback"}>
                                                {formik.errors.designationId ? formik.errors.designationId : ""}
                                            </div>
                                        </div>
                                    </div> */}

                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='institutionTypeId' className='form-label'>
                        Institution Types*
                      </label>

                      <Select
                        className={
                          formik.errors.institutionTypeId &&
                          formik.touched.institutionTypeId
                            ? 'custom-control is-invalid'
                            : 'custom-control'
                        }
                        name='institutionTypeId'
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        value={
                          InstitutionTypeList
                            ? InstitutionTypeList.find(
                                (option: any) =>
                                  option &&
                                  option.value ===
                                    formik.values.institutionTypeId
                              )
                            : 0
                        }
                        options={InstitutionTypeList}
                        onChange={async (option: any) => {
                          formik.setFieldValue(
                            'institutionTypeId',
                            option && option.value
                          );
                          handleOptions(option);
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.institutionTypeId
                          ? formik.errors.institutionTypeId
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='institutionId' className='form-label'>
                        Institution*
                      </label>

                      <Select
                        className={
                          formik.errors.institutionId &&
                          formik.touched.institutionId
                            ? 'custom-control is-invalid'
                            : 'custom-control'
                        }
                        name='institutionId'
                        ref={selectInstitutionRef}
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        value={
                          InstitutionList
                            ? InstitutionList.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.institutionId
                              )
                            : ''
                        }
                        options={InstitutionList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'institutionId',
                            option && option.value
                          );
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.institutionTypeId
                          ? formik.errors.institutionTypeId
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='remarks' className='form-label'>
                        Remarks
                      </label>
                      <input
                        name='remarks'
                        type='text'
                        onChange={formik.handleChange}
                        value={
                          formik.values.remarks ? formik.values.remarks : ''
                        }
                        className='form-control'
                      />
                      {/* <div className={"invalid-feedback"}>
                                        {formik.errors.remarks ? formik.errors.remarks : ""}
                                    </div> */}
                    </div>
                  </div>

                  {/* <div className="col-md-4 col-xl-3">
                                        <div className="form-grp">
                                            <label htmlFor="activity" className="form-label">Activity*</label>

                                            <Select
                                                className={(formik.errors.activitiId && formik.touched.activitiId ? 'custom-control is-invalid' : 'custom-control')}
                                                name="activitiId"
                                                isClearable="true"
                                                isDisabled={location.state && location.state.view ? true : false}
                                                value={activityList ? activityList.find((option: any) => option && option.value === formik.values.activitiId) : ""}
                                                options={activityList}
                                                onChange={(option: Option) => {
                                                    formik.setFieldValue("activitiId", option && option.value);
                                                }}
                                            ></Select>
                                            <div className={"invalid-feedback"}>
                                                {formik.errors.activitiId ? formik.errors.activitiId : ""}
                                            </div>
                                        </div>
                                    </div> */}

                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='role' className='form-label'>
                        Role*
                      </label>

                      <Select
                        className={
                          formik.errors.roleId && formik.touched.roleId
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        name='roleId'
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        value={
                          RoleList
                            ? RoleList.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.roleId
                              )
                            : ''
                        }
                        options={RoleList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'roleId',
                            option && option.value
                          );
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.roleId ? formik.errors.roleId : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4 col-xl-3'>
                    <div className='form-grp'>
                      <label htmlFor='Screen' className='form-label'>
                        Screen*
                      </label>
                      <MultiSelect
                        className={
                          formik.errors.screenId && formik.touched.screenId
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        options={ScreenList}
                        value={selectedOption}
                        onChange={screenHandleChange}
                        disabled={
                          location.state && location.state.view ? true : false
                        }
                        labelledBy={'Select'}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.screenId ? formik.errors.screenId : ''}
                      </div>
                    </div>
                  </div>
                </Row>
              </fieldset>
            </>
            <div className='form-grp buttongrouprightend mb-4'>
              <button
                className='btn font-chng'
                style={{
                  marginRight: '10px',
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                  textTransform: 'none',
                }}
                onClick={() => history.push('/listUsers')}
              >
                Cancel
              </button>
              {location && location.state && location.state.view ? (
                ''
              ) : (
                <Button
                  type='submit'
                  id='Submitbtnid'
                  className='btn font-chng'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UserManagement;

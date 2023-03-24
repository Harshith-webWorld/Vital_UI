import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { years, months, reportTableStyle, getDistrictName } from '../../utils';
import Row from 'react-bootstrap/Row';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import { FormikProvider, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import Button from 'react-bootstrap/Button';
import DropdownService from '../../../../services/DropdownService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import {
  current_month,
  current_year,
  initmonth,
  previous_month,
  endMonthList,
  NoneList,
  monthList,
  yearList,
  findMonthName,
} from '../../../../../Components/constant';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { Menu, TablePagination as Paging } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterdataStyle: { textAlign: 'start', marginRight: '10px' },
    menuheading: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#00AEE6',
    },
    menu: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '20px',
      color: '#123962',
    },
    popup: {
      paddingLeft: '10px',
      maxWidth: '850px !important',
      '&.MuiMenu-paper': {
        maxWidth: '850px !important',
      },
    },
  })
);

const InfrastructureandTraining = () => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const userDistrictId = useUserDistrictId() || '';
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
      subCenterId: '',
      talukaId: '',
    };
  }, []);
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevsubCenterRef: any = React.useRef();
  const prevtalukaRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  const [districtName, setDistrictName] = useState('');
  let [districtIdValues, setdistrictIdValues] = useState([]);

  const [facilityId, setfacilityId] = useState();
  const [subCenterId, setsubCenterId] = useState();
  const [talukaId, settalukaId] = useState();

  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subCenterIdValues, setsubCenterIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const [facilityName, setfacilityName] = useState('');
  const [subCenterName, setsubCenterName] = useState('');
  const [talukaName, settalukaName] = useState('');

  const [stateLevelData, setStateLevelData] = useState({
    NoOfCentresWithSkilledStaff: '',
    NoOfFilariaPatientsManaged: '',
    NoOfFilarialHydroceleOperations: '',
  });
  const [subcenterLevelData, setsubcenterLevelData] = useState([
    {
      NoOfCentresWithSkilledStaff: '',
      NoOfFilariaPatientsManaged: '',
      NoOfFilarialHydroceleOperations: '',
      subCenterName: '',
    },
  ]);
  const [PHCLevelData, setPHCLevelData] = useState([
    {
      NoOfCentresWithSkilledStaff: '',
      NoOfFilariaPatientsManaged: '',
      NoOfFilarialHydroceleOperations: '',
      facilityName: '',
    },
  ]);
  useEffect(() => {
    const data = initialFilterValue();
    getMDAInfrastructure(data);
  }, [initialFilterValue]);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string(),
    facilityId: Yup.string(),
    subCenterId: Yup.string(),
    talukaId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
      subCenterId: '',
      talukaId: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      const {
        districtId,
        year,
        startMonth,
        endMonth,
        facilityId,
        subCenterId,
        talukaId,
      } = values;
      const data = {
        districtId: districtId ? `${districtId}` : '',
        year: `${year}`,
        startMonth: `${startMonth}`,
        endMonth: `${endMonth}`,
        facilityId: facilityId ? `${facilityId}` : '',
        subCenterId: subCenterId ? `${subCenterId}` : '',
        talukaId: `${talukaId}`,
      };
      setStartMonth(`${values.startMonth}`);
      setEndMonth(`${values.endMonth}`);
      setYear(`${values.year}`);
      setDistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      getMDAInfrastructure(data);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      setfacilityName('');
      setsubCenterName('');
      settalukaName('');
      setsubCenterIdValues([]);
      setfacilityIdValues([]);
      getMDAInfrastructure(initialFilterValue());
    },
  });

  async function getMDAInfrastructure(filterData) {
    const reportData = await ReportService.getMDAInfrastructure(filterData);
    if (reportData && reportData.data) {
      let tempsubcenter = reportData?.data?.subcentre?.map((item) => {
        return {
          NoOfCentresWithSkilledStaff: item?.NoOfCentresWithSkilledStaff
            ? item.NoOfCentresWithSkilledStaff
            : '',
          NoOfFilariaPatientsManaged: item?.NoOfFilariaPatientsManaged
            ? item.NoOfFilariaPatientsManaged
            : '',
          NoOfFilarialHydroceleOperations: item?.NoOfFilarialHydroceleOperations
            ? item.NoOfFilarialHydroceleOperations
            : '',
          subCenterName: item?.facilityName ? item.facilityName : '',
        };
      });
      setsubcenterLevelData(tempsubcenter);
      let tempphc = reportData?.data?.phc?.map((item) => {
        return {
          NoOfCentresWithSkilledStaff: item?.NoOfCentresWithSkilledStaff
            ? item.NoOfCentresWithSkilledStaff
            : '',
          NoOfFilariaPatientsManaged: item?.NoOfFilariaPatientsManaged
            ? item.NoOfFilariaPatientsManaged
            : '',
          NoOfFilarialHydroceleOperations: item?.NoOfFilarialHydroceleOperations
            ? item.NoOfFilarialHydroceleOperations
            : '',
          facilityName: item?.facilityName ? item.facilityName : '',
        };
      });
      setPHCLevelData(tempphc);

      setStateLevelData((prev) => {
        return {
          ...prev,
          NoOfCentresWithSkilledStaff: reportData.data.state[0]
            ?.NoOfCentresWithSkilledStaff
            ? reportData.data.state[0].NoOfCentresWithSkilledStaff
            : '',
          NoOfFilariaPatientsManaged: reportData.data.state[0]
            ?.NoOfFilariaPatientsManaged
            ? reportData.data.state[0].NoOfFilariaPatientsManaged
            : '',
          NoOfFilarialHydroceleOperations: reportData.data.state[0]
            ?.NoOfFilarialHydroceleOperations
            ? reportData.data.state[0].NoOfFilarialHydroceleOperations
            : '',
        };
      });
    }
  }

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
      setfacilityIdValues([]);
      settalukaIdValues([]);
      setsubCenterIdValues([]);
    }
  }
  async function getfacility(e: any) {
    if (e && e.value) {
      setfacilityId(e && e.value);
      setsubCenterIdValues([]);
    }
  }
  async function getsubCenter(e: any) {
    if (e && e.value) {
      setsubCenterId(e && e.value);
    }
  }
  async function gettaluka(e: any) {
    if (e && e.value) {
      settalukaId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setDistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }
  }
  const getSubcenterInfo = useCallback(() => {
    async function getData() {
      if (formik.values.districtId && formik.values.facilityId) {
        const subcenterId: any = await DropdownService.getOneSubCenter(
          formik.values.facilityId,
          formik.values.districtId
        );
        if (subcenterId && subcenterId.data) {
          setsubCenterIdValues(subcenterId.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.facilityId]);

  const getfacilityId = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const facility: any = await DropdownService.getOneFacility(
          formik.values.districtId
        );
        if (facility && facility.data && facility.data.length > 0) {
          setfacilityIdValues(facility.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);

  const getTalukacontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const taluka: any = await DropdownService.getOneTaluka(
          formik.values.districtId
        );
        if (taluka && taluka.data && taluka.data.length > 0) {
          settalukaIdValues(taluka.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);
  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevsubCenterRef.current = subCenterId;
    prevtalukaRef.current = talukaId;
  }, []);

  useEffect(() => {
    getSubcenterInfo();
    getfacilityId();
    getTalukacontent();
  }, [getSubcenterInfo, getfacilityId, getTalukacontent]);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
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

  const talukaIdList =
    talukaIdValues &&
    talukaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });

  const accumulatedData = (phcData, subCenterData) => {
    let phcJsXData = phcData?.length > 0 &&
      phcData?.map((item) => {
        if (item.NoOfCentresWithSkilledStaff) {
          return (
            <tr>
              <td>PHC - {item.facilityName}</td>{' '}
              <td align='center' colSpan={2}>
                {item.NoOfCentresWithSkilledStaff}
              </td>
              <td align='center' colSpan={2}>
                {item.NoOfFilariaPatientsManaged}
              </td>
              <td align='center' colSpan={2}>
                {item.NoOfFilarialHydroceleOperations}
              </td>
            </tr>
          );
        }
      })
    let subCenterJsXData = subCenterData?.length > 0 &&
      subCenterData?.map((item) => {
        if (item.NoOfCentresWithSkilledStaff) {
          return (
            <tr>
              <td>Subcentre - {item.subCenterName}</td>{' '}
              <td align='center' colSpan={2}>
                {item.NoOfCentresWithSkilledStaff}
              </td>
              <td align='center' colSpan={2}>
                {item.NoOfFilariaPatientsManaged}
              </td>
              <td align='center' colSpan={2}>
                {item.NoOfFilarialHydroceleOperations}
              </td>
            </tr>
          );
        }
      })
    let accumulated = phcJsXData?.length > 0 ? phcJsXData : []
    accumulated = subCenterJsXData?.length > 0 ? [...accumulated, ...subCenterJsXData] : accumulated
    return accumulated.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    // return [phcJsXData?.length > 0 && phcJsXData,
    //   subCenterJsXData?.length > 0 && subCenterJsXData]
  }
  return (
    <div>
      <style>{`
    td {
      padding: 6px 20px;
      white-space: nowrap;
    }
  `}</style>
      <div
        style={{
          backgroundColor: '#ffff',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', marginTop: '2%', marginBottom: '2%' }}>
          <p className='rpthead'>
            Health infrastructure available with trained health staff to manage
            Lymphedema patients during Year
          </p>
        </div>{' '}
        <div
          style={{
            display: 'flex',
            float: 'right',
            marginBottom: '1%',
          }}
        >
          <button
            className='mt-m font-chng btn btn-secondary1'
            onClick={() =>
              Exportpdf(
                'table-to-xlsnew',
                `Health infrastructure available with trained health staff to manage
        Lymphedema patients during Year.pdf`,
                'p',
                210,
                295
              )
            }
          >
            Export as PDF
          </button>
          <ReactHTMLTableToExcel
            className='mt-m font-chng btn btn-secondary1'
            id='test-table-xls-button'
            table='table-to-xlsnew'
            filename='Health infrastructure available with trained health staff to manage
        Lymphedema patients during Year'
            sheet='Health infrastructure available with trained health staff to manage
        Lymphedema patients during Year'
            buttonText=' Export as xsl'
          />

          <PopupState variant='popover' popupId='demo-popup-menu'>
            {(popupState) => (
              <div>
                <FilterListIcon
                  style={{
                    marginRight: '15px',
                    cursor: 'pointer',
                    float: 'right',
                    marginTop: '50%',
                    margin: 'auto',
                  }}
                  {...bindTrigger(popupState)}
                >
                  Filter
                </FilterListIcon>
                <Menu {...bindMenu(popupState)} style={{ padding: '0px' }}>
                  <div className={classes.popup}>
                    <div style={{ display: 'flex' }}>
                      <FormikProvider value={formik}>
                        <form
                          style={{ width: '100%' }}
                          onSubmit={formik.handleSubmit}
                          onChange={formik.handleChange}
                          onReset={formik.handleReset}
                        >
                          <Row className='mb-3' style={{ padding: '0 20px' }}>
                            <div className='col-md-12 col-xl-4 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='districtId'
                                  className='form-label font-chng'
                                >
                                  District
                                </label>
                                {districtIdValues &&
                                  districtIdValues.length !== 0 ? (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='districtId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    options={districtIdList}
                                    isClearable='true'
                                    isDisabled={!!userDistrictId}
                                    className={
                                      formik.errors.districtId &&
                                        formik.touched.districtId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.districtId !== ''
                                        ? districtIdList
                                          ? districtIdList.find(
                                            (option) =>
                                              option &&
                                              option.value ===
                                              formik.values.districtId
                                          )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'districtId',
                                        option && option.value
                                      );
                                      getDistrict(option);
                                      setDistrictName(option && option.label);
                                      formik.setFieldValue('subCenterId', '');
                                      formik.setFieldValue('facilityId', '');
                                      formik.setFieldValue('talukaId', '');
                                      setsubCenterIdValues([]);
                                      setfacilityIdValues([]);
                                      settalukaIdValues([]);
                                    }}
                                  ></Select>
                                ) : (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='districtId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    //options={NoneList}
                                    className='custom-select'
                                    options={NoneList}
                                    isClearable='true'
                                    value={
                                      NoneList
                                        ? NoneList.find(
                                          (option) =>
                                            option &&
                                            option.value ===
                                            parseInt(
                                              formik.values.districtId
                                            )
                                        )
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'districtId',
                                        option && option.value
                                      );
                                    }}
                                  ></Select>
                                )}
                                <div className={'invalid-feedback'}>
                                  {formik.errors
                                    ? formik.errors.districtId
                                    : ''}
                                </div>
                              </div>
                            </div>
                            <div className='col-md-12 col-xl-8 col-12'>
                              {' '}
                              <label className='form-label font-chng'>
                                Month
                              </label>
                              <Row>
                                <div className='col-md-1 col-xl-1 col-12'>
                                  <label
                                    className='form-label font-chng'
                                    style={{ paddingTop: '6px' }}
                                  >
                                    From
                                  </label>
                                </div>
                                <div className='col-md-5 col-xl-5 col-12'>
                                  <div className='form-grp'>
                                    <Select
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: '9999',
                                        }),
                                        control: (base) => ({
                                          ...base,
                                          borderColor: '#ced4da',
                                          fontSize: '14px',
                                          color: '#212529',
                                          minHeight: '35px',
                                          height: '35px',
                                          '&:hover': {
                                            borderColor: '#ced4da',
                                          },
                                        }),
                                        menu: (base) => ({
                                          top: '100%',
                                          backgroundColor: 'hsl(0, 0%, 100%)',
                                          borderRadius: '4',
                                          boxShadow:
                                            '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                          marginBottom: '8px',
                                          marginTop: '8px',
                                          position: 'absolute',
                                          width: '100%',
                                          boxSizing: 'border-box',
                                          zIndex: '9999',
                                        }),
                                        placeholder: (base) => ({
                                          color: '#212529',
                                          fontSize: '13px',
                                        }),
                                        indicatorContainer: (base) => ({
                                          color: '#212529',
                                        }),
                                      }}
                                      className={
                                        formik.errors.startMonth &&
                                          formik.touched.startMonth
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='startMonth'
                                      isClearable='true'
                                      value={
                                        formik.values.startMonth !== ''
                                          ? monthList
                                            ? monthList.find(
                                              (option: any) =>
                                                option &&
                                                option.value ==
                                                formik.values.startMonth
                                            )
                                            : ''
                                          : monthList.find(
                                            (option: any) =>
                                              option &&
                                              option.value == previous_month
                                          )
                                      }
                                      options={monthList}
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'startMonth',
                                          option ? option.value : ''
                                        );
                                        formik.setFieldValue(
                                          'endMonth',
                                          option ? option.value : ''
                                        );
                                        // setstartMonth(
                                        //   option ? option.label : ''
                                        // );
                                      }}
                                    ></Select>
                                    <div className={'invalid-feedback'}>
                                      {formik.errors
                                        ? formik.errors.startMonth
                                        : ''}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-1 col-xl-1 col-12'>
                                  <label
                                    className='form-label font-chng'
                                    style={{ paddingTop: '6px' }}
                                  >
                                    &nbsp;&nbsp;To
                                  </label>
                                </div>
                                <div className='col-md-5 col-xl-5 col-12'>
                                  <div className='form-grp'>
                                    <Select
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: '9999',
                                        }),
                                        control: (base) => ({
                                          ...base,
                                          borderColor: '#ced4da',
                                          fontSize: '14px',
                                          color: '#212529',
                                          minHeight: '35px',
                                          height: '35px',
                                          '&:hover': {
                                            borderColor: '#ced4da',
                                          },
                                        }),
                                        menu: (base) => ({
                                          top: '100%',
                                          backgroundColor: 'hsl(0, 0%, 100%)',
                                          borderRadius: '4',
                                          boxShadow:
                                            '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                          marginBottom: '8px',
                                          marginTop: '8px',
                                          position: 'absolute',
                                          width: '100%',
                                          boxSizing: 'border-box',
                                          zIndex: '9999',
                                        }),
                                        placeholder: (base) => ({
                                          color: '#212529',
                                          fontSize: '13px',
                                        }),
                                        indicatorContainer: (base) => ({
                                          color: '#212529',
                                        }),
                                      }}
                                      className={
                                        formik.errors.endMonth &&
                                          formik.touched.endMonth
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='endMonth'
                                      isClearable='true'
                                      value={
                                        formik.values.endMonth !== ''
                                          ? endMonthList(
                                            formik.values.startMonth
                                          )?.find(
                                            (option: any) =>
                                              option &&
                                              option.value ==
                                              formik.values.endMonth
                                          )
                                          : endMonthList(
                                            formik.values.startMonth
                                          )?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == previous_month
                                          )
                                      }
                                      options={
                                        formik.values.startMonth
                                          ? endMonthList(
                                            formik.values.startMonth
                                          )
                                          : NoneList
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'endMonth',
                                          option ? option.value : ''
                                        );
                                        // setendMonth(option ? option.label : '');
                                      }}
                                    ></Select>
                                    <div className={'invalid-feedback'}>
                                      {formik.errors
                                        ? formik.errors.endMonth
                                        : ''}
                                    </div>
                                  </div>
                                </div>
                              </Row>
                            </div>
                            <div className='col-md-6 col-xl-4 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='email'
                                  className='form-label font-chng'
                                >
                                  Year
                                </label>
                                <Select
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: '9999',
                                    }),
                                    control: (base) => ({
                                      ...base,
                                      borderColor: '#ced4da',
                                      fontSize: '14px',
                                      color: '#212529',
                                      minHeight: '35px',
                                      height: '35px',
                                      '&:hover': {
                                        borderColor: '#ced4da',
                                      },
                                    }),
                                    menu: (base) => ({
                                      top: '100%',
                                      backgroundColor: 'hsl(0, 0%, 100%)',
                                      borderRadius: '4',
                                      boxShadow:
                                        '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                      marginBottom: '8px',
                                      marginTop: '8px',
                                      position: 'absolute',
                                      width: '100%',
                                      boxSizing: 'border-box',
                                      zIndex: '9999',
                                    }),
                                    placeholder: (base) => ({
                                      color: '#212529',
                                      fontSize: '13px',
                                    }),
                                    indicatorContainer: (base) => ({
                                      color: '#212529',
                                    }),
                                  }}
                                  className={
                                    formik.errors.year && formik.touched.year
                                      ? 'custom-select is-invalid'
                                      : 'custom-select'
                                  }
                                  name='year'
                                  isClearable='true'
                                  value={
                                    formik.values.year !== ''
                                      ? yearList
                                        ? yearList.find(
                                          (option: any) =>
                                            option &&
                                            option.value == formik.values.year
                                        )
                                        : ''
                                      : ''
                                  }
                                  options={yearList}
                                  onChange={(option: Option) => {
                                    formik.setFieldValue(
                                      'year',
                                      option ? option.value : ''
                                    );
                                    // setyear(option ? option.label : '');
                                  }}
                                ></Select>
                                <div className={'invalid-feedback'}>
                                  {formik.errors ? formik.errors.year : ''}
                                </div>
                              </div>
                            </div>
                            <div className='col-md-6 col-xl-4 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='districtId'
                                  className='form-label font-chng'
                                >
                                  Facility
                                </label>
                                {facilityIdValues &&
                                  facilityIdValues.length !== 0 ? (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='facilityId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    options={facilityIdList}
                                    isClearable='true'
                                    className={
                                      formik.errors.facilityId &&
                                        formik.touched.facilityId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.facilityId !== ''
                                        ? facilityIdList
                                          ? facilityIdList.find(
                                            (option) =>
                                              option &&
                                              option.value ===
                                              formik.values.facilityId
                                          )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'facilityId',
                                        option ? option.value : ''
                                      );
                                      getfacility(option);
                                      setfacilityName(
                                        option ? option.label : ''
                                      );
                                      formik.setFieldValue('subCenterId', '');
                                      setsubCenterIdValues([]);
                                    }}
                                  ></Select>
                                ) : (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='facilityId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    //options={NoneList}
                                    className='custom-select'
                                    options={NoneList}
                                    isClearable='true'
                                    value=''
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'facilityId',
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>
                                )}
                                <div className={'invalid-feedback'}>
                                  {formik.errors
                                    ? formik.errors.facilityId
                                    : ''}
                                </div>
                              </div>
                            </div>
                            <div className='col-md-6 col-xl-4 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='districtId'
                                  className='form-label font-chng'
                                >
                                  Subcenter
                                </label>
                                {subCenterIdValues &&
                                  subCenterIdValues.length !== 0 ? (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='subCenterId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    options={subCenterIdList}
                                    isClearable='true'
                                    className={
                                      formik.errors.subCenterId &&
                                        formik.touched.subCenterId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.subCenterId !== ''
                                        ? subCenterIdList
                                          ? subCenterIdList.find(
                                            (option) =>
                                              option &&
                                              option.value ===
                                              formik.values.subCenterId
                                          )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'subCenterId',
                                        option ? option.value : ''
                                      );
                                      getsubCenter(option);
                                      setsubCenterName(
                                        option ? option.label : ''
                                      );
                                    }}
                                  ></Select>
                                ) : (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='subCenterId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    //options={NoneList}
                                    className='custom-select'
                                    options={NoneList}
                                    isClearable='true'
                                    value=''
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'subCenterId',
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>
                                )}
                                <div className={'invalid-feedback'}>
                                  {formik.errors
                                    ? formik.errors.subCenterId
                                    : ''}
                                </div>
                              </div>
                            </div>
                            <div className='col-md-6 col-xl-4 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='districtId'
                                  className='form-label font-chng'
                                >
                                  Taluka
                                </label>
                                {talukaIdValues &&
                                  talukaIdValues.length !== 0 ? (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='talukaId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    options={talukaIdList}
                                    isClearable='true'
                                    className={
                                      formik.errors.talukaId &&
                                        formik.touched.talukaId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.talukaId !== ''
                                        ? talukaIdList
                                          ? talukaIdList.find(
                                            (option) =>
                                              option &&
                                              option.value ===
                                              formik.values.talukaId
                                          )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'talukaId',
                                        option ? option.value : ''
                                      );
                                      gettaluka(option);
                                      settalukaName(option ? option.label : '');
                                    }}
                                  ></Select>
                                ) : (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='talukaId'
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: '9999',
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        borderColor: '#ced4da',
                                        fontSize: '14px',
                                        color: '#212529',
                                        minHeight: '35px',
                                        height: '35px',
                                        '&:hover': {
                                          borderColor: '#ced4da',
                                        },
                                      }),
                                      menu: (base) => ({
                                        top: '100%',
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        borderRadius: '4',
                                        boxShadow:
                                          '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                        marginBottom: '8px',
                                        marginTop: '8px',
                                        position: 'absolute',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        zIndex: '9999',
                                      }),
                                      placeholder: (base) => ({
                                        color: '#212529',
                                        fontSize: '13px',
                                      }),
                                      indicatorContainer: (base) => ({
                                        color: '#212529',
                                      }),
                                    }}
                                    //options={NoneList}
                                    className='custom-select'
                                    options={NoneList}
                                    isClearable='true'
                                    value=''
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'talukaId',
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>
                                )}
                                <div className={'invalid-feedback'}>
                                  {formik.errors ? formik.errors.talukaId : ''}
                                </div>
                              </div>
                            </div>
                            <div
                              className='col-md-6 col-xl-12 col-12 right-wrappernew '
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                              }}
                            >
                              <button
                                onClick={popupState.close}
                                className='mt-m font-chng btn btn-secondary1'
                                type='submit'
                              >
                                Filter
                              </button>
                              <button
                                className='mt-m font-chng btn btn-secondary1'
                                type='reset'
                                onClick={() => {
                                  formik.resetForm();
                                }}
                                style={{ marginLeft: '10px' }}
                              >
                                Clear
                              </button>
                            </div>
                          </Row>{' '}
                        </form>
                      </FormikProvider>{' '}
                      <Icon
                        onClick={popupState.close}
                        style={{ height: '2em' }}
                      >
                        <CloseIcon
                          style={{ width: '1rem', cursor: 'pointer' }}
                        />
                      </Icon>
                    </div>
                  </div>
                </Menu>
              </div>
            )}
          </PopupState>
        </div>
        <div style={{ display: 'flex', marginBottom: '1%' }}>
          <div className={classes.filterdataStyle}>
            {startMonth !== '' ? `Month from - ` : ''}
            {startMonth !== '' && <b> {findMonthName(startMonth)}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {endMonth !== '' ? `Month to -  ` : ''}
            {endMonth !== '' && <b>{findMonthName(endMonth)}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {year !== '' ? `Year - ` : ''}
            {year !== '' && <b> {year}</b>}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {facilityName !== '' ? `Facility - ` : ''}
            {facilityName !== '' && <b> {facilityName}</b>}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {subCenterName !== '' ? `SubCenter - ` : ''}
            {subCenterName !== '' && <b> {subCenterName}</b>}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td>Level of Healthcare</td>
                  <td colSpan={2}>
                    No.of centres with
                    <br /> skilled staff
                  </td>
                  <td colSpan={2}>
                    No.of filaria patients
                    <br /> managed
                  </td>
                  <td colSpan={2}>
                    No.of filarial hydrocele operations
                    <br /> undertaken in the ELF
                  </td>
                </tr>
              </thead>

              <tbody>
                {' '}
                <tr>
                  <td>State level</td>
                  {stateLevelData.NoOfCentresWithSkilledStaff ? (
                    <>
                      {' '}
                      <td align='center' colSpan={2}>
                        {stateLevelData.NoOfCentresWithSkilledStaff}
                      </td>
                      <td align='center' colSpan={2}>
                        {stateLevelData.NoOfFilariaPatientsManaged}
                      </td>
                      <td align='center' colSpan={2}>
                        {stateLevelData.NoOfFilarialHydroceleOperations}
                      </td>
                    </>
                  ) : (
                    <td
                      colSpan={5}
                      style={{ textAlign: 'center', height: '100px' }}
                    >
                      No Data found
                    </td>
                  )}{' '}
                </tr>
                {
                  accumulatedData(PHCLevelData, subcenterLevelData)
                }
                {/* {PHCLevelData?.length > 0 &&
                  PHCLevelData?.map((item) => {
                    if (item.NoOfCentresWithSkilledStaff) {
                      return (
                        <tr>
                          <td>PHC - {item.facilityName}</td>{' '}
                          <td align='center' colSpan={2}>
                            {item.NoOfCentresWithSkilledStaff}
                          </td>
                          <td align='center' colSpan={2}>
                            {item.NoOfFilariaPatientsManaged}
                          </td>
                          <td align='center' colSpan={2}>
                            {item.NoOfFilarialHydroceleOperations}
                          </td>
                        </tr>
                      );
                    }
                  })}
                {subcenterLevelData?.length > 0 &&
                  subcenterLevelData?.map((item) => {
                    if (item.NoOfCentresWithSkilledStaff) {
                      return (
                        <tr>
                          <td> Subcentre - {item.subCenterName} </td>
                          <td align='center' colSpan={2}>
                            {item.NoOfCentresWithSkilledStaff}
                          </td>
                          <td align='center' colSpan={2}>
                            {item.NoOfFilariaPatientsManaged}
                          </td>
                          <td align='center' colSpan={2}>
                            {item.NoOfFilarialHydroceleOperations}
                          </td>
                        </tr>
                      );
                    }
                  })} */}
                {/* {stateLevelData.NoOfCentresWithSkilledStaff && (
              <tr>
                <td >Total</td>
                <td  align='center' colSpan={2}>
                  {stateLevelData.NoOfCentresWithSkilledStaff +
                    item.NoOfCentresWithSkilledStaff +
                    subcenterLevelData.NoOfCentresWithSkilledStaff}
                </td>
                <td  align='center' colSpan={2}>
                  {stateLevelData.NoOfFilariaPatientsManaged +
                    item.NoOfFilariaPatientsManaged +
                    subcenterLevelData.NoOfFilariaPatientsManaged}
                </td>
                <td  align='center' colSpan={2}>
                  {stateLevelData.NoOfFilarialHydroceleOperations +
                    item.NoOfFilarialHydroceleOperations +
                    subcenterLevelData.NoOfFilarialHydroceleOperations}
                </td>
              </tr>
            )} */}
              </tbody>
            </table>
          </TableContainer>
        </div>


        {<div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {' '}
          <Paging
            rowsPerPageOptions={[10, 25, 50, 100]}
            count={+PHCLevelData?.length + (+subcenterLevelData?.length) + 1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ border: 'none' }}
          />
        </div>}
      </div>
    </div>
  );
};
export default InfrastructureandTraining;

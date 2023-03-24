import React, { useState, useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReportService from '../../../../services/ReportService';
import { useSelector } from 'react-redux';
import {
  years,
  columnYears,
  reversedYears,
  reportTableStyle,
} from '../../utils';
import TableContainer from '@material-ui/core/TableContainer';
import { Menu, TablePagination as Paging, Icon } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
  current_month,
  current_year,
  findtotal,
  endYearGenerate,
  endMonthList,
  findMonthName,
  monthList,
  NoneList,
} from '../../../../../Components/constant';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';

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

const Analysis3 = () => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const [reportTableData, setreportTableData] = useState([]);
  const userDistrictId = useUserDistrictId() || '';
  const prevDistrictRef: any = React.useRef();
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState(`${current_year}`);
  const [districtId, setdistrictId] = useState('');
  const [districtName, setdistrictName] = useState('');
  const [colYears, setColYears] = useState([...columnYears]);
  const [initialFilterValue] = useState({
    districtId: userDistrictId,
    startYear: colYears[0],
    endYear: colYears[colYears.length - 1],
  });
  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
    setStartYear(colYears[0]);
    setEndYear(colYears[colYears.length - 1]);
  }, []);
  useEffect(() => {
    const data = initialFilterValue;
    getReportAnalysisThree(data);
  }, [initialFilterValue]);

  let validSchema = Yup.object().shape({
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('district is required').nullable(),
    }),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      endYear: `${current_year}`,
      startYear: `${current_year}`,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      getReportAnalysisThree(values);
      setEndYear(`${values.endYear}`);
      setStartYear(`${values.startYear}`);
    },
    onReset: (values) => {
      setEndYear(`${current_year}`);
      setStartYear(`${current_year}`);
    },
  });

  let [districtIdValues, setdistrictIdValues] = useState([]);

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];

  let endYearList: any =
    formik.values.startYear === ''
      ? [{ label: current_year, value: current_year }]
      : endYearGenerate(formik.values.startYear);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  console.log(districtIdList);

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      let temp = districtId.data.find(
        (option: any) => option.id == userDistrictId
      );
      setdistrictName(temp.districtName);
    }
  }

  async function getReportAnalysisThree(filterData) {
    const reportData: any = await ReportService.getReportLfAnalysis3(
      filterData
    );
    if (reportData) {
      setreportTableData(reportData.data);
    }
  }

  const dataDisplay = (detailsName: any, year: any) => {
    let extractData =
      reportTableData &&
      reportTableData.filter((item: any) => {
        return item.year === year;
      });
    let myObj: any = extractData.length > 0 ? extractData[0] : {};
    let obj: any = {};
    myObj.hasOwnProperty(`${detailsName}`)
      ? (obj = myObj)
      : (obj[detailsName] = 0);
    let result: any = obj;
    return result;
  };

  const filterColumns = (startDate: any, endDate: any) => {
    if (startDate !== '') {
      let startDateIndex = startDate
        ? reversedYears.indexOf(startDate)
        : reversedYears.indexOf(2017);
      let endDateIndex = reversedYears.indexOf(endDate);
      let filteredColumns = reversedYears.slice(
        startDateIndex,
        endDateIndex + 1
      );
      return filteredColumns;
    } else {
      return columnYears;
    }
  };

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
        <div style={{ marginTop: '1%' }}>
          <p className='rpthead'>
            {' '}
            Consolidated district report on Lymphedema morbidity Management and
            Hydrocele cases
          </p>{' '}
          <div
            style={{
              display: 'flex',
              float: 'right',
              marginBottom: '2%',
            }}
          >
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf(
                  'table-to-xlsnew',
                  `Consolidated district report on Lymphedema morbidity Management and
            Hydrocele cases.pdf`,
                  'l',
                  295,
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
              filename='Consolidated district report on Lymphedema morbidity Management and
            Hydrocele cases'
              sheet='Consolidated district report on Lymphedema morbidity Management and
            Hydrocele cases'
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
                                    options={
                                      districtIdValues &&
                                      districtIdValues.length !== 0
                                        ? districtIdList
                                        : NoneList
                                    }
                                    // isClearable='false'
                                    isDisabled={!!userDistrictId}
                                    className={
                                      formik.errors.districtId &&
                                      formik.touched.districtId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.districtId == ''
                                        ? districtIdList?.find(
                                            (option) =>
                                              option && option.value == 24
                                          )
                                        : districtIdList?.find(
                                            (option) =>
                                              option &&
                                              option.value ==
                                                formik.values.districtId
                                          )
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'districtId',
                                        option ? option.value : ''
                                      );
                                      getDistrict(option);
                                      // setdistrictName(
                                      //   option ? option.label : ''
                                      // );
                                    }}
                                  ></Select>

                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.districtId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-12 col-xl-8 col-12'>
                                <label className='form-label font-chng'>
                                  Year
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
                                          formik.errors.startYear &&
                                          formik.touched.startYear
                                            ? 'custom-select is-invalid'
                                            : 'custom-select'
                                        }
                                        name='startYear'
                                        isClearable='true'
                                        value={
                                          formik.values.startYear !== ''
                                            ? yearList
                                              ? yearList.find(
                                                  (option: any) =>
                                                    option &&
                                                    option.value ===
                                                      formik.values.startYear
                                                )
                                              : ''
                                            : ''
                                        }
                                        options={yearList}
                                        onChange={(option: Option) => {
                                          formik.setFieldValue(
                                            'startYear',
                                            option ? option.value : ''
                                          );
                                          // setStartYear(
                                          //   option ? option.label : colYears[0]
                                          // );
                                        }}
                                      ></Select>
                                      <div className={'invalid-feedback'}>
                                        {formik.errors
                                          ? formik.errors.startYear
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
                                          formik.errors.endYear &&
                                          formik.touched.endYear
                                            ? 'custom-select is-invalid'
                                            : 'custom-select'
                                        }
                                        name='endYear'
                                        isClearable='true'
                                        value={
                                          // formik.values.endYear !== current_year ?
                                          endYearList.find(
                                            (option: any) =>
                                              option &&
                                              option.value ===
                                                formik.values.endYear
                                          )
                                        }
                                        options={endYearList}
                                        s
                                        onChange={(option: Option) => {
                                          formik.setFieldValue(
                                            'endYear',
                                            option ? option.value : current_year
                                          );
                                          // setEndYear(
                                          //   option ? option.label : current_year
                                          // );
                                        }}
                                      ></Select>
                                      <div className={'invalid-feedback'}>
                                        {formik.errors
                                          ? formik.errors.endYear
                                          : ''}
                                      </div>
                                    </div>
                                  </div>
                                </Row>
                              </div>

                              <div
                                className='col-md-6 col-xl-12 col-12 right-wrappernew'
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
                                  Filter{' '}
                                </button>
                                <button
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='reset'
                                  style={{ marginLeft: '10px' }}
                                >
                                  Clear{' '}
                                </button>
                              </div>
                            </Row>
                          </form>
                        </FormikProvider>
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
          </div>{' '}
        </div>{' '}
        <div
          style={{ display: 'flex', fontFamily: 'poppins', fontWeight: '500' }}
        >
          <div className={classes.filterdataStyle}>
            {' '}
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {startYear !== '' ? `Start year - ` : ''}
            {startYear !== '' && <b> {startYear}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {endYear !== '' ? `End year -  ` : ''}
            {endYear !== '' && <b>{endYear}</b>}{' '}
          </div>
        </div>
        <TableContainer>
          <table id='table-to-xlsnew'>
            <thead>
              <tr>
                <td>Sr.No.</td>
                <td>Details</td>
                {colYears.map((year, index) => (
                  <td key={`D${index}`}>{year}</td>
                ))}
              </tr>{' '}
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>No.of LF cases line listed</td>
                {colYears.map((year, index) => (
                  <td key={`NLF${index}`}>
                    {dataDisplay('NoLFCases', year).NoLFCases}
                  </td>
                ))}
              </tr>{' '}
              <tr>
                <td>2</td>
                <td>No.of LF cases trained during this month for MM</td>
                {colYears.map((year, index) => (
                  <td key={`NLFT${index}`}>
                    {dataDisplay('NoLFCasesTrainedMM', year).NoLFCasesTrainedMM}
                  </td>
                ))}
              </tr>{' '}
              <tr>
                <td>3</td>
                <td>Balance to be trained</td>
                {colYears.map((year, index) => (
                  <td key={`BT${index}`}>
                    {
                      dataDisplay('NoBalanceToBeTrained', year)
                        .NoBalanceToBeTrained
                    }
                  </td>
                ))}
              </tr>{' '}
              <tr>
                <td>4</td>
                <td>NNo. of trained LF cases following MM</td>
                {colYears.map((year, index) => (
                  <td key={`NLFTF${index}`}>
                    {
                      dataDisplay('NoTrainedLFCasesFollowingMM', year)
                        .NoTrainedLFCasesFollowingMM
                    }
                  </td>
                ))}
              </tr>{' '}
              <tr>
                <td>5</td>
                <td>No.of hydrocele cases line listed</td>
                {colYears.map((year, index) => (
                  <td key={`NH${index}`}>
                    {dataDisplay('NoOfHydroceleCases', year).NoOfHydroceleCases}
                  </td>
                ))}
              </tr>{' '}
              <tr>
                <td>6</td>
                <td>No. ineligible for surgery</td>
                {colYears.map((year, index) => (
                  <td key={`NIS${index}`}>
                    {
                      dataDisplay('NoIneligibleForSurgery', year)
                        .NoIneligibleForSurgery
                    }
                  </td>
                ))}
              </tr>{' '}
              <tr>
                <td>7</td>
                <td>No.of hydrocele cases operated</td>
                {colYears.map((year, index) => (
                  <td key={`NHCO{index}`}>
                    {
                      dataDisplay('NoOfHydroceleOperated', year)
                        .NoOfHydroceleOperated
                    }
                  </td>
                ))}
              </tr>{' '}
              <tr>
                <td>8</td>
                <td>Balance to be operated</td>
                {colYears.map((year, index) => (
                  <td key={`BO${index}`}>
                    {
                      dataDisplay('BalanceToBeOperated', year)
                        .BalanceToBeOperated
                    }
                  </td>
                ))}
              </tr>
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: 'center',
                    height: '40px',
                  }}
                ></td>
              </tr>
            </tbody>
          </table>
        </TableContainer>
      </div>
    </div>
  );
};
export default Analysis3;

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { reportTableStyle } from '../../utils';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import Button from 'react-bootstrap/Button';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
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
  findtotal,
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

const MDATrainingstatus1 = () => {
  let classes = useStyles();
  const [reportTableData, setreportTableData] = useState([]);
  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const [stateLvlData, setstateLvlData] = useState([]);
  const [CHCLevelData, setCHCLevelData] = useState([]);
  const [subcenterLevelData, setSubcenterLevelData] = useState([]);

  const [initialFilterValue, setinitialFilterValue] = useState({
    year: `${current_year}`,
    startMonth: `1`,
    endMonth: `${current_month[0].value}`,
  });

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      year: `${current_year}`,
      startMonth: `${previous_month}`,
      endMonth: `${previous_month}`,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setStartMonth(`${values.startMonth}`);
      setEndMonth(`${values.endMonth}`);
      setYear(`${values.year}`);
      getMDATrainingStatus1({ ...values });
    },
    onReset: () => {
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      // getMDATrainingStatus1(initialFilterValue());
    },
  });

  const YearNone = {
    label: 'Unknown Year',
    value: 0,
  };

  async function getMDATrainingStatus1(filterData) {
    const reportData: any = await ReportService.getMDATrainingStatus1(
      filterData
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
      setstateLvlData(reportData.data.StateLvl);
      setCHCLevelData(reportData.data.CHCLvl);
      setSubcenterLevelData(reportData.data.subCenterLvl);
    }
  }
  const isNullish =
    stateLvlData?.length !== 0
      ? Object.values(stateLvlData[0]).every((value) => {
          if (value === null) {
            return true;
          }
          return false;
        })
      : true;
  useEffect(() => {
    const data = initialFilterValue;
    getMDATrainingStatus1(data);
  }, [initialFilterValue]);

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
            Training of Health Staff for ELF during Year
          </p>
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
            }}
          >
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf(
                  'table-to-xlsnew',
                  `Training of Health Staff for ELF during Year.pdf`,
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
              filename='Training of Health Staff for ELF during Year'
              sheet='Training of Health Staff for ELF during Year'
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
                          >
                            {/* <div className='card'>
                <div className='card-body'> */}
                            <Row className='mb-3' style={{ padding: '0 20px' }}>
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
                                          // setStartMonth(
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
                                          // setEndMonth(
                                          //   option ? option.label : ''
                                          // );
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
                                  <label className='form-label font-chng'>
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
                                                option.value ==
                                                  formik.values.year
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
                                      // setYear(option ? option.label : '');
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.year : ''}
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
                            </Row>
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
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td rowSpan={2}>Administrative Level</td>{' '}
                  <td rowSpan={2}>Facility Name </td>
                  <td colSpan={4}>MDA/IDA</td>
                  <td colSpan={4}>Morbidity Management (MM)</td>
                  <td colSpan={4}>Both (MDA &amp; MM)</td>
                </tr>{' '}
                <tr>
                  <td>No.of courses organised</td>
                  <td>No.of staff sanctioned</td>
                  <td>No.of vacant positions</td>
                  <td>No.of staff trained</td>
                  <td>No.of courses organised</td>
                  <td>No.of staff sanctioned</td>
                  <td>No.of vacant positions</td>
                  <td>No.of staff trained</td>
                  <td>No.of courses organised</td>
                  <td>No.of staff sanctioned</td>
                  <td>No.of vacant positions</td>
                  <td>No.of staff trained</td>
                </tr>
              </thead>
              <tbody>
                {stateLvlData.length !== 0 && !isNullish ? (
                  stateLvlData.map((data: any, index: any) => (
                    <tr>
                      {index === 0 && (
                        <td rowSpan={stateLvlData.length}>State Level</td>
                      )}
                      <td>{data.facilityName}</td>
                      <td>{data.batchesOfTrainingOrganizedMDAIDA}</td>
                      <td></td>
                      <td></td>
                      <td>{data.numberTrainedForMDAIDA}</td>
                      <td>{data.batchesOfTrainingOrganizedMMDP}</td>
                      <td></td>
                      <td></td>
                      <td>{data.numberTrainedForMMDP}</td>
                      <td>{data.batchesOfTrainingOrganized}</td>
                      <td>{data.totalStaffSanctioned}</td>
                      <td>{data.NoOfVacantPositions}</td>
                      <td>{data.numberTrained}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>State Level</td>
                    <td
                      colSpan={7}
                      style={{ textAlign: 'center', height: '100px' }}
                    >
                      No state level Data found
                    </td>
                  </tr>
                )}

                {/* {stateLvlData.length !== 0 && (
                <tr>
                  <td >Total</td>
                  <td >
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(
                        stateLvlData,
                        'batchesOfTrainingOrganizedMDAIDA',
                      )}
                  </td>
                  <td ></td>
                  <td ></td>
                  <td >
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(stateLvlData, 'numberTrainedForMDAIDA')}
                  </td>
                  <td >
                    {' '}
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(stateLvlData, 'batchesOfTrainingOrganizedMMDP')}
                  </td>
                  <td ></td>
                  <td ></td>
                  <td >
                    {' '}
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(stateLvlData, 'numberTrainedForMMDP')}
                  </td>
                  <td >
                    {' '}
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(stateLvlData, 'batchesOfTrainingOrganized')}
                  </td>
                  <td >
                    {' '}
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(stateLvlData, 'totalStaffSanctioned')}
                  </td>
                  <td >
                    {' '}
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(stateLvlData, 'NoOfVacantPositions')}
                  </td>
                  <td >
                    {' '}
                    {stateLvlData &&
                      stateLvlData.length > 0 &&
                      findtotal(stateLvlData, 'numberTrained')}
                  </td>
                </tr>
              )} */}
                {CHCLevelData.length !== 0 ? (
                  CHCLevelData.map((data: any, index: any) => {
                    return (
                      <tr>
                        {index === 0 && (
                          <td rowSpan={CHCLevelData.length}>PHC Level</td>
                        )}
                        <td>{data.facilityName}</td>
                        <td>{data.batchesOfTrainingOrganizedMDAIDA}</td>
                        <td></td>
                        <td></td>
                        <td>{data.numberTrainedForMDAIDA}</td>
                        <td>{data.batchesOfTrainingOrganizedMMDP}</td>
                        <td></td>
                        <td></td>
                        <td>{data.numberTrainedForMMDP}</td>
                        <td>{data.batchesOfTrainingOrganized}</td>
                        <td>{data.totalStaffSanctioned}</td>
                        <td>{data.NoOfVacantPositions}</td>
                        <td>{data.numberTrained}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>PHC Level</td>
                    <td
                      colSpan={7}
                      style={{ textAlign: 'center', height: '100px' }}
                    >
                      No PHC level Data found
                    </td>
                  </tr>
                )}
                {CHCLevelData.length !== 0 && (
                  <tr>
                    <td>Total</td>
                    <td></td>
                    <td>
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(
                          CHCLevelData,
                          'batchesOfTrainingOrganizedMDAIDA'
                        )}
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      {' '}
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(CHCLevelData, 'numberTrainedForMDAIDA')}
                    </td>
                    <td>
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(
                          CHCLevelData,
                          'batchesOfTrainingOrganizedMMDP'
                        )}
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      {' '}
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(CHCLevelData, 'numberTrainedForMMDP')}
                    </td>
                    <td>
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(CHCLevelData, 'batchesOfTrainingOrganized')}
                    </td>
                    <td>
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(CHCLevelData, 'totalStaffSanctioned')}
                    </td>
                    <td>
                      {' '}
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(CHCLevelData, 'NoOfVacantPositions')}
                    </td>
                    <td>
                      {CHCLevelData &&
                        CHCLevelData.length > 0 &&
                        findtotal(CHCLevelData, 'numberTrained')}
                    </td>
                  </tr>
                )}
                {subcenterLevelData.length !== 0 ? (
                  subcenterLevelData.map((data: any, index: any) => (
                    <tr>
                      {index === 0 && (
                        <td rowSpan={subcenterLevelData.length}>
                          Subcentre level
                        </td>
                      )}
                      <td>{data.subCenterName}</td>{' '}
                      <td>{data.batchesOfTrainingOrganizedMDAIDA}</td>
                      <td></td>
                      <td></td>
                      <td>{data.numberTrainedForMDAIDA}</td>
                      <td>{data.batchesOfTrainingOrganizedMMDP}</td>
                      <td></td>
                      <td></td>
                      <td>{data.numberTrainedForMMDP}</td>
                      <td>{data.batchesOfTrainingOrganized}</td>
                      <td>{data.totalStaffSanctioned}</td>
                      <td>{data.NoOfVacantPositions}</td>
                      <td>{data.numberTrained}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>Subcentre level</td>
                    <td
                      colSpan={7}
                      style={{ textAlign: 'center', height: '100px' }}
                    >
                      No Subcentre level Data found
                    </td>
                  </tr>
                )}
                {subcenterLevelData.length !== 0 && (
                  <tr>
                    <td>Total</td>
                    <td></td>
                    <td>
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(
                          subcenterLevelData,
                          'batchesOfTrainingOrganizedMDAIDA'
                        )}
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      {' '}
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(subcenterLevelData, 'numberTrainedForMDAIDA')}
                    </td>
                    <td>
                      {' '}
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(
                          subcenterLevelData,
                          'batchesOfTrainingOrganizedMMDP'
                        )}
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      {' '}
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(subcenterLevelData, 'numberTrainedForMMDP')}
                    </td>
                    <td>
                      {' '}
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(
                          subcenterLevelData,
                          'batchesOfTrainingOrganized'
                        )}
                    </td>
                    <td>
                      {' '}
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(subcenterLevelData, 'totalStaffSanctioned')}
                    </td>
                    <td>
                      {' '}
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(subcenterLevelData, 'NoOfVacantPositions')}
                    </td>
                    <td>
                      {' '}
                      {subcenterLevelData &&
                        subcenterLevelData.length > 0 &&
                        findtotal(subcenterLevelData, 'numberTrained')}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={15}></td>
                </tr>
                {/* <tr>
                <td >Grand Total</td>
                <td >
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(
                        stateLvlData,
                        'batchesOfTrainingOrganizedMDAIDA',
                      )
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(
                          CHCLevelData,
                          'batchesOfTrainingOrganizedMDAIDA',
                        )
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(
                          subcenterLevelData,
                          'batchesOfTrainingOrganizedMDAIDA',
                        )
                      : 0)}
                </td>
                <td ></td>
                <td ></td>
                <td >
                  {' '}
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(stateLvlData, 'numberTrainedForMDAIDA')
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(CHCLevelData, 'numberTrainedForMDAIDA')
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(subcenterLevelData, 'numberTrainedForMDAIDA')
                      : 0)}
                </td>
                <td >
                  {' '}
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(stateLvlData, 'batchesOfTrainingOrganizedMMDP')
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(
                          CHCLevelData,
                          'batchesOfTrainingOrganizedMMDP',
                        )
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(
                          subcenterLevelData,
                          'batchesOfTrainingOrganizedMMDP',
                        )
                      : 0)}
                </td>
                <td ></td>
                <td ></td>
                <td >
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(stateLvlData, 'numberTrainedForMMDP')
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(CHCLevelData, 'numberTrainedForMMDP')
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(subcenterLevelData, 'numberTrainedForMMDP')
                      : 0)}
                </td>
                <td >
                  {' '}
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(stateLvlData, 'batchesOfTrainingOrganized')
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(CHCLevelData, 'batchesOfTrainingOrganized')
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(
                          subcenterLevelData,
                          'batchesOfTrainingOrganized',
                        )
                      : 0)}
                </td>
                <td >
                  {' '}
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(stateLvlData, 'totalStaffSanctioned')
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(CHCLevelData, 'totalStaffSanctioned')
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(subcenterLevelData, 'totalStaffSanctioned')
                      : 0)}
                </td>
                <td >
                  {' '}
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(stateLvlData, 'NoOfVacantPositions')
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(CHCLevelData, 'NoOfVacantPositions')
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(subcenterLevelData, 'NoOfVacantPositions')
                      : 0)}
                </td>
                <td >
                  {' '}
                  {(stateLvlData && stateLvlData.length > 0
                    ? findtotal(stateLvlData, 'numberTrained')
                    : 0) +
                    (CHCLevelData && CHCLevelData.length > 0
                      ? findtotal(CHCLevelData, 'numberTrained')
                      : 0) +
                    (subcenterLevelData && subcenterLevelData.length > 0
                      ? findtotal(subcenterLevelData, 'numberTrained')
                      : 0)}
                </td>
              </tr> */}
              </tbody>
            </table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
export default MDATrainingstatus1;

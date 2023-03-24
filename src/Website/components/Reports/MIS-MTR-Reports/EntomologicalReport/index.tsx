import React, { useEffect, useState, useCallback, useRef } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import { years, reportTableStyle } from '../../utils';
import * as Yup from 'yup';
import Select, { Option } from 'react-select';
import ReportService from '../../../../services/ReportService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import {
  current_month,
  current_year,
  findtotal,
  endYearGenerate,
  endMonthList,
  findMonthName,
  monthList,
} from '../../../../../Components/constant';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Icon, Menu } from '@material-ui/core';

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

const EntomologicalReport = (props) => {
  let classes = useStyles();
  const initialFilterValue = useCallback(() => {
    return {
      endYear: `${current_year}`,
      startYear: `${current_year}`,
      startMonth: `01`,
      endMonth: `${current_month[0].value}`,
    };
  }, []);
  const [reportTableData, setreportTableData] = useState([]);
  const [endYear, setEndYear] = useState(`${current_year}`);
  const [startYear, setStartYear] = useState(`${current_year}`);
  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  useEffect(() => {
    const data = initialFilterValue();
    getEntomologicalMISMTRReport(data);
  }, [initialFilterValue]);
  let NoneList = [{ label: 'None', value: 0 }];

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];

  async function getEntomologicalMISMTRReport(filterData) {
    const reportData: any = await ReportService.getEntomologicalMISMTRReport(
      filterData
    );
    if (reportData && reportData.data && reportData.data.data) {
      setreportTableData(reportData.data.data);
    }
  }

  let validSchema = Yup.object().shape({
    startYear: Yup.number().required(),
    startMonth: Yup.number().required(),
    endMonth: Yup.number().required(),
    endYear: Yup.number().required(),
  });
  const formik = useFormik({
    initialValues: {
      endYear: `${current_year}`,
      startYear: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      getEntomologicalMISMTRReport(values);
      setEndYear(`${values.endYear}`);
      setStartYear(`${values.startYear}`);
      setStartMonth(`${values.startMonth}`);
      setEndMonth(`${values.endMonth}`);
    },
    onReset: () => {
      setEndYear(`${current_year}`);
      setStartYear(`${current_year}`);
      setStartMonth(`1`);
      setEndMonth(`${current_month[0].value}`);
      getEntomologicalMISMTRReport(initialFilterValue());
    },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <div style={{ display: 'flex', marginTop: '2%', marginBottom: '2%' }}>
          <p className='rpthead'>Entomological Data</p>
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
                  `Entomological Data.pdf`,
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
              filename='Entomological Data'
              sheet='Entomological Data'
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
                              <div className='col-md-6 col-xl-6 col-12'>
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Start Year
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
                                                option.value ==
                                                  formik.values.startYear
                                            )
                                          : ''
                                        : ''
                                    }
                                    options={yearList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'startYear',
                                        option && option.value
                                      );
                                      // setStartYear(option && option.label);
                                    }}
                                  ></Select>
                                  <div className='invalid-feedback'>
                                    {formik.errors
                                      ? formik.errors.startYear
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-6 col-12'>
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Start Month
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
                                        : ''
                                    }
                                    options={monthList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'startMonth',
                                        option && option.value
                                      );
                                      formik.setFieldValue(
                                        'endMonth',
                                        option && option.value
                                      );
                                      // setyear(option && option.label);
                                    }}
                                  ></Select>
                                  <div className='invalid-feedback'>
                                    {formik.errors
                                      ? formik.errors.startMonth
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-6 col-12'>
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    End Year
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
                                      formik.errors.endYear &&
                                      formik.touched.endYear
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='year'
                                    isClearable='true'
                                    value={
                                      formik.values.endYear !== ''
                                        ? yearList
                                          ? yearList.find(
                                              (option: any) =>
                                                option &&
                                                option.value ==
                                                  formik.values.endYear
                                            )
                                          : ''
                                        : ''
                                    }
                                    options={endYearGenerate(
                                      formik.values.startYear
                                    )}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'endYear',
                                        option && option.value
                                      );
                                      // setyear(option && option.label);
                                    }}
                                  ></Select>
                                  <div className='invalid-feedback'>
                                    {formik.errors ? formik.errors.endYear : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-6 col-12'>
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    End Month
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
                                      formik.errors.endMonth &&
                                      formik.touched.endMonth
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='endMonth'
                                    isClearable='true'
                                    value={
                                      formik.values.endMonth !== ''
                                        ? monthList
                                          ? monthList.find(
                                              (option: any) =>
                                                option &&
                                                option.value ==
                                                  formik.values.endMonth
                                            )
                                          : ''
                                        : ''
                                    }
                                    options={
                                      formik.values.startYear ===
                                      formik.values.endYear
                                        ? endMonthList(formik.values.startMonth)
                                        : monthList
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'endMonth',
                                        option && option.value
                                      );
                                      // setyear(option && option.label);
                                    }}
                                  ></Select>
                                  <div className='invalid-feedback'>
                                    {formik.errors
                                      ? formik.errors.endMonth
                                      : ''}
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
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginBottom: '1%',
            fontFamily: 'poppins',
            fontWeight: '500',
          }}
        >
          <div>
            {startYear !== '' ? `Start year - ` : ''}
            {startYear !== '' && <b> {startYear}</b>}{' '}
            {startMonth !== '' ? `Start month - ` : ''}
            {startMonth !== '' && <b> {findMonthName(startMonth)}</b>}{' '}
            {endYear !== '' ? `End year - ` : ''}
            {endYear !== '' && <b> {endYear}</b>}{' '}
            {endMonth !== '' ? `End month - ` : ''}
            {endMonth !== '' && <b> {findMonthName(endMonth)}</b>}{' '}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td rowSpan={3}>Sr. No.</td>
                  <td rowSpan={3}>Name of Unit</td>
                  <td rowSpan={3}>
                    Total time spent <br />
                    (hours)
                  </td>
                  <td align='center' colSpan={4}>
                    Mosquito Collection
                  </td>
                  <td align='center' colSpan={7}>
                    Mosquito Dissection
                  </td>
                </tr>
                <tr>
                  <td align='center' colSpan={3}>
                    C.Quinquefasciatus
                  </td>
                  <td rowSpan={2}>
                    Density Per 10 men <br />
                    hrs
                  </td>
                  <td rowSpan={2}>
                    No.of Mosquito <br />
                    Dissected.
                  </td>
                  <td rowSpan={2}>
                    No. of positive <br />
                    for I II and III stage
                  </td>
                  <td rowSpan={2}>
                    No. of positive <br />
                    for III stage
                  </td>
                  <td rowSpan={2}>Infection Rate % </td>
                  <td rowSpan={2}>Infectivity Rate %</td>
                </tr>
                <tr>
                  <td rowSpan={2}>Male</td>
                  <td rowSpan={2}>Female</td>
                  <td rowSpan={2}>Total</td>
                </tr>
              </thead>{' '}
              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index: any) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{data.nameOfUnit}</td>
                        <td align='right'>{data.totaltime}</td>
                        <td align='right'>{data.cquinmale}</td>
                        <td align='right'>{data.cquinfemale}</td>
                        <td align='right'>{data.cquintot}</td>
                        <td align='right'>{data.densityPer10Menhrs}</td>
                        <td align='right'>{data.noofmosquitodissected}</td>
                        <td align='right'>{data.noofpositivei_ii_iiistage}</td>
                        <td align='right'>{data.noofpositiveiiistage}</td>
                        <td align='right'>{data.InfectionRate}</td>
                        <td align='right'>{data.InfectivityRate}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: 'center', height: '100px' }}
                    >
                      No Data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableContainer>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {' '}
          <Paging
            rowsPerPageOptions={[10, 25, 50, 100]}
            count={reportTableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EntomologicalReport;

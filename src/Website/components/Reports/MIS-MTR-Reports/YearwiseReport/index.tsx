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
import { current_month, current_year, findtotal, endYearGenerate, endMonthList, findMonthName, monthList } from '../../../../../Components/constant';
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
  }),
);

const YearwiseReport = (props) => {
  let classes = useStyles();
  const initialFilterValue = useCallback(() => {
    return {
      yearType: `calender`
    };
  }, []);
  const [reportTableData, setreportTableData] = useState([]);
  const [yearType, setyearType] = useState(`calender`);
  useEffect(() => {
    const data = initialFilterValue();
    getYearwiseMISMTRReport(data);
  }, [initialFilterValue]);
  let NoneList = [{ label: 'None', value: 0 }];

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];
  let optionList = [
    { label: "Calender year", value: "calender" },
    { label: "Financial year", value: "financial" }
  ]
  async function getYearwiseMISMTRReport(filterData) {
    const reportData: any = await ReportService.getYearwiseMISMTRReport(
      filterData,
    );
    if (reportData && reportData.data && reportData.data.data) {
      setreportTableData(reportData.data.data);
    }
  }

  let validSchema = Yup.object().shape({
    year: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      yearType: `calender`
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      getYearwiseMISMTRReport(values);
      setyearType(`${values.yearType}`);
    },
    onReset: () => {
      setyearType(`calender`);
      getYearwiseMISMTRReport(initialFilterValue());
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
        }}>
        <div style={{ display: 'flex', marginTop: '2%', marginBottom: '2%' }}>
          <p className='rpthead'>
            National Filaria Control Programme : Maharashtra State As Whole
          </p>
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
            }}>
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf(
                  'table-to-xlsnew',
                  `National Filaria Control Programme : Maharashtra State AS WHOLE.pdf`,
                  'l',
                  295,
                  295,
                )
              }>
              Export as PDF
            </button>
            <ReactHTMLTableToExcel
              className='mt-m font-chng btn btn-secondary1'
              id='test-table-xls-button'
              table='table-to-xlsnew'
              filename='National Filaria Control Programme : Maharashtra State AS WHOLE'
              sheet='National Filaria Control Programme : Maharashtra State AS WHOLE'
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
                    {...bindTrigger(popupState)}>
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
                            onReset={formik.handleReset}>
                            <Row className='mb-3' style={{ padding: '0 20px' }}>
                              <div className='col-md-12 col-xl-12 col-12'>
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'>
                                    Year Type
                                  </label>
                                  <Select menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: base => ({ ...base, zIndex: '9999' }),
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
                                      formik.errors.yearType && formik.touched.yearType
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='yearType'
                                    isClearable='true'
                                    value={
                                      formik.values.yearType !== ''
                                        ? optionList
                                          ? optionList.find(
                                            (option: any) =>
                                              option &&
                                              option.value ==
                                              formik.values.yearType,
                                          )
                                          : ''
                                        : ''
                                    }
                                    options={optionList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'yearType',
                                        option && option.value,
                                      );
                                      // setyearType(option && option.label);
                                    }}></Select>
                                  <div className='invalid-feedback'>
                                    {formik.errors ? formik.errors.yearType : ''}
                                  </div>
                                </div>
                              </div>

                              <div
                                className='col-md-6 col-xl-12 col-12 right-wrappernew '
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                }}>
                                <button
                                  onClick={popupState.close}
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='submit'>
                                  Filter
                                </button>
                                <button
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='reset'
                                  onClick={() => {
                                    formik.resetForm();
                                  }}
                                  style={{ marginLeft: '10px' }}>
                                  Clear
                                </button>
                              </div>
                            </Row>
                          </form>
                        </FormikProvider>
                        <Icon
                          onClick={popupState.close}
                          style={{ height: '2em' }}>
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
          <div >
            {yearType !== '' ? `Start Type - ` : ''}
            {yearType !== '' && <b> {yearType}</b>} {" "}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td rowSpan={2}>Year</td>
                  <td rowSpan={2}>Blood Smear <br />Collected / Examined</td>
                  <td rowSpan={2}>MF +ve</td>
                  <td rowSpan={2}>MF Rate %</td>
                  <td rowSpan={2}>Disease</td>
                  <td rowSpan={2}>Disease Rate %</td>
                  <td rowSpan={2}>Hydrocele Operations <br />Carried Out</td>
                </tr>
              </thead>{' '}
              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index: any) => (
                      <tr>
                        <td>{data.year}</td>
                        <td align="right">{data.noOfBSExamined}</td>
                        <td align='right'>{data.noOfPersonsMFDetect}</td>
                        <td align='right'>{data.noOfPersonsDiseaseDetect}</td>
                        <td align='right'>{data.mfPercent}</td>
                        <td align='right'>{data.disPercent}</td>
                        <td align='right'>{data.hydrocelectomyOperations || data.hydrocelectomyoperations}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: 'center', height: '100px' }}>
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
          }}>
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

export default YearwiseReport;

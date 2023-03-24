import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Select, { Option } from 'react-select';
import { years } from '../../utils';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging, Menu, Icon } from '@material-ui/core';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { current_year, findtotal } from '../../../../../Components/constant';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
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
const MMDPKitsGiven = (props) => {
  let classes = useStyles();
  const [reportTableData, setreportTableData] = useState([]);
  const [year, setYear] = useState(`${current_year}`);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
  });
  const formik = useFormik({
    initialValues: { year: `${current_year}` },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setYear(values.year);
      getReportMMDPKitsGiven(values);
    },
    onReset: () => {
      setYear(`${current_year}`);
      getReportMMDPKitsGiven({ year: `${current_year}` });
    },
  });

  const initialFilterValue = useCallback(() => {
    return {
      year: `${current_year}`
    };
  }, []);

  useEffect(() => {
    const data = initialFilterValue();
    getReportMMDPKitsGiven(data);
  }, [initialFilterValue]);

  async function getReportMMDPKitsGiven(filterData) {
    const reportData: any = await ReportService.getReportMMDPKitsGiven(
      filterData,
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];

  // const calculatePending = (item) => {
  //   return +item.totalLast - +item.total < 0 ? 0 : +item.totalLast - +item.total
  // }

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
        <div style={{ marginTop: '2%', display: 'flex' }}>
          <p className='rpthead'> MMDP Kits Distributed</p>{' '}
          <div
            style={{
              display: 'flex',
              float: 'right',
              marginLeft: 'auto',
            }}>
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf(
                  'table-to-xlsnew',
                  `Mmdpkitsdistributed.pdf`,
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
              filename='Base Line Data'
              sheet='Mmdpkitsdistributed'
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

                              <div className='col-md-6 col-xl-6 col-12'>
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'>
                                    Year
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
                                              formik.values.year,
                                          )
                                          : ''
                                        : ''
                                    }
                                    options={yearList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'year',
                                        option && option.value,
                                      );
                                    }}></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.year : ''}
                                  </div>
                                </div>
                              </div>
                              <div
                                className='col-md-6 col-xl-12 col-12 right-wrappernew'
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                }}>
                                <button
                                  onClick={popupState.close}
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='submit'>
                                  Filter{' '}
                                </button>
                                <button
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='reset'
                                  style={{ marginLeft: '10px' }}>
                                  Clear{' '}
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
          </div>{' '}
        </div>{' '}
        <div style={{ display: 'flex', marginBottom: '1%' }}>
          <div>
            {/* {' '}
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>} */}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {year !== '' ? `year - ` : ''}
            {year !== '' && <b> {year}</b>}
          </div>
        </div>
        <TableContainer>
          <table id='table-to-xlsnew'>
            <thead>
              {' '}
              <tr>
                <td>
                  <b>District </b>
                </td>
                <td>
                  <b>Jan</b>
                </td>
                <td>
                  <b>Feb</b>
                </td>
                <td>
                  <b>Mar</b>
                </td>
                <td>
                  <b>Apr</b>
                </td>
                <td>
                  <b>May</b>
                </td>
                <td>
                  <b>Jun</b>
                </td>
                <td>
                  <b>Jul</b>
                </td>
                <td>
                  <b>Aug</b>
                </td>
                <td>
                  <b>Sep</b>
                </td>
                <td>
                  <b>Oct</b>
                </td>
                <td>
                  <b>Nov</b>
                </td>
                <td>
                  <b>Dec</b>
                </td>
                <td>
                  <b>Total MMDP kits <br />distributed</b>
                </td>
              </tr>
            </thead>

            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .map((item: any, index: any) => (
                  <tr>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{item.districtName}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.jan}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.feb}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.mar}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.apr}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.may}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.jun}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.jul}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.aug}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.sep}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.oct}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.nov}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.dec}</td>
                    <td align='left' className={item.highlight ? "fw-bold" : ""}>{+item.total}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: 'center', height: '100px' }}>
                  No Data found
                </td>
              </tr>
            )}
          </table>
        </TableContainer>
      </div>
    </div>
  );
};

export default MMDPKitsGiven;

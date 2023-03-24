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
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
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
import { current_year } from '../../../../../Components/constant';
import { useSelector } from 'react-redux';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { years, months, reportTableStyle, getDistrictName } from '../../utils';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Icon, Menu } from '@material-ui/core';
import { Exportpdf } from '../../../../services/PdfService';

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

const BaselineEntomoligicalReport = (props) => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
    };
  }, []);
  const prevDistrictRef: any = useRef();
  const [districtId, setdistrictId] = useState();
  const [reportTableData, setreportTableData] = useState([]);
  const [districtName, setDistrictName] = useState('');
  let [districtIdValues, setdistrictIdValues] = useState([]);
  const [year, setyear] = useState(`${current_year}`);
  const userDistrictId = useUserDistrictId() || '';

  useEffect(() => {
    const data = initialFilterValue();
    getBaselineEntomologyReport(data);
  }, [initialFilterValue]);
  let NoneList = [{ label: 'None', value: 0 }];

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];

  async function getBaselineEntomologyReport(filterData) {
    const reportData: any = await ReportService.getBaselineEntomologyReport(
      filterData
    );
    console.log(reportData, 'data');
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }

  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setDistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }
  }

  useEffect(() => {
    const data = initialFilterValue();
    getBaselineEntomologyReport(data);
    getpostcontent();
    prevDistrictRef.current = districtId;
  }, []);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    districtId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setyear(`${values.year}`);
      setDistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      getBaselineEntomologyReport(values);
    },
    onReset: () => {
      setyear(`${current_year}`);
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      getBaselineEntomologyReport(initialFilterValue());
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

  const createpdf = () => {
    const input = document.getElementById('table-to-xls');
    if (input) {
      html2canvas(input).then((canvas: any) => {
        var imgWidth: any = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        const imgData = canvas.toDataURL('image/png');
        var doc = new jsPDF('p', 'mm');
        var position = 0;
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
          heightLeft -= pageHeight;
        }
        doc.save('Base line Survey Entomological Data.pdf');
      });
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
        <div style={{ display: 'flex', marginTop: '2%', marginBottom: '2%' }}>
          <p className='rpthead'>Base line Survey Entomological Data</p>
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
                  `Base line Survey Entomological Data.pdf`,
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
              filename='Base line Survey Entomological Data'
              sheet='Base line Survey Entomological Data'
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
                                      isDisabled={!!userDistrictId}
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
                              <div className='col-md-6 col-xl-6 col-12'>
                                {' '}
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
                                        option && option.value
                                      );
                                    }}
                                  ></Select>
                                  <div className='invalid-feedback'>
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
        <div style={{ display: 'flex', marginBottom: '1%' }}>
          <div className={classes.filterdataStyle}>
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
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
                <tr>
                  <td rowSpan={2}>Sr. No.</td>
                  <td rowSpan={2}>Taluka/City</td>
                  <td rowSpan={2}>Name of PHC/Urban area</td>
                  <td rowSpan={2}>Name of Sub-Center</td>
                  <td rowSpan={2}>
                    Name of Site
                    <br /> (Village/Ward)
                  </td>
                  <td rowSpan={2}>
                    Type of Site
                    <br /> (Sentinel / Random)
                  </td>
                  <td rowSpan={2}>Date of Survey</td>
                  <td colSpan={3}>
                    No. of Culex quinquefasciatus
                    <br /> collection in Fixed catching station
                  </td>
                  <td colSpan={3}>
                    No. of Culex quinquefasciatus
                    <br /> in Random catching station
                  </td>
                  <td colSpan={3}>Total</td>
                  <td rowSpan={2}>
                    Density Per
                    <br /> 10 man hours
                  </td>
                </tr>
                <tr>
                  <td>Time </td>
                  <td>Male </td>
                  <td>Female</td>
                  <td>Time </td>
                  <td>Male </td>
                  <td>Female</td>
                  <td>Time </td>
                  <td>Male </td>
                  <td>Female</td>
                </tr>
              </thead>

              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index: any) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{data.talukaName}</td>
                        <td>{data.facilityName}</td>
                        <td>{data.subCenterName}</td>
                        <td>{data.villageName}</td>
                        <td>{data.fixedOrRandom}</td>
                        <td align='right'>
                          {moment(data.DateOfSurvey).format('DD-MM-YYYY')}
                        </td>
                        <td align='right'>{data.totalTimeSpentF}</td>
                        <td align='right'>{data.noOfMosquitoCollectedMaleF}</td>
                        <td align='right'>
                          {data.noOfMosquitoCollectedFemaleF}
                        </td>
                        <td align='right'>{data.totalTimeSpentR}</td>
                        <td align='right'>{data.noOfMosquitoCollectedMaleR}</td>
                        <td align='right'>
                          {data.noOfMosquitoCollectedFemaleR}
                        </td>
                        <td align='right'>{data.totalTimeSpent}</td>
                        <td align='right'>{data.noOfMosquitoCollectedMale}</td>
                        <td align='right'>
                          {data.noOfMosquitoCollectedFemale}
                        </td>
                        <td align='right'>{data.densityManHours}</td>
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
                {reportTableData && reportTableData.length > 0 && (
                  <tr className='row6'>
                    <td className='column0 style17 s style5' colSpan={7}>
                      Total
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
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

export default BaselineEntomoligicalReport;

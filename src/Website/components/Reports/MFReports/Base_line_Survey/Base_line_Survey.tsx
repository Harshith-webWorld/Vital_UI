import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import Select, { Option } from 'react-select';
import { years, getDistrictName } from '../../utils';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import DropdownService from '../../../../services/DropdownService';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging, Menu, Icon } from '@material-ui/core';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  })
);

const Base_line_Survey = (props) => {
  let classes = useStyles();
  const userDistrictId = useUserDistrictId() || '';
  const [reportTableData, setreportTableData] = useState([]);
  const [districtId, setdistrictId] = useState();
  const prevDistrictRef: any = React.useRef();
  const [year, setYear] = useState(`${current_year}`);
  const [districtName, setDistrictName] = useState('');

  let [districtIdValues, setdistrictIdValues] = useState([]);
  let validSchema = Yup.object().shape({
    year: Yup.string(),
    districtId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      year: `${current_year}`,
      districtId: userDistrictId,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setYear(`${values.year}`);
      setDistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      getMFBaseLineSurveyList(values);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setYear(`${current_year}`);
      getMFBaseLineSurveyList(initialFilterValue());
    },
  });

  let NoneList = [{ label: 'None', value: 0 }];

  const YearNone = {
    label: 'Unknown Year',
    value: 0,
  };

  const MonthNone = {
    label: 'Unknown Month',
    value: 0,
  };
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
    };
  }, []);

  useEffect(() => {
    const data = initialFilterValue();
    getpostcontent();
    getMFBaseLineSurveyList(data);
    prevDistrictRef.current = districtId;
  }, []);

  async function getMFBaseLineSurveyList(filterData) {
    const reportData: any = await ReportService.getReportMFBaseLineSurveryList(
      filterData
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setDistrictName(getDistrictName(districtId.data, userDistrictId));
    }
  }

  // useEffect(() => {
  //   getpostcontent();
  //   prevDistrictRef.current = districtId;
  // }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
        doc.save('Base Line Data.pdf');
      });
    }
  };

  console.log(reportTableData, 'reportTableData44');
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
        <div style={{ marginTop: '2%', display: 'flex' }}>
          <p className='rpthead'> Base Line Data</p>{' '}
          <div
            style={{
              display: 'flex',
              float: 'right',
              marginLeft: 'auto',
            }}
          >
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf(
                  'table-to-xlsnew',
                  `Base Line Data.pdf`,
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
              filename='Base Line Data'
              sheet='Base Line Data'
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
                              <div className='col-md-6 col-xl-4 col-12'>
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
                              <div className='col-md-6 col-xl-4 col-12'>
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
        <div style={{ display: 'flex', marginBottom: '1%' }}>
          <div className={classes.filterdataStyle}>
            {year !== '' ? `year - ` : ''}
            {year !== '' && <b> {year}</b>}
          </div>
          <div>
            {' '}
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>{' '}
        </div>
        <TableContainer>
          <table id='table-to-xlsnew'>
            <thead>
              {' '}
              <tr>
                <td height='21'>Sr. No.</td>
                <td>P.H.C.</td>
                <td>Sub center</td>
                <td>Village</td>
                <td>Site</td>
                <td>Date of Survey</td>
                <td>B.S.Collection</td>
                <td>B.S.Examination</td>
                <td>Mf Positive</td>
                <td>Mf Rate %</td>
              </tr>
            </thead>

            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item: any, index: any) => (
                  <tbody>
                    <tr>
                      <td height='21' align='left'>
                        {index + 1}
                      </td>
                      <td align='left'>{item.facilityName}</td>
                      <td align='left'>{item.subCenterName}</td>
                      <td align='left'>{item.villageName}</td>
                      <td align='left'>{item.site}</td>
                      <td align='left'>{item.DateOfSurvey}</td>
                      <td align='left'>{item.NoOfBSCollected}</td>
                      <td align='left'>{item.NoOfBSExamined}</td>
                      <td align='left'>{item.noOfBSFoundPositive}</td>
                      <td align='left'>{item.MFRate}</td>
                    </tr>
                  </tbody>
                ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: 'center', height: '100px' }}
                >
                  No Data found
                </td>
              </tr>
            )}
            {reportTableData && reportTableData.length > 0 && (
              <tr>
                <td colSpan={6} height='21'>
                  <b>Total</b>
                </td>
                <td align='left'>
                  {findtotal(reportTableData, 'NoOfBSCollected')}
                </td>
                <td align='left'>
                  {findtotal(reportTableData, 'NoOfBSExamined')}
                </td>
                <td align='left'>
                  {findtotal(reportTableData, 'noOfBSFoundPositive')}
                </td>
                <td align='left'>{findtotal(reportTableData, 'MFRate')}</td>
              </tr>
            )}
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
  );
};

export default Base_line_Survey;

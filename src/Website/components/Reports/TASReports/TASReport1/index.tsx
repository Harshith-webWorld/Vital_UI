import React from 'react';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import TableContainer from '@material-ui/core/TableContainer';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TablePagination as Paging, Menu, Icon } from '@material-ui/core';
import { ageTextGenerator } from '../../utils';

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

const TASReport1 = (props) => {
  let classes = useStyles();
  const [reportTableData, setreportTableData] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [initialFilterValue, setinitialFilterValue] = useState<any>({
    Date_of_survey: moment(new Date()).format('YYYY-MM-DD'),
    name_Of_EU: '',
  });
  let isValidDate = moment().format('YYYY-MM-DD');
  let validSchema = Yup.object().shape({
    Date_of_survey: Yup.string().required('date of survey is required'),
    name_Of_EU: Yup.string().required('name of euea is required'),
  });
  const formik = useFormik({
    initialValues: {
      Date_of_survey: moment(new Date()).format('YYYY-MM-DD'),
      name_Of_EU: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      getTASReport1(values);
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  async function getTASReport1(filterData: any) {
    const tasReportData: any = await ReportService.getTASReport1(filterData);
    if (tasReportData && tasReportData.data) {
      setreportTableData(tasReportData.data);
    }
  }

  useEffect(() => {
    const data = initialFilterValue;
    getTASReport1(data);
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
        }}>
        <div style={{ marginTop: '2%', display: 'flex' }}>
          <p className='rpthead'> Proforma For School Survey</p>{' '}
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
                  `Proforma For School Survey.pdf`,
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
              filename='Proforma For School Survey'
              sheet='Proforma For School Survey'
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
                              <div className='col-md-6 col-xl-3 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='name_Of_EU'
                                    className='form-label font-chng'>
                                    Name of EU
                                  </label>
                                  <input
                                    name='name_Of_EU'
                                    value={
                                      formik.values.name_Of_EU
                                        ? formik.values.name_Of_EU
                                        : ''
                                    }
                                    onChange={formik.handleChange}
                                    type='text'
                                    // className="form-control"
                                    className={
                                      formik.errors.name_Of_EU &&
                                      formik.touched.name_Of_EU
                                        ? 'form-control is-invalid'
                                        : 'form-control'
                                    }></input>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.name_Of_EU
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-xl-3 col-md-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='Date of survey'
                                    className='form-label font-chng'>
                                    Date of survey
                                  </label>
                                  <input
                                    type='date'
                                    max={isValidDate}
                                    className={
                                      formik.errors.Date_of_survey &&
                                      formik.touched.Date_of_survey
                                        ? 'form-control is-invalid'
                                        : 'form-control'
                                    }
                                    name='Date_of_survey'
                                    value={formik.values.Date_of_survey}
                                    onChange={(value: any) => {
                                      formik.setFieldValue(
                                        'Date_of_survey',
                                        value,
                                      );
                                    }}
                                  />
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.Date_of_survey
                                      : ''}
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
                            </Row>{' '}
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
        <TableContainer>
          <table id='table-to-xlsnew'>
            {reportTableData && reportTableData?.school?.length > 0 && (
              <>
                <tr>
                  <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                    <b>Name / Number of EU - </b>
                    {reportTableData?.school[0]?.nameOfEU}
                  </td>
                  <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                    <b>Date of Survey - </b>
                    {reportTableData?.school[0]?.DateOfSurvey}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                    <b>Name of the School - </b>
                    {reportTableData?.school[0]?.nameOfSchool}
                  </td>
                  <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                    <b>SL No of School - </b>
                    {reportTableData?.school[0]?.serialNoOfSchool}
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} style={{ border: '0', textAlign: 'start' }}>
                    <b>
                      Type of School (Govt./Private/Charitable/NGO
                      run/religious/other) -
                    </b>
                    {reportTableData.school[0]?.typeOfSchool}
                  </td>
                </tr>
              </>
            )}
            <thead>
              {' '}
              <tr>
                <td>Token number</td>
                <td>Name of Student</td>
                <td>Age (Yrs)</td>
                <td>Sex</td>
                <td>ICT +ve/-ve/Invalid</td>
              </tr>
            </thead>
            <tbody>
              {' '}
              {reportTableData && reportTableData?.student?.length > 0 ? (
                <tr>
                  <td>{reportTableData?.student[0]?.tokenNumberSB}</td>
                  <td>{reportTableData?.student[0]?.nameOfStudent}</td>
                  <td>
                    {ageTextGenerator(
                      reportTableData?.student[0]?.ageYears,
                      reportTableData?.student[0]?.ageMonths,
                    )}
                  </td>
                  <td>{reportTableData?.student[0]?.sex}</td>
                  <td>{reportTableData?.student[0]?.result}</td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: 'center', height: '100px' }}>
                    No Data found
                    <br />
                    Please Select different filter criteria
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
            count={reportTableData.student?.length ? reportTableData.student.length : 0}
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

export default TASReport1;

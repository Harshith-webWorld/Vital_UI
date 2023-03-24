import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ageTextGenerator } from '../../utils';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import TableContainer from '@material-ui/core/TableContainer';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TablePagination as Paging, Menu, Icon } from '@material-ui/core';
import commonFunction from '../../../../../helpers/common/common';

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

const TASReport2 = (props) => {
  let classes = useStyles();
  const prevDistrictRef: any = useRef();
  const prevNFCURef: any = useRef();
  const [districtId, setdistrictId] = useState();
  const [nameOfStudentId, setnameOfStudentId] = useState();
  const [studentNamelist, setStudentName] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    // getnumberOfStudentlist()
    prevDistrictRef.current = districtId;
    prevNFCURef.current = nameOfStudentId;
  }, []);

  const initialFilterValue = useCallback(() => {
    return {
      name_of_student: '',
      name_of_school: '',
    };
  }, []);

  let validSchema = Yup.object().shape({
    name_of_student: Yup.string().required('name of student is required'),
    name_of_school: Yup.string().required('name of school is required'),
  });
  useEffect(() => {
    const data = initialFilterValue();
    getTasReport2Data(data);
  }, [initialFilterValue]);

  const formik = useFormik({
    initialValues: {
      name_of_student: '',
      name_of_school: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values: any) => {
      getTasReport2Data(values);
    },
    onReset: () => {
      formik.setFieldValue('name_of_student', '');
      formik.setFieldValue('name_of_school', '');
    },
  });

  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [numberOfStudentValues, setnumberOfStudentValues] = useState([]);
  const [reportTableData, setreportTableData] = useState<any>([]);

  async function getTasReport2Data(filterData) {
    const reportData: any = await ReportService.tasReport2(filterData);
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }

  const nameofStudentList =
    numberOfStudentValues &&
    numberOfStudentValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  async function getnumberOfEU(e: any) {
    if (e && e.value) {
      setnameOfStudentId(e && e.value);
    }
  }
  // async function getnumberOfStudentlist() {
  //   const unitType = "FCU";
  //   const numberOfEUId: any = await DropdownService.getNameOfUnit(unitType, 1);
  //   if (numberOfEUId && numberOfEUId.data && numberOfEUId.data.length > 0) {
  //     numberOfStudentValues(numberOfEUId.data);
  //   }
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
          <p className='rpthead'>
            Proforma for movement history & dec consumption of each ICT +ve
            child
          </p>
          <div
            style={{
              display: 'flex',
              float: 'right',
              marginLeft: 'auto',
              marginBottom: '2%',
            }}>
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf(
                  'table-to-xlsnew',
                  `Proforma for movement history & dec consumption of each ICT +ve child.pdf`,
                  'p',
                  210,
                  295,
                )
              }>
              Export as PDF
            </button>
            <ReactHTMLTableToExcel
              className='mt-m font-chng btn btn-secondary1'
              id='test-table-xls-button'
              table='table-to-xlsnew'
              filename='Proforma for movement history & dec consumption of each ICT +ve child'
              sheet='Proforma for movement history & dec consumption of each ICT +ve child'
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
                                    htmlFor='email'
                                    className='form-label font-chng'>
                                    Name Of Student
                                  </label>
                                  <input
                                    name='name_of_student'
                                    value={
                                      formik.values.name_of_student
                                        ? formik.values.name_of_student
                                        : ''
                                    }
                                    onChange={formik.handleChange}
                                    onKeyPress={(e) =>
                                      commonFunction.keyPress(e)
                                    }
                                    type='text'
                                    className={
                                      formik.errors.name_of_student &&
                                      formik.touched.name_of_student
                                        ? 'form-control is-invalid'
                                        : 'form-control'
                                    }></input>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.name_of_student
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-3 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'>
                                    Name Of School
                                  </label>
                                  <input
                                    name='name_of_school'
                                    value={
                                      formik.values.name_of_school
                                        ? formik.values.name_of_school
                                        : ''
                                    }
                                    onChange={formik.handleChange}
                                    onKeyPress={(e) =>
                                      commonFunction.keyPress(e)
                                    }
                                    type='text'
                                    className={
                                      formik.errors.name_of_school &&
                                      formik.touched.name_of_school
                                        ? 'form-control is-invalid'
                                        : 'form-control'
                                    }></input>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.name_of_school
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
                                  Filter
                                </button>
                                <button
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='reset'
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
        <TableContainer>
          <table id='table-to-xlsnew'>
            {/*  {reportTableData.map((data: any, index: any) => {
              return (
                <>
                  <tr>
                    <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Name of the Student /child : </b>
                      {data.nameOfStudent}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Name of the School & class/ EA identification : </b>
                      {data.nameOfSchool}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Address of the School / village or ward : </b>
                      {data.villageName}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={1} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Father's name : </b>
                      {data.fatherName}
                    </td>
                    <td colSpan={1} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Age : </b>
                      {ageTextGenerator(data.ageYears, data.ageMonths)}
                    </td>
                    <td colSpan={1} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Sex : </b>
                      {data.sex}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Complete permanent address : </b>
                      {data.completePermanentAddress}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>Date of ICT performed : </b>
                      {data.dateOfICT}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                      {' '}
                      <b>
                        Movement history of the child since birth (fill-up the
                        table below :
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ border: '0', textAlign: 'start' }}>
                      <b>
                        (Information should be collected from mother or father
                        or any adult close relation)
                      </b>
                    </td>
                  </tr>
                </>
              );
            })} */}{' '}
            <thead>
              <tr>
                <td>Name of the Student /child</td>
                <td>Name of the Student /child</td>
                <td>Address of the School / village or ward</td>
                <td>Father's name</td>
                <td>Age</td>
                <td>Sex</td>
                <td>Complete permanent address</td>
                <td>Date of ICT performed</td>
                <td>Movement history of the child since birth</td>
                <td>Name of village / town where resided</td>
                <td>Name of district & state / UT</td>
                <td> Age from(In years & months)</td>
                <td>Age to(In years & month)</td>
              </tr>
            </thead>
            <tbody>
              {reportTableData && reportTableData.length > 0 ? (
                reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => (
                  <tr>
                    <td>{data.nameOfStudent}</td>
                    <td>{data.nameOfSchool}</td>
                    <td>{data.villageName}</td>
                    <td>{data.fatherName}</td>
                    <td>{ageTextGenerator(data.ageYears, data.ageMonths)}</td>
                    <td>{data.sex}</td>
                    <td>{data.completePermanentAddress}</td>
                    <td>{data.dateOfICT}</td>
                    <td></td>
                    <td>{data.villageName}</td>
                    <td>{data.districtName}</td>
                    <td>
                      {/* {data.ageSBYears} years, {data.ageSBMonths} months */}
                      {/* {ageTextGenerator(data.ageYears, data.ageMonths)} */}
                    </td>
                    <td>
                      <br />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      height: '100px',
                    }}>
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

export default TASReport2;

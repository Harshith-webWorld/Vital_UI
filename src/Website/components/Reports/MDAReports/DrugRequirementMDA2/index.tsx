import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Select, { Option } from 'react-select';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import { Exportpdf } from '../../../../services/PdfService';
import { current_year, yearList } from '../../../../../Components/constant';
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
const generatefundsAllottedArray = (dataArray: any) => {
  let fundsAllotted: any = [];
  let { state, RD } = dataArray;
  state.map(
    (item: any) =>
      item.statementOfFundsAllotted &&
      fundsAllotted.push(item.statementOfFundsAllotted)
  );
  RD.map(
    (item: any) =>
      item.statementOfFundsAllotted &&
      fundsAllotted.push(item.statementOfFundsAllotted)
  );
  let data: any = Array.from(new Set(fundsAllotted));
  return data;
};

const DrugRequirementMDA2 = () => {
  let classes = useStyles();
  const [reportTableData, setreportTableData] = useState([]);
  const [fundsAllottedArray, setfundsAllottedArray] = useState([]);
  const [stateArray, setStateArray] = useState<any>([]);
  const [RDArray, setRDArray] = useState<any>([]);
  const [year, setyear] = useState(`${current_year}`);

  const initialFilterValue = useCallback(() => {
    return {
      year: current_year,
    };
  }, []);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
  });
  const formik = useFormik({
    initialValues: { year: `${current_year}` },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      let { year } = values;
      let data = {
        year: `${year}`,
      };

      getDrugRequirementMDA2(values);
      setyear(`${values.year}`);
    },
    onReset: () => {
      setyear(`${current_year}`);
    },
  });

  async function getDrugRequirementMDA2(filterData) {
    const reportData: any = await ReportService.getDrugRequirementMDA2(
      filterData
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
      setfundsAllottedArray(generatefundsAllottedArray(reportData.data));
      setStateArray(reportData.data.state);
      setRDArray(reportData.data.RD);
      console.log(generatefundsAllottedArray(reportData.data));
    }
  }

  useEffect(() => {
    const data = initialFilterValue();
    getDrugRequirementMDA2(data);
  }, [initialFilterValue]);

  const DataExtractor = (
    DataArray: [],
    fundsAllottedName: any,
    dataSelector: any
  ) => {
    let extractedArray = DataArray.filter(
      (item: any) => item.statementOfFundsAllotted === fundsAllottedName
    );
    // console.log(extractedArray[0]?.fundAllocatedWithDate);
    let data: any = extractedArray[0] && extractedArray[0][dataSelector];
    return data;
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
          <p className='rpthead'>Statement of funds Allotted and Utilized</p>
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
                  `Statement of funds Allotted and Utilized.pdf`,
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
              filename='Statement of funds Allotted and Utilized'
              sheet='Statement of funds Allotted and Utilized'
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
                              <div className='col-md-12 col-xl-12 col-12'>
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
                                      formik.values.year !== `${current_year}`
                                        ? yearList.find(
                                            (option: any) =>
                                              option &&
                                              option.value ===
                                                formik.values.year
                                          )
                                        : yearList.find(
                                            (option: any) =>
                                              option &&
                                              option.value === current_year
                                          )
                                    }
                                    options={yearList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'year',
                                        option ? option.value : current_year
                                      );
                                      // setyear(option ? option.label : '');
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
                            {/* </div>
              </div> */}
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
            {year !== '' ? `Year - ` : ''}
            {year !== '' && <b> {year}</b>}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                <tr>
                  <td rowSpan={2}>Statement of funds allotted</td>
                  <td colSpan={2}>Funds allocated with date</td>
                  <td colSpan={2}>Funds utilised with date</td>
                  <td colSpan={2}>Funds balance after round</td>
                  <td rowSpan={2}>Allocated with dates</td>
                  <td rowSpan={2}>Balance as on</td>
                </tr>
                <tr>
                  <td>RD</td>
                  <td>State</td>
                  <td>RD</td>
                  <td>State</td>
                  <td>RD</td>
                  <td>State</td>
                </tr>
              </thead>
              <tbody>
                {' '}
                {stateArray.length > 0 || RDArray.length > 0 ? (
                  fundsAllottedArray.map((fundAllottedName: any, index) => (
                    <tr>
                      <td>{fundAllottedName}</td>
                      <td>
                        {DataExtractor(
                          RDArray,
                          fundAllottedName,
                          'fundAllocatedWithDate'
                        )}
                      </td>
                      <td>
                        {DataExtractor(
                          stateArray,
                          fundAllottedName,
                          'fundAllocatedWithDate'
                        )}
                      </td>
                      <td>
                        {DataExtractor(
                          RDArray,
                          fundAllottedName,
                          'fundUtilisedWithDate'
                        )}
                      </td>
                      <td>
                        {DataExtractor(
                          stateArray,
                          fundAllottedName,
                          'fundUtilisedWithDate'
                        )}
                      </td>
                      <td>
                        {DataExtractor(
                          RDArray,
                          fundAllottedName,
                          'fundBalanceAfterRound'
                        )}
                      </td>
                      <td>
                        {DataExtractor(
                          stateArray,
                          fundAllottedName,
                          'fundBalanceAfterRound'
                        )}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
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
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: 'center', height: '40px' }}
                  ></td>
                </tr>
              </tbody>
            </table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default DrugRequirementMDA2;

import React, { useState, useEffect, useCallback } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { months, years, reportTableStyle } from '../../utils';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { Exportpdf } from '../../../../services/PdfService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
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
} from '../../../../../Components/constant';
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

const DrugRequirementMDA = () => {
  let classes = useStyles();
  const YearNone = {
    label: 'Unknown Year',
    value: 0,
  };
  const d = new Date();
  let currentmonth = d.getMonth();

  const initialFilterValue = useCallback(() => {
    return {
      year: `${current_year}`,
      month: `${currentmonth}`,
    };
  }, []);
  const [reportTableData, setreportTableData] = useState<any>();
  const [year, setyear] = useState<any>(`${current_year}`);
  const [month, setmonth] = useState(`${current_month[0].value}`);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    month: Yup.string(),
  });

  useEffect(() => {
    const data = initialFilterValue();
    getDrugRequirementMDA1Data(data);
  }, [initialFilterValue]);

  async function getDrugRequirementMDA1Data(filterData) {
    const reportData: any = await ReportService.getDrugRequirementMDA1(
      filterData
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
      console.log(reportData, 'test');
    }
  }
  const formik = useFormik({
    initialValues: { year: `${current_year}`, month: `${currentmonth}` },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setyear(`${values.year}`);
      setmonth(`${values.month}`);
      getDrugRequirementMDA1Data(values);
    },
    onReset: () => {
      setmonth(`${current_month[0].value}`);
      setyear(`${current_year}`);
      getDrugRequirementMDA1Data(initialFilterValue());
    },
  });
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
          <p className='rpthead'>Drug Requirements</p>
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
                  `Drug Requirements.pdf`,
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
              filename='Drug Requirements'
              sheet='Drug Requirements'
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
                            <Row className='mb-3' style={{ padding: '0 20px' }}>
                              <div className='col-md-6 col-xl-4 col-12'>
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
                                        ? yearList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == formik.values.year
                                          )
                                        : yearList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == current_year
                                          )
                                    }
                                    options={yearList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'year',
                                        option && option.value
                                      );
                                      // setyear(option && option.label);
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.year : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Month
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
                                      formik.errors.month &&
                                      formik.touched.month
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='month'
                                    isClearable='true'
                                    value={
                                      formik.values.month !== ''
                                        ? monthList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value ==
                                                formik.values.month
                                          )
                                        : monthList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == previous_month
                                          )
                                    }
                                    options={monthList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'month',
                                        option && option.value
                                      );
                                      // setmonth(option && option.label);
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.month : ''}
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
            {month !== '' ? `Month -  ` : ''}
            {month !== '' && <b> {findMonthName(month)}</b>}
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
                  <td>Sr.No.</td>
                  <td colSpan={5}>Inventory Summary</td>
                  <td>DEC 100 Mg</td>
                  <td colSpan={3}>Albendazole</td>
                  <td colSpan={2}>Mactizin (Ivermectin)</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td colSpan={5}>
                    How many Tablets Balance are there in Stock after
                    compeletion of MDA public IDA round.
                  </td>
                  {reportTableData?.DEC100Mg?.map((dec: any) => {
                    return (
                      <>
                        <td colSpan={2}>{dec.tabletInStockBeforeRound}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Albendazole?.map((alb: any) => {
                    return (
                      <>
                        <td colSpan={2}>{alb.tabletInStockBeforeRound}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Mactizin?.map((Mac: any) => {
                    return (
                      <>
                        <td colSpan={2}>{Mac.tabletInStockBeforeRound}</td>
                      </>
                    );
                  })}
                </tr>
                <tr>
                  <td>2 a)</td>
                  <td colSpan={5}>
                    How many tablets were received for MDA round
                  </td>
                  {reportTableData?.DEC100Mg.map((dec: any) => {
                    return (
                      <>
                        <td colSpan={2}>{dec.tabletReceivedForRound}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Albendazole.map((alb: any) => {
                    return (
                      <>
                        <td colSpan={2}>{alb.tabletReceivedForRound}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Mactizin.map((Mac: any) => {
                    return (
                      <>
                        <td colSpan={2}>{Mac.tabletReceivedForRound}</td>
                      </>
                    );
                  })}
                </tr>
                <tr>
                  <td>2 b)</td>
                  <td colSpan={5}>
                    From which source(s) the tablets were received
                  </td>
                  {reportTableData?.DEC100Mg.map((dec: any) => {
                    return (
                      <>
                        <td colSpan={2}>
                          {dec.sourceFromTabletReceived
                            .split(',')
                            .filter(function (item, pos) {
                              return (
                                dec.sourceFromTabletReceived
                                  .split(',')
                                  .indexOf(item) == pos
                              );
                            })}
                        </td>
                      </>
                    );
                  })}
                  {reportTableData?.Albendazole.map((alb: any) => {
                    return (
                      <>
                        <td colSpan={2}>
                          {alb.sourceFromTabletReceived
                            .split(',')
                            .filter(function (item, pos) {
                              return (
                                alb.sourceFromTabletReceived
                                  .split(',')
                                  .indexOf(item) == pos
                              );
                            })}
                        </td>
                      </>
                    );
                  })}
                  {reportTableData?.Mactizin.map((Mac: any) => {
                    return (
                      <>
                        <td colSpan={2}>
                          {Mac.sourceFromTabletReceived
                            .split(',')
                            .filter(function (item, pos) {
                              return (
                                Mac.sourceFromTabletReceived
                                  .split(',')
                                  .indexOf(item) == pos
                              );
                            })}
                        </td>
                      </>
                    );
                  })}
                </tr>
                <tr>
                  <td>3</td>
                  <td colSpan={5}>How many tablets were used during MDA</td>
                  {reportTableData?.DEC100Mg.map((dec: any) => {
                    return (
                      <>
                        <td colSpan={2}>{dec.sum}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Albendazole.map((alb: any) => {
                    return (
                      <>
                        <td colSpan={2}>{alb.sum}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Mactizin.map((Mac: any) => {
                    return (
                      <>
                        <td colSpan={2}>{Mac.sum}</td>
                      </>
                    );
                  })}
                </tr>
                <tr>
                  <td>4</td>
                  <td colSpan={5}>
                    How many tablets have been destroyed since last &amp; during
                    round
                  </td>
                  {reportTableData?.DEC100Mg.map((dec: any) => {
                    return (
                      <>
                        <td colSpan={2}>{dec.tabletsDestroyedDuringRound}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Albendazole.map((alb: any) => {
                    return (
                      <>
                        <td colSpan={2}>{alb.tabletsDestroyedDuringRound}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Mactizin.map((Mac: any) => {
                    return (
                      <>
                        <td colSpan={2}>{Mac.tabletsDestroyedDuringRound}</td>
                      </>
                    );
                  })}
                </tr>
                <tr>
                  <td>5</td>
                  <td colSpan={5}>
                    How many tablets have been lost/stolen since last &amp;
                    during round
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}></td>
                  <td></td>
                </tr>
                <tr>
                  <td>6</td>
                  <td colSpan={5}>How many Tablets Balance in Stock as on</td>
                  {reportTableData?.DEC100Mg.map((dec: any) => {
                    return (
                      <>
                        <td colSpan={2}>{dec.tabletsBalanceInStock}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Albendazole.map((alb: any) => {
                    return (
                      <>
                        <td colSpan={2}>{alb.tabletsBalanceInStock}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Mactizin.map((Mac: any) => {
                    return (
                      <>
                        <td colSpan={2}>{Mac.tabletsBalanceInStock}</td>
                      </>
                    );
                  })}
                </tr>
                <tr>
                  <td>7</td>
                  <td colSpan={5}>
                    Please list each batch/Lot of Tablets remain in stock the
                    number of
                    <br /> useable tablets per batch lot on the corresponding
                    expiry date
                  </td>
                  {reportTableData?.DEC100Mg.map((dec: any) => {
                    return (
                      <>
                        <td colSpan={2}>{dec.BatchAndExp}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Albendazole.map((alb: any) => {
                    return (
                      <>
                        <td colSpan={2}>{alb.BatchAndExp}</td>
                      </>
                    );
                  })}
                  {reportTableData?.Mactizin.map((Mac: any) => {
                    return (
                      <>
                        <td colSpan={2}>{Mac.BatchAndExp}</td>
                      </>
                    );
                  })}
                </tr>
                <tr>
                  <td>8</td>
                  <td colSpan={5}>
                    How many more tablets are required for the next round
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={10}></td>
                </tr>
              </tbody>
            </table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
export default DrugRequirementMDA;

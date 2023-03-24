import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { months, years } from '../../utils';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
const Base_line_Survey = (props) => {
  let validSchema = Yup.object().shape({
    year: Yup.string(),
    months: Yup.string(),
  });
  const formik = useFormik({
    initialValues: { year: '', months: '' },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: () => {},
  });

  const YearNone = {
    label: 'Unknown Year',
    value: 0,
  };

  const MonthNone = {
    label: 'Unknown Month',
    value: 0,
  };

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [YearNone, ...yearList];

  let monthList = months.map((months: any, i: any) => {
    return { label: months.monthName, value: months.month };
  });
  monthList = [MonthNone, ...monthList];
  return (
    <div>
      <style>{`
    table{
      border-collapse: collapse;
    }
    th ,td{ border: 1px solid black }
    td {
      text-align: center;
    }
  `}</style>
      <div>
        <Accordion style={{ width: '100%', marginBottom: 15 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography>Filter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormikProvider value={formik}>
              <form
                style={{ width: '100%' }}
                onSubmit={formik.handleSubmit}
                onChange={formik.handleChange}>
                <div className='card'>
                  <div className='card-body'>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-3 col-12'>
                        {' '}
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'>
                            Month
                          </label>
                          <Select
                            styles={{
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
                              formik.errors.months && formik.touched.months
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            name='month'
                            isClearable='true'
                            value={
                              monthList
                                ? monthList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.months,
                                  )
                                : ''
                            }
                            options={monthList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'months',
                                option && option.value,
                              );
                            }}></Select>
                          <div className={'invalid-feedback'}>
                            {formik.errors ? formik.errors.months : ''}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3 col-12'>
                        {' '}
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'>
                            Year
                          </label>
                          <Select
                            styles={{
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
                              yearList
                                ? yearList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.year,
                                  )
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
                        className='col-md-6 col-xl-6 col-12'
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}>
                        <Button
                          variant='secondary'
                          className='mt-m font-chng'
                          type='submit'>
                          Filter{' '}
                        </Button>
                      </div>
                    </Row>{' '}
                  </div>
                </div>
              </form>
            </FormikProvider>
          </AccordionDetails>
        </Accordion>
      </div>
      <h4 style={{ textAlign: 'center' }}>Base Line Data</h4>
      <table style={{ border: '0' }}>
        <colgroup></colgroup>
        <tr>
          <td height='21'>
            Sr. No.
          </td>
          <td>
            <b>P.H.C. </b>
          </td>
          <td>
            <b>Sub center</b>
          </td>
          <td>
            <b>Village</b>
          </td>
          <td>
            <b>Site</b>
          </td>
          <td>
            <b>Date of Survey</b>
          </td>
          <td>
            <b>B.S.Collection</b>
          </td>
          <td>
            <b>B.S.Examination</b>
          </td>
          <td>
            <b>Mf Positive</b>
          </td>
          <td>
            <b>Mf Rate %</b>
          </td>
        </tr>
        <tr>
          <td height='21' align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
        </tr>
        <tr>
          <td height='21' align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
        </tr>
        <tr>
          <td height='21' align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
        </tr>
        <tr>
          <td height='21' align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
        </tr>
        <tr>
          <td colSpan={4} height='21'>
            <b>Total</b>
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
          <td align='left'>
            <br />
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Base_line_Survey;

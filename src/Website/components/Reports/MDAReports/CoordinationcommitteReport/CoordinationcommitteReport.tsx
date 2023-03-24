import React, { useState, useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  current_year,
  previous_month,
  yearList,
  monthList,
  NoneList,
} from '../../../../../Components/constant';

const CoordinationcommitteReport = (props) => {
  const prevDistrictRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
  }, []);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    months: Yup.string(),

    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('district is required').nullable(),
    }),
  });
  const formik = useFormik({
    initialValues: {
      districtId: '',
      year: current_year,
      months: previous_month,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: () => {},
  });

  let [districtIdValues, setdistrictIdValues] = useState([]);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const YearNone = {
    label: 'Unknown Year',
    value: 0,
  };

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
    }
  }
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
      <div className='flex mb-5'>
        <Accordion style={{ width: '100%', marginBottom: 15 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>Filter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormikProvider value={formik}>
              <form
                style={{ width: '100%' }}
                onSubmit={formik.handleSubmit}
                onChange={formik.handleChange}
              >
                <div className='card'>
                  <div className='card-body'>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='districtId'
                            className='form-label font-chng'
                          >
                            District
                          </label>
                          {districtIdValues && districtIdValues.length !== 0 ? (
                            <Select
                              name='districtId'
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
                              options={districtIdList}
                              isClearable='true'
                              className={
                                formik.errors.districtId &&
                                formik.touched.districtId
                                  ? 'custom-select is-invalid'
                                  : 'custom-select'
                              }
                              value={
                                districtIdList
                                  ? districtIdList.find(
                                      (option) =>
                                        option &&
                                        option.value ===
                                          formik.values.districtId
                                    )
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
                              name='districtId'
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
                                          parseInt(formik.values.districtId)
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
                            {formik.errors ? formik.errors.districtId : ''}
                          </div>
                        </div>
                      </div>

                      <div className='col-md-6 col-xl-3 col-12'>
                        {' '}
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
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
                                      option.value === formik.values.year
                                  )
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
                      <div className='col-md-6 col-xl-3 col-12'>
                        {' '}
                        <div className='form-grp'>
                          <label
                            htmlFor='email'
                            className='form-label font-chng'
                          >
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
                                      option.value === formik.values.months
                                  )
                                : ''
                            }
                            options={monthList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'months',
                                option && option.value
                              );
                            }}
                          ></Select>
                          <div className={'invalid-feedback'}>
                            {formik.errors ? formik.errors.months : ''}
                          </div>
                        </div>
                      </div>
                      <div
                        className='col-md-6 col-xl-3 col-12'
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          variant='secondary'
                          className='mt-m font-chng'
                          type='submit'
                        >
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
      <div style={{ marginTop: '10px' }}>
        <div
          style={{
            backgroundColor: 'yellow',
            border: 'none',
            textAlign: 'center',
          }}
        >
          <b>
            Table 12 Details of District Co-ordination Committee <br />
            (DCC) meeting in District------
          </b>
        </div>
      </div>
      <table style={{ border: '0' }}>
        <tr>
          <td colSpan={2} rowSpan={2} height='42' align='center' valign='top'>
            <b>Designation of Members</b>
          </td>
          <td colSpan={2} rowSpan={2} align='center' valign='top'>
            {' '}
            <b>Date of First DCC Meeting</b>
          </td>
          <td colSpan={2} rowSpan={2} align='center' valign='top'>
            {' '}
            <b>Date of Second DCC Meeting</b>
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td colSpan={2} height='21' align='left' valign='bottom'>
            <br />
          </td>
          <td colSpan={2} align='left' valign='bottom'>
            {' '}
            <br />
          </td>
          <td colSpan={2} align='left' valign='bottom'>
            {' '}
            <br />
          </td>
        </tr>
      </table>
    </div>
  );
};

export default CoordinationcommitteReport;

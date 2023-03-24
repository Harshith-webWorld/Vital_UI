import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router';
import history from '../../../helpers/history';
import settingsService from '../../../helpers/services/website-settings.service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../redux';

const AddSettings = () => {
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const location = useLocation<any>();
  const [initialValues, setInitialValues] = useState({
    settingKey: '',
    settingValue: '',
    settingUnit: 'seconds',
    isEnabled: true,
    isActive: true,
    createdBy: ReduxLoginInfo.Admin.login.entities.createdBy,
    lastModifiedBy: ReduxLoginInfo.Admin.login.entities.lastModifiedBy,
  });

  let validSchema = Yup.object().shape({
    settingKey: Yup.string().required('Settings Key is required'),
    settingValue: Yup.string().required('Settings value is required'),
    settingUnit: Yup.string(),
    isEnabled: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      settingKey: initialValues.settingKey ? initialValues.settingKey : '',
      settingValue: initialValues.settingValue
        ? initialValues.settingValue
        : '',
      settingUnit: initialValues.settingUnit ? initialValues.settingUnit : '',
      isEnabled: initialValues.isEnabled ? initialValues.isEnabled : '',
      isActive: initialValues.isActive ? initialValues.isActive : '',
      createdBy: initialValues.createdBy ? initialValues.createdBy : 0,
      lastModifiedBy: initialValues.lastModifiedBy
        ? initialValues.lastModifiedBy
        : 0,
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      const { settingKey, settingValue, settingUnit, isEnabled } = values;
      let response;
      if (location && location.state && location.state.id) {
        const editData = {
          id: `${location.state.id}`,
          settingKey: `${settingKey}`,
          settingValue: `${settingValue}`,
          settingUnit: `${settingUnit}`,
          isEnabled: `${isEnabled}`,
        };
        response = settingsService.postWebsiteSettingsData(editData);
      } else {
        const addData = {
          settingKey: `${settingKey}`,
          settingValue: `${settingValue}`,
          settingUnit: `${settingUnit}`,
          isEnabled: `${isEnabled}`,
        };
        response = settingsService.postWebsiteSettingsData(addData);
      }
      if (response) {
        history.push('/siteSettings');
      }
    },
  });

  const getOneSettings = useCallback(() => {
    async function getData() {
      if (location && location.state && location.state.id) {
        const response = await settingsService.getOneWebsiteSettingsDataInfo(
          location.state.id,
        );
        if (response && response.data && response.data.length > 0) {
          setInitialValues((prev) => {
            return {
              ...prev,
              settingKey: response.data[0].settingKey,
              settingValue: response.data[0].settingValue,
              settingUnit: response.data[0].settingUnit,
              isEnabled: response.data[0].isEnabled,
            };
          });
        }
      }
    }
    getData();
  }, [location]);

  useEffect(() => {
    getOneSettings();
  }, [getOneSettings]);

  return (
    <div className='content add-page'>
      <div className='card'>
        <div className='card-header'>
          <h1 className='cardtitlenew'>
            {location.state ? '' : 'Add Site Settings'}
            {location.state &&
              location.state.id &&
              location.state.view &&
              'Site Settings'}
            {location.state &&
              location.state.id &&
              !location.state.view &&
              'Edit Site Settings'}
          </h1>
        </div>
        <div className='card-body'>
          <FormikProvider value={formik}>
            <form
              style={{ width: '100%' }}
              onSubmit={formik.handleSubmit}
              onChange={formik.handleChange}>
              <fieldset>
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label htmlFor='settings Name' className='form-label'>
                        Setting Key
                      </label>
                      <input
                        name='settingKey'
                        value={formik.values.settingKey}
                        type='text'
                        disabled={true}
                        className={
                          formik.errors.settingKey && formik.touched.settingKey
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        onChange={(e) =>
                          formik.setFieldValue('settingKey', e.target.value)
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.settingKey
                          ? formik.errors.settingKey
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-3' style={{ marginTop: '35px' }}>
                    <div className='form-grp'>
                      <label>
                        <input
                          type='checkbox'
                          name='isEnabled'
                          onChange={(e) =>
                            formik.setFieldValue('isEnabled', e.target.value)
                          }
                          checked={formik.values.isEnabled === true}
                          value='true'
                        />
                        {'  Enable'}
                      </label>
                      <div className={'invalid-feedback'}>
                        {formik.errors.settingKey
                          ? formik.errors.settingKey
                          : ''}
                      </div>
                    </div>
                  </div>
                </Row>
              </fieldset>{' '}
              <fieldset
                disabled={location.state && location.state.view ? true : false}>
                <Row>
                  <div className='col-md-9'>
                    <div className='form-grp'>
                      <label htmlFor='settingValue' className='form-label'>
                        Setting Value
                      </label>
                      <input
                        name='settingValue'
                        value={formik.values.settingValue}
                        type='text'
                        className={
                          formik.errors.settingValue &&
                          formik.touched.settingValue
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        onChange={(e) =>
                          formik.setFieldValue('settingValue', e.target.value)
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.settingValue
                          ? formik.errors.settingValue
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <div className='form-grp'>
                      <label htmlFor='settingUnit' className='form-label'>
                        Setting Unit
                      </label>
                      <input
                        name='settingUnit'
                        value={formik.values.settingUnit}
                        type='text'
                        disabled={true}
                        className={
                          formik.errors.settingUnit &&
                          formik.touched.settingUnit
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        onChange={(e) =>
                          formik.setFieldValue('settingUnit', e.target.value)
                        }
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors.settingUnit
                          ? formik.errors.settingUnit
                          : ''}
                      </div>
                    </div>
                  </div>
                </Row>
              </fieldset>
              <Row>
              <div className="form-grp buttongrouprightend mb-4">
                  <button
                    className="btn font-chng"
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                      textTransform: 'none',
                    }}
                    onClick={() => history.push('/siteSettings')}>
                    Cancel
                  </button>

                  {location && location.state && location.state.view ? (
                    ''
                  ) : (
                    <button type='submit' 
                    className="btn font-chng"
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                      textTransform: 'none',
                    }}>
                      Submit
                    </button>
                  )}
                </div>
              </Row>
            </form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default AddSettings;

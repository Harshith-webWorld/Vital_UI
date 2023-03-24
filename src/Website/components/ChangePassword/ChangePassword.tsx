import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router';

import { Formik, useFormik } from 'formik';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import ChangePasswordServices from '../../../helpers/services/website-changepassword.service';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import history from '../../../helpers/history';

const validSchema = Yup.object().shape({
  oldpassword: Yup.string()
    .required('Oldpassword is required')
    .min(6, 'Password must be at least 6 characters'),
  newpassword: Yup.string()
    .required('Newpassword is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmpassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Confirm Password is required')
    .oneOf([Yup.ref('newpassword'), null], 'Passwords must match'),
});
const ChangePassword: React.FC = () => {
  const location = useLocation<any>();

  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const signinInfoId = signinInfo && signinInfo.data && signinInfo.data.id;
  const [updatePasswords, setUpdatePasswords] = useState({
    oldpassword: '',
    newpassword: '',
    confirmpassword: '',
  });

  const formik = useFormik({
    initialValues: updatePasswords,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      setUpdatePasswords({
        ...updatePasswords,
        newpassword: values.newpassword,
        oldpassword: values.oldpassword,
      });

      sendUpdatePassword(values, signinInfoId);
      formik.resetForm({ values: updatePasswords });
    },
  });

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid') {
      formik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
            className: 'toast-message',
          });
        }
      });
    }
  };
  async function sendUpdatePassword(values, signinInfoId) {
    const response = await ChangePasswordServices.updatePasswords(
      values,
      signinInfoId
    );
    if (response && response.status) {
      console.log('website resetPassword:: ', response.data);
      toast.success('Password updated Successfully', {
        position: toast.POSITION.TOP_CENTER,
        className: 'toast-message',
      });
    } else if (response && !response.status) {
      toast.error(response.message, {
        position: toast.POSITION.TOP_CENTER,
        className: 'toast-message',
      });
    }
  }

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item active>Change Password</Breadcrumb.Item>
      </Breadcrumb>
      <div className='row'>
        <div className='col-12 col-xl-12'>
          <div className='content add-page'>
            <div className='card'>
              <div className='card-body'>
                <Row className='mb-3'>
                  <Form
                    onClick={showToast}
                    onSubmit={formik.handleSubmit}
                    className='card-body'
                  >
                    <div className='form-grp'>
                      <div className='col-md-9'>
                        <label htmlFor='question' className='form-label'>
                          Old Password
                        </label>

                        <input
                          name='oldpassword'
                          type='password'
                          value={formik.values.oldpassword}
                          onChange={formik.handleChange}
                          className='form-control'
                        />
                        <label className='text-danger'>
                          {formik.errors.oldpassword
                            ? formik.errors.oldpassword
                            : null}
                        </label>
                      </div>
                      <div className='col-md-9'>
                        <label htmlFor='question' className='form-label'>
                          New Password
                        </label>

                        <input
                          name='newpassword'
                          type='password'
                          value={formik.values.newpassword}
                          onChange={formik.handleChange}
                          className='form-control'
                        />
                        <label className='text-danger'>
                          {formik.errors.newpassword
                            ? formik.errors.newpassword
                            : null}
                        </label>
                      </div>
                      <div className='col-md-9'>
                        <label htmlFor='question' className='form-label'>
                          Confirm Password
                        </label>

                        <input
                          name='confirmpassword'
                          type='password'
                          value={formik.values.confirmpassword}
                          onChange={formik.handleChange}
                          className='form-control'
                        />
                        <label className='text-danger'>
                          {formik.errors.confirmpassword
                            ? formik.errors.confirmpassword
                            : null}
                        </label>
                      </div>
                    </div>

                    <div
                      className={
                        location.state && location.state.view
                          ? 'd-none'
                          : 'form-grp Password-Change'
                      }
                    >
                      {location && location.state && location.state.view ? (
                        ''
                      ) : (
                        <button
                          type='submit'
                          id='Submitbtnid'
                          className='btn btn-outline-light'
                        >
                          submit
                        </button>
                      )}
                      <button
                        className='btn btn-outline-light'
                        onClick={() => history.push('/WebDashboard')}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                </Row>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-12 col-xl-6">
                        <div className="card">
                            <div className="card-header">
                                <h5>Low / High Performing Dist</h5>
                            </div>
                            <div className="card-body">
                                
                            </div>
                        </div>
                    </div> */}
      </div>
    </div>
  );
};

export default ChangePassword;

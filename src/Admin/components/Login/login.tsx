import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { onLogin } from './loginslice';
import { ToastContainer } from 'react-toastify';
import loginLogo from '../../assets/images/mhlogo.png';
import history from '../../../helpers/history';

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const [initialValues] = useState({
    userName: '',
    password: '',
  });
  const validSchema = Yup.object().shape({
    userName: Yup.string()
      // .userName('Email is invalid')
      .required('Username is required'),
    password: Yup.string()
      .min(5, 'Password must be at least 5 characters')
      .required('Password is required'),
  });

  const onSubmit = async (val: any) => {
    let resp: any = await dispatch(onLogin(val));
    if (resp && resp.payload) {
      history.push('/dashboardadmin');
    }
  };

  return (
    <div className='ad-login'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-xl-7 col-12 col-md-12 col-lg-9'>
            <div className='card'>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-xl-6 col-12 col-md-6'>
                    <div className='ad-logo'>
                      <img src={loginLogo} />
                    </div>
                  </div>
                  <div className='col-xl-6 col-12 col-md-6'>
                    <h5>Sign In</h5>
                    <ToastContainer />
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validSchema}
                      onSubmit={onSubmit}>
                      {({ errors, status, touched }) => (
                        <Form>
                          <div className='form-grp'>
                            <label htmlFor='userName' className='form-label'>
                              UserName
                            </label>
                            <Field
                              name='userName'
                              type='text'
                              className={
                                'form-control' +
                                (errors.userName && touched.userName
                                  ? ' is-invalid'
                                  : '')
                              }
                            />
                            <ErrorMessage
                              name='userName'
                              component='div'
                              className='invalid-feedback'
                            />
                          </div>
                          <div className='form-grp'>
                            <label htmlFor='password' className='form-label'>
                              Password
                            </label>
                            <Field
                              name='password'
                              type='password'
                              className={
                                'form-control ' +
                                (errors.password && touched.password
                                  ? ' is-invalid'
                                  : '')
                              }
                            />
                            <ErrorMessage
                              name='password'
                              component='div'
                              className='invalid-feedback'
                            />
                          </div>
                          <div className='form-grp'>
                            <button type='submit' className='btn btn-secondary'>
                              Sign In
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;

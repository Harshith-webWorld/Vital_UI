import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useFormik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { onSignin } from './siginslice';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import NewForgetPasswordModal from './NewForgetPasswordModal';
import { useCookies } from 'react-cookie';
import { Button as ReactButton } from '@material-ui/core';

const ModalSignin: any = (props) => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [disabledsignin, setdisabledsignin] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [singinInitial, setSinginInitial] = useState({
    userName: cookies.UserName || '',
    password: cookies.Password || '',
  });
  const validSchema = Yup.object().shape({
    userName: Yup.string()
      //.email('userName is invalid')
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: singinInitial,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      setdisabledsignin(true);
      let resp = await dispatch(
        onSignin(values, (isLoginFailed) => {
          if (isLoginFailed === true) {
            setdisabledsignin(false);
          }
        })
      );
    },
  });

  const handleChange = (e) => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      setCookie('UserName', formik.values.userName, {
        secure: true,
        path: '/',
      });
      setCookie('Password', formik.values.password, {
        secure: true,
        path: '/',
      });
    } else {
      removeCookie('UserName');
      removeCookie('Password');
    }
  };

  const [showSignPopup, setShowSignPopup] = useState(false);
  const [showForget, setShowForget] = useState(false);

  const handleCloseModalForget = () => {
    setShowForget(false);
    setShowSignPopup(true);
  };
  const handleShowModalForget = () => {
    setShowSignPopup(false);
    setShowForget(true);
  };
  useEffect(() => {
    showForget
      ? props.onChangetitle('FORGET PASSWORD')
      : props.onChangetitle('Sign in');
  }, [showForget]);
  return (
    <div>
      {' '}
      {!showSignPopup && !showForget ? (
        <Form onSubmit={formik.handleSubmit} className='card-body'>
          <div className='form-grp'>
            <label className='form-label'>Username</label>
            <input
              name='userName'
              type='text'
              value={formik.values.userName}
              onChange={formik.handleChange}
              className='form-control autocomplete'
            />
            <label className='text-danger'>
              {formik.errors.userName ? formik.errors.userName : null}
            </label>
          </div>
          <div className='form-grp'>
            <label className='form-label'>Password</label>
            <input
              name='password'
              type='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              className='form-control autocomplete'
            />
            <label className='text-danger'>
              {formik.errors.password ? formik.errors.password : null}
            </label>
          </div>
          <div
            className='signinscreen'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className='form-check' style={{ float: 'left' }}>
              <input
                className='form-check-input'
                type='checkbox'
                value=''
                id='flexCheckDefault'
                checked={rememberMe}
                onChange={handleChange}
              />
              <label className='form-check-label form-label forgetpwd'>
                Remember me
              </label>
            </div>
            <div style={{ float: 'right' }}>
              {console.log(disabledsignin, 'disabledsignin')}
              <ReactButton
                type='submit'
                disabled={disabledsignin}
                className='btn-cancel'
                style={{
                  marginRight: '10px',
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                  textTransform: 'none',
                  maxWidth: '225px',
                  width: '225px',
                  minWidth: 'fit-content',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                Sign in
              </ReactButton>{' '}
            </div>
          </div>

          <div
            className='form-group col text-right'
            style={{ float: 'right', marginTop: '20px' }}
          >
            {
              <p
                className='forgetpwd'
                style={{ textDecorationLine: 'underline' }}
                onClick={handleShowModalForget}
              >
                Forget Password?
              </p>
            }
          </div>
        </Form>
      ) : (
        <NewForgetPasswordModal />
      )}
    </div>
  );
};
export default ModalSignin;

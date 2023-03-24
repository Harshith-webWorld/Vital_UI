import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import ForgetPasswordService from '../../../helpers/services/website-forgetpassword.service';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import history from '../../../helpers/history';
import { Button as ReactButton } from '@material-ui/core';

const ForgotPasswordModal: React.FC = () => {
  let WebsiteContentData: WebsiteContent[] = [];
  const [websiteContents, setWebsiteContent] =
    React.useState(WebsiteContentData);
  const [hideSendOtpScreen, sethideSendOtpScreen] = React.useState(false);
  const [hideResetpassword, sethideResetpassword] = React.useState(true);
  const [hideVerifyOtp, sethideVerifyOtp] = React.useState(true);
  const [verifyOtpInfo, setVerifyOtpInfo] = useState({
    otp: '',
    email: '',
  });

  const [sendOtpInfo, setSendOtpInfo] = useState({
    email: '',
  });

  const [resetPasswordInfo, setResetPasswordInfo] = useState({
    newpassword: '',
    otp: '',
    email: '',
    id: 0,
  });
  React.useEffect(() => {
    getWebsitecontent();
  }, []);

  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent();
    if (response) {
      WebsiteContentData = response.data;
      setWebsiteContent(response.data);
    }
  }
  async function sendOtpToEmail(values) {
    const response = await ForgetPasswordService.sendOtp(values);
    if (response && response.data) {
      console.log('website sendOtpToEmail:: ', response.data);
      sethideSendOtpScreen(true);
      sethideResetpassword(true);
      sethideVerifyOtp(false);
      toast.success('Email Sent Successfully', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (response && response.message === 'User does not exist') {
      toast.error(response.message, { position: toast.POSITION.TOP_CENTER });
    } else {
      toast.error('Email Sent failed', { position: toast.POSITION.TOP_CENTER });
    }
  }

  async function verificationOTP(values) {
    const response = await ForgetPasswordService.verifyingOTP(values);
    if (response && response.data) {
      console.log('website verifyingOTP:: ', response.data);
      let updateuserInfo = { id: response.data.id, otp: response.data.userOtp };
      setResetPasswordInfo({ ...resetPasswordInfo, ...updateuserInfo });
      sethideSendOtpScreen(true);
      sethideResetpassword(false);
      sethideVerifyOtp(true);
      toast.success('OTP verified Successfully', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error('Invalid OTP', { position: toast.POSITION.TOP_CENTER });
    }
  }
  async function updateResetPassword(values) {
    console.log('website updatePassword:: ', values);
    const response = await ForgetPasswordService.updatePassword(
      values,
      values.id,
    );
    if (response && response.status) {
      console.log('website resetPassword:: ', response.data);
      sethideSendOtpScreen(true);
      sethideResetpassword(true);
      sethideVerifyOtp(true);
      toast.success('Password updated Successfully', {
        position: toast.POSITION.TOP_CENTER,
      });
      history.push('/');
    } else if (response && !response.status) {
      toast.error(response.message, { position: toast.POSITION.TOP_CENTER });
    }
  }

  const validSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email is invalid')
      .required('Email ID is required'),
  });
  const validSchema1 = Yup.object().shape({
    otp: Yup.string().required('OTP is required'),
  });
  const validSchema2 = Yup.object().shape({
    newpassword: Yup.string()
      .required('new password is required')
      .min(6, 'New Password must be at least 6 characters'),
  });

  const formik = useFormik({
    initialValues: sendOtpInfo,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      console.log('values', values);
      setVerifyOtpInfo({ ...verifyOtpInfo, email: values.email });
      setResetPasswordInfo({
        ...resetPasswordInfo,
        email: values.email,
      });
      sendOtpToEmail(values);
      console.log('form1', values);
    },
  });
  const formik1 = useFormik({
    initialValues: verifyOtpInfo,
    enableReinitialize: true,
    validationSchema: validSchema1,
    onSubmit: async (values: any) => {
      verificationOTP(values);

      console.log('form2', values);
    },
  });

  const formik2 = useFormik({
    initialValues: resetPasswordInfo,
    enableReinitialize: true,
    validationSchema: validSchema2,
    onSubmit: async (values: any) => {
      updateResetPassword(values);
      console.log('form3', values);
    },
  });

  return (
    <div>
      <div>
        {!hideSendOtpScreen && hideResetpassword && hideVerifyOtp && (
          <>
            <Form onSubmit={formik.handleSubmit} className='card-body'>
              <div className='form-grp'>
                <label className='form-label'>Email *</label>
                <p>We will send you a verification code to your email</p>
                <input
                  name='email'
                  type='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className='form-control'
                />
                <label className='text-danger'>
                  {formik.errors.email ? formik.errors.email : null}
                </label>
              </div>
              <div className='form-grp text-center'>
                <ReactButton
                  type='submit'
                  id='sendemail'
                  className='btn-cancel'
                  style={{
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '13px',
                    lineHeight: '20px',
                    cursor: 'pointer',
                  }}>
                  Send OTP via Email
                </ReactButton>
              </div>{' '}
            </Form>
          </>
        )}

        {hideSendOtpScreen && hideResetpassword && !hideVerifyOtp && (
          <>
            {' '}
            <div className='card-header'>
              <div
                className='formtitlenew font-chng'
                style={{ marginLeft: '19px' }}>
                Verification OTP{' '}
              </div>{' '}
            </div>
            <Form onSubmit={formik1.handleSubmit} className='card-body'>
              <div className='form-grp'>
                <label className='form-label'>OTP *</label>
                <p>
                  Please, enter the code we've sent you to {formik.values.email}
                </p>

                <input
                  name='otp'
                  type='text'
                  value={formik1.values.otp}
                  onChange={formik1.handleChange}
                  className='form-control'
                />
                <label className='text-danger'>
                  {formik1.errors.otp ? formik1.errors.otp : null}
                </label>
              </div>

              <div className='form-grp'>
                <ReactButton
                  type='submit'
                  id='verifyotp'
                  className='btn-cancel'
                  style={{
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '13px',
                    lineHeight: '20px',
                    cursor: 'pointer',
                  }}>
                  Confirm
                </ReactButton>
              </div>
            </Form>{' '}
          </>
        )}

        {hideSendOtpScreen && !hideResetpassword && hideVerifyOtp && (
          <>
            {' '}
            <div className='card-header'>
              <h4>Reset Password</h4>
            </div>
            <Form onSubmit={formik2.handleSubmit} className='card-body'>
              <div className='form-grp'>
                <label className='form-label'>New Password * </label>
                <input
                  name='newpassword'
                  type='text'
                  value={formik2.values.newpassword}
                  onChange={formik2.handleChange}
                  className='form-control'
                />
                <label className='text-danger'>
                  {formik2.errors.newpassword
                    ? formik2.errors.newpassword
                    : null}
                </label>
              </div>

              <div className='form-grp'>
                <ReactButton
                  type='submit'
                  id='resetpassword'
                  className='btn-cancel'
                  style={{
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '13px',
                    lineHeight: '20px',
                    cursor: 'pointer',
                  }}>
                  Reset Password
                </ReactButton>
              </div>
            </Form>{' '}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// import { useDispatch, useSelector } from "react-redux";
// import { onLogin, ApplicationState } from '../redux';
import { ToastContainer, toast } from 'react-toastify';
import '../../../Admin/components/website-news/node_modules/react-toastify/dist/ReactToastify.css';
import history from '../../../helpers/history';
const Userform: React.FC = () => {

    const [initialValues] = useState({
        email: '',
        password: '',
    });
    const validSchema = Yup.object().shape({

        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),

    })

   
    const onSubmit = (val: any) => {
        history.push('/newsList')
    }




    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-6">
                    <div className="card o-hidden border-0 shadow-lg my-4">
                        <div className="card-body p-0">

                            <div className="col-lg-12">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Login</h1>
                                    </div>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validSchema}
                                        onSubmit={onSubmit}>

                                        {({ errors, status, touched }) => (
                                            <Form>

                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Password</label>
                                                    <Field name="password" type="password" className={'form-control ' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                                </div>
                                                <br />
                                                <div className="form-group text-center ">
                                                    <button type="submit" className="btn btn-primary mr-2">submit</button>

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



    )
}
export default Userform;
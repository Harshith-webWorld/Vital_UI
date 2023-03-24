import React, { useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import { useFormik,ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { onSignin } from '../WebLogin/siginslice';
import { Link } from 'react-router-dom';
import Modal from "react-bootstrap/Modal";
import ForgetPasswordModal from './ForgetPasswordModal';
import { useCookies } from 'react-cookie';


const ModalSignin: React.FC = () => {
    
   const dispatch = useDispatch();
   const [rememberMe,setRememberMe] = useState(false);
   const [cookies, setCookie,removeCookie] = useCookies();
    const [singinInitial,setSinginInitial]=useState({
        userName:cookies.UserName||'',
        password:cookies.Password||'',
    })
   

    const validSchema = Yup.object().shape({

        userName: Yup.string()
            //.email('userName is invalid')
            .required('Username is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),

    })

    const formik = useFormik({
        initialValues: singinInitial,
        validationSchema:validSchema,
        onSubmit: async(values:any)=>{
            let resp = await dispatch(onSignin(values))
            }
    })
   
   

    const handleChange = (e)=>{
        
        setRememberMe(!rememberMe)
        if(!rememberMe){
        setCookie('UserName',  formik.values.userName ,{secure: true, path:'/' });
        setCookie('Password', formik.values.password,{ secure: true , path: '/'});
        }
        else{
            removeCookie('UserName')
            removeCookie('Password')
        }
     }


    const [showSignPopup, setShowSignPopup] = useState(false);
    const [showForget, setShowForget] = useState(false);

    const handleCloseModalForget = () => {
        setShowForget(false)
        setShowSignPopup(true);

    }
    ;
    const handleShowModalForget = () => {
        setShowSignPopup(false);
        setShowForget(true)

    }
  


    return (
        <div className="log-box">
          {!showSignPopup && !showForget && <div className="card">
                <div className="card-header">
                    <h4>Sign in</h4>
                </div>
                <Form onSubmit={formik.handleSubmit} className="card-body" >
                    <div className="form-grp">
                        <label className="form-label">Username</label>
                        <input name="userName" type="text"  value={formik.values.userName} onChange={formik.handleChange} className="form-control autocomplete" />
                        <label className="text-danger">{(formik.errors.userName ? formik.errors.userName : null)}</label>
                    </div>
                    <div className="form-grp">
                        <label className="form-label">Password</label>
                        <input name="password" type="password" value={formik.values.password} onChange={formik.handleChange} className="form-control autocomplete" />
                        <label className="text-danger">{(formik.errors.password ? formik.errors.password : null)}</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox"  value="" id="flexCheckDefault" checked={rememberMe} onChange={handleChange} />
                        <label className="form-check-label form-label">
                            Remember me
                        </label>
                    </div>
                    <div className="form-grp">
                        <button type="submit" className="btn sign-btn">Sign in</button>
                    </div>


                    <div className="form-group col text-right">
                       
                   
                        {<button
                        className="btn btn-outline-light"
                        onClick={handleShowModalForget}
                        >
                            Forget Password?
                        </button> }
                        
                </div>
                </Form>
            </div>}

            {  showForget  && <Modal
                        show={!showSignPopup && showForget}
                        backdrop="static"
                        onHide={handleCloseModalForget}
                        dialogClassName="sign-modal in-down"
                        aria-labelledby="example-custom-modal-styling-title"
                        >
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                           <ForgetPasswordModal  />
                        </Modal.Body>
                    </Modal> }
        </div>

        
    )
}
export default ModalSignin;
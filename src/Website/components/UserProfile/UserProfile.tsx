import React, { useState, useEffect } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useSelector } from 'react-redux';
import UserService from '../../../helpers/services/userService';
import history from '../../../helpers/history';

const UserProfile: React.FC = () => {
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const signinInfoId = signinInfo && signinInfo.data && signinInfo.data.id;

  const [designationList, setDesignationList] = useState([]);
  const [institution, setInstitution] = useState([]);

  async function getUserDetails() {
    const response = await UserService.getOneUser(signinInfoId);
    console.log('form21', response);
    if (response && response.data) {
      setDesignationList(response && response.data);
    }
  }
  const rowValues: any = designationList && designationList[0];

  React.useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item active>User Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div className='row'>
        {/* <div className="col-12 col-xl-8">
                </div> */}
        <div className='col-12 col-xl-12'>
          <div className='font-chng'>
            <div className='card'>
              {/* <div className="card-header">
                            <h5 className="card-title">Quick Links</h5>
                            <i className="fas fa-chevron-right"></i>
                        </div> */}
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-8 col-12'>
                    <div className='form-grp d-flex'>
                      <label htmlFor='FullName' className='form-label'>
                        Full Name :&nbsp;
                      </label>
                      <div className='line-ht'>
                        {signinInfo &&
                          signinInfo.data &&
                          signinInfo.data.fullName}
                      </div>
                    </div>
                    <div className='form-grp d-flex'>
                      <label htmlFor='DOB' className='form-label'>
                        DOB :&nbsp;
                      </label>
                      <div className='line-ht'>
                        {signinInfo && signinInfo.data && signinInfo.data.DOB}
                      </div>
                    </div>
                    <div className='form-grp d-flex'>
                      <label htmlFor='Email' className='form-label'>
                        Email:&nbsp;
                      </label>
                      <div className='line-ht'>
                        {signinInfo && signinInfo.data && signinInfo.data.email}
                      </div>
                    </div>
                    <div className='form-grp d-flex'>
                      <label htmlFor='MpbileNumber' className='form-label'>
                        Mobile Number:&nbsp;
                      </label>
                      <div className='line-ht'>
                        {signinInfo &&
                          signinInfo.data &&
                          signinInfo.data.mobileNumber}
                      </div>
                    </div>
                    <div className='form-grp d-flex'>
                      <label htmlFor='designation' className='form-label'>
                        Designation:&nbsp;
                      </label>
                      <div className='line-ht'>
                        {rowValues &&
                          rowValues.designation &&
                          rowValues.designation.designationName}
                      </div>
                    </div>
                    <div className='form-grp d-flex'>
                      <label htmlFor='institution' className='form-label'>
                        Institution:&nbsp;
                      </label>
                      <div className='line-ht'>
                        {rowValues &&
                          rowValues.institutionType &&
                          rowValues.institutionType.institutionTypeName}
                      </div>
                    </div>

                    <div className='form-grp'>
                      {' '}
                      <a
                        className='p-3 btn-light rounded'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          history.push('/ChangePassword');
                        }}
                      >
                        Change Password
                      </a>
                    </div>
                  </div>
                </div>
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

export default UserProfile;

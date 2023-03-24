import React, { useState } from 'react';
import Logo from '../../assets/img/mhlogo.png';

const Footer = (props: any) => {
  const Websitecontent = props.webSiteContent;
  let contactUsText = () => {
    if (Websitecontent && Websitecontent.contactUsText) {
      return (
        <div className='con-box font-chng'>
          <h4>Contact Us</h4>
          <p>{Websitecontent.contactUsText}</p>
        </div>
      );
    }
  };

  return (
    <div className='foot-sec'>
      <div className='foot-wrap'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-4'>
              <div className='foot-logo font-chng'>
                <img src={Logo} />
              </div>
            </div>
            <div className='col-sm-4'>
              <div className='social-box font-chng'>
                <div className='icon-box'>
                  <i className='fab fa-twitter'></i>
                </div>
                <div className='icon-box'>
                  <i className='fab fa-linkedin-in'></i>
                </div>
                <div className='icon-box'>
                  <i className='fab fa-facebook-f'></i>
                </div>
              </div>
            </div>
            <div className='col-sm-4'>{contactUsText()}</div>
          </div>
        </div>
      </div>
      <div className='copy-box font-chng'>
        <h5>Copyright © 2021. All rights reserved.</h5>
      </div>
    </div>
  );
};
export default Footer;

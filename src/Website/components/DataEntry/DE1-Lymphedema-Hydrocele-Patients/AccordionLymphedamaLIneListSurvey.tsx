import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Button, Container } from 'react-bootstrap';

const AccordionLymphedamaLineListSurvey = (props) => {
  const rowValues: any = props && props.rowValues && props.rowValues.data;

  return (
    <div className='card cus-tablecard' style={{ padding: 30 }}>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>LymphedemaLineListId:</div>
            <div>{rowValues && rowValues.lymphedemaLineListId}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Survey Done Under:</div>
            <div>
              {rowValues &&
                rowValues.udCategoryOption &&
                rowValues.udCategoryOption.categoryOptionName}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Date Of Survey:</div>
            <div>{rowValues && rowValues.dateOfSurvey}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Verified:</div>
            <div>{rowValues && rowValues.isVerified ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Verified By Doctor Name:</div>
            <div>{rowValues && rowValues.verifiedByDoctorName}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Date Of Verification:</div>
            <div>{rowValues && rowValues.dateOfVerification}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Created on</div>
            <div>
              {rowValues &&
                moment(rowValues.createdAt).format('MM-DD-YYYY h:mm a')}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Updated on</div>
            <div>
              {rowValues &&
                moment(rowValues.updatedAt).format('MM-DD-YYYY h:mm a')}
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default AccordionLymphedamaLineListSurvey;

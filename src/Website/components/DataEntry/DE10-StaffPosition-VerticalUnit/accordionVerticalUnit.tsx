import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';

const AccordionVerticalStaffPostion = (props) => {
  const rowValues: any = props && props.rowValues && props.rowValues.data;
  console.log('track', rowValues);

  const staffTraningList =
    rowValues &&
    rowValues.staffPosVerticalUnitTrainingStatuses.map((item: any, i: any) => {
      return (
        <div className='form-grp' key={i}>
          <Row>
            <div className='col'>
              <div className='form-grp'>
                <div className='form-label font-chng'>
                  Staff Position Vertical Unit Id:
                </div>
                <div>{item && item.staffPosVerticalUnitId}</div>
              </div>
            </div>

            <div className='col'>
              <div className='form-grp'>
                <div className='form-label font-chng'>Type Of Taining:</div>
                <div>{item && item.typeOfTraining}</div>
              </div>
            </div>
            <div className='col'>
              <div className='form-grp'>
                <div className='form-label font-chng'>Place Of Taining:</div>
                <div>{item && item.placeOfTraining}</div>
              </div>
            </div>
          </Row>
          <Row>
            <div className='col'>
              <div className='form-grp'>
                <div className='form-label font-chng'>Date Of Taining:</div>
                <div>
                  {rowValues &&
                    moment(rowValues.dateOfTraining).format('DD/MM/YYYY')}
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='form-label font-chng'>CreatedAt:</div>
              <div>
                {rowValues && moment(rowValues.createdAt).format('DD/MM/YYYY')}
              </div>
            </div>
            <div className='col'>
              <div className='form-label font-chng'>LastModifiedAt:</div>
              <div>
                {rowValues && moment(rowValues.updatedAt).format('DD/MM/YYYY')}
              </div>
            </div>
          </Row>
        </div>
      );
    });

  return (
    <div className='card cus-tablecard' style={{ padding: '30px' }}>
      <Row className='mb-3'>
        <div className='col-md-2 col-xl-3 col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Id:</div>
            <div>{rowValues && rowValues.staffPosVerticalUnitId}</div>
          </div>
        </div>
        <div className='col-md-2 col-xl-3 col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Name Of Staff:</div>
            <div>{rowValues && rowValues.nameOfStaff}</div>
          </div>
        </div>
        <div className='col-md-2 col-xl-3 col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Designation:</div>
            <div>
              {rowValues &&
                rowValues.Designation &&
                rowValues.Designation.designationName}
            </div>
          </div>
        </div>
        {/* <div className="col-md-2 col-xl-3 col-12">
                 <div className="form-grp">
                    <div className="form-label font-chng">Designation:</div>
                    <div>{rowValues && rowValues.designationOther }</div>
                </div>
                </div> */}
        <div className='col-md-6 col-xl-3 col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Created On:</div>
            <div>
              {rowValues && moment(rowValues.createdAt).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3 col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Updated On:</div>
            <div>
              {rowValues && moment(rowValues.updatedAt).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
      </Row>
      <div>
        <h6
          className='formtitlenew font-chng form-grp'
          style={{ marginLeft: '0px', marginBottom: '10px' }}
        >
          {' '}
          Vertical Unit Trainig status
        </h6>
        {staffTraningList}
      </div>
    </div>
  );
};

export default AccordionVerticalStaffPostion;

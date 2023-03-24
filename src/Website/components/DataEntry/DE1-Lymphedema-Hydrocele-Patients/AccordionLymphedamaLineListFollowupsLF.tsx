import React, { useState, useEffect } from "react";
import moment from "moment";
import { Row, Col, Button, Container } from "react-bootstrap";

const AccordionLymphedamaLineListFollowUpsLF = (props) => {
    const rowValues:any = props && props.rowValues && props.rowValues.data;

    return (
      <div className='card cus-tablecard ' style={{ padding: 30 }}>
        <Row>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Name:</div>
              <div>{rowValues && rowValues.serviceProviderName}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Designation:</div>
              <div>{rowValues && rowValues.serviceProviderDesignation}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Place:</div>
              <div>
                {rowValues && rowValues.serviceProviderPlace
                  ? rowValues.serviceProviderPlace
                  : 'Nil'}
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Phone:</div>
              <div>
                {rowValues && rowValues.serviceProviderPhone
                  ? rowValues.serviceProviderPhone
                  : 'Nil'}
              </div>
            </div>
          </div>
        </Row>
        <Row>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>DateOfVisit:</div>
              <div>{rowValues && rowValues.serviceDateOfVisit}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>MMDP Training Given:</div>
              <div>
                {rowValues && rowValues.isServiceMMDPTrainingGiven
                  ? 'Yes'
                  : 'No'}
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>MMDP Training Date:</div>
              <div>{rowValues && rowValues.serviceMMDPTrainingDate}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Patient Following MM:</div>
              <div>
                {rowValues && rowValues.isServicePatientFollowingMM
                  ? 'Yes'
                  : 'No'}
              </div>
            </div>
          </div>
        </Row>
        <Row>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>
                Patient Following Date:
              </div>
              <div>{rowValues && rowValues.servicePatientFollowingDate}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>MMDP Kit Given:</div>
              <div>
                {rowValues && rowValues.isServiceMMDPKitGiven ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>MMDP Kit Given Date:</div>
              <div>{rowValues && rowValues.serviceMMDPKitGivenDate}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>
                Service Medicine Given:
              </div>
              <div>
                {rowValues && rowValues.isServiceMedicineGiven ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </Row>
        <Row>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>
                Service Medicine Given Date:
              </div>
              <div>{rowValues && rowValues.serviceMedicineGivenDate}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>
                Follow Up Lost Reasons:
              </div>
              <div>
                {rowValues &&
                rowValues.FollowUpLostReasonsId &&
                rowValues.FollowUpLostReasonsId.categoryOptionName
                  ? rowValues.FollowUpLostReasonsId.categoryOptionName
                  : 'None'}
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Date Of Death:</div>
              <div>{rowValues && rowValues.followUpLostDateOfDeath}</div>
            </div>
          </div>
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Place Of Migration:</div>
              <div>
                {rowValues && rowValues.followUpLostPlaceOfMigration
                  ? rowValues.followUpLostPlaceOfMigration
                  : 'Nil'}
              </div>
            </div>
          </div>
        </Row>
        <Row>
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
}

export default AccordionLymphedamaLineListFollowUpsLF;
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Button, Container } from 'react-bootstrap';

const AccordionLymphedamaLineListFollowUpsHF = (props) => {
  const rowValues: any = props && props.rowValues && props.rowValues.data;

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
            <div className='form-label font-chng'>Any Comorbidity:</div>
            <div>{rowValues && rowValues.isAnyComorbidity ? 'Yes' : 'No'}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Comorbidity Type:</div>
            <div>
              {rowValues && rowValues.comorbidityType
                ? rowValues.comorbidityType
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Other Comorbidity:</div>
            <div>
              {rowValues && rowValues.otherComorbidity
                ? rowValues.otherComorbidity
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Surgery Done:</div>
            <div>{rowValues && rowValues.isSurgeryDone ? 'Yes' : 'No'}</div>
          </div>
        </div>{' '}
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Date Of Surgery:</div>
            <div>
              {rowValues && rowValues.dateOfSurgery
                ? rowValues.dateOfSurgery
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Name Of Surgeon:</div>
            <div>
              {rowValues && rowValues.nameOfSurgeon
                ? rowValues.nameOfSurgeon
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Surgeon Phone:</div>
            <div>
              {rowValues && rowValues.surgeonPhone
                ? rowValues.surgeonPhone
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Surgery Done At:</div>
            <div>
              {rowValues && rowValues.NameOfHospitalSurgeryDoneId
                ? rowValues &&
                  rowValues.NameOfHospitalSurgeryDoneId &&
                  rowValues &&
                  rowValues.NameOfHospitalSurgeryDoneId.facilityName
                : 'Other'}
            </div>
          </div>
        </div>
      </Row>
      <Row>
        {rowValues?.nameOfHospitalSurgeryDonename !== '' && (
          <div className='col'>
            <div className='form-grp'>
              <div className='form-label font-chng'>Surgery other:</div>
              <div>{rowValues?.nameOfHospitalSurgeryDonename}</div>
            </div>
          </div>
        )}{' '}
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Stage Of Hydrocele:</div>
            <div>{rowValues && rowValues.stageOfHydrocele}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Date Of After Surgery:</div>
            <div>{rowValues && rowValues.dateOfFollowUpAfterSurgery}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Findings During Surgery:</div>
            <div>
              {rowValues && rowValues.findingsDuringSurgeryFollowUp
                ? rowValues.findingsDuringSurgeryFollowUp
                : 'Nil'}
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Surgery Not Possible Reasons:
            </div>
            <div>
              {rowValues &&
              rowValues.SurgeryNotPossibleReasonsId &&
              rowValues.SurgeryNotPossibleReasonsId.categoryOptionName
                ? rowValues.SurgeryNotPossibleReasonsId.categoryOptionName
                : 'None'}
            </div>
          </div>
        </div>{' '}
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Date Of Death Surgery:</div>
            <div>{rowValues && rowValues.dateOfDeathSurgeryNotPossible}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Place Of Migration Surgery:
            </div>
            <div>
              {rowValues && rowValues.placeOfMigrationSurgeryNoPossible
                ? rowValues.placeOfMigrationSurgeryNoPossible
                : 'Nil'}
            </div>
          </div>
        </div>{' '}
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Created on</div>
            <div>
              {rowValues &&
                moment(rowValues.createdAt).format('MM-DD-YYYY h:mm a')}
            </div>
          </div>
        </div>
      </Row>
      <Row>
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

export default AccordionLymphedamaLineListFollowUpsHF;

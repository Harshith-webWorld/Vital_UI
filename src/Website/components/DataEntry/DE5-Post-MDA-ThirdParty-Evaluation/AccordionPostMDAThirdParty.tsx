import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Button, Container } from 'react-bootstrap';

const AccordionPostMDAThirdParty = (props) => {
  const rowValues: any = props && props.rowValues && props.rowValues.data;
  const months = [
    { month: 1, monthName: 'JAN' },
    { month: 2, monthName: 'FEB' },
    { month: 3, monthName: 'MAR' },
    { month: 4, monthName: 'APR' },
    { month: 5, monthName: 'MAY' },
    { month: 6, monthName: 'JUN' },
    { month: 7, monthName: 'JUL' },
    { month: 8, monthName: 'AUG' },
    { month: 9, monthName: 'SEP' },
    { month: 10, monthName: 'OCT' },
    { month: 11, monthName: 'NOV' },
    { month: 12, monthName: 'DEC' },
  ];

  const monthValues = (values) => {
    return months.map((month) => {
      if (month.month == values.month) {
        return month.monthName;
      }
    });
  };

  return (
    <div className='card cus-tablecard' style={{ padding: "30px" }}>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>SR.No:</div>
            <div>{rowValues && rowValues.srNo}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>State:</div>
            <div>
              {rowValues && rowValues.stateId && rowValues.district.stateName
                ? rowValues.district.stateName
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>District:</div>
            <div>
              {rowValues &&
                rowValues.district &&
                rowValues.district.districtName
                ? rowValues.district.districtName
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Corporation:</div>
            <div>
              {rowValues &&
                rowValues.corporation &&
                rowValues.corporation.corporationName
                ? rowValues.corporation.corporationName
                : 'None'}
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Taluka:</div>
            <div>
              {rowValues && rowValues.taluka && rowValues.taluka.talukaName
                ? rowValues.taluka.talukaName
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Facility:</div>
            <div>
              {rowValues &&
                rowValues.facility &&
                rowValues.facility.facilityName
                ? rowValues.facility.facilityName
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>SubCenter:</div>
            <div>
              {rowValues &&
                rowValues.subCenter &&
                rowValues.subCenter.subCenterName
                ? rowValues.subCenter.subCenterName
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Ward:</div>
            <div>
              {rowValues && rowValues.ward && rowValues.ward.wardName
                ? rowValues.ward.wardName
                : 'None'}
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Village:</div>
            <div>
              {rowValues && rowValues.village && rowValues.village.villageName
                ? rowValues.village.villageName
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Urban Area:</div>
            <div>
              {rowValues && rowValues.urbanArea ? rowValues.urbanArea : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Name Of Investigator:</div>
            <div>
              {rowValues && rowValues.nameOfInvestigator
                ? rowValues.nameOfInvestigator
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Date Of Investigation:</div>
            <div>
              {rowValues &&
                moment(rowValues.dateOfInvestigation).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Name Of Head Of Family:</div>
            <div>
              {rowValues && rowValues.nameOfHeadOfFamily
                ? rowValues.nameOfHeadOfFamily
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Name Of Person Interviewed:
            </div>
            <div>
              {rowValues && rowValues.nameOfPersonInterviewed
                ? rowValues.nameOfPersonInterviewed
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Total Members In The Family:
            </div>
            <div>{rowValues && rowValues.totalMembersInFamily}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>MDA Was Undertaken From:</div>
            <div>
              {rowValues &&
                moment(rowValues.mdaUndertakenOnFrom).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>MDA Was Undertaken To:</div>
            <div>
              {rowValues &&
                moment(rowValues.mdaUndertakenOnTo).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Number Of Tablets Recovered:
            </div>
            <div>{rowValues && rowValues.noDECTabletsRecovered}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Verified by Investigator</div>
            <div>
              {rowValues && rowValues.IsVerifiedByInvestigator
                ? rowValues.IsVerifiedByInvestigator
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Year:</div>
            <div>{rowValues && rowValues.year}</div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Month:</div>
            <div>{rowValues && monthValues(rowValues)}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Created on</div>
            <div>
              {rowValues &&
                moment(rowValues.createdAt).format('L')}
            </div>
          </div>
        </div>

        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Updated on</div>
            <div>
              {rowValues &&
                moment(rowValues.updatedAt).format('L')}
            </div>
          </div>
        </div>
        <div className='col'>
        </div>
      </Row>
    </div>
  );
};

export default AccordionPostMDAThirdParty;

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Button, Container } from 'react-bootstrap';

const AccordionLymphedamaLineList = (props) => {
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
    <div className='card cus-tablecard' style={{ padding: 30 }}>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Patient Id:</div>
            <div>{rowValues && rowValues.patientId}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Name of Patient:</div>
            <div>{rowValues && rowValues.nameOfPatient}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Head Of Family:</div>
            <div>
              {rowValues && rowValues.headOfFamily
                ? rowValues.headOfFamily
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
            <div>
              {rowValues && rowValues.month ? monthValues(rowValues) : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Unit of Action:</div>
            <div>
              {rowValues &&
              rowValues.unitOfAction &&
              rowValues.UnitOfAction.categoryOptionName
                ? rowValues.UnitOfAction.categoryOptionName
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Name of Unit:</div>
            <div>
              {rowValues &&
              rowValues.verticalControlUnit &&
              rowValues.verticalControlUnit.nameOfControlUnit
                ? rowValues.verticalControlUnit.nameOfControlUnit
                : 'None'}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Name of Field Unit:</div>
            <div>
              {rowValues &&
              rowValues.verticalControlFieldUnit &&
              rowValues.verticalControlFieldUnit.fieldUnitName
                ? rowValues.verticalControlFieldUnit.fieldUnitName
                : 'None'}
            </div>
          </div>
        </div>
      </Row>
      <Row>
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
            <div className='form-label font-chng'>Zone:</div>
            <div>
              {rowValues && rowValues.zone && rowValues.zone.zoneName
                ? rowValues.zone.zoneName
                : 'None'}
            </div>
          </div>
        </div>
      </Row>
      <Row>
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
            <div className='form-label font-chng'>Town:</div>
            <div>{rowValues && rowValues.town ? rowValues.town : 'Nil'}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Subcenter:</div>
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
            <div className='form-label font-chng'>Area:</div>
            <div>{rowValues && rowValues.area ? rowValues.area : 'Nil'}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Age in years:</div>
            <div>{rowValues && rowValues.ageYears}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Age in months:</div>
            <div>{rowValues && rowValues.ageMonths}</div>
          </div>
        </div>
      </Row>

      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Patient Mobile Number:</div>
            <div>{rowValues && rowValues.patientMobileNumber}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Disease Type:</div>
            <div>{rowValues && rowValues.diseaseType}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Grading:</div>
            <div>
              {rowValues &&
                rowValues.Grading &&
                rowValues.Grading.categoryOptionName}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Presence of Blisters:</div>
            <div>
              {rowValues && rowValues.isPresenceOfBlisters == null
                ? 'Nil'
                : rowValues.isPresenceOfBlisters
                ? 'Yes'
                : 'No'}
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Duration Of Disease - Years:</div>
            <div>{rowValues && rowValues.diseaseLastedYears}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Duration Of Disease - Months:</div>
            <div>{rowValues && rowValues.diseaseLastedMonths}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Created on</div>
            <div>
              {rowValues &&
                moment(rowValues.createdAt).format('MM/DD/YYYY')}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Updated on</div>
            <div>
              {rowValues &&
                moment(rowValues.updatedAt).format('MM/DD/YYYY')}
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default AccordionLymphedamaLineList;

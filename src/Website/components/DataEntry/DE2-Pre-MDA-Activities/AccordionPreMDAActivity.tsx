import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Container } from 'react-bootstrap';

const AccordionPreMDAActivity = (props) => {
  const values = props && props.rowValues && props.rowValues.data;
  console.log('gggg', values);
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
    <div className='card cus-tablecard' style={{ padding: '30px' }}>
      {/* <div className="card-body"> */}
      {/* <Row>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>SR.No:</div>
            <div>{values && values.srNo}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>District:</div>
            <div>{values && values.district && values.district.districtName}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Facility:</div>
            <div>
              {values && values.facility && values.facility.facilityName}
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Corporation:</div>
            <div>{values && values.corporation && values.corporation.corporationName}</div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col'>
          <div className="form-grp">
            <div className="form-label font-chng">Taluka:</div>
            <div>{values && values.taluka && values.taluka.talukaName}</div>
          </div>
        </div>
        <div className='col'>
          <div className='form-grp'>
            <div className="form-label font-chng">Village:</div>
            <div>{values && values.village && values.village.villageName}</div>
          </div>
        </div>
        <div className='col'>
          <div className="form-grp">
            <div className="form-label font-chng"> Ward:</div>
            <div>{values && values.ward && values.ward.wardName ? values.ward.wardName : "Nil"}</div>
          </div>
        </div>
        <div className='col'>
          <div className="form-grp">
            <div className="form-label font-chng">Subcenter</div>
            <div>{values && values.subCenter && values.subCenter.subCenterName}</div>
          </div>
        </div>
      </Row> */}
      <Row className='mb-3'>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Sr.No:</div>
            <div>{values && values.srNo}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>District:</div>
            <div>
              {values && values.district && values.district.districtName}
            </div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Facility:</div>
            <div>
              {values && values.facility && values.facility.facilityName}
            </div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Corporation:</div>
            <div>
              {values &&
                values.corporation &&
                values.corporation.corporationName}
            </div>
          </div>
        </div>
      </Row>
      <Row className='mb-3'>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Taluka:</div>
            <div>{values && values.taluka && values.taluka.talukaName}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Village:</div>
            <div>{values && values.village && values.village.villageName}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'> Ward:</div>
            <div>
              {values && values.ward && values.ward.wardName
                ? values.ward.wardName
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Subcenter</div>
            <div>
              {values && values.subCenter && values.subCenter.subCenterName}
            </div>
          </div>
        </div>
      </Row>
      <Row className='mb-3'>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'> Zone:</div>
            <div>
              {values && values.zone && values.zone.zoneName
                ? values.zone.zoneName
                : 'Nil'}
            </div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Area:</div>
            <div>{values && values.area ? values.area : 'Nil'}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Total Population Village:
            </div>
            <div>{values && values.totalPopulationVillage}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Total Staff Sanctioned:</div>
            <div>{values && values.totalStaffSanctioned}</div>
          </div>
        </div>
      </Row>
      <Row className='mb-3'>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'> Total Staffs Unit:</div>
            <div>{values && values.totalStaffsUnit}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Number Trained For Morbidity Management:
            </div>
            <div>{values && values.numberTrainedForMMDP}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Batches Of Training Organized For MMDP:
            </div>
            <div>{values && values.batchesOfTrainingOrganizedMMDP}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Number Trained For MDA/IDA:
            </div>
            <div>{values && values.numberTrainedForMDAIDA}</div>
          </div>
        </div>
      </Row>
      <Row className='mb-3'>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Year:</div>
            <div>{values && values.year}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Month:</div>
            <div>{values && monthValues(values)}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>
              Batches Of Training Organized For MDA/IDA:
            </div>
            <div>{values && values.batchesOfTrainingOrganizedMDAIDA}</div>
          </div>
        </div>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Created On:</div>
            <div>{values && moment(values.createdAt).format('DD/MM/YYYY')}</div>
          </div>
        </div>
      </Row>
      <Row>
        <div className='col-md-6 col-xl-3  col-12'>
          <div className='form-grp'>
            <div className='form-label font-chng'>Updated On:</div>
            <div>{values && moment(values.updatedAt).format('DD/MM/YYYY')}</div>
          </div>
        </div>
      </Row>
    </div>
    // </div>
  );
};
export default AccordionPreMDAActivity;

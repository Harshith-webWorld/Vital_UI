import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";

const AccordionVerticalUnitStock = (props) => {
  const values = props && props.rowValues && props.rowValues.data;
  
  return (
    <div className="card cus-tablecard" style={{ padding: "30px" }}>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3 col-12">
          <div className="form-grp">
            <div className="form-label font-chng">SR.No:</div>
            <div>{values && values.srNo}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Year:</div>
            <div>{values && values.year}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">District:</div>
            <div>{values && values.district && values.district.districtName}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Jan:</div>
            <div>{values && values.jan}</div>
          </div>
        </div>
      </Row>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Feb:</div>
            <div>{values && values.feb}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Mar:</div>
            <div>{values && values.mar}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Apr:</div>
            <div>{values && values.apr}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">May:</div>
            <div>{values && values.may}</div>
          </div>
        </div>
      </Row>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Jun:</div>
            <div>{values && values.jun}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Jul:</div>
            <div>{values && values.jul}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Aug:</div>
            <div>{values && values.aug}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Sep:</div>
            <div>{values && values.sep}</div>
          </div>
        </div>
      </Row>
      <Row className="mb-3">
      <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Oct:</div>
            <div>{values && values.oct}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Nov:</div>
            <div>{values && values.nov}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Dec:</div>
            <div>{values && values.dec}</div>
          </div>
        </div>
      </Row>
    </div>
  )
}
export default AccordionVerticalUnitStock
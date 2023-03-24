import moment from "moment";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

const AccordionTASSurveyChildren = (props) => {
    const rowValues:any = props && props.rowValues && props.rowValues.data;
    return(
        <div className="card cus-tablecard" style={{padding : "30px"}}>
        <Row className="mb-3">
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                <div className="form-label font-chng">Name Of Student:</div>
                <div>{rowValues && rowValues.nameOfStudent}</div>
                </div>
            </div>
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                <div className="form-label font-chng">Age:</div>
                <div>{rowValues && rowValues.ageYears}</div>
                </div>
            </div>
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                <div className="form-label font-chng">Month:</div>
                <div>{rowValues && rowValues.ageMonths}</div>
                </div>
            </div>
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                <div className="form-label font-chng">Gender:</div>
                <div>{rowValues && rowValues.Sex && rowValues.Sex.categoryOptionName}</div>
                </div>
            </div>
            </Row>
            <Row className="mb-3">
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                <div className="form-label font-chng">Result:</div>
                <div>{rowValues && rowValues.result }</div>
                </div>
            </div>
            
            
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                <div className="form-label font-chng"> Family History Remarks:</div>
                <div>{rowValues && rowValues.familyHistoryRemarks}</div>
                </div>
            </div>
                </Row>
                <Row>
                <div className="col-md-6 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Created On:</div>
                    <div>{rowValues && moment(rowValues.createdAt).format("DD/MM/YYYY")}</div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Updated On:</div>
                    <div>{rowValues && moment(rowValues.updatedAt).format("DD/MM/YYYY")}</div>
                    </div>
                </div>
            </Row>
            </div>
    )
    
}
export default AccordionTASSurveyChildren;
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Row, Col, Container } from "react-bootstrap";

const AccordionPatientInfo = (props)=>{
    const values = props && props.rowValues && props.rowValues.data;
    console.log("gggg",values);
    
    return(
        <div className="card cus-tablecard" style={{padding : "30px"}}>
         <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">MF Positive LineList Id:</div>
                    <div>{values && values.mfPositiveLineListId}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Patient ID:</div>
                    <div>{values && values.patientId}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Head Of Family:</div>
                    <div>{values && values.headOfFamily ?values.headOfFamily : "Nil"}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">BS Number:</div>
                    <div>{values && values.bsNumber}</div>
            </div>
            </div>
            </Row>
            <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Patient Name :</div>
                    <div>{values && values.patientName}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Age - Years :</div>
                    <div>{values && values.ageYears}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Age - Months:</div>
                    <div>{values && values.ageMonths}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Gender</div>
                    <div>{values && values.Gender && values.Gender.categoryOptionName}</div>
            </div>
            </div>
            </Row>
            <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Patient Phone Number :</div>
                    <div>{values && values.patientPhoneNo}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Date Of Collection:</div>
                    {/* <div>{values && values.dateOfCollection}</div> */}
                    <div>{values && moment(values.dateOfCollection).format("DD/MM/YYYY")}</div>

            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Date Of Examination:</div>
                    {/* <div>{values && values.dateOfExamination}</div> */}
                    <div>{values && moment(values.dateOfExamination).format("DD/MM/YYYY")}</div>

            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Name Of EU/EA:</div>
                    <div>{values && values.nameOfEUEA ? values.nameOfEUEA: 'Nil'}</div>
            </div>
            </div>
            </Row>
            <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Name Of School :</div>
                    <div>{values && values.nameOfSchool ? values.nameOfSchool : 'Nil'}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">MF Count:</div>
                    <div>{values && values.mfCount ? values.mfCount : 0 }</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> No Of Dec Tablets Given :</div>
                    <div>{values && values.noOfDECTabletsGiven ? values.noOfDECTabletsGiven: 0}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Date Of Treatment Started:</div>
                    {/* <div>{values && values.dateOfTreatmentStarted}</div> */}
                    <div>{values && moment(values.dateOfTreatmentStarted).format("DD/MM/YYYY")}</div>
                    
            </div>
            </div>
            </Row>
            <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Reason For Not Treating:</div>
                    <div>{values && values.ReasonsForNonTreating && values.ReasonsForNonTreating.categoryOptionName}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Other Reason:</div>
                    <div>{values && values.reasonOthers}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Created On:</div>
                    <div>{values && moment(values.createdAt).format("DD/MM/YYYY")}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Updated On:</div>
                    <div>{values && moment(values.updatedAt).format("DD/MM/YYYY")}</div>
            </div>
            </div>
            </Row>
            </div>
    )
}
export default AccordionPatientInfo
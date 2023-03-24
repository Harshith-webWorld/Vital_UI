import React, { useState, useEffect } from "react";
import moment from "moment";
import { Row, Col, Container } from "react-bootstrap";

const AccordionFollowUpDetails = (props)=>{
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
                    <div className="form-label font-chng">MF Positive FollowUp Patient:</div>
                    <div>{values && values.mfPositiveLineListPatient && values.mfPositiveLineListPatient.patientName}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Follow Up Year:</div>
                    <div>{values && values.followUpYear}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Follow Up Date:</div>
                    {/* <div>{values && values.followUpDate}</div> */}
                    <div>{values && moment(values.followUpDate).format("DD/MM/YYYY")}</div>

            </div>
            </div>
            </Row>
            <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Result:</div>
                    <div>{values && values.result ? values.result: "Nil"}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">No Of DEC Tablets Given:</div>
                    <div>{values && values.noOfDECTabletsGiven}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> No Of DEC Tablets Consumed:</div>
                    <div>{values && values.noOfDECTabletsConsumed}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Name Of Drug Admin</div>
                    <div>{values && values.nameOfDrugAdmin ? values.nameOfDrugAdmin:"Nil"}</div>
            </div>
            </div>
            </Row>
            <Row className="mb-3">
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
export default AccordionFollowUpDetails
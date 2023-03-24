import moment from "moment";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

const AccordionFusTargetSurvey = (props) => {
    const rowValues:any = props && props.rowValues && props.rowValues.data;
    

   

    return(
        <div className="card cus-tablecard" style={{padding: "30px"}}>
            <Row className="mb-3">
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Fsu Target Achievement Id:</div>
                    <div>{rowValues && rowValues.fsuTargetAchievementId}</div>
                    </div> 
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Name of Villages Or Towns:</div>
                    <div>{rowValues && rowValues.namesOfVillagesOrTowns }</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Targeted Population:</div>
                    <div>{rowValues && rowValues.targetedPopulation  }</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Surveyed Population:</div>
                    <div>{rowValues &&  rowValues.surveyedPopulation}</div>
                </div>
                </div>
                
            
            
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">No of BS Colleted:</div>
                    <div>{rowValues && rowValues.noOfBSCollected}</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of BS Examined:</div>
                    <div>{rowValues && rowValues.noOfBSExamined}</div>
                    </div>
                </div>
                
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of MF Positive Cases:</div>
                    <div>{rowValues && rowValues.noOfMFPositiveCases }</div>
                </div>
                </div>
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

export default AccordionFusTargetSurvey;
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

const AccordionFusTarget = (props) => {
    const rowValues:any = props && props.rowValues && props.rowValues.data;
    const months = [{month:1,monthName:"JAN"},{month:2,monthName:"FEB"},{month:3,monthName:"MAR"},{month:4,monthName:"APR"},{month:5,monthName:"MAY"},{month:6,monthName:"JUN"},{month:7,monthName:"JUL"},
    {month:8,monthName:"AUG"},{month:9,monthName:"SEP"},{month:10,monthName:"OCT"},{month:11,monthName:"NOV"},{month:12,monthName:"DEC"}];
    
    const monthValues = ((values)=>{
        return months.map((month)=>{
            if(month.month == values.month){
                    return month.monthName
            }
            });
})

   

    return(
        <div className="card cus-tablecard" style={{padding: "30px"}}>
            <Row className="mb-3">
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">SR.No:</div>
                    <div>{rowValues && rowValues.srNo}</div>
                    </div> 
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Name Of Filaria Survey Unit:</div>
                    <div>{rowValues  &&rowValues.verticalControlUnit&& rowValues.verticalControlUnit.nameOfControlUnit}</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Year:</div>
                    <div>{rowValues && rowValues.year }</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Month:</div>
                    <div>{rowValues &&  monthValues(rowValues)}</div>
                </div>
                </div>
                
            
            
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">District:</div>
                    <div>{rowValues &&  rowValues.district && rowValues.district.districtName}</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Facility:</div>
                    <div>{rowValues && rowValues.facility && rowValues.facility.facilityName}</div>
                </div>
                </div>
                
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of Villages Or Towns:</div>
                    <div>{rowValues && rowValues.noOfVillagesOrTowns }</div>
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

export default AccordionFusTarget;
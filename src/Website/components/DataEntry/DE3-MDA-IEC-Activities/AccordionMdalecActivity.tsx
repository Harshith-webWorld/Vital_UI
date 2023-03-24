import React, { useState, useEffect } from "react";
import moment from "moment";
import { Row, Col, Container } from "react-bootstrap";

const AccordionMdalecActivity = (props)=>{
    const values = props && props.rowValues && props.rowValues.data;
    console.log("gggg",values);
    const months = [{month:1,monthName:"JAN"},{month:2,monthName:"FEB"},{month:3,monthName:"MAR"},{month:4,monthName:"APR"},{month:5,monthName:"MAY"},{month:6,monthName:"JUN"},{month:7,monthName:"JUL"},
    {month:8,monthName:"AUG"},{month:9,monthName:"SEP"},{month:10,monthName:"OCT"},{month:11,monthName:"NOV"},{month:12,monthName:"DEC"}];
    const[hideOther,setHideOthers]=useState(false)
    const monthValues = ((values)=>{
        return months.map((month)=>{
            if(month.month == values.month){
                    return month.monthName
            }
            });
})

useEffect(() => {
       
if(values&&values.MaterialActivity && values.MaterialActivity.categoryOptionName == "Any other (specify)"){
        setHideOthers(true)
}
else{
        setHideOthers(false)
}
        
    },[])
    
    return(
        <div className="card cus-tablecard" style={{ padding: 30 }}>
         {/* <div className="card-body"> */}

         <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">SR.No:</div>
                    <div>{values && values.srNo}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">State:</div>
                    <div>{values && values.state && values.state.stateName}</div>
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
                    <div className="form-label font-chng">Material/Activity</div>
                    <div>{values && values.MaterialActivity && values.MaterialActivity.categoryOptionName}</div>
            </div>
            </div>
            
            </Row>
            <Row className="mb-3">
                    {hideOther &&
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Other Specify</div>
                    <div>{values && values.otherMaterial && values.otherMaterial}</div>
            </div>
            </div>
}
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">No Of Material/Activity:</div>
                    <div>{values && values.materialActivityNo}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Cost Of Material/Activity:</div>
                    <div>{values && values.materialActivityCostInRs}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Statement Of Fund Allotted:</div>
                    <div>{values && values.StatementOfFundsAllotted && values.StatementOfFundsAllotted.categoryOptionName}</div>
            </div>
            </div>
            
            </Row>
            <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Date District Coordination Comittee</div>
                    <div>{values && moment(values.dateDistrictCoordComitte).format("DD/MM/YYYY")}</div>

            </div>
            </div>
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Fund Allocated:</div>
                    <div>{values && values.fundAllocatedWithDate}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Fund Utilised:</div>
                    <div>{values && values.fundUtilisedWithDate}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Fund Balance After Round:</div>
                    <div>{values && values.fundBalanceAfterRound}</div>
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
                    <div className="form-label font-chng">Month:</div>
                    <div>{values && monthValues(values)}</div>
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
            <Row className="mb-3">
           
        
            </Row>
            </div>
        // </div>
    )
}
export default AccordionMdalecActivity
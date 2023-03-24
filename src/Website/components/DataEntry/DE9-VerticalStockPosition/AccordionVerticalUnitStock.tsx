import React, { useState, useEffect } from "react";
import moment from "moment";
import { Row, Col, Container } from "react-bootstrap";

const AccordionVerticalUnitStock = (props)=>{
    const values = props && props.rowValues && props.rowValues.data;
    console.log("gggg",values);
    const[hideOthers,setHideOthers]=useState(false)
    
    const months = [{month:1,monthName:"JAN"},{month:2,monthName:"FEB"},{month:3,monthName:"MAR"},{month:4,monthName:"APR"},{month:5,monthName:"MAY"},{month:6,monthName:"JUN"},{month:7,monthName:"JUL"},
    {month:8,monthName:"AUG"},{month:9,monthName:"SEP"},{month:10,monthName:"OCT"},{month:11,monthName:"NOV"},{month:12,monthName:"DEC"}];
    
    useEffect(() => {
        
        if(values && values.items === 0){
                setHideOthers(true)
         }
        else{
                setHideOthers(false)
                console.log("Preth",hideOthers);
        }
        },[])
   
    const monthValues = ((values)=>{
        return months.map((month)=>{
            if(month.month == values.month){
                    return month.monthName
            }
            });
})
            //console.log(monthValues)
    return(
        <div className="card cus-tablecard" style={{padding: "30px"}}>
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
                    <div className="form-label font-chng">Month:</div>
                    <div>{values && monthValues(values)}</div>
            </div>
            </div>
           
            
            </Row>
            <Row className="mb-3">
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Year:</div>
                    <div>{values && values.year}</div>
                </div>
                </div>
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Unit Type:</div>
                    <div>{values && values.UnitType && values.UnitType.categoryOptionName}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Name Of Unit:</div>
                    <div>{values && values.verticalControlUnit && values.verticalControlUnit.nameOfControlUnit}</div>
            </div>
            </div>
            {hideOthers ?
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Items:</div>
                   
                    <div>{values  && values.otherItem && values.otherItem}</div>
            </div>
            </div>
            :
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Items other :</div>
                   
                    <div>{values  && values.tabletName && values.tabletName.categoryOptionName}</div>
                    {/* <div>{values && values.item}</div> */}
            </div>
            </div>
           } 
           
            </Row>
            <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Measurement </div>
                    <div>{values && values.measurement}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Quantity </div>
                    <div>{values && values.openingBalanceQty}</div>
            </div>
            </div>
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Received  Balance Qty:</div>
                    <div>{values && values.receivedDuringMonthQty}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Total Stock:</div>
                    <div>{values && values.totalStock}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Actual Consumption:</div>
                    <div>{values && values.actualConsumption}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Issue To  Balance Qty:</div>
                    <div>{values && values.issueToOtherQty}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Balance End Of Month:</div>
                    <div>{values && values.balanceEndOfMonth}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Req. Next 3 Month Qty:</div>
                    <div>{values && values.reqNext3MonthsQty}</div>
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
        // </div>
    )
}
export default AccordionVerticalUnitStock
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import moment from "moment";

const AccordionMappingOfOT = (props) => {
    const rowValues:any = props && props.rowValues && props.rowValues.data;
    //console.log(rowValues);
    const months = [{month:1,monthName:"JAN"},{month:2,monthName:"FEB"},{month:3,monthName:"MAR"},{month:4,monthName:"APR"},{month:5,monthName:"MAY"},{month:6,monthName:"JUN"},{month:7,monthName:"JUL"},
    {month:8,monthName:"AUG"},{month:9,monthName:"SEP"},{month:10,monthName:"OCT"},{month:11,monthName:"NOV"},{month:12,monthName:"DEC"}];
    
    const monthValues = ((values)=>{
        return months.map((month)=>{
            if(month.month == values.month){
                    return month.monthName
            }
            });
})
    const genderList =
            rowValues && rowValues.mappingOfOTSurgeons.map((item: any, i: any) => {
        return (
            <div className="form-grp" key={i}>
            <Row>
            <div className="col">
            <div className="form-grp">
                <div className="form-label font-chng">Mapping of OT Id</div>
                <div>{item && item.mappingOfOTId}</div>
                </div>
            </div>
            <div className="col">
                <div className="form-label font-chng">Surgeon/Anesthetist</div>
                <div>{item && item.surgeonOrAnesthetist ? item.surgeonOrAnesthetist : "Nil"}</div>
            </div>
            <div className="col">
                <div className="form-label font-chng">Name Of Doctor</div>
                <div>{item && item.nameOfDoctor === "" ? "Nil" : item && item.nameOfDoctor}</div>
            </div>
            <div className="col">
            <div className="form-grp">
                <div className="form-label font-chng">Headquarter</div>
                <div>{item && item.headquarter === "" ? "Nil" : item && item.headquarter}</div>
                </div>
            </div>
        </Row>
        {/* <Row>
            
            <div className="col">
                <div className="form-label font-chng">CreatedAt:</div>
                <div>{item && item.createdAt}</div>
            </div>
            <div className="col">
                <div className="form-label font-chng">LastModifiedAt:</div>
                <div>{item && item.updatedAt}</div>
            </div>
        </Row> */}
        </div>
        );
    });

    return(
        <div className="card cus-tablecard" style={{ padding: "30px" }}>
        <Row>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">SR.No</div>
                    <div>{rowValues && rowValues.srNo}</div>
                    </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Year</div>
                    <div>{rowValues && rowValues.year}</div>
                </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Month</div>
                    <div>{rowValues && monthValues(rowValues)}</div>
                </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">District</div>
                    <div>{rowValues && rowValues.district && rowValues.district.districtName}</div>
                </div>
                </div>
            </Row>
            <Row>
                
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Corporation</div>
                    <div>{rowValues && rowValues.corporation && rowValues.corporation.corporationName}</div>
                </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Taluka</div>
                    <div>{rowValues && rowValues.taluka && rowValues.taluka.talukaName}</div>
                </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Institution/OT</div>
                    <div>{rowValues && rowValues.nameOfInstitutionOT}</div>
                </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Govt Or Private</div>
                    <div>{rowValues && rowValues.GovtOrPrivate === ")" ? "None" : (rowValues && rowValues.GovtOrPrivate ? "Govt" : "Private")}</div>
                </div>
                </div>
            </Row>
            <Row>
                
               
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Empaneled Surgeons</div>
                    <div>{rowValues && rowValues.noOfAvailableSurgeons }</div>
                </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Available Anaesthetist</div>
                    <div>{rowValues && rowValues.noOfAvailableAnaesthetist}</div>
                    </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">PHC's attached to Operation Theater</div>
                    <div>{rowValues && rowValues.facility && rowValues.facility.facilityName}</div>
                </div>
                </div>
                <div className="col">
                <div className="form-grp">
                    <div className="form-label font-chng">Created on</div>
                    <div>{rowValues && moment(rowValues.createdAt).format("DD/MM/YYYY")}</div>
                    </div>
                </div>
            </Row>
            
            <Row>
                
                <div className="col">
                    <div className="form-label font-chng">Updated on</div>
                    <div>{rowValues && moment(rowValues.updatedAt).format("DD/MM/YYYY")}</div>
                </div>
            </Row>
            <br/>
            <div className="col">
            <h6 className="form-title font-chng form-grp" >Mapping of Operation Theaters Surgeons</h6>
            {genderList}
            </div>
        </div>
    )
}

export default AccordionMappingOfOT;
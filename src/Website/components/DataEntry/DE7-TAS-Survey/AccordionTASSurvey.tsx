import moment from "moment";
import React, { useState, useEffect } from "react";
import { Row} from "react-bootstrap";

const AccordionTASSurvey = (props) => {
    const rowValues:any = props && props.rowValues && props.rowValues.data;
    const [hideSchoolData, setHideSchoolData] = useState(false);
    const [hidecommunityData, setHideCommunityData] = useState(false)
   useEffect(() => {
       

       if (rowValues.typeOfTAS === 1) {
        setHideSchoolData(false)
        setHideCommunityData(true)
    } else if (rowValues.typeOfTAS === 2) {
        setHideSchoolData(true)
        setHideCommunityData(false)
    }else{
        setHideSchoolData(false)
        setHideCommunityData(false)
    }
   },[rowValues.typeOfTAS])
   const months = [{month:1,monthName:"JAN"},{month:2,monthName:"FEB"},{month:3,monthName:"MAR"},{month:4,monthName:"APR"},{month:5,monthName:"MAY"},{month:6,monthName:"JUN"},{month:7,monthName:"JUL"},
   {month:8,monthName:"AUG"},{month:9,monthName:"SEP"},{month:10,monthName:"OCT"},{month:11,monthName:"NOV"},{month:12,monthName:"DEC"}];
   const monthValues = ((values)=>{
    return months.map((month)=>{
        if(month.month === values.month){
                return month.monthName
        }
        });
})


   

    return(
        <div className="card cus-tablecard">
            <Row className="mb-3">
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">SR.No:</div>
                    <div>{rowValues && rowValues.srNo}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                <div className="form-label font-chng">State:</div>
                <div className="form-grp">
                       <div>{rowValues && rowValues.state && rowValues.state.stateName ? rowValues.state.stateName: "None" }</div>
                </div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">District:</div>
                    <div>{rowValues && rowValues.district && rowValues.district.districtName ? rowValues.district.districtName:"None"}</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Corporation:</div>
                    <div>{rowValues &&  rowValues.corporation &&  rowValues.corporationName? rowValues.corporationName: "None"}</div>
                </div>
                </div>
                
            </Row>
            <Row>
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Taluka:</div>
                    <div>{rowValues && rowValues.taluka && rowValues.talukaName? rowValues.talukaName:"None"}</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Ward:</div>
                    <div>{rowValues && rowValues.ward && rowValues.ward.wardName? rowValues.ward.wardName:"None"}</div>
                </div>
                </div>
                <div className="col-md-6 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Village:</div>
                    <div>{rowValues && rowValues.village  && rowValues.villageName? rowValues.villageName:"None"}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Type of TAS:</div>
                    <div>{rowValues && rowValues.typeOfTAS}</div>
                </div>
                </div>
                <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Month:</div>
                    <div>{rowValues && monthValues(rowValues)}</div>
            </div>
            </div>
            <div className="col-md-2 col-xl-3 col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Year:</div>
                    <div>{rowValues && rowValues.year}</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Name of EU:</div>
                    <div>{rowValues && rowValues.nameOfEU}</div>
                </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Name of EA:</div>
                    <div>{rowValues && rowValues.nameOfEA}</div>
                </div>
                </div>
               
            </Row>
            <Row>
            <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Date of Survey:</div>
                    <div>{rowValues && rowValues.DateOfSurvey}</div>
                    </div>
                </div>
                
                
               
               
                {hideSchoolData&& 
                <> 
                <div className="col-md-2 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Name of School:</div>
                    <div>{rowValues && rowValues.nameOfSchool}</div>
                    </div>
                </div>
                
                
                
                </>
                 }
                  {hidecommunityData&&
                <>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-label font-chng">Serial Number of EA</div>
                    <div>{rowValues && rowValues.serialNumberOfEA }</div>
                </div>
              
                

            
                </>
                }
               
            
            </Row>
            
           
            
            <Row>
                <div className="col-md-6 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Created On:</div>
                    <div>{rowValues && moment(rowValues.createdAt).format("MM-DD-YYYY h:mm a")}</div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Updated On:</div>
                    <div>{rowValues && moment(rowValues.updatedAt).format("MM-DD-YYYY h:mm a")}</div>
                </div>
                </div>
            </Row>
           
        </div>
    )
}

export default AccordionTASSurvey;
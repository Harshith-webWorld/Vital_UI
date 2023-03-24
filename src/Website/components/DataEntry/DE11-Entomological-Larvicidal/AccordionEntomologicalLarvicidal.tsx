import moment from "moment";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

const AccordionEntomologicalLarvicidal = (props) => {
    const rowValues: any = props && props.rowValues && props.rowValues.data;
    const months = [{ month: 1, monthName: "JAN" }, { month: 2, monthName: "FEB" }, { month: 3, monthName: "MAR" }, { month: 4, monthName: "APR" }, { month: 5, monthName: "MAY" }, { month: 6, monthName: "JUN" }, { month: 7, monthName: "JUL" },
    { month: 8, monthName: "AUG" }, { month: 9, monthName: "SEP" }, { month: 10, monthName: "OCT" }, { month: 11, monthName: "NOV" }, { month: 12, monthName: "DEC" }];

    const monthValues = ((values) => {
        return months.map((month) => {
            if (month.month == values.month) {
                return month.monthName
            }
        });
    })



    return (
        <div className="card cus-tablecard" style={{ padding: "30px" }}>
            <Row className="mb-3">
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">SR.No:</div>
                        <div>{rowValues && rowValues.srNo}</div>
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
                        <div className="form-label font-chng">Month:</div>
                        <div>{rowValues && monthValues(rowValues)}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Type Of Unit:</div>
                        <div>{rowValues && rowValues.TypeOfUnit && rowValues.TypeOfUnit.categoryOptionName}</div>
                    </div>
                </div>

            </Row>
            <Row>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Name Of Unit:</div>
                        <div>{rowValues && rowValues.verticalControlUnit && rowValues.verticalControlUnit.nameOfControlUnit}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">District:</div>
                        <div>{rowValues && rowValues.district && rowValues.district.districtName}</div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Taluka:</div>
                        <div>{rowValues && rowValues.taluka && rowValues.taluka.talukaName}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Facility:</div>
                        <div>{rowValues && rowValues.facility && rowValues.facility.facilityName}</div>
                    </div>
                </div>

            </Row>
            <Row>

                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Subcenter:</div>
                        <div>{rowValues && rowValues.subCenter && rowValues.subCenter.subCenterName}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Village:</div>
                        <div>{rowValues && rowValues.village && rowValues.village.villageName}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Town:</div>
                        <div>{rowValues && rowValues.town}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Date Of Survey:</div>
                        {/* <div>{rowValues && rowValues.dateOfSurvey}</div> */}
                        <div>{rowValues && moment(rowValues.dateOfSurvey).format("DD/MM/YYYY")}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Fixed Or Random:</div>
                        <div>{rowValues && rowValues.fixedOrRandom}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total Time Spent (Hrs.):</div>
                        <div>{rowValues && rowValues.totalTimeSpentHrs}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total Time Spent (Min.):</div>
                        <div>{rowValues && rowValues.totalTimeSpentMinutes}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total No Of Dips Taken:</div>
                        <div>{rowValues && rowValues.totalNoOfDipsTaken}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total No Of +Ve Location For III & IV Stage:</div>
                        <div>{rowValues && rowValues.noOfPosVePlaceIIIandIVStage}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total No Of Positive Location For Pupae:</div>
                        <div>{rowValues && rowValues.noOfPosVePlaceForPupae}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total Culex Larvae Count 1 To 4 Stage:</div>
                        <div>{rowValues && rowValues.totalCulexLarvaeCount1to4Stage}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total Culex Pupae Count</div>
                        <div>{rowValues && rowValues.totalCulexPupaeCount}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Total An Larvae Count:</div>
                        <div>{rowValues && rowValues.totalAnLarvaeCount}</div>
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

export default AccordionEntomologicalLarvicidal;
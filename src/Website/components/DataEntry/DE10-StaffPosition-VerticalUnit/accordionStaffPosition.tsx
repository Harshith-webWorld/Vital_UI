import moment from "moment";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

const AccordionStaffPostion = (props) => {
    const rowValues: any = props && props.rowValues && props.rowValues.data;
    console.log("onRowExpandToggled", rowValues)
    let [showCadre, setShowCadre] = useState(false);
    const months = [{ month: 1, monthName: "JAN" }, { month: 2, monthName: "FEB" }, { month: 3, monthName: "MAR" }, { month: 4, monthName: "APR" }, { month: 5, monthName: "MAY" }, { month: 6, monthName: "JUN" }, { month: 7, monthName: "JUL" },
    { month: 8, monthName: "AUG" }, { month: 9, monthName: "SEP" }, { month: 10, monthName: "OCT" }, { month: 11, monthName: "NOV" }, { month: 12, monthName: "DEC" }];

    const monthValues = ((values) => {
        return months.map((month) => {
            if (month.month == values.month) {
                return month.monthName
            }
        });
    })

    useEffect(() => {
        if (rowValues.cadre === "Other-Specify") {
            setShowCadre(true);
        } else {
            setShowCadre(false);
        }
    }, []);


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
                        <div className="form-label font-chng">State:</div>
                        <div>{rowValues && rowValues.state.stateName}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">District:</div>
                        <div>{rowValues && rowValues.district.districtName}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Type Of Unit:</div>
                        <div>{rowValues && rowValues.TypeOfUnit2.categoryOptionName}</div>
                    </div>
                </div>

            </Row>
            <Row>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Name of Unit:</div>
                        <div>{rowValues && rowValues.verticalControlUnit.nameOfControlUnit}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Cadre:</div>
                        <div>{rowValues && rowValues.Cadre2 && rowValues.Cadre2.categoryOptionName}</div>
                    </div>
                </div>
                {showCadre &&
                    <div className="col-md-6 col-xl-3 col-12">
                        <div className="form-grp">
                            <div className="form-label font-chng">Cadre Other:</div>
                            <div>{rowValues && rowValues.cadreOther}</div>
                        </div>
                    </div>
                }
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">sanctioned:</div>
                        <div>{rowValues && rowValues.sanctioned}</div>
                    </div>
                </div>

            </Row>
            <Row>
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
                        <div className="form-label font-chng">Filled:</div>
                        <div>{rowValues && rowValues.filled}</div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-3 col-12">
                    <div className="form-grp">
                        <div className="form-label font-chng">Vacant:</div>
                        <div>{rowValues && rowValues.vacant}</div>
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

export default AccordionStaffPostion;
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import moment from "moment";

const AccordionCoverageMopUpList = (props) => {
    const values:any = props && props.rowValues && props.rowValues.data;
    console.log(values);

    const coverageMopUpList =
            values && values.mdaIDACoverageOthersLists.map((item: any, i: any) => {
        return (
            <div className="form-grp" key={i}>
            <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                <div className="form-label font-chng">MDA IDA Coverage Id:</div>
                <div>{item && item.mdaIDACoverageId}</div>
                </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                <div className="form-label font-chng">MDA IDA Coverage MopUp ListId:</div>
                <div>{item && item.mdaIDACoverageMopUpListId}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                <div className="form-label font-chng">Adverse  Experiences:</div>
                <div>{item && item.otherAdverseExp ? item.otherAdverseExp : "Nil"}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                <div className="form-label font-chng">No Of People With Adverse Experiences:</div>
                <div>{item && item.noOfPersonsWithOtherAdverseExp}</div>
                </div>
            </div>
            </Row>
            {/* <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
                <div className="form-label font-chng">CreatedAt:</div>
                <div>{item && moment(item.createdAt).format("L")}</div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
                <div className="form-label font-chng">LastModifiedAt:</div>
                <div>{item && moment(item.updatedAt).format("L")}</div>
            </div>
        </Row> */}
        </div>
        );
    });

    return(
        <div className="card cus-tablecard" style={{padding: "30px"}}>
            <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">MDA IDA Coverage Id:</div>
                    <div>{values && values.mdaIDACoverageId}</div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Mop Up :</div>
                    <div>{values && values.mopUp }</div>
                </div>
                </div>
                <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of People Administered:</div>
                    <div>{values && values.noOfPeopleAdministered}</div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of Persons With Fever:</div>
                    <div>{values && values.noOfPersonsWithFever}</div>
                </div>    
                </div>
                </Row>
                <Row className="mb-3">
                <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                     <div className="form-label font-chng">No Of Persons With Headache:</div>
                    <div>{values && values.noOfPersonsWithHeadache}</div>
                </div>
                </div>
                <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of Persons With Bodyache:</div>
                    <div>{values && values.noOfPersonsWithBodyache}</div>
                </div>
                </div>
            <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of Persons With Nausea:</div>
                    <div>{values && values.noOfPersonsWithNausea}</div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">No Of Persons With Vomiting:</div>
                    <div>{values && values.noOfPersonsWithVomiting}</div>
                </div>
                </div>
                </Row>
                <Row className="mb-3">
                <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">Is Required Hospital Stay:</div>
                    <div>{values && values.isRequiredHospitalStay ? "Yes" : "No"}</div>
                </div>
                </div>
            <div className="col-md-6 col-xl-3  col-12">
                <div className="form-grp">
                    <div className="form-label font-chng">remarks:</div>
                    <div>{values && values.remarks ? values.remarks : "Nil"}</div>
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
            <div>
            {coverageMopUpList}
            </div>
        </div>
    )
}

export default AccordionCoverageMopUpList;
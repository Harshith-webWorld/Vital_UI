import React, { useState, useEffect } from "react";
import moment from "moment";
import { Row, Col, Container } from "react-bootstrap";

const AccordionPreMDAActivityDrug = (props)=>{
    const values = props && props.rowValues && props.rowValues.data;
    return(
        <div className="card cus-tablecard" style={{ padding: 30 }}>
         {/* <div className="card-body"> */}

         <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">PreMDAActivityId:</div>
                    <div>{values && values.preMDAActivityId}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Name Of Tablet:</div>
                    <div>{values && values.nameOfTablet}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Quantity Tablet Require For MDA:</div>
                    <div>{values && values.quantityTabletRquireForMDA}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Quantity Tablet In Stock Before Round:</div>
                    <div>{values && values.quantityTabletInStockBeforeRound}</div>
            </div>
            </div>
            </Row>
            <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Batch Number Of Tablet:</div>
                    <div>{values && values.batchNumberOfTablet}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Date Of Expiry Tablet:</div>
                    <div>{values && moment(values.dateOfExpiryTablet, 'YYYY-MM-DD').format("DD/MM/YYYY")}</div>

            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Quantity Of Tablet Destroyed During Round:</div>
                    <div>{values && values.quantityTabletInStockBeforeRound}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Reason For Tablet Destroyed</div>
                    <div>{values && values.reasonForTabletsDestroyed}</div>
            </div>
            </div>
            </Row>
            <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Batch Number Of Tablet Destroyed:</div>
                    <div>{values && values.batchNumberOfTabletDestroyed}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Date Of Expiry Tablet Destroyed:</div>
                    <div>{values && moment(values.dateOfExpiryTabletDestroyed, 'YYYY-MM-DD').format("DD/MM/YYYY")}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Quantity In Hand After Current Round:</div>
                    <div>{values && values.quantityOfBalanceTabletsInStock}</div>
            </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng">Batch Number Of Tablet In Stock:</div>
                    <div>{values && values.batchNumberOfTabletInStock}</div>
            </div>
            </div>
            </Row>
            <Row className="mb-3">
         <div className="col-md-6 col-xl-3  col-12">
            <div className="form-grp">
                    <div className="form-label font-chng"> Date Of Expiry Tablet In Stock:</div>
                    <div>{values && moment(values.dateOfExpiryTabletInStock).format("DD/MM/YYYY")}</div>

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
            </div>
        // </div>
    )
}
export default AccordionPreMDAActivityDrug
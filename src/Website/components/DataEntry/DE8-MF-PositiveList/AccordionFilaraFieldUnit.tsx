import React, { useState, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import moment from "moment";

const AccordionFilaraFieldUnit = (props) => {
  const values: any = props && props.rowValues && props.rowValues.data;
  console.log("Data", values)
  const months = [{ month: 1, monthName: "JAN" }, { month: 2, monthName: "FEB" }, { month: 3, monthName: "MAR" }, { month: 4, monthName: "APR" }, { month: 5, monthName: "MAY" }, { month: 6, monthName: "JUN" }, { month: 7, monthName: "JUL" },
  { month: 8, monthName: "AUG" }, { month: 9, monthName: "SEP" }, { month: 10, monthName: "OCT" }, { month: 11, monthName: "NOV" }, { month: 12, monthName: "DEC" }];

  const monthValues = ((values) => {
    return months.map((month) => {
      if (month.month == values.month) {
        return month.monthName
      }
    });
  })
  const mfPositiveLineListSurvey =
    values && values.mfPositiveLineListSurveys.map((item: any, i: any) => {
      return (
        <div className="form-grp" key={i}>
          <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">MF Positive LineList Id:</div>
                <div>{item && item.mfPositiveLineListId}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">Details Of Survey Id:</div>
                <div>{item && item.detailsOfSurveyId}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">CreatedAt:</div>
                <div>{item && moment(item.createdAt).format("DD/MM/YYYY")}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">LastModifiedAt:</div>
                <div>{item && moment(item.updatedAt).format("DD/MM/YYYY")}</div>
              </div>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">
                  {'No Of Persons Female 0 -< 5:'}</div>
                <div>{item && item.noOfPersonsFemale0to4}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons Female 5 -< 15:'}</div>
                <div>{item && item.noOfPersonsFemale5to14}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons Female 15 -< 40:'}</div>
                <div>{item && item.noOfPersonsFemale15to39}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons Female 40 & above:'}</div>
                <div>{item && item.noOfPersonsFemale40Plus}</div>
              </div>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons Male 0 -< 5:'}</div>
                <div>{item && item.noOfPersonsMale0to4}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons Male 5 -< 15:'}</div>
                <div>{item && item.noOfPersonsMale5to14}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons Male 15 -< 40:'}</div>
                <div>{item && item.noOfPersonsMale15to39}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons Male 40 & above:'}</div>
                <div>{item && item.noOfPersonsMale40Plus}</div>
              </div>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons TG 0 -< 5:'}</div>
                <div>{item && item.noOfPersonsTG0to4}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons TG 5 -< 15:'}</div>
                <div>{item && item.noOfPersonsTG5to14}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons TG 15 -< 40:'}</div>
                <div>{item && item.noOfPersonsTG15to39}</div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3  col-12">
              <div className="form-grp">
                <div className="form-label font-chng">{'No Of Persons TG 40 & above:'}</div>
                <div>{item && item.noOfPersonsTG40Plus}</div>
              </div>
            </div>
          </Row>
        </div>
      );
    });

  return (
    <div className="card cus-tablecard" style={{padding : "30px"}}>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">SR.No:</div>
            <div>{values && values.srNo}</div>
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
            <div className="form-label font-chng">Facility:</div>
            <div>{values && values.facility && values.facility.facilityName}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Corporation:</div>
            <div>{values && values.corporation && values.corporation.corporationName}</div>
          </div>
        </div>
      </Row>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Taluka:</div>
            <div>{values && values.taluka && values.taluka.talukaName}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Village:</div>
            <div>{values && values.village && values.village.villageName}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Subcenter</div>
            <div>{values && values.subCenter && values.subCenter.subCenterName ? values.subCenter.subCenterName : "None"}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng"> Zone:</div>
            <div>{values && values.zone && values.zone.zoneName ? values.zone.zoneName : "None"}</div>
          </div>
        </div>
      </Row>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Area:</div>
            <div>{values && values.area ? values.area : "None"}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Town :</div>
            <div>{values && values.town ? values.town : "None"}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Name Of Unit:</div>
            <div>{values && values.verticalControlUnit && values.verticalControlUnit.nameOfControlUnit}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Unit Of Action:</div>
            <div>{values && values.UnitOfAction2 && values.UnitOfAction2.categoryOptionName}</div>
          </div>
        </div>
      </Row>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Total Population Village:</div>
            <div>{values && values.totalPopulationVillage}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Total No Of Houses In Area:</div>
            <div>{values && values.totalNoOfHousesInArea}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">BS Collection:</div>
            <div>{values && values.BsCollectionAntigenTest && values.BsCollectionAntigenTest.categoryOptionName}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Population Covered:</div>
            <div>{values && values.populationCoveredByUnit}</div>
          </div>
        </div>
      </Row>
      <Row className="mb-3">
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Target For Collection Of NBS:</div>
            <div>{values && values.targetForCollectionOfNBS}</div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3  col-12">
          <div className="form-grp">
            <div className="form-label font-chng">Fix Or Random:</div>
            <div>{values && values.fixOrRandom == 0 ? "Nil" : (values.fixOrRandom == 1 ? "Fix" : "Random")}</div>
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
      <div>
        {mfPositiveLineListSurvey}
      </div>
    </div>
  )
}
export default AccordionFilaraFieldUnit;
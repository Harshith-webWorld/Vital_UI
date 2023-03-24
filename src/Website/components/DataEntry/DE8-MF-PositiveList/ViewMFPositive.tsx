import React, { useState, useEffect } from "react";
import {useUserDistrictId} from '../../../customHooks/useUserDistrictId';
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import DataTable from "react-data-table-component";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import plusImg from "../../../assets/img/LEFP_Images/add_new.png";
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import history from "../../../../helpers/history";
import moment from "moment";
import MfPositiveService from "../../../services/MfPositiveService";
import { confirmAlert } from "react-confirm-alert";
import { USER_ROLE_REPORT_REVIEW } from "../../../../helpers/config";
import AccordionFilaraFieldUnit from "./AccordionFilaraFieldUnit";
import mfPositiveDraftServices from "../../../draftServices/FormMFPositiveDraftServices";
import DexieOfflineDataBase from "../../../../helpers/Offline/OfflineDropdownServices";
import FormMFPositiveLineListSyncService from "../../../DraftSyncServices/FormMFPositiveLineListDraftSyncServices";
import MFPositiveFilter from "./MFPositiveFilter";

const ViewMFPositive = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  const [listData, setListData] = useState([]);
  let isOnline = window.navigator.onLine;
  const [mfPositiveLineListDraftListData, setmfPositiveLineListDraftListData] = useState([]);
  const [mfPositiveLineListDraftListShow, setmfPositiveLineListDraftListShow] = useState(false);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  let [nameOfFilariaUnitIdValues, setnameOfFilariaUnitIdValues] = useState([]);

  const editPath = (id) => {
    history.push(addDESheetName, { mfId: id } );
  };
  const columns = [
    {
      name: "Sr.No",
      selector: "srNo",
    },
    {
      name: "Name Of Filaria Unit",
      selector: (row: any) =>
        row.verticalControlFieldUnit &&
          row.verticalControlFieldUnit.fieldUnitName
          ? row.verticalControlFieldUnit.fieldUnitName
          : "Nil",
    },
    {
      name: "District",
      selector: (row: any) =>
        row.district && row.district ? row.district.districtName : "None",
    },
    {
      name: "Taluka",
      selector: (row: any) =>
        row.taluka && row.taluka.talukaName ? row.taluka.talukaName : "None",
    },
    {
      name: "Village",
      selector: (row: any) =>
        row.village && row.village.villageName
          ? row.village.villageName
          : "None",
    },
    {
      name: "Facility",
      selector: (row: any) =>
        row.facility && row.facility.facilityName
          ? row.facility.facilityName
          : "None",
    },
    {
      name: "Target For Collection Of NBS",
      selector: "targetForCollectionOfNBS",
    },
    {
      name: 'Follow Ups',
      selector: 'followUps',
      cell: (row) => {
        return (
          <div>
            <button 
              className="btn-link"
              onClick={() => history.push(addDESheetName, { mfId: row.id, goToStep: 3 })}
            >
              Filaria
            </button>
          </div>
        )
      }
    },
    {
      name: "Actions",
      selector: "id",
      cell: (row) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag="allowRowEvents" className="action-grp">
            <button
              className="btn tooltip-wrap"
              type="button"
              onClick={() =>
                history.push(addDESheetName, { mfId: row.id, view: "viewOnly" })
              }
            >
              <img src={viewIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">View</div>
              </div>
            </button>
            <button
              className="btn tooltip-wrap"
              type="button"
              onClick={() => {
                editPath(row.id);
              }}
            >
              <img src={editIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">Edit</div>
              </div>
            </button>
            <button
              className="btn tooltip-wrap"
              onClick={(event) => Delete(event, row.id)}
            >
              <img src={deleteIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">Delete</div>
              </div>
            </button>
          </div>
        ) : (
          <div data-tag="allowRowEvents" className="action-grp">
            <button
              className="btn tooltip-wrap"
              type="button"
              onClick={() =>
                history.push(addDESheetName, { mfId: row.id, view: "viewOnly" })
              }
            >
              <img src={viewIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">View</div>
              </div>
            </button>
          </div>
        ),
    },
  ];

  const draftColumns = [
    {
      name: "Sr.No",
      selector: "srNo",
    },
    {
      name: "Name Of Filaria Unit",
      selector: (row: any) => {
        if (row.nameOfFilariaFieldUnit === 0 || row.nameOfFilariaFieldUnit === "0") {
          return "None";
        } else {
          if (nameOfFilariaUnitIdValues.length > 0) {
            const find: any = nameOfFilariaUnitIdValues.find(({ id }) => id === row.nameOfFilariaFieldUnit)
            return find && find.fieldUnitName;
          } else {
            return "empty";
          }
        }
      }
    },
    {
      name: "District",
      selector: (row: any) => {
        if (row.districtId === 0) {
          return "None";
        } else {
          if (districtIdValues.length > 0) {
            const find: any = districtIdValues.find(({ id }) => id === row.districtId)
            return find && find.districtName;
          } else {
            return "empty";
          }
        }
      }
    },
    {
      name: "Taluka",
      selector: (row: any) => {
        if (row.talukaId === 0) {
          return "None";
        } else {
          if (talukaIdValues.length > 0) {
            const find: any = talukaIdValues.find(({ id }) => id === row.talukaId)
            return find && find.talukaName;
          } else {
            return "empty";
          }
        }
      }
    },
    {
      name: "Village",
      selector: (row: any) => {
        if (row.villageId === 0 || row.villageId === "0") {
          return "None";
        } else {
          if (villageIdValues.length > 0) {
            const find: any = villageIdValues.find(({ id }) => id === row.villageId)
            return find && find.villageName;
          } else {
            return "empty";
          }
        }
      }
    },
    {
      name: "Facility",
      selector: (row: any) => {
        if (row.facilityId === 0) {
          return "None";
        } else {
          if (facilityIdValues.length > 0) {
            const find: any = facilityIdValues.find(({ id }) => id === row.facilityId)
            return find && find.facilityName;
          } else {
            return "empty";
          }
        }
      }
    },
    {
      name: "Target For Collection Of NBS",
      selector: "targetForCollectionOfNBS",
    },
    {
      name: "Actions",
      selector: "id",
      cell: (row) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag="allowRowEvents" className="action-grp">
            <button
              className="btn tooltip-wrap"
              type="button"
              onClick={() =>
                history.push(addDESheetName, { UUID: row.mfPositiveLineListUUID, view: "viewOnly" })
              }
            >
              <img src={viewIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">View</div>
              </div>
            </button>
            <button
              className="btn tooltip-wrap"
              type="button"
              onClick={() => {
                history.push(addDESheetName, { UUID: row.mfPositiveLineListUUID });
              }}
            >
              <img src={editIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">Edit</div>
              </div>
            </button>
            <button
              className="btn tooltip-wrap"
              onClick={(event) => Delete(event, row.mfPositiveLineListUUID, true)}
            >
              <img src={deleteIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">Delete</div>
              </div>
            </button>
          </div>
        ) : (
          <div data-tag="allowRowEvents" className="action-grp">
            <button
              className="btn tooltip-wrap"
              type="button"
              onClick={() =>
                history.push(addDESheetName, { UUID: row.mfPositiveLineListUUID, view: "viewOnly" })
              }
            >
              <img src={viewIcon} />
              <div className="tooltip">
                <div className="tooltip-inner">View</div>
              </div>
            </button>
          </div>
        ),
    },
  ];

  async function deleteFilariaField(id: number, isDraft?: boolean) {
    if ( isDraft != true ) {
      const response = await MfPositiveService.deleteMfPositiveList(id);
      if (response) {
        getPositiveList(filterValues);
      }
    } else {
      const draftResponse = await mfPositiveDraftServices.deleteMFPositiveLineList(id);
      if (draftResponse) {
        getPositiveList(filterValues);
      }      
    }    
  }

  const Delete = (event: any, id: number, isDraft?: boolean) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: "Do you want to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            deleteFilariaField(id, isDraft);
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  useEffect(() => {
    getPositiveList({districtId: userDistrictId});
  }, []);
  const addForm = () => {
    history.push(addDESheetName);
  };
  async function getPositiveList(params) {
    const positiveList: any = await MfPositiveService.getMfPositiveList(params);
    //console.log("positiveList:: ", positiveList);
    if (positiveList && positiveList.data) {
      setListData(positiveList.data);
    }
    else{
      setListData([]);
    }
    const draftCountResponse: any = await mfPositiveDraftServices.countMFPositiveLineList(props && props.userSessionId);
    setDraftCount(draftCountResponse);
    if (draftCountResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
    const draftResponse = await mfPositiveDraftServices.getListMFPositiveLineList(props && props.userSessionId);
    if (draftResponse) {
      console.log("get LymphedemaPatientInformation:: ", draftResponse);
      setmfPositiveLineListDraftListData(draftResponse);
    }
    const districtIdOffline = await DexieOfflineDataBase.getDistricts();
    if (districtIdOffline) {
      setdistrictIdValues(districtIdOffline);
    }
    const talukaIdOffline: any = await DexieOfflineDataBase.getAllTaluka();
    if (talukaIdOffline) {
      settalukaIdValues(talukaIdOffline);
    }
    const facilityIdOffline: any = await DexieOfflineDataBase.getAllFacility();
    if (facilityIdOffline) {
      setfacilityIdValues(facilityIdOffline);
    }
    const villageIdOffline: any = await DexieOfflineDataBase.getAllVillage();
    if (villageIdOffline) {
      setvillageIdValues(villageIdOffline);
    }
    const nameOfFilariaUnitIdOffline: any = await DexieOfflineDataBase.getAllVertiocalControlFieldUnitsOffline();
    if (nameOfFilariaUnitIdOffline) {
      setnameOfFilariaUnitIdValues(nameOfFilariaUnitIdOffline);
    }
  }

  const handleSync = async () => {
    //Sync Service
    const syncStatus = await FormMFPositiveLineListSyncService.syncOfflineData(props && props.userSessionId);
    console.log("status", syncStatus);
    if (syncStatus && syncStatus.data || syncStatus && syncStatus.status === 200) {
      getPositiveList({districtId: userDistrictId});
    }
  }

  const AccordionComponent = (row) => {
    return <AccordionFilaraFieldUnit rowValues={row} />;
  };

  return (
    <div className="in-left">
      <Breadcrumb>
        <Breadcrumb.Item className="font-chng" onClick={() => {history.push('/WebDashboard')}}>
          Data Entry
        </Breadcrumb.Item>
        {
          isOnline ? <Breadcrumb.Item active>ONLINE</Breadcrumb.Item> : <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
        }
        <Breadcrumb.Item active className="font-chng">
          MF Positive
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className="card">
          <div className="row">
            <div className="col-md-6">
              <h4 className="formtitlenew font-chng">MF Positive</h4>
            </div>
            <div className="col-md-6 col-12 flexdiv">
              <Button
                variant="secondary"
                className="mt-m font-chng mr10"
                style={{ backgroundColor: '#19D895', border: 'none' }}
                onClick={() => {
                  if (mfPositiveLineListDraftListShow) {
                    setmfPositiveLineListDraftListShow(false);
                  } else {
                    setmfPositiveLineListDraftListShow(true);
                  }
                }}
              >
                {mfPositiveLineListDraftListShow && <div>Server List</div>}

                {!mfPositiveLineListDraftListShow &&
                  <div>Draft List <b>{draftCount > 0 ? `(${draftCount})` : null}</b></div>}
              </Button>
              <Button
                variant="secondary"
                className="mt-m font-chng mr10"
                style={{ backgroundColor: '#19D895', border: 'none' }}
                onClick={addForm}
              >
                <img src={plusImg} className="pe-2" />
                Add New
              </Button>
              <MFPositiveFilter
                getPositiveList={getPositiveList}
                setFilterValues={setFilterValues}
              />
            </div>
            {/* <div className="col-md-3 text-right">
              
            </div> */}
          </div>
          <div className="post-tablenew font-chng cus-table">
            {!mfPositiveLineListDraftListShow ?
              <div>
                <DataTable
                  columns={columns}
                  data={listData}
                  expandableRows={true}
                  expandableRowsComponent={<AccordionComponent />}
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  paginationComponentOptions={{
                    rowsPerPageText: "Records per page:",
                    rangeSeparatorText: "out of",
                  }}
                />
              </div>
              :
              <div>
                <DataTable
                  columns={draftColumns}
                  data={mfPositiveLineListDraftListData}
                  // expandableRows={true}
                  // expandableRows={true}
                  //expandOnRowClicked={true}
                  // expandableRowsComponent={<AccordionComponent />}
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  paginationComponentOptions={{
                    rowsPerPageText: "Records per page:",
                    rangeSeparatorText: "out of",
                  }}
                />
                <div>
                  <Button
                    disabled={!SyncBtnShow ? true : false}
                    variant="secondary"
                    className="mt-m font-chng m-3"
                    style={{ backgroundColor: '#19D895', border: 'none' }}
                    onClick={handleSync}
                  >
                    Sync
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMFPositive;

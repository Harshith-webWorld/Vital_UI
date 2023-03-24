import React, { useEffect, useState } from 'react';
import { useUserDistrictId } from '../../../customHooks/useUserDistrictId';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import history from '../../../../helpers/history';
import TassurveyService from '../../../services/FormTasSurveyService';
import { TasSurvey } from '../../../interfaces/FormTasSurveyInterfaces';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import Accordion from 'react-bootstrap/Accordion';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionTASSurvey from './AccordionTASSurvey';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormTasSurveyDraftService from '../../../draftServices/FormTasSurveyDraftService';
import FormTasSurveyDraftSyncService from '../../../DraftSyncServices/FormTasSurveyDraftSyncService';

const ViewTASSurvey = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  let isOnline = window.navigator.onLine;
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  const [tasSurveyList, setTasSurveyList] = useState([]);
  const [tasSurveyOfflineListData, setTasSurveyOfflineListData] = useState([]);
  const [tasSurveyOfflineListShow, setTasSurveyOfflineListShow] =
    useState(false);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  useEffect(() => {
    getTassurvey({ districtId: userDistrictId });
    getListContentData();
  }, []);

  async function getListContentData() {
    const districtIdOffline: any = await DexieOfflineDataBase.getDistricts();
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
  }

  const [getData, setGetdata] = useState([]);

  async function getTassurvey(params) {
    const response = await TassurveyService.getTASSurvey(params);
    if (response) {
      setGetdata(response.data);
    }
    const offlineResponse = await FormTasSurveyDraftService.getAllTasSurvey();
    if (offlineResponse) {
      setTasSurveyOfflineListData(offlineResponse);
    }
    const countTasSurveyResponse =
      await FormTasSurveyDraftService.countTasSurvey(
        props && props.userSessionId
      );
    setDraftCount(countTasSurveyResponse);
    if (countTasSurveyResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
  }
  async function deleteTas(event: any, id: any, IdType: string) {
    event.persist();
    if (IdType === 'Id') {
      const response = await TassurveyService.deleteTasSurvey(id);
      if (response.message == 'Deleted successfully') {
        getTassurvey({ districtId: userDistrictId });
        //console.log("Delete News", response);
      }
    } else {
      const offlineResponse = await FormTasSurveyDraftService.deleteTasSurvey(
        id
      );
      setGetdata(offlineResponse);
      getTassurvey({ districtId: userDistrictId });
    }
  }

  const Delete = (event: any, id: number, IdType: string) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteTas(event, id, IdType);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  const ExpandedComponent = (row) => {
    return <AccordionTASSurvey rowValues={row} />;
  };

  const columns = [
    {
      name: 'ID',
      selector: 'srNo',
    },

    {
      name: 'District',
      selector: (row: any) =>
        row && row.district && row.district.districtName
          ? row.district.districtName
          : 'None',
    },
    {
      name: 'Taluka',
      selector: (row: any) =>
        row.taluka && row.taluka.talukaName ? row.taluka.talukaName : 'None',
    },
    {
      name: 'Village',
      selector: (row: any) =>
        row.village && row.village.villageName
          ? row.village.villageName
          : 'None',
    },
    {
      name: 'Type of TAS',
      selector: 'typeOfTAS',
    },
    {
      name: 'Name Of EU',
      selector: 'nameOfEU',
    },
    {
      name: 'Actions',
      selector: 'Actions',
      cell: (row) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag='allowRowEvents' className='action-grp'>
            <button
              className='btn tooltip-wrap'
              onClick={() =>
                history.push(addDESheetName, {
                  id: row.id,
                  view: 'viewOnly',
                })
              }
            >
              <img src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>View</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={() => history.push(addDESheetName, { id: row.id })}
            >
              <img src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(e) => Delete(e, row.id, 'Id')}
            >
              <img src={deleteIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>Delete</div>
              </div>
            </button>
          </div>
        ) : (
          <div data-tag='allowRowEvents' className='action-grp'>
            <button
              className='btn tooltip-wrap'
              onClick={() =>
                history.push(addDESheetName, {
                  id: row.id,
                  view: 'viewOnly',
                })
              }
            >
              <img src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>View</div>
              </div>
            </button>
          </div>
        ),
    },
  ];

  const offlineColumns = [
    {
      name: 'Sr.No',
      selector: 'srNo',
      // grow: 0,
    },
    {
      name: 'District',
      selector: (row: any) => {
        if (row.districtId === 0) {
          return 'None';
        } else {
          return districtIdValues.map((district: any, i: any) => {
            if (row.districtId === district.id) {
              return district.districtName;
            }
          });
        }
      },
    },
    {
      name: 'Taluka',
      selector: (row: any) => {
        if (row.talukaId === 0) {
          return 'None';
        } else {
          return talukaIdValues.map((taluka: any, i: any) => {
            if (row.talukaId === taluka.id) {
              return taluka.talukaName;
            }
          });
        }
      },
    },

    {
      name: 'Village',
      selector: (row: any) => {
        if (row.villageId === 0 || row.villageId === '0') {
          return 'None';
        } else {
          return villageIdValues.map((village: any, i: any) => {
            if (row.villageId === village.id) {
              return village.villageName;
            }
          });
        }
      },
      // grow: 0,
    },

    {
      name: 'Type of TAS',
      selector: (row: any) => (row && row.typeOfTAS ? row.typeOfTAS : 'None'),
      // grow: 0,
    },
    {
      name: 'Name Of EU',
      selector: (row: any) => (row && row.nameOfEU ? row.nameOfEU : 'None'),
    },

    {
      name: 'Actions',
      selector: 'Actions',

      cell: (row) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag='allowRowEvents'>
            <button
              className='btn tooltip-wrap'
              onClick={() => {
                history.push(addDESheetName, {
                  tasSurveyUUID: row.tasSurveyUUID,
                  view: 'viewOnly',
                });
              }}
            >
              <img src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={() => {
                history.push(addDESheetName, {
                  tasSurveyUUID: row.tasSurveyUUID,
                });
              }}
            >
              <img src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(e: any) => {
                Delete(e, row.tasSurveyUUID, 'UUID');
              }}
            >
              <img src={deleteIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>Delete</div>
              </div>
            </button>
          </div>
        ) : (
          <div data-tag='allowRowEvents'>
            <button
              className='btn tooltip-wrap'
              onClick={() => {
                history.push(addDESheetName, {
                  tasSurveyUUID: row.tasSurveyUUID,
                  view: 'viewOnly',
                });
              }}
            >
              <img src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
          </div>
        ),
    },
  ];

  const addForm = () => {
    history.push(addDESheetName);
  };

  const handleSync = async () => {
    const syncStatus = await FormTasSurveyDraftSyncService.syncOfflineData(
      props && props.userSessionId
    );
    if (syncStatus.status === 200) {
      getTassurvey({ districtId: userDistrictId });
    }
  };

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/WebDashboard');
          }}
          className='font-chng'
        >
          Data Entry
        </Breadcrumb.Item>
        {/* <Breadcrumb.Item href="">
                    TAS Survey
                 </Breadcrumb.Item> */}
        {isOnline ? (
          <Breadcrumb.Item active>ONLINE</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active className='font-chng'>
          TAS Survey
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='card-head'>
            <div className='row'>
              <div className='col-md-6 col-12'>
                <h4 className='formtitlenew font-chng'>TAS Survey</h4>
              </div>
              <div className='col-md-6 col-12 flexdiv'>
                <Button
                  variant='secondary'
                  className='mt-m font-chng mr10'
                  style={{ backgroundColor: '#19D895', border: 'none' }}
                  onClick={() => {
                    if (tasSurveyOfflineListShow) {
                      setTasSurveyOfflineListShow(false);
                    } else {
                      setTasSurveyOfflineListShow(true);
                    }
                  }}
                >
                  {tasSurveyOfflineListShow && <div>Server List</div>}

                  {!tasSurveyOfflineListShow && (
                    <div>
                      Draft List{' '}
                      <b>{draftCount > 0 ? `(${draftCount})` : null}</b>
                    </div>
                  )}
                </Button>
                <Button
                  variant='secondary'
                  className='mt-m font-chng mr10'
                  onClick={addForm}
                >
                  <img src={plusImg} className='pe-2' />
                  Add New
                </Button>
              </div>
              {/* <div className="col-md-3 col-12">
                <div className="text-right">
                  
                </div>
              </div> */}
            </div>
          </div>
          {!tasSurveyOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={getData}
                expandableRows={true}
                onRowExpandToggled={(expand, row) => {}}
                expandableRowsComponent={<ExpandedComponent />}
                highlightOnHover
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationComponentOptions={{
                  rowsPerPageText: 'Records per page:',
                  rangeSeparatorText: 'out of',
                }}
              />
            </div>
          )}

          {tasSurveyOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={offlineColumns}
                data={tasSurveyOfflineListData}
                expandableRows={true}
                onRowExpandToggled={(expand, row) => {}}
                expandableRowsComponent={<ExpandedComponent />}
                highlightOnHover
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100, 1000]}
                paginationComponentOptions={{
                  rowsPerPageText: 'Records per page:',
                  rangeSeparatorText: 'out of',
                }}
              />

              <div>
                <Button
                  disabled={!SyncBtnShow ? true : false}
                  variant='secondary'
                  className='mt-m font-chng m-3'
                  style={{ backgroundColor: '#19D895', border: 'none' }}
                  onClick={handleSync}
                >
                  Sync
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTASSurvey;

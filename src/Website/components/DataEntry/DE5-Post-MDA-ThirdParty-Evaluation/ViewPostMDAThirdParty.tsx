import React, { useEffect, useState } from 'react';
import { useUserDistrictId } from '../../../customHooks/useUserDistrictId';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import history from '../../../../helpers/history';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import postMDAList from '../../../services/postMDAEvalList.service';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionPostMDAThirdParty from './AccordionPostMDAThirdParty';

import AddPostMdaDraftServices from '../../../draftServices/FormAddPostMdaDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormPostMdaDraftSyncServices from '../../../DraftSyncServices/FormPostMdaDraftSyncServices';

const ViewPostMDAThirdParty = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  let isOnline = window.navigator.onLine;

  const [getData, setGetdata] = useState([]);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  //offline
  const [getOfflineData, setGetOfflineData] = useState([]);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [addPostMdaOfflineListShow, setAddPostMdaOfflineListShow] =
    useState(false);
  const [draftCount, setDraftCount] = useState(0);
  useEffect(() => {
    getEvalList({ districtId: userDistrictId });
    getListContentData();
  }, []);

  async function getEvalList(params) {
    const response = await postMDAList.getEvalList(params);
    if (response) {
      //console.log("website content:: ", response.data);
      setGetdata(response.data);
    }
    const draftResponse = await AddPostMdaDraftServices.getAllPostMdaEvaly();
    if (draftResponse) {
      setGetOfflineData(draftResponse);
    }
    const countCoverageReportResponse =
      await AddPostMdaDraftServices.countPostMdaEval(
        props && props.userSessionId
      );
    setDraftCount(countCoverageReportResponse);
    if (countCoverageReportResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
  }

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

  const ExpandedComponent = (row) => {
    return <AccordionPostMDAThirdParty rowValues={row} />;
  };
  const columns = [
    {
      name: 'Sr.No',
      selector: 'srNo',
    },
    {
      name: 'District',
      selector: (row: any) =>
        row.district && row.district ? row.district.districtName : 'None',
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
      name: 'Facility',
      selector: (row: any) =>
        row.facility && row.facility.facilityName
          ? row.facility.facilityName
          : 'None',
    },
    {
      name: 'Name of Person Interviewed',
      selector: (row: any) =>
        row.nameOfPersonInterviewed ? row.nameOfPersonInterviewed : 'None',
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
                history.push(addDESheetName, { id: row.id, view: 'viewOnly' })
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
              onClick={(event) => Delete(event, row.id, 'Id')}
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
                history.push(addDESheetName, { id: row.id, view: 'viewOnly' })
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
      name: 'Facility',
      selector: (row: any) => {
        if (row.facilityId === 0) {
          return 'None';
        } else {
          return facilityIdValues.map((facility: any, i: any) => {
            if (row.facilityId === facility.id) {
              return facility.facilityName;
            }
          });
        }
      },
    },

    {
      name: 'Village',
      selector: (row: any) => {
        if (row.villageId === 0) {
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
      name: 'Name of Person Interviewed',
      selector: (row: any) =>
        row.nameOfPersonInterviewed ? row.nameOfPersonInterviewed : 'None',
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
                  UUID: row.postMdaEvalUUID,
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
                history.push(addDESheetName, { UUID: row.postMdaEvalUUID });
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
                Delete(e, row.postMdaEvalUUID, 'UUID');
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
                  UUID: row.postMdaEvalUUID,
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

  const onActivityRemove = async (event: any, id: any, IdType: string) => {
    event.persist();
    if (IdType === 'Id') {
      const response = await postMDAList.deleteEvalList(id);
      console.log(response.data);
    } else {
      const offlineResponse = await AddPostMdaDraftServices.deletePostMdaEval(
        id
      );
    }
    getEvalList({ districtId: userDistrictId });
  };

  const Delete = (event: any, id: any, IdType: string) => {
    //console.log(id);
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onActivityRemove(event, id, IdType);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleSync = async () => {
    const syncStatus = await FormPostMdaDraftSyncServices.syncDraftData(
      props && props.userSessionId
    );
    console.log('status', syncStatus);
    getEvalList({ districtId: userDistrictId });
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
        {isOnline ? (
          <Breadcrumb.Item active>ONLINE</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active className='font-chng'>
          Third Party Evaluation for MDA
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='card-head'>
            <div className='row'>
              <div className='col-md-6 col-12'>
                <h4 className='formtitlenew font-chng'>
                  Third Party Evaluation for MDA
                </h4>
              </div>
              <div className='col-md-6 col-12 flexdiv'>
                <Button
                  variant='secondary'
                  className='mt-m font-chng mr10'
                  style={{ backgroundColor: '#19D895', border: 'none' }}
                  onClick={() => {
                    if (addPostMdaOfflineListShow) {
                      setAddPostMdaOfflineListShow(false);
                    } else {
                      setAddPostMdaOfflineListShow(true);
                    }
                  }}
                >
                  {addPostMdaOfflineListShow && <div>Server List</div>}

                  {!addPostMdaOfflineListShow && (
                    <div>
                      Draft List{' '}
                      <b>{draftCount > 0 ? `(${draftCount})` : null}</b>
                    </div>
                  )}
                </Button>
                <Button
                  variant='secondary'
                  className='mt-m font-chng mr10'
                  style={{ backgroundColor: '#19D895', border: 'none' }}
                  onClick={addForm}
                >
                  <img src={plusImg} className='pe-2 font-chng' />
                  Add New
                </Button>
              </div>
              {/* <div className="col-md-3 col-12">
                <div className="text-right">
                  
                </div>
              </div> */}
            </div>
          </div>
          <div className='post-tablenew font-chng cus-table'>
            {!addPostMdaOfflineListShow ? (
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
            ) : (
              <div>
                <DataTable
                  columns={offlineColumns}
                  data={getOfflineData}
                  // expandableRows={true}
                  // onRowExpandToggled={(expand,row)=>{
                  //   console.log(expand);
                  //   console.log(row);
                  // }}
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  //expandOnRowClicked={false}
                  // expandableRowsComponent={<AccordionComponent/>}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
    </div>
  );
};

export default ViewPostMDAThirdParty;

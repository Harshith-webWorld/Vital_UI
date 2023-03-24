import React, { useState, useEffect } from 'react';
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
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import history from '../../../../helpers/history';
import PreMDAActivityService from '../../../services/FormPreMDAActivityService';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment';
import Loader from '../../../../helpers/Loader/index';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionPreMDAActivity from './AccordionPreMDAActivity';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import DexieOfflineFormPreMdaActivity from '../../../draftServices/FormPreMdaActivityDraft';
import FormPreMdaActivitySyncService from '../../../DraftSyncServices/FormPreMdaActivitySyncService';
import { off } from 'process';
const ViewPreMDAActivity = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const [loading, setLoading] = useState(false);
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  let isOnline = window.navigator.onLine;
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  const [preMdaOfflineDataList, setPreMdaOfflineDataList] = useState([]);
  const [preMdaActivityOfflineListShow, setpreMdaActivityOfflineListShow] =
    useState(false);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  useEffect(() => {
    getPreMDAActivity({ districtId: userDistrictId });
    getListContentData();
  }, []);
  const [getData, setGetdata] = useState([]);

  const handleSync = async () => {
    const syncStatus = await FormPreMdaActivitySyncService.syncOfflineData(
      props && props.userSessionId
    );
    if (syncStatus.status === 200) {
      getPreMDAActivity({ districtId: userDistrictId });
    }
  };

  async function getPreMDAActivity(params) {
    const response = await PreMDAActivityService.getPreMDAActivity(params);
    if (response) {
      setGetdata(response.data);
    }
    const offlineResponse =
      await DexieOfflineFormPreMdaActivity.getAllPreMdaActivity();
    if (offlineResponse) {
      setPreMdaOfflineDataList(offlineResponse);
    }
    const draftCountResponse =
      await DexieOfflineFormPreMdaActivity.countPreMdaActvity(
        props && props.userSessionId
      );
    setDraftCount(draftCountResponse);
    if (draftCountResponse > 0) {
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
  async function deletePreMDAACtivity(
    id: number,
    event: any,
    isDraft?: boolean
  ) {
    event.persist();
    if (isOnline && isDraft != true) {
      const response = await PreMDAActivityService.deletePreMDAActivity(id);
      if (response.message == 'Deleted successfully') {
        getPreMDAActivity({ districtId: userDistrictId });
      }
    } else {
      const offlineResponse =
        await DexieOfflineFormPreMdaActivity.deletePreMdaActivity(id);
      setPreMdaOfflineDataList(offlineResponse);
      getPreMDAActivity({ districtId: userDistrictId });
    }
  }

  const Delete = (event: any, id: number, isDraft?: boolean) => {
    confirmAlert({
      // title: 'Confirm to Delete',
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deletePreMDAACtivity(id, event, isDraft);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const AccordionComponent = (row) => {
    return <AccordionPreMDAActivity rowValues={row} />;
  };

  const columns = [
    {
      name: 'Sr.No',
      selector: 'srNo',
      grow: 1.5,
      style: {
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '13px',
        lineHeight: '20px',
        color: '#000000',
      },
    },
    {
      name: 'District',
      selector: 'district.districtName',
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
              <img src={viewIcon} alt='' />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={() => history.push(addDESheetName, { id: row.id })}
            >
              <img src={editIcon} alt='' />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(event) => Delete(event, row.id)}
            >
              <img src={deleteIcon} alt='' />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>Delete</div>
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
              <img src={viewIcon} className='font-chng' />
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
      name: 'Actions',
      selector: 'Actions',

      cell: (row) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag='allowRowEvents'>
            <button
              className='btn tooltip-wrap'
              onClick={() => {
                history.push(addDESheetName, {
                  preMDAActivityUUID: row.preMDAActivityUUID,
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
                  preMDAActivityUUID: row.preMDAActivityUUID,
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
                Delete(e, row.preMDAActivityUUID, true);
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
                  preMdaActivityUUID: row.preMDAActivityUUID,
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

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/WebDashboard');
          }}
          className='font-chng'
        >
          Data Entry{' '}
        </Breadcrumb.Item>
        {isOnline ? (
          <Breadcrumb.Item active>ONLINE</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
        )}
        {/* <Breadcrumb.Item href="/viewpremdaactivity">Pre-MDA</Breadcrumb.Item> */}
        <Breadcrumb.Item active className='font-chng'>
          Pre-MDA activity
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='row'>
            <div className='col-md-6 col-12'>
              <h4 className='formtitlenew font-chng'>
                Pre-MDA activity (Action plan, Training status and drugs
                logistics)
              </h4>
            </div>
            <div className='col-md-6 col-12 flexdiv'>
              <Button
                variant='secondary'
                className='mt-m font-chng mr10'
                style={{ backgroundColor: '#19D895', border: 'none' }}
                onClick={() => {
                  if (preMdaActivityOfflineListShow) {
                    setpreMdaActivityOfflineListShow(false);
                  } else {
                    setpreMdaActivityOfflineListShow(true);
                  }
                }}
              >
                {preMdaActivityOfflineListShow && <div>Server List</div>}

                {!preMdaActivityOfflineListShow && (
                  <div>
                    Draft List{' '}
                    <b>{draftCount > 0 ? `(${draftCount})` : null}</b>
                  </div>
                )}
              </Button>
              <Button
                variant='secondary'
                className='mt-m font-chng mr10'
                onClick={() => history.push(addDESheetName)}
              >
                <img src={plusImg} className='pe-2 font-chng ' />
                Add New
              </Button>
            </div>

            {/* <div className="col-md-3 text-right">
              
            </div> */}
          </div>
          {!preMdaActivityOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={getData}
                expandableRows={true}
                //expandOnRowClicked={true}
                expandableRowsComponent={<AccordionComponent />}
                highlightOnHover
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                paginationComponentOptions={{
                  rowsPerPageText: 'Records per page:',
                  rangeSeparatorText: 'out of',
                }}
              />
              {/* {loading&&<Loader/>} */}
            </div>
          )}

          {preMdaActivityOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={offlineColumns}
                data={preMdaOfflineDataList}
                expandableRows={true}
                onRowExpandToggled={(expand, row) => {}}
                expandableRowsComponent={<AccordionComponent />}
                highlightOnHover
                pagination
                paginationPerPage={10}
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
  );
};

export default ViewPreMDAActivity;

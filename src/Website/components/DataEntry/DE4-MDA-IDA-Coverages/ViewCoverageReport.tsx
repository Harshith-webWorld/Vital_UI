import React, { useState, useEffect } from 'react';
import { useUserDistrictId } from '../../../customHooks/useUserDistrictId';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import history from '../../../../helpers/history';
import MdaIdaCoveregareService from '../../../services/FormMdaIdaCoveragesService';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionCoverageReport from './AccordionCoverageReport';
//offline
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import mdaIdaCoveragesDraftServices from '../../../draftServices/FormMadIdaCoveragesDraftServices';
import FormMdaIdaCoveragesSyncService from '../../../DraftSyncServices/FormMdaIdaCoverageSyncServices';
import { Sync } from '@material-ui/icons';

const ViewMDACoverageReport = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  const location = useLocation<any>();
  let isOnline = window.navigator.onLine;
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  const [mdaIdaCoveragesList, setmdaIdaCoveragesList] = useState([]);
  const [mdaIdaCoveragesOfflineListData, setmdaIdaCoveragesOfflineListData] =
    useState([]);
  const [mdaIdaCoveragesOfflineListShow, setmdaIdaCoveragesOfflineListShow] =
    useState(false);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    getListContentData();
    getmdaIdaCoveragesList({ districtId: userDistrictId });
  }, []);

  //   useEffect(()=>{
  //     popup();
  //     getmdaIdaCoveragesList();
  // },[isOnline])

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

  async function popup() {
    if (!isOnline) {
      confirmAlert({
        title: 'You are offline now!',
        message: "Don't Refresh your page",
        buttons: [
          {
            label: 'ok',
            onClick: () => {},
          },
        ],
      });
    }
  }

  async function getmdaIdaCoveragesList(params) {
    const response = await MdaIdaCoveregareService.getAllMdaIdaCoverages(
      params
    );
    if (response) {
      setmdaIdaCoveragesList(response.data);
    }
    const offlineResponse =
      await mdaIdaCoveragesDraftServices.getListMdaIdaCoverages(
        props && props.userSessionId
      );
    if (offlineResponse) {
      setmdaIdaCoveragesOfflineListData(offlineResponse);
    }
    const countCoverageReportResponse =
      await mdaIdaCoveragesDraftServices.countMdaCoverageReport(
        props && props.userSessionId
      );
    setDraftCount(countCoverageReportResponse);
    if (countCoverageReportResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
  }

  const onMdaIdaCoveragesRemove = async (
    event: any,
    id: any,
    IdType: string
  ) => {
    event.persist();
    if (IdType === 'Id') {
      const response = await MdaIdaCoveregareService.deleteMdaIdaCoverages(id);
      console.log(response.data);
      getmdaIdaCoveragesList({ districtId: userDistrictId });
    } else {
      const offlineResponse =
        await mdaIdaCoveragesDraftServices.deleteMdaIdaCoverages(id);
      if (offlineResponse) {
        const step2Delete =
          await mdaIdaCoveragesDraftServices.deleteGetListMdaIdaRegular(id);
        const step3Delete =
          await mdaIdaCoveragesDraftServices.deleteGetListMdaIdaMopUp(id);
      }
      setmdaIdaCoveragesList(offlineResponse);
      getmdaIdaCoveragesList({ districtId: userDistrictId });
    }
  };

  const Delete = (event: any, id: any, IdType: string) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onMdaIdaCoveragesRemove(event, id, IdType);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const columns = [
    {
      name: 'Sr.No',
      selector: 'srNo',
      // grow: 0,
    },
    {
      name: 'District',
      selector: (row: any) =>
        row.district && row.district.districtName
          ? row.district.districtName
          : 'None',
    },
    {
      name: 'Taluka',
      selector: (row: any) =>
        row.taluka && row.taluka.talukaName ? row.taluka.talukaName : 'None',
    },
    {
      name: 'Facility',
      selector: (row: any) =>
        row.facility && row.facility.facilityName
          ? row.facility.facilityName
          : 'None',
    },

    {
      name: 'Village',
      selector: (row: any) =>
        row.village && row.village.villageName
          ? row.village.villageName
          : 'None',
      // grow: 0,
    },

    {
      name: 'Eligible Population For MDA/IDA',
      selector: (row: any) =>
        row && row.eligiblePopulation ? row.eligiblePopulation : 'None',
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
              onClick={() =>
                history.push(addDESheetName, {
                  id: row.id,
                  view: 'viewOnly',
                })
              }
            >
              <img src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={() => history.push(addDESheetName, { id: row.id })}
            >
              <img src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(e: any) => Delete(e, row.id, 'Id')}
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
              onClick={() =>
                history.push(addDESheetName, {
                  id: row.id,
                  view: 'viewOnly',
                })
              }
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
      name: 'Eligible Population For MDA/IDA',
      selector: (row: any) =>
        row && row.eligiblePopulation ? row.eligiblePopulation : 'None',
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
                  mdaIDACoveragesUUID: row.mdaIDACoveragesUUID,
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
                  mdaIDACoveragesUUID: row.mdaIDACoveragesUUID,
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
                Delete(e, row.mdaIDACoveragesUUID, 'UUID');
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
                  mdaIDACoveragesUUID: row.mdaIDACoveragesUUID,
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

  const handleSync = async () => {
    const syncStatus = await FormMdaIdaCoveragesSyncService.syncOfflineData(
      props && props.userSessionId
    );
    console.log('status', syncStatus);
    if (
      (syncStatus && syncStatus.data) ||
      (syncStatus && syncStatus.status === 200)
    ) {
      getmdaIdaCoveragesList({ districtId: userDistrictId });
    }
  };

  const AccordionComponent = (row) => {
    return <AccordionCoverageReport rowValues={row} />;
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
        {/* <Breadcrumb.Item href="">Pre-MDA</Breadcrumb.Item> */}
        {isOnline ? (
          <Breadcrumb.Item active>ONLINE</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active className='font-chng'>
          MDA activity
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='row'>
            <div className='col-md-6 col-12'>
              <h4 className='formtitlenew font-chng'>
                MDA & IDA Coverage Report
              </h4>
            </div>
            <div className='col-md-6 col-12 flexdiv'>
              <Button
                variant='secondary'
                className='mt-m font-chng mr10'
                style={{ backgroundColor: '#19D895', border: 'none' }}
                onClick={() => {
                  if (mdaIdaCoveragesOfflineListShow) {
                    setmdaIdaCoveragesOfflineListShow(false);
                  } else {
                    setmdaIdaCoveragesOfflineListShow(true);
                  }
                }}
              >
                {mdaIdaCoveragesOfflineListShow && <div>Server List</div>}

                {!mdaIdaCoveragesOfflineListShow && (
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
                onClick={() => history.push(addDESheetName)}
              >
                <img src={plusImg} className='pe-2' />
                Add New
              </Button>
            </div>
            {/* <div className="col-md-3 col-12 text-right">
              
            </div> */}
          </div>
          {!mdaIdaCoveragesOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={columns}
                data={mdaIdaCoveragesList}
                expandableRows={true}
                //expandOnRowClicked={true}
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
            </div>
          )}
          {mdaIdaCoveragesOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={offlineColumns}
                data={mdaIdaCoveragesOfflineListData}
                // expandableRows={true}
                // expandOnRowClicked={true}
                // expandableRowsComponent={<AccordionComponent/>}
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

export default ViewMDACoverageReport;

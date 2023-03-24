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
import moment from 'moment';
import 'react-confirm-alert/src/react-confirm-alert.css';
import EntomologicalLarvicidalService from '../../../services/FormEntomologicalLarvicidalService';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionEntomologicalLarvicidal from './AccordionEntomologicalLarvicidal';
import entomologicalDraftServices from '../../../draftServices/FormEntomologicalDraftservice';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormEntomologicalDraftSyncService from '../../../DraftSyncServices/FormEntomologicalDraftSyncService';

const ViewEntomologicalLarvicidal = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const [OfflineListShow, setOfflineListShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  let isOnline = window.navigator.onLine;
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  const [getOfflineData, setGetOfflineData] = useState([]);

  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthsText = [
    { month: 0, monthName: 'None' },
    { month: 1, monthName: 'JAN' },
    { month: 2, monthName: 'FEB' },
    { month: 3, monthName: 'MAR' },
    { month: 4, monthName: 'APR' },
    { month: 5, monthName: 'MAY' },
    { month: 6, monthName: 'JUN' },
    { month: 7, monthName: 'JUL' },
    { month: 8, monthName: 'AUG' },
    { month: 9, monthName: 'SEP' },
    { month: 10, monthName: 'OCT' },
    { month: 11, monthName: 'NOV' },
    { month: 12, monthName: 'DEC' },
  ];

  useEffect(() => {
    get_EntomologicalLarvicidal({ districtId: userDistrictId });
    getListContentData();
  }, []);
  const [getData, setGetdata] = useState([]);

  async function get_EntomologicalLarvicidal(params) {
    const response =
      await EntomologicalLarvicidalService.getEntomologicalLarvicidal(params);
    if (response) {
      console.log('verticalPosition content:: ', response.data);
      setGetdata(response.data);
    }
    const draftResponse =
      await entomologicalDraftServices.getListEntomological();
    console.log('draftResponse ', draftResponse);
    if (draftResponse) {
      setGetOfflineData(draftResponse);
    }
    const countEntomologicalResponse =
      await entomologicalDraftServices.countEntomological(
        props && props.userSessionId
      );
    setDraftCount(countEntomologicalResponse);
    if (countEntomologicalResponse > 0) {
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

  async function DeleteEntomologicalLarvicidal(id: number, IdType: string) {
    if (IdType === 'Id') {
      const response =
        await EntomologicalLarvicidalService.deleteEntomologicalLarvicidal(id);
      if (response.message == 'Deleted successfully') {
        get_EntomologicalLarvicidal({ districtId: userDistrictId });
        console.log('Delete News', response);
      }
    } else {
      const response = await entomologicalDraftServices.deleteEntomological(id);
      get_EntomologicalLarvicidal({ districtId: userDistrictId });
    }
  }

  const Delete = (event: any, id: number, IdType: string) => {
    confirmAlert({
      // title: 'Confirm to Delete',
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            DeleteEntomologicalLarvicidal(id, IdType);
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
    return <AccordionEntomologicalLarvicidal rowValues={row} />;
  };

  const columns = [
    {
      name: 'Sr.No',
      selector: 'srNo',
      grow: 0,
    },
    {
      name: 'Year',
      selector: 'year',
      grow: 0,
    },
    {
      name: 'Month',
      selector: (row: any) => {
        return monthsText.map((month: any, i: any) => {
          if (row.month === month.month) {
            return month.monthName;
          }
        });
      },
      grow: 0,
    },

    {
      name: 'District',
      selector: (row: any) =>
        row.district && row.district.districtName
          ? row.district.districtName
          : 'None',
    },
    {
      name: 'Name Of Unit',
      selector: (row: any) =>
        row.verticalControlUnit && row.verticalControlUnit.nameOfControlUnit
          ? row.verticalControlUnit.nameOfControlUnit
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

  const handleSync = async () => {
    const syncStatus = await FormEntomologicalDraftSyncService.syncDraftData(
      props && props.userSessionId
    );
    console.log('status', syncStatus);
    get_EntomologicalLarvicidal({ districtId: userDistrictId });
  };

  const offlineColumns = [
    {
      name: 'Sr.No',
      selector: 'srNo',
      grow: 0,
    },
    {
      name: 'Year',
      selector: 'year',
      grow: 0,
    },
    {
      name: 'Month',
      selector: (row: any) => {
        return monthsText.map((month: any, i: any) => {
          if (row.month === month.month) {
            return month.monthName;
          }
        });
      },
      grow: 0,
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
        if (row.talukaId === '0') {
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
        if (row.facilityId === '0') {
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
        if (row.villageId === '0') {
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
      button: true,
      cell: (row: any) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag='allowRowEvents' className='iec-btn'>
            <button
              className='btn tooltip-wrap'
              onClick={() =>
                history.push(addDESheetName, {
                  UUID: row.entomologicalUUID,
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
              onClick={() =>
                history.push(addDESheetName, { UUID: row.entomologicalUUID })
              }
            >
              <img src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(e: any) => Delete(e, row.entomologicalUUID, 'UUID')}
            >
              <img src={deleteIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>Delete</div>
              </div>
            </button>
          </div>
        ) : (
          <div data-tag='allowRowEvents' className='iec-btn'>
            <button
              className='btn tooltip-wrap'
              onClick={() =>
                history.push(addDESheetName, {
                  UUID: row.entomologicalUUID,
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

  const addForm = () => {
    history.push(addDESheetName);
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
          Entomological and Larvicidal
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='card-head'>
            <div className='row'>
              <div className='col-md-6 col-12'>
                <h4 className='formtitlenew font-chng'>
                  Entomological and Larvicidal
                </h4>
              </div>
              <div className='col-md-6 col-12 flexdiv'>
                <Button
                  variant='secondary'
                  className='mt-m font-chng mr10'
                  style={{ backgroundColor: '#19D895', border: 'none' }}
                  onClick={() => {
                    if (OfflineListShow) {
                      setOfflineListShow(false);
                    } else {
                      setOfflineListShow(true);
                    }
                  }}
                >
                  {OfflineListShow && <div>Server List</div>}

                  {!OfflineListShow && (
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
          <div className='post-tablenew font-chng cus-table ent-table'>
            {!OfflineListShow ? (
              <DataTable
                columns={columns}
                data={getData}
                expandableRows={true}
                onRowExpandToggled={(expand, row) => {
                  console.log(expand);
                  console.log(row);
                }}
                //expandOnRowClicked={false}
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

export default ViewEntomologicalLarvicidal;

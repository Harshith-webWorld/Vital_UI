import React, { useEffect, useState } from 'react';
import { useUserDistrictId } from '../../../customHooks/useUserDistrictId';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import history from '../../../../helpers/history';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import StaffPositionService from '../../../services/FormStaffPosition';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionStaffPostion from './accordionStaffPosition';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import staffPositionDraftServices from '../../../draftServices/FormStaffPositionDraftServices';
import FormStaffPositionDraftSyncService from '../../../DraftSyncServices/FormStaffPositionDraftSyncServices';

const ViewStaffPosition = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  let isOnline = window.navigator.onLine;

  const [staffUnitOfflineListShow, setStaffUnitOfflineListShow] =
    useState(false);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [getOfflineData, setGetOfflineData] = useState([]);
  const [districtList, setdistrictList] = useState([]);
  const [cadreOption, setCadreOption] = useState([]);
  const [catagroyOption, setCatagroyOption] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [verticalControlUnitIdValues, setverticalControlUnitIdValues] =
    useState([]);
  const [getData, setGetData] = useState([]);

  useEffect(() => {
    getStaffPosition({ districtId: userDistrictId });
    getstaffDraftListColumnData();
  }, []);

  async function getStaffPosition(params) {
    const response = await StaffPositionService.getStaffPostion(params);
    if (response) {
      // console.log("getStaffPosition:: ",response.data);
      setGetData(response.data);
    }
    const draftResponse =
      await staffPositionDraftServices.getAllStaffPosUnitStatus();
    if (draftResponse) {
      setGetOfflineData(draftResponse);
    }
    const countCoverageReportResponse =
      await staffPositionDraftServices.countStaffPosunitStatus(
        props && props.userSessionId
      );
    setDraftCount(countCoverageReportResponse);
    if (countCoverageReportResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
  }

  async function getstaffDraftListColumnData() {
    const districtId: any = await DexieOfflineDataBase.getDistricts();
    if (districtId && districtId.length > 0) {
      setdistrictList(districtId);
    }
    const CatagroyOption: any = await DexieOfflineDataBase.getCatagoryOption();
    if (CatagroyOption && CatagroyOption.length > 0) {
      setCatagroyOption(CatagroyOption);
    }
    const verticalControlUnitResponse =
      await DexieOfflineDataBase.getAllVertiocalControlUnitsOffline();
    if (verticalControlUnitResponse) {
      setverticalControlUnitIdValues(verticalControlUnitResponse);
    }
  }

  async function deleteStaffPosition(event: any, id: any, IdType: string) {
    event.persist();
    if (IdType === 'Id') {
      const response = await StaffPositionService.deleteStaffPosition(id);
    } else {
      const response =
        await staffPositionDraftServices.deleteStaffPosUnitStatus(id);
    }
    getStaffPosition({ districtId: userDistrictId });
  }

  const Delete = (event: any, id: any, IdType: string) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteStaffPosition(event, id, IdType);
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
    return <AccordionStaffPostion rowValues={row} />;
  };

  const column = [
    {
      name: 'Sr.No',
      selector: 'srNo',
    },

    {
      name: 'district ',
      selector: (row: any) =>
        row && row.district && row.district.districtName
          ? row.district.districtName
          : 'None',
    },

    {
      name: 'Name of Unit',
      selector: (row: any) =>
        row.verticalControlUnit && row.verticalControlUnit.nameOfControlUnit
          ? row.verticalControlUnit.nameOfControlUnit
          : 'None',
    },
    {
      name: 'Cadre',
      selector: (row: any) =>
        row.Cadre2 && row.Cadre2.categoryOptionName
          ? row.Cadre2.categoryOptionName
          : 'None',
    },

    {
      name: 'Sanctioned',
      selector: 'sanctioned',
    },
    {
      name: 'Filled',
      selector: 'filled',
    },
    {
      name: 'Vacant',
      selector: 'vacant',
    },

    {
      name: 'Actions',
      selector: 'Actions',
      cell: (row: any) =>
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
              <img src={editIcon} alt='' />
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

  const staffUnitOfflineDraftColumn = [
    {
      name: 'Sr.No',
      selector: 'srNo',
    },
    {
      name: 'District',
      selector: (row: any) => {
        if (row.districtId === 0) {
          return 'None';
        } else {
          return districtList.map((district: any, i: any) => {
            if (row.districtId === district.id) {
              return district.districtName;
            }
          });
        }
      },
    },
    {
      name: 'Name Of Unit',
      selector: (row: any) => {
        if (row.nameOfUnit === 0 || row.nameOfUnit === '0') {
          return 'None';
        } else {
          if (verticalControlUnitIdValues.length > 0) {
            const find: any = verticalControlUnitIdValues.find(
              ({ id }) => id === row.nameOfUnit
            );
            return find && find.nameOfControlUnit;
          } else {
            return 'empty';
          }
        }
      },
    },
    {
      name: 'Cadre',
      selector: (row: any) => {
        if (row.cadre === 0) {
          return 'None';
        } else {
          return catagroyOption.map((item: any) => {
            if (row.cadre === item.id) {
              return item.categoryOptionName;
            }
          });
        }
      },
    },
    /*  selector: (row: any) => (row.Cadre2 && row.Cadre2.categoryOptionName) ? row.Cadre2.categoryOptionName : '', */
    {
      name: 'Sanctioned',
      selector: 'sanctioned',
    },
    {
      name: 'Filled',
      selector: 'filled',
    },
    {
      name: 'Vacant',
      selector: 'vacant',
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
                  staffPosUnitStatusUUID: row.staffPosUnitStatusUUID,
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
                history.push(addDESheetName, {
                  staffPosUnitStatusUUID: row.staffPosUnitStatusUUID,
                })
              }
            >
              <img src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(e: any) =>
                Delete(e, row.staffPosUnitStatusUUID, 'UUID')
              }
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
                  staffPosUnitStatusUUID: row.staffPosUnitStatusUUID,
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

  const handleSync = async () => {
    const syncStatus = await FormStaffPositionDraftSyncService.syncOfflineData(
      props && props.userSessionId
    );
    console.log('status', syncStatus);
    getStaffPosition({ districtId: userDistrictId });
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
          Staff position Vertical Unit
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='card-head'>
            <div className='row'>
              <div className='col-md-6 col-12'>
                <h4 className='formtitlenew font-chng'>
                  Staff Position Vertical Unit
                </h4>
              </div>

              <div className='col-md-6 col-12 flexdiv'>
                <Button
                  variant='secondary'
                  className='mt-m font-chng mr10'
                  style={{ backgroundColor: '#19D895', border: 'none' }}
                  onClick={() => {
                    if (staffUnitOfflineListShow) {
                      setStaffUnitOfflineListShow(false);
                    } else {
                      setStaffUnitOfflineListShow(true);
                    }
                  }}
                >
                  {staffUnitOfflineListShow && <div>Server List</div>}

                  {!staffUnitOfflineListShow && (
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
                  style={{ backgroundColor: '#19D895', border: 'none' }}
                >
                  <img src={plusImg} className='pe-2' alt='' />
                  Add New
                </Button>
              </div>

              {/* <div className="col-md-3 col-12 text-right">
                
              </div> */}
            </div>
          </div>

          {!staffUnitOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={column}
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
          {staffUnitOfflineListShow && (
            <div className='post-tablenew font-chng cus-table'>
              <DataTable
                columns={staffUnitOfflineDraftColumn}
                data={getOfflineData}
                expandableRows={false}
                onRowExpandToggled={(expand, row) => {
                  console.log(expand, row);
                }}
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
export default ViewStaffPosition;

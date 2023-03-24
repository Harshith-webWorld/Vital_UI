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
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import HydrocelectomyOperationsService from '../../../services/FormHydrocelectomyOperationsService';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionHydrocelectomyOperations from './AccordionHydrocelectomyOperations';
import HydrocelectomyOperationsDraftServices from '../../../draftServices/FormHydrocelectomyOperationsDraftService';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import HydrocelectomyOperationskDraftSyncService from '../../../DraftSyncServices/FormHydrocelectomyOperationsDraftSyncServices';

const ViewHydrocelectomyOperations = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;

  const [OfflineListShow, setOfflineListShow] = useState(false);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  let isOnline = window.navigator.onLine;
  const [getOfflineData, setGetOfflineData] = useState([]);
  const [districtIdValues, setdistrictIdValues] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [catagoryOption, setCatagoryOption] = useState([]);
  const [verticalControlUnitIdValues, setverticalControlUnitIdValues] =
    useState([]);

  useEffect(() => {
    getHydrocelectomyOperations({ districtId: userDistrictId });
    // getListContentData();
  }, []);

  const [getData, setGetdata] = useState([]);

  async function getHydrocelectomyOperations(params) {
    const response =
      await HydrocelectomyOperationsService.getHydrocelectomyOperations(params);
    if (response) {
      setGetdata(response.data);
      console.log('respy', response.data);
    }
    const draftResponse =
      await HydrocelectomyOperationsDraftServices.getListHydrocelectomyOperations();
    if (draftResponse) {
      setGetOfflineData(draftResponse);
    }
    const countHydrocelectomyOperationsResponse =
      await HydrocelectomyOperationsDraftServices.countHydrocelectomyOperations(
        props && props.userSessionId
      );
    setDraftCount(countHydrocelectomyOperationsResponse);
    if (countHydrocelectomyOperationsResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
  }

  // async function getListContentData() {
  //   const districtIdOffline: any = await DexieOfflineDataBase.getDistricts();
  //   if (districtIdOffline) {
  //     setdistrictIdValues(districtIdOffline);
  //   }
  //   const CatagoryOption = await DexieOfflineDataBase.getCatagoryOption();
  //   if (CatagoryOption) {
  //     setCatagoryOption(CatagoryOption);
  //   }
  //   const verticalControlUnitResponse = await DexieOfflineDataBase.getAllVertiocalControlUnitsOffline();
  //   if (verticalControlUnitResponse) {
  //     setverticalControlUnitIdValues(verticalControlUnitResponse);
  //   }
  // }

  async function deleteHydrocelectomyOperations(id: number, IdType: string) {
    if (IdType === 'Id') {
      const response =
        await HydrocelectomyOperationsService.deleteHydrocelectomyOperations(
          id
        );
      if (response.message == 'Deleted successfully') {
        getHydrocelectomyOperations({ districtId: userDistrictId });
        console.log('Delete News', response);
      }
    } else {
      const response =
        await HydrocelectomyOperationsDraftServices.deleteHydrocelectomyOperations(
          id
        );
      getHydrocelectomyOperations({ districtId: userDistrictId });
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
            deleteHydrocelectomyOperations(id, IdType);
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
    },
    {
      name: 'Year',
      selector: 'year',
    },
    {
      name: 'District',
      selector: (row: any) =>
        row.district && row.district.districtName
          ? row.district && row.district.districtName
          : 'Nil',
    },
    {
      name: 'Jan',
      selector: 'jan',
    },
    {
      name: 'Feb',
      selector: 'feb',
    },
    {
      name: 'Mar',
      selector: 'mar',
    },
    {
      name: 'Apr',
      selector: 'apr',
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
      grow: 0,
    },
    {
      name: 'Year',
      selector: 'year',
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
      name: 'Jan',
      selector: 'jan',
    },
    {
      name: 'Feb',
      selector: 'feb',
    },
    {
      name: 'Mar',
      selector: 'mar',
    },
    {
      name: 'Apr',
      selector: 'apr',
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
                  UUID: row.HydrocelectomyOperationsUUID,
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
                  UUID: row.HydrocelectomyOperationsUUID,
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
                Delete(e, row.HydrocelectomyOperationsUUID, 'UUID')
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
                  UUID: row.HydrocelectomyOperationsUUID,
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

  const AccordionComponent = (row) => {
    return <AccordionHydrocelectomyOperations rowValues={row} />;
  };

  const handleSync = async () => {
    const syncStatus =
      await HydrocelectomyOperationskDraftSyncService.syncDraftData(
        props && props.userSessionId
      );
    console.log('status', syncStatus);
    getHydrocelectomyOperations({ districtId: userDistrictId });
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
          {' '}
          Hydrocelectomy Operations
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='card-head'>
            <div className='row'>
              <div className='col-md-6 col-12'>
                <h4 className='formtitlenew font-chng'>
                  Hydrocelectomy Operations
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
            </div>
          </div>
          <div className='post-tablenew font-chng cus-table'>
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
            ) : (
              <div>
                <DataTable
                  columns={offlineColumns}
                  data={getOfflineData}
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
    </div>
  );
};

export default ViewHydrocelectomyOperations;

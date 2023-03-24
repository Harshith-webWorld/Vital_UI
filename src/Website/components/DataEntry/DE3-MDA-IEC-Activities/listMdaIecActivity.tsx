import React, { useState, useEffect } from 'react';
import { useUserDistrictId } from '../../../customHooks/useUserDistrictId';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import MDAActivityServices from '../../../services/FormMdaIecActivityService';
import history from '../../../../helpers/history';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AccordionMdaleActivity from './AccordionMdalecActivity';
import mdaIecActivityDraftServices from '../../../draftServices/FormMdaIecActivityDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormMdaIecActivityDraftSyncService from '../../../DraftSyncServices/FormMdaIecActivityDraftSyncServices';

const ListMDAIECActivity = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const [mdaList, setMdaList] = useState([]);
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  let isOnline = window.navigator.onLine;
  const [mdaIecActivityOfflineListData, setmdaIecActivityOfflineListData] =
    useState([]);
  const [mdaIecActivityOfflineListShow, setmdaIecActivityOfflineListShow] =
    useState(false);
  const [districtList, setdistrictList] = useState([]);
  const [materialActivityOption, setmaterialActivityOption] = useState([]);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    getMDAList({ districtId: userDistrictId });
    getMDADraftListColumnData();
  }, []);

  async function getMDAList(params) {
    const response = await MDAActivityServices.listMDAActivity(params);
    if (response) {
      setMdaList(response && response.data);
    }
    const draftResponse =
      await mdaIecActivityDraftServices.getAllMdaIecActivity(
        props && props.userSessionId
      );
    if (draftResponse) {
      setmdaIecActivityOfflineListData(draftResponse);
    }
    const draftCountResponse =
      await mdaIecActivityDraftServices.countMdaIecActivity(
        props && props.userSessionId
      );
    setDraftCount(draftCountResponse);
    if (draftCountResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
  }

  async function getMDADraftListColumnData() {
    const districtId: any = await DexieOfflineDataBase.getDistricts();
    if (districtId && districtId.length > 0) {
      setdistrictList(districtId);
    }
    const response: any = await DexieOfflineDataBase.getCatagoryOption();
    if (response) {
      setmaterialActivityOption(response);
    }
  }

  const onActivityRemove = async (event: any, id: any, IdType: string) => {
    event.persist();
    if (IdType === 'Id') {
      const response = await MDAActivityServices.deleteMDAActivity(id);
      console.log(response.data);
    } else {
      const response = await mdaIecActivityDraftServices.deleteMdaIecActivity(
        id
      );
    }
    getMDAList({ districtId: userDistrictId });
  };

  const Delete = (event: any, id: any, IdType: string) => {
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

  const AccordionComponent = (row) => {
    return <AccordionMdaleActivity rowValues={row} />;
  };

  const handleSync = async () => {
    const syncStatus = await FormMdaIecActivityDraftSyncService.syncDraftData(
      props && props.userSessionId
    );
    console.log('status', syncStatus);
    getMDAList({ districtId: userDistrictId });
  };

  const columns = [
    {
      name: 'Sr.No',
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
      name: 'Materials / Activities',
      selector: (row: any) =>
        row && row.MaterialActivity && row.MaterialActivity.categoryOptionName
          ? row.MaterialActivity.categoryOptionName
          : 'None',
    },
    {
      name: 'No of Materials / Activities',
      selector: (row: any) =>
        row && row.materialActivityNo ? row.materialActivityNo : '0',
    },
    {
      name: 'Fund Allocated',
      selector: (row: any) =>
        row && row.fundAllocatedWithDate ? row.fundAllocatedWithDate : '0.00',
    },
    {
      name: 'Fund Utilised',
      selector: (row: any) =>
        row && row.fundUtilisedWithDate ? row.fundUtilisedWithDate : '0.00',
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
              onClick={(e: any) => Delete(e, row.id, 'Id')}
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

  const mdaIecActivityDraftColumn = [
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
      name: 'Materials / Activities',
      selector: (row: any) => {
        if (row.materialActivity === 0) {
          return 'None';
        } else {
          return materialActivityOption.map((materialActivity: any, i: any) => {
            if (materialActivity && materialActivity.categoryCode === 1008) {
              if (row.materialActivity === materialActivity.id) {
                return materialActivity.categoryOptionName;
              }
            }
          });
        }
      },
    },
    {
      name: 'No of Materials / Activities',
      selector: (row: any) =>
        row && row.materialActivityNo ? row.materialActivityNo : '0',
    },
    {
      name: 'Fund Allocated',
      selector: (row: any) =>
        row && row.fundAllocatedWithDate ? row.fundAllocatedWithDate : '0.00',
    },
    {
      name: 'Fund Utilised',
      selector: (row: any) =>
        row && row.fundUtilisedWithDate ? row.fundUtilisedWithDate : '0.00',
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
                  UUID: row.mdaIecActivityUUID,
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
                history.push(addDESheetName, { UUID: row.mdaIecActivityUUID })
              }
            >
              <img src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(e: any) => Delete(e, row.mdaIecActivityUUID, 'UUID')}
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
                  UUID: row.mdaIecActivityUUID,
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

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/WebDashboard');
          }}
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
        <Breadcrumb.Item active>
          MDA Activity and Fund Utilization
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className='card'>
        <div className='row'>
          <div className='col-md-6 col-12'>
            <h4 className='formtitlenew font-chng'>
              MDA Activity and Fund Utilization
            </h4>
          </div>
          <div className='col-md-6 col-12 flexdiv'>
            <Button
              variant='secondary'
              className='mt-m font-chng mr10 btn btn-secondary'
              style={{ backgroundColor: '#19D895', border: 'none' }}
              onClick={() => {
                if (mdaIecActivityOfflineListShow) {
                  setmdaIecActivityOfflineListShow(false);
                } else {
                  setmdaIecActivityOfflineListShow(true);
                }
              }}
            >
              {mdaIecActivityOfflineListShow && <div>Server List</div>}

              {!mdaIecActivityOfflineListShow && (
                <div>
                  Draft List <b>{draftCount > 0 ? `(${draftCount})` : null}</b>
                </div>
              )}
            </Button>
            <Button
              variant='secondary'
              className='mt-m font-chng mr10 btn btn-secondary'
              onClick={() => history.push(addDESheetName)}
            >
              <img src={plusImg} className='pe-2' />
              Add New
            </Button>
          </div>
          {/* <div className="col-md-3 col-12 text-right">
            
          </div> */}
        </div>
        <div className='post-tablenew font-chng cus-table'>
          {!mdaIecActivityOfflineListShow ? (
            <DataTable
              columns={columns}
              data={mdaList}
              expandableRows={true}
              onRowExpandToggled={(expand, row) => {
                console.log(expand);
                console.log(row);
              }}
              highlightOnHover
              pagination
              paginationPerPage={10}
              //expandOnRowClicked={false}
              expandableRowsComponent={<AccordionComponent />}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponentOptions={{
                rowsPerPageText: 'Records per page:',
                rangeSeparatorText: 'out of',
              }}
            />
          ) : (
            <div>
              <DataTable
                columns={mdaIecActivityDraftColumn}
                data={mdaIecActivityOfflineListData}
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
  );
};

export default ListMDAIECActivity;

import React, { useState, useEffect } from 'react';
import { useUserDistrictId } from '../../../customHooks/useUserDistrictId';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import MappingOfOTService from '../../../services/FormMappingOfOTService';
import history from '../../../../helpers/history';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import { confirmAlert } from 'react-confirm-alert';
import moment from 'moment';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionMappingOfOT from './AccordionMappingOfOT';
import mappingOfOperationTheatersDraftServices from '../../../draftServices/FormMappingOfOTDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormMappingofOTDraftSyncService from '../../../DraftSyncServices/FormMappingOfOTDraftSyncServices';

const ListMappingOfOperationTheaters = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const [mappingOfOTList, setMappingOfOTList] = useState([]);
  const [mappingOfOTDraftList, setMappingOfOTDraftList] = useState([]);
  const [mappingOfOTDraftListShow, setMappingOfOTDraftListShow] =
    useState(false);
  let [districtValues, setDistrictValues] = useState([]);
  let [facilityValues, setFacilitValues] = useState([]);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  const months = [
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
  let isOnline = window.navigator.onLine;

  useEffect(() => {
    getMappingOfOTList({ districtId: userDistrictId });
  }, []);

  async function getMappingOfOTList(params) {
    const response = await MappingOfOTService.getAllMappingOfOT(params);
    if (response) {
      setMappingOfOTList(response.data);
    }
    const Draftresponse =
      await mappingOfOperationTheatersDraftServices.getAllMappingOfOperationTheaters(
        props && props.userSessionId
      );
    if (Draftresponse) {
      setMappingOfOTDraftList(Draftresponse);
    }
    const districtArr = await DexieOfflineDataBase.getDistricts();
    if (districtArr) {
      setDistrictValues(districtArr);
    }
    const facilityArr = await DexieOfflineDataBase.getAllFacility();
    if (facilityArr) {
      setFacilitValues(facilityArr);
    }

    const draftCountResponse =
      await mappingOfOperationTheatersDraftServices.countMappingOfOperationTheaters(
        props && props.userSessionId
      );
    setDraftCount(draftCountResponse);
    if (draftCountResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
  }

  const onMappingOfOTRemove = async (event: any, id: any, idType: any) => {
    event.persist();
    if (idType === 'Id') {
      const response = await MappingOfOTService.deleteMappingOfOT(id);
      console.log(response.data);
      getMappingOfOTList({ districtId: userDistrictId });
    } else if (idType === 'UUID') {
      const response =
        await mappingOfOperationTheatersDraftServices.deleteMappingOfOperationTheaters(
          id
        );
      console.log(response.data);
      getMappingOfOTList({ districtId: userDistrictId });
    }
  };

  const Delete = (event: any, id: any, idType: any) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onMappingOfOTRemove(event, id, idType);
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
    const syncStatus = await FormMappingofOTDraftSyncService.syncDraftData(
      props && props.userSessionId
    );
    console.log('status', syncStatus);
    getMappingOfOTList({ districtId: userDistrictId });
  };

  const ExpandedComponent = (row) => {
    return <AccordionMappingOfOT rowValues={row} />;
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
      name: 'Month',
      selector: (row: any) => {
        return months.map((month: any, i: any) => {
          if (row.month === month.month) {
            return month.monthName;
          }
        });
      },
    },
    {
      name: 'District',
      selector: (row: any) =>
        row.district && row.district.districtName
          ? row.district.districtName
          : 'None',
    },
    {
      name: 'Name Of The Institution / OT',
      selector: 'nameOfInstitutionOT',
    },
    {
      name: "Name Of PHC's Attached",
      selector: (row: any) =>
        row.mappingOfOTPhcAttachedToTheaters.length
          ? row.mappingOfOTPhcAttachedToTheaters
              .map((item) => item.facility.facilityName)
              .join(',')
          : 'None',
    },

    {
      name: 'Actions',
      button: true,
      cell: (row: any) =>
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
              onClick={(e: any) => Delete(e, row.id, 'Id')}
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

  const Draftcolumns = [
    {
      name: 'Sr.No',
      selector: 'srNo',
    },
    {
      name: 'Year',
      selector: 'year',
    },
    {
      name: 'Month',
      selector: (row: any) => {
        return months.map((month: any, i: any) => {
          if (row.month === month.month) {
            return month.monthName;
          }
        });
      },
    },
    {
      name: 'District',
      selector: (row: any) => {
        if (row.districtId === 0) {
          return 'None';
        } else {
          if (districtValues.length > 0) {
            const find: any = districtValues.find(
              ({ id }) => id === row.districtId
            );
            return find && find.districtName;
          } else {
            return 'empty';
          }
        }
      },
    },
    {
      name: 'Name Of The Institution / OT',
      selector: 'nameOfInstitutionOT',
    },
    {
      name: "Name Of PHC's Attached",
      selector: (row: any) => {
        if (row.nameOfPHCAttachedToOT === 0) {
          return 'None';
        } else {
          if (facilityValues.length > 0) {
            const find: any = facilityValues.find(
              ({ id }) => id === row.nameOfPHCAttachedToOT
            );
            return find && find.facilityName;
          } else {
            return 'empty';
          }
        }
      },
    },

    {
      name: 'Actions',
      button: true,
      cell: (row: any) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag='allowRowEvents' className='action-grp'>
            <button
              className='btn tooltip-wrap'
              onClick={() =>
                history.push(addDESheetName, {
                  UUID: row.mappingOfOperationTheatersUUID,
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
                  UUID: row.mappingOfOperationTheatersUUID,
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
                Delete(e, row.mappingOfOperationTheatersUUID, 'UUID')
              }
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
                  UUID: row.mappingOfOperationTheatersUUID,
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
          Mapping of Operation Theaters
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className='card'>
        <div className='card-head'>
          <div className='row'>
            <div className='col-md-6'>
              <h4 className='formtitlenew font-chng'>
                Mapping of Operation Theaters
              </h4>
            </div>
            <div className='col-md-6 col-12 flexdiv'>
              <Button
                variant='secondary'
                className='mt-m font-chng mr10'
                style={{ backgroundColor: '#19D895', border: 'none' }}
                onClick={() => {
                  if (mappingOfOTDraftListShow) {
                    setMappingOfOTDraftListShow(false);
                  } else {
                    setMappingOfOTDraftListShow(true);
                  }
                }}
              >
                {mappingOfOTDraftListShow && <div>Server List</div>}

                {!mappingOfOTDraftListShow && (
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
                <img src={plusImg} className='pe-2' />
                Add New
              </Button>
            </div>
            <div className='col-md-3 col-12 text-right'></div>
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          {!mappingOfOTDraftListShow ? (
            <DataTable
              columns={columns}
              data={mappingOfOTList}
              expandableRows={true}
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
                columns={Draftcolumns}
                data={mappingOfOTDraftList}
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

export default ListMappingOfOperationTheaters;

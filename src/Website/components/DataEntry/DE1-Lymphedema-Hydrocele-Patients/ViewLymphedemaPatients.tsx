import React, { useMemo, useState } from 'react';
import {useSelector} from 'react-redux';
import {useUserDistrictId} from '../../../customHooks/useUserDistrictId'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import history from '../../../../helpers/history';
import LymphedemaPatientInfoService from '../../../services/FormLymphedemaService';
import { confirmAlert } from 'react-confirm-alert';
import AccordionLymphedamaLineList from './AccordionLymphedamaLineList';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import lymphedemaLineListDraftServices from '../../../draftServices/FormLymphdemaHydroceleDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormLymphedemaHydroceleSyncService from '../../../DraftSyncServices/FormLymphdemaHydroceleSyncServices';
import Pagination from '../../../utils/Pagination';
import LymphedemaPatientsFilter from './LymphedemaPatientsFilter';

const ViewLymphedemaPatients = (props: any) => {
  let PageSize = 10;
  const userDistrictId = useUserDistrictId() || '';
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const addDESheetName: any = props && props.addDESheetName;
  //console.log(addDESheetName, 'addDESheetNameaddDESheetName');
  const userRole: any = props && props.userRole;
  let isOnline = window.navigator.onLine;
  const [lymphedemaLineListDraftListData, setlymphedemaLineListDraftListData] =
    useState([]);
  const [lymphedemaLineListDraftListShow, setlymphedemaLineListDraftListShow] =
    useState(false);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  const [filterValues, setFilterValues] = useState({});

  React.useEffect(() => {
    getLymphedemaList({districtId: userDistrictId});
  }, []);

  const ExpandedComponent = (row) => {
    return <AccordionLymphedamaLineList rowValues={row} />;
  };
  const columns = [
    {
      name: 'Patient ID',
      selector: 'patientId',
      grow: 1.5,
      style: {
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '20px',
        color: '#000000',
      },
    },
    {
      name: 'Name',
      selector: 'nameOfPatient',
      grow: 1.5,
    },
    {
      name: 'Disease Type',
      selector: 'diseaseType',
    },
    {
      name: 'District',
      selector: (row: any) =>
        row.district && row.district ? row.district.districtName : 'None',
    },
    {
      name: 'Facility',
      selector: (row: any) =>
        row.facility && row.facility.facilityName
          ? row.facility.facilityName
          : 'None',
    },
    {
      name: 'Follow Ups',
      selector: 'followUps',
      grow: 1.5,
      cell: (row) => {
        return (
          <div>
            <button 
              className="btn-link"
              onClick={() => history.push(addDESheetName, { id: row.id, goToStep: 3 })}
            >
              Filaria
            </button>|
            <button 
              className="btn-link"
              onClick={() => history.push(addDESheetName, { id: row.id, goToStep: 4 })}
            >
              Hydrocele
            </button>
          </div>
        )
      }
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
              }>
              <img alt='' src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={() => history.push(addDESheetName, { id: row.id })}>
              <img alt='' src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(event) => Delete(event, row.id, 'Id')}>
              <img alt='' src={deleteIcon} />
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
                history.push(addDESheetName, {
                  id: row.id,
                  view: 'viewOnly',
                })
              }>
              <img alt='' src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
          </div>
        ),
    },
  ];

  const DraftColumns = [
    {
      name: 'Patient ID',
      selector: 'patientId',
      grow: 1.5,
      style: {
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '20px',
        color: '#000000',
      },
    },
    {
      name: 'Name',
      selector: 'nameOfPatient',
      grow: 1.5,
    },
    {
      name: 'Mobile ',
      selector: 'patientMobileNumber',
      grow: 1,
    },
    {
      name: 'Disease Type',
      selector: 'diseaseType',
    },
    {
      name: 'District',
      selector: (row: any) => {
        if (row.districtId === 0) {
          return 'None';
        } else {
          if (districtIdValues.length > 0) {
            const find: any = districtIdValues.find(
              ({ id }) => id === row.districtId,
            );
            return find && find.districtName;
          } else {
            return 'empty';
          }
        }
      },
    },
    {
      name: 'Facility',
      selector: (row: any) => {
        if (row.facilityId === 0) {
          return 'None';
        } else {
          if (facilityIdValues.length > 0) {
            const find: any = facilityIdValues.find(
              ({ id }) => id === row.facilityId,
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
      selector: 'Actions',
      cell: (row) =>
        !(userRole && userRole.roleName === USER_ROLE_REPORT_REVIEW) ? (
          <div data-tag='allowRowEvents' className='action-grp'>
            <button
              className='btn tooltip-wrap'
              onClick={() =>
                history.push(addDESheetName, {
                  UUID: row.lymphedemaLineListUUID,
                  view: 'viewOnly',
                })
              }>
              <img alt='' src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={() =>
                history.push(addDESheetName, {
                  UUID: row.lymphedemaLineListUUID,
                })
              }>
              <img alt='' src={editIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>Edit</div>
              </div>
            </button>
            <button
              className='btn tooltip-wrap'
              onClick={(event) =>
                Delete(event, row.lymphedemaLineListUUID, 'UUID')
              }>
              <img alt='' src={deleteIcon} />
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
                history.push(addDESheetName, {
                  UUID: row.lymphedemaLineListUUID,
                  view: 'viewOnly',
                })
              }>
              <img alt='' src={viewIcon} />
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
  const [getData, setGetdata] = useState([]);
  async function getLymphedemaList(params) {
    const response =
      await LymphedemaPatientInfoService.getLymphedemaPatientInformation(params);
    if (response) {
      if(response.data){
        setGetdata(response.data);
      }
      else{
        setGetdata([]);
      }
    }
    const draftCountResponse: any =
      await lymphedemaLineListDraftServices.countLymphedemaLineList(
        props && props.userSessionId,
      );
    setDraftCount(draftCountResponse);
    if (draftCountResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
    const draftResponse =
      await lymphedemaLineListDraftServices.getListLymphedemaLineList(
        props && props.userSessionId,
      );
    if (draftResponse) {
      setlymphedemaLineListDraftListData(draftResponse);
    }
    const districtIdOffline = await DexieOfflineDataBase.getDistricts();
    if (districtIdOffline) {
      setdistrictIdValues(districtIdOffline);
    }
    const facilityIdOffline = await DexieOfflineDataBase.getAllFacility();
    if (facilityIdOffline) {
      setfacilityIdValues(facilityIdOffline);
    }
  }
  async function deleteLymphedema(id: number, idType) {
    if (idType === 'Id') {
      const response =
        await LymphedemaPatientInfoService.deleteLymphedemaPatientInformation(
          id,
        );
      if (response) {
        getLymphedemaList(filterValues);
      }
    } else if (idType === 'UUID') {
      const step1Delete =
        await lymphedemaLineListDraftServices.deleteLymphedemaLineList(id);
      if (step1Delete) {
        getLymphedemaList(filterValues);
        const step2Delete =
          await lymphedemaLineListDraftServices.deleteListLymphedemaLineListSurvey(
            id,
          );
        const step3Delete =
          await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsLF(
            id,
          );
        const step4Delete =
          await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsHF(
            id,
          );
      }
    }
  }

  const handleSync = async () => {
    const syncStatus = await FormLymphedemaHydroceleSyncService.syncOfflineData(
      props && props.userSessionId,
    );
    if (
      (syncStatus && syncStatus.data) ||
      (syncStatus && syncStatus.status === 200)
    ) {
      getLymphedemaList({districtId: userDistrictId});
    }
  };

  const Delete = (event: any, id: number, idType) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to Delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteLymphedema(id, idType);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  const CustomPagination = (getData) => {
    return (
      <Pagination
        className='pagination-bar'
        currentPage={currentPage}
        totalCount={getData.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    );
  };
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = currentPage + PageSize;
    console.log("currentTableData", getData, getData.slice(firstPageIndex, lastPageIndex))
    return getData.slice(firstPageIndex, lastPageIndex);
  }, [PageSize, currentPage, getData]);

  const currentlympLineListDraftListData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = currentPage + PageSize;
    return lymphedemaLineListDraftListData.slice(firstPageIndex, lastPageIndex);
  }, [PageSize, currentPage, lymphedemaLineListDraftListData]);

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item className='font-chng' onClick={() => {history.push("/WebDashboard")}}>
          Data Entry{' '}
        </Breadcrumb.Item>
        {/* {isOnline ? (
          <Breadcrumb.Item active>ONLINE</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
        )} */}
        <Breadcrumb.Item active className='font-chng'>
          Lymphedema/Hydrocele Patients
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='row'>
            <div className='col-md-6'>
              {/* <h4 className='form-title font-chng'>
                Lymphedema/Hydrocele Patients
              </h4> */}
            </div>
            <div className='col-md-6 col-12 flexdivmenu '>
              <Button
                variant='secondary'
                className='mt-m font-chng mr10'
                style={{ backgroundColor: '#19D895', border: 'none' }}
                onClick={() => {
                  if (lymphedemaLineListDraftListShow) {
                    setlymphedemaLineListDraftListShow(false);
                  } else {
                    setlymphedemaLineListDraftListShow(true);
                  }
                }}>
                {lymphedemaLineListDraftListShow && <div>Server List</div>}

                {!lymphedemaLineListDraftListShow && (
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
                onClick={addForm}>
                <img src={plusImg} alt='' className='pe-2' />
                Add New
              </Button>
              <LymphedemaPatientsFilter
                getLymphedemaList={getLymphedemaList}
                setFilterValues={setFilterValues}
              />
            </div>
          </div>
          <div className='post-tablenew font-chng cus-table'>
            {!lymphedemaLineListDraftListShow ? (
              <DataTable
                columns={columns}
                data={getData}
                expandableRows={true}
                onRowExpandToggled={(expand, row) => {}}
                //expandOnRowClicked={false}
                expandableRowsComponent={<ExpandedComponent />}
                highlightOnHover
                pagination
                paginationPerPage={PageSize}
                paginationRowsPerPageOptions={[10, 25, 50]}
                paginationComponentOptions={{
                  rowsPerPageText: 'Records per page:',
                  rangeSeparatorText: 'out of',
                }}
                // paginationComponent={() => CustomPagination(getData)}
              />
            ) : (
              <div>
                <DataTable
                  columns={DraftColumns}
                  data={currentlympLineListDraftListData}
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 25, 50]}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                  }}
                  // paginationComponent={() =>
                  //   CustomPagination(lymphedemaLineListDraftListData)
                  // }
                />
                <div>
                  <Button
                    disabled={!SyncBtnShow ? true : false}
                    variant='secondary'
                    className='mt-m font-chng mr10'
                    style={{ backgroundColor: '#19D895', border: 'none' }}
                    onClick={handleSync}>
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

export default ViewLymphedemaPatients;

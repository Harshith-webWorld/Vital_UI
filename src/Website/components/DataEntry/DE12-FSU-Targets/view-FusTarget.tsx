import React, { useEffect, useState } from 'react';
import { useUserDistrictId } from '../../../customHooks/useUserDistrictId';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { WebsiteUserFsuTarget } from '../../../interfaces/FormFusTargetInterface';
import GetFusTargetService from '../../../services/FormFusTargetService';
import DeleteFusTarget from '../../../services/FormFusTargetService';
//import history from '../../../Admin/components/history';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import moment from 'moment';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionFusTarget from './AccordionFusTaget';
import fsuTargetDraftServices from '../../../draftServices/FormFsuTargetDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormFsuTargetSyncService from '../../../DraftSyncServices/FormFsuTargetSyncServices';

const ViewFusTarget = (props) => {
  const userDistrictId = useUserDistrictId() || '';
  const addDESheetName: any = props && props.addDESheetName;
  const userRole: any = props && props.userRole;
  let isOnline = window.navigator.onLine;

  const location = useLocation();
  useEffect(() => {
    getFus({ districtId: userDistrictId });
  }, []);
  const [getFsuTargetList, setFsuTargetList] = useState([]);
  const [fsuTargetDraftList, setFsuTargetDraftList] = useState([]);
  const [fsuTargetDraftListShow, setFsuTargetDraftListShow] = useState(false);
  let [districtValues, setDistrictValues] = useState([]);
  let [facilityValues, setFacilitValues] = useState([]);
  let [nameOfFilariaSurveyUnitValues, setNameOfFilariaSurveyUnitValues] =
    useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [SyncBtnShow, setSyncBtnShow] = useState(false);
  let history = useHistory();
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthsText = [
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

  async function getFus(params) {
    const response = await GetFusTargetService.getFusTarget(params);
    if (response) {
      console.log('getdata', response);
      setFsuTargetList(response.data);
    }
    const draftResponse =
      await fsuTargetDraftServices.getListFsuTargetAchievements(
        props && props.userSessionId
      );
    if (draftResponse) {
      setFsuTargetDraftList(draftResponse);
    }

    const draftCountResponse =
      await fsuTargetDraftServices.countFsuTargetAchievements(
        props && props.userSessionId
      );
    setDraftCount(draftCountResponse);
    if (draftCountResponse > 0) {
      setSyncBtnShow(true);
    } else {
      setSyncBtnShow(false);
    }
    const districtArr = await DexieOfflineDataBase.getDistricts();
    if (districtArr) {
      setDistrictValues(districtArr);
    }
    const facilityArr = await DexieOfflineDataBase.getAllFacility();
    if (facilityArr) {
      setFacilitValues(facilityArr);
    }
    const NameOfFilariaSurveyUnitArr =
      await DexieOfflineDataBase.getAllVertiocalControlUnitsOffline();
    if (NameOfFilariaSurveyUnitArr) {
      setNameOfFilariaSurveyUnitValues(NameOfFilariaSurveyUnitArr);
    }
  }

  async function DeleteValues(id: number, idType) {
    if (idType === 'Id') {
      const response = await DeleteFusTarget.deleteFusTarget(id);
      console.log('response', response);
      if (response) {
        getFus({ districtId: userDistrictId });
        console.log('Delete News', response);
      }
    } else if (idType === 'UUID') {
      let response = await fsuTargetDraftServices.deleteFsuTargetAchievements(
        id
      );
      if (response) {
        let step2delete =
          await fsuTargetDraftServices.deleteGetListFsuTargetAchievementsSurveys(
            id
          );
        if (step2delete) {
          getFus({ districtId: userDistrictId });
          console.log('Delete News', step2delete);
        }
      }
    }
  }

  const Delete = (event: any, id: number, idType) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            DeleteValues(id, idType);
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
    const syncStatus: any = await FormFsuTargetSyncService.syncOfflineData(
      props && props.userSessionId
    );
    console.log('status', syncStatus);
    if (
      (syncStatus && syncStatus.data) ||
      (syncStatus && syncStatus.status === 200)
    ) {
      getFus({ districtId: userDistrictId });
    }
  };
  const ExpandedComponent = (row) => {
    return <AccordionFusTarget rowValues={row} />;
  };

  const column = [
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
        return monthsText.map((month: any, i: any) => {
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
      name: 'Filaria Survey Unit',
      selector: (row: any) =>
        row.verticalControlUnit && row.verticalControlUnit.nameOfControlUnit
          ? row.verticalControlUnit.nameOfControlUnit
          : '',
    },
    {
      name: 'Facility',
      selector: (row: any) =>
        row.facility && row.facility.facilityName
          ? row.facility.facilityName
          : 'None',
    },
    {
      name: 'No Of Villages Or Towns',
      selector: 'noOfVillagesOrTowns',
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

  const draftColumn = [
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
        return monthsText.map((month: any, i: any) => {
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
      name: 'Filaria Survey Unit',
      selector: (row: any) => {
        if (row.nameOfFilariaSurveyUnit === 0) {
          return 'None';
        } else {
          if (nameOfFilariaSurveyUnitValues.length > 0) {
            const find: any = nameOfFilariaSurveyUnitValues.find(
              ({ id }) => id === row.nameOfFilariaSurveyUnit
            );
            return find && find.nameOfControlUnit;
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
          if (facilityValues.length > 0) {
            const find: any = facilityValues.find(
              ({ id }) => id === row.facilityId
            );
            return find && find.facilityName;
          } else {
            return 'empty';
          }
        }
      },
    },
    {
      name: 'No Of Villages Or Towns',
      selector: 'noOfVillagesOrTowns',
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
                  UUID: row.fsuTargetAchievementsUUID,
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
                  UUID: row.fsuTargetAchievementsUUID,
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
              onClick={(event) =>
                Delete(event, row.fsuTargetAchievementsUUID, 'UUID')
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
                  UUID: row.fsuTargetAchievementsUUID,
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
          FSU Target & Achievement
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='row'>
            <div className='col-md-6 col-12'>
              <h4 className='formtitlenew font-chng'>
                FSU Target & Achievement
              </h4>
            </div>
            <div className='col-md-6 col-12 flexdiv'>
              <Button
                variant='secondary'
                className='mt-m font-chng mr10'
                style={{ backgroundColor: '#19D895', border: 'none' }}
                onClick={() => {
                  if (fsuTargetDraftListShow) {
                    setFsuTargetDraftListShow(false);
                  } else {
                    setFsuTargetDraftListShow(true);
                  }
                }}
              >
                {fsuTargetDraftListShow && <div>Server List</div>}

                {!fsuTargetDraftListShow && (
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
            {/* <div className="col-md-3 text-right col-12">
              
            </div> */}
          </div>
          <div className='post-tablenew font-chng cus-table'>
            {!fsuTargetDraftListShow && (
              <div key={0}>
                <DataTable
                  columns={column}
                  data={getFsuTargetList}
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
              </div>
            )}
            {fsuTargetDraftListShow && (
              <div key={1}>
                <DataTable
                  columns={draftColumn}
                  data={fsuTargetDraftList}
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
export default ViewFusTarget;

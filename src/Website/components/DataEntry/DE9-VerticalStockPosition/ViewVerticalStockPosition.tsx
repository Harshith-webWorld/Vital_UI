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
import 'react-confirm-alert/src/react-confirm-alert.css';
import StockPositionService from '../../../services/FormVerticalStockPositionService';
import moment from 'moment';
import { USER_ROLE_REPORT_REVIEW } from '../../../../helpers/config';
import AccordionVerticalUnitStock from './AccordionVerticalUnitStock';
import VerticalUnitStockDraftServices from '../../../draftServices/FormVerticalUnitStockDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import FormVerticalUnitStockDraftSyncService from '../../../DraftSyncServices/FormVerticalUnitStockDraftSyncServices';

const ViewVerticalStockPosition = (props) => {
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
    getstockposition({ districtId: userDistrictId });
    getListContentData();
  }, []);

  const [getData, setGetdata] = useState([]);
  const months = [
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

  async function getstockposition(params) {
    const response = await StockPositionService.getStockPosition(params);
    if (response) {
      // console.log('response value in vertical',response)
      // console.log("verticalPosition content:: ", response.data);
      setGetdata(response.data);
    }
    const draftResponse =
      await VerticalUnitStockDraftServices.getListVerticalUnitStock();
    if (draftResponse) {
      setGetOfflineData(draftResponse);
    }
    const countVerticalUnitStockResponse =
      await VerticalUnitStockDraftServices.countVerticalUnitStock(
        props && props.userSessionId
      );
    setDraftCount(countVerticalUnitStockResponse);
    if (countVerticalUnitStockResponse > 0) {
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
    const CatagoryOption = await DexieOfflineDataBase.getCatagoryOption();
    if (CatagoryOption) {
      setCatagoryOption(CatagoryOption);
    }
    const verticalControlUnitResponse =
      await DexieOfflineDataBase.getAllVertiocalControlUnitsOffline();
    if (verticalControlUnitResponse) {
      setverticalControlUnitIdValues(verticalControlUnitResponse);
    }
  }

  async function DeleteStockPosition(id: number, IdType: string) {
    if (IdType === 'Id') {
      const response = await StockPositionService.deleteStockPosition(id);
      if (response.message == 'Deleted successfully') {
        getstockposition({ districtId: userDistrictId });
        console.log('Delete News', response);
      }
    } else {
      const response =
        await VerticalUnitStockDraftServices.deleteVerticalUnitStock(id);
      getstockposition({ districtId: userDistrictId });
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
            DeleteStockPosition(id, IdType);
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
          ? row.district && row.district.districtName
          : 'Nil',
    },
    {
      name: 'Unit Type',
      selector: (row: any) =>
        row && row.UnitType && row.UnitType.categoryOptionName,
    },

    {
      name: 'Name Of Unit',
      selector: (row: any) =>
        row.verticalControlUnit && row.verticalControlUnit.nameOfControlUnit
          ? row.verticalControlUnit.nameOfControlUnit
          : 'Nil',
    },

    {
      name: 'Items',
      selector: (row: any) =>
        row.tabletName && row.tabletName.categoryOptionName
          ? row.tabletName.categoryOptionName
          : 'Others',
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
          return districtIdValues.map((district: any, i: any) => {
            if (row.districtId === district.id) {
              return district.districtName;
            }
          });
        }
      },
    },
    {
      name: 'Unit Type',
      selector: (row: any) => {
        if (row.unitType === 0 || row.unitType === '0') {
          return 'None';
        } else {
          if (catagoryOption.length > 0) {
            const find: any = catagoryOption.find(
              ({ id }) => id === row.unitType
            );
            return find && find.categoryOptionName;
          } else {
            return 'empty';
          }
        }
      },
    },

    {
      name: 'Name Of Unit',
      selector: (row: any) => {
        if (row.unitName === 0 || row.unitName === '0') {
          return 'None';
        } else {
          if (verticalControlUnitIdValues.length > 0) {
            const find: any = verticalControlUnitIdValues.find(
              ({ id }) => id === row.unitName
            );
            return find && find.nameOfControlUnit;
          } else {
            return 'empty';
          }
        }
      },
    },
    {
      name: 'Items',
      selector: (row: any) => {
        if (row.items === 0) {
          return 'Other';
        } else {
          return catagoryOption.map((item: any, i: any) => {
            if (row.items === item.id) {
              return item.categoryOptionName;
            }
          });
        }
      },
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
                  UUID: row.VerticalUnitStockUUID,
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
                  UUID: row.VerticalUnitStockUUID,
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
              onClick={(e: any) => Delete(e, row.VerticalUnitStockUUID, 'UUID')}
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
                  UUID: row.VerticalUnitStockUUID,
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
    return <AccordionVerticalUnitStock rowValues={row} />;
  };

  const handleSync = async () => {
    const syncStatus =
      await FormVerticalUnitStockDraftSyncService.syncDraftData(
        props && props.userSessionId
      );
    console.log('status', syncStatus);
    getstockposition({ districtId: userDistrictId });
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
          Vertical unit Stock Position
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <div className='card'>
          <div className='card-head'>
            <div className='row'>
              <div className='col-md-6 col-12'>
                <h4 className='formtitlenew font-chng'>
                  Vertical unit Stock Position
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

export default ViewVerticalStockPosition;

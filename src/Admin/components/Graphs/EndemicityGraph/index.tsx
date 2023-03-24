import React, { useState, useEffect } from 'react';
import TabList from '@material-ui/lab/TabList';
import Tab from '@material-ui/core/Tab';
import BarChartIcon from '@material-ui/icons/BarChart';
import TableChartIcon from '@material-ui/icons/TableChart';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import DataTable from 'react-data-table-component';
import CsvDownload from 'react-json-to-csv';
import graphservice from '../../../../helpers/services/website-barchart.service';
import '../../../assets/scss/admin.scss';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { MultiSelect } from 'react-multi-select-component';
import districtService from '../../../../helpers/services/districtService';
import {
  Box,
  IconButton,
  makeStyles,
  styled,
  SwipeableDrawer,
} from '@material-ui/core';
import { Global } from '@emotion/react';
import { grey } from '@material-ui/core/colors';
import {
  current_month,
  current_year,
  options,
  monthList,
  yearList,
} from '../../../../Components/constant';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import DetailsTable from './DetailsTable';
const drawerBleeding = 56;
const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  display: 'inline-block',
  marginRight: '10px',
}));

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: '25%',
  },
  iconbutton: {
    float: 'right',
    display: 'inline-block',
  },
}));

export default function EndemicityGraph(props: any) {
  const [labels, setlabels] = useState<any>([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);
  const [selectedId, setselectedId] = useState<any>();
  const [tablelist, settablelist] = useState<any>([
    {
      Indicators: 'No. Of MF',
      January: '200',
      February: '300',
      March: '200',
      April: '150',
      May: '200',
      June: '300',
      July: '200',
      August: '150',
      September: '200',
      October: '300',
      November: '200',
      December: '150',
    },
    {
      Indicators: 'No. of LF',
      January: '100',
      February: '150',
      March: '80',
      April: '100',
      May: '100',
      June: '150',
      July: '80',
      August: '100',
      September: '100',
      October: '150',
      November: '80',
      December: '100',
    },
    {
      Indicators: 'No of HF',
      January: '50',
      February: '50',
      March: '50',
      April: '25',
      May: '50',
      June: '50',
      July: '50',
      August: '25',
      September: '50',
      October: '50',
      November: '50',
      December: '25',
    },
  ]);
  const [value, setValue] = React.useState<any>('1');
  const classes = useStyles();
  const { window } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const [open, setOpen] = React.useState<any>(false);
  let tempdatasets = [
    {
      id: 0,
      label: 'No. Of MF',
      pointStyle: 'rectRounded',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: '#b9b5ae05',
      data: [200, 300, 200, 150, 200, 300, 200, 150, 200, 300, 200, 150],
    },
    {
      id: 1,
      label: 'No. of LF',
      pointStyle: 'rectRounded',
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: '#b9b5ae05',
      data: [100, 150, 80, 100, 100, 150, 80, 100, 100, 150, 80, 100],
    },
    {
      id: 2,
      label: 'No of HF',
      pointStyle: 'rectRounded',
      borderColor: '#b9b5ae',
      backgroundColor: '#b9b5ae05',
      data: [50, 50, 50, 25, 50, 50, 50, 25, 50, 50, 50, 25],
    },
  ];
  const [NoofMFchecked, setNoofMFchecked] = useState<any>(true);
  const [NoofLFchecked, setNoofLFchecked] = useState<any>(true);
  const [NoofHFchecked, setNoofHFchecked] = useState<any>(true);
  const [data, setdata] = useState<any>({
    responsive: true,
    offset: true,
    labels: [...labels],
    datasets: [...tempdatasets],
  });
  const [districtList, setDistrictList] = useState<any>([]);
  const [districtoption, setdistrictoption] = useState<any>([]);
  const [monthoption, setmonthoption] = useState<any>(
    monthList,
    // current_month,
  );
  const [yearoption, setyearoption] = useState<any>(
    yearList,
    // [{ label: current_year, value: current_year }],
  );
  const [show, setShow] = useState(false);
  const [selectedvalue, setselectedvalue] = useState<any>('');
  const handleCloseModal = () => setShow(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const changeDistrict = (selected: any[]) => {
    setdistrictoption(selected);
    setdata((prevData: any) => {
      var selectedvalues = selected.map((a: { value: any }) => a.value);
      let result = districtList.filter((val) => selectedvalues.includes(val));
      return { ...prevData, labels: [...result] };
    });
  };
  const changeMonth = (selected: any) => {
    setmonthoption(selected);
    selected.length === 0 && setmonthoption(current_month);
  };
  const changeYear = (selected: any) => {
    selected.length === 51 && setmonthoption(monthList);
    setyearoption(selected);
    selected.length === 0 &&
      setyearoption([{ label: current_year, value: current_year }]);
  };
  const exportimage = () => {
    let graph = document.getElementById('graph');
    graph &&
      html2canvas(graph).then(function (canvas: any) {
        canvas.toBlob(function (blob: any) {
          saveAs(blob, 'Dashboard.png');
        });
      });
  };
  const removedataset = (id: string | number) => {
    setdata((prevData: any) => {
      let temp = prevData;
      temp.datasets[id].data = [];
      return temp;
    });
  };
  const adddatsets = (id: number) => {
    setdata((prevData: any) => {
      let temp = prevData;
      let data = tempdatasets.filter((item) => {
        if (item.id === id) return item.data;
      });
      temp.datasets[id].data = data[0].data;
      return temp;
    });
  };
  const changeStatus = (id: number) => {
    return id === 0
      ? setNoofMFchecked(!NoofMFchecked)
      : id === 1
      ? setNoofLFchecked(!NoofLFchecked)
      : id === 2
      ? setNoofHFchecked(!NoofHFchecked)
      : null;
  };
  const handleindicatorselect = (id: number, status: any) => {
    if (status) {
      removedataset(id);
      changeStatus(id);
    } else {
      adddatsets(id);
      changeStatus(id);
    }
  };
  async function getDistrictList() {
    const response = await districtService.getDistrict();
    if (response && response.data) {
      let data = response.data.map((item: { districtName: any; id: any }) => {
        return { label: item.districtName, value: item.id };
      });
      setdistrictoption(data);
      setDistrictList(data);
      // setlabels(
      //   response.data.map((item: { districtName: any; id: any }) => {
      //     return item.districtName;
      //   }),
      // );
    }
  }
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };
  function remove_duplicates_es6(arr: Iterable<unknown> | null | undefined) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
  }
  // async function GetEndemicityGraphAllDistricts() {
  //   const response = await graphservice.getEndemicityGraphAllDistricts({
  //     year: `${yearoption
  //       .map((item: { value: any }) => {
  //         return item.value;
  //       })
  //       .join(',')}`,
  //     month: `${monthoption
  //       .map((item: { value: any }) => {
  //         return item.value;
  //       })
  //       .join(',')}`,
  //     districtId: `${districtoption
  //       .map((item: { value: any }) => {
  //         return item.value;
  //       })
  //       .join(',')}`,
  //   });
  //   if (response && response.data) {
  //     // setlabels(
  //     //   remove_duplicates_es6(
  //     //     response.data
  //     //       .map((item: any) => {
  //     //         if (
  //     //           item?.districtName !== null &&
  //     //           (item.NoofMF !== null ||
  //     //             item.NoofLF !== null ||
  //     //             item.NoOfHydroceleOperated !== null ||
  //     //             item.NoOfPendingApprovalMO !== null)
  //     //         )
  //     //           return item.districtName;
  //     //       })
  //     //       .filter((item: undefined) => {
  //     //         if (item !== undefined) return item;
  //     //       }),
  //     //   ),
  //     // );
  //     let templabel = remove_duplicates_es6(
  //       response.data
  //         .map((item: any) => {
  //           if (
  //             item?.districtName !== null &&
  //             (item.NoofMF !== null ||
  //               item.NoofLF !== null ||
  //               item.NoOfHydroceleOperated !== null ||
  //               item.NoOfPendingApprovalMO !== null)
  //           )
  //             return item.districtName;
  //         })
  //         .filter((item: undefined) => {
  //           if (item !== undefined) return item;
  //         }),
  //     );
  //     let temp = tablelist;
  //     response.data.map((item: any) => {
  //       item.NoofMF !== null &&
  //         (temp[0] = {
  //           ...temp[0],
  //           [item.districtName]: item.NoofMF,
  //         });
  //       item.NoofLF !== null &&
  //         (temp[1] = {
  //           ...temp[1],
  //           [item.districtName]: item.NoofLF,
  //         });
  //       item.NoOfHydroceleOperated !== null &&
  //         (temp[2] = {
  //           ...temp[2],
  //           [item.districtName]: item.NoOfHydroceleOperated,
  //         });
  //       item.NoOfPendingApprovalMO !== null &&
  //         (temp[3] = {
  //           ...temp[3],
  //           [item.districtName]: item.NoOfPendingApprovalMO,
  //         });
  //     });
  //     settablelist(temp);
  //     setdata((prevdata: any) => {
  //       return {
  //         ...prevdata,
  //         datasets: [
  //           {
  //             id: 0,
  //             label: 'No. Of MF',
  //             pointStyle: 'rectRounded',
  //             borderColor: 'rgb(255, 99, 132)',
  //             backgroundColor: '#b9b5ae05',
  //             data:
  //               temp && temp.length > 0
  //                 ? Object.values(temp[0]).filter((x, i) => i !== 0)
  //                 : [],
  //           },
  //           {
  //             id: 1,
  //             label: 'No. of LF',
  //             pointStyle: 'rectRounded',
  //             borderColor: 'rgb(53, 162, 235)',
  //             backgroundColor: '#b9b5ae05',
  //             data:
  //               temp && temp.length > 0
  //                 ? Object.values(temp[1]).filter((x, i) => i !== 0)
  //                 : [],
  //           },
  //           {
  //             id: 2,
  //             label: 'No of HF',
  //             pointStyle: 'rectRounded',
  //             borderColor: '#b9b5ae',
  //             backgroundColor: '#b9b5ae05',
  //             data:
  //               temp && temp.length > 0
  //                 ? Object.values(temp[2]).filter((x, i) => i !== 0)
  //                 : [],
  //           },
  //         ],
  //         labels: [...templabel],
  //       };
  //     });
  //   }
  // }
  const s = new Set();
  tablelist.map((item) => {
    Object.keys(item).map((item) => {
      s.add(item);
    });
  });
  const res = Array.from(s.values()).sort(function (a: any, b: any) {
    if (a.key === b.key) return 0;
    if (a.key === 'Indicators') return -1;
    if (b.key === 'IndicatorsIndicators') return 1;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  let columns: any = [];
  if (res && res.length > 0) {
    columns = res.map((item, i) => {
      if (i == 0)
        return {
          name: item,
          selector: item,
          width: '100px',
          minWidth: '100px',
        };
      else
        return {
          name: item,
          selector: item,
        };
    });
  }
  const handleOnClickbar = (evt: any, elem: any) => {
    const chart = elem[0]._chart;
    const element = chart.getElementAtEvent(evt)[0];
    const dataset = chart.data.datasets[element._datasetIndex];
    const xLabel = chart.data.labels[element._index];

    if (dataset.label) {
      let id = districtoption.filter((item: any) => {
        return item.label === xLabel;
      })[0].value;
      setselectedId(id);
      setselectedvalue(dataset.label);
      setShow(true);
    }
  };
  useEffect(() => {
    getDistrictList();
    // GetEndemicityGraphAllDistricts();
  }, []);
  useEffect(() => {
    // GetEndemicityGraphAllDistricts();
  }, [yearoption, monthoption, districtoption]);
  return (
    <>
      <div>
        {/* Content */}
        <div className='content'>
          {/* card */}
          <div className='card'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-md-9'>
                  <h5 className='card-title'></h5>
                </div>
              </div>
            </div>
            <TabContext value={value}>
              <TabList onChange={handleChange} aria-label='simple tabs example'>
                <Tab
                  value='1'
                  icon={<BarChartIcon />}
                  aria-label='barchart'
                  {...a11yProps(1)}
                />
                <Tab
                  value='2'
                  icon={<TableChartIcon />}
                  aria-label='table'
                  {...a11yProps(2)}
                />
              </TabList>
              <div className='card-header'>
                <div className='row'>
                  <div className='col-md-9'>
                    <h5 className='card-title'>Endemicity</h5>
                  </div>
                </div>
              </div>
              <TabPanel value='1'>
                <>
                  <Global
                    styles={{
                      '.MuiDrawer-root > .MuiPaper-root': {
                        height: 'fit-content',
                        overflow: 'scroll',
                      },
                    }}
                  />
                  <div
                    style={{
                      marginTop: '2%',
                      marginBottom: '1%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}>
                    <button
                      style={{ marginRight: '15px' }}
                      className='mt-m font-chng btn btn-secondary'
                      onClick={exportimage}>
                      Export Image
                    </button>
                    <FilterListIcon
                      style={{ marginRight: '15px' }}
                      onClick={toggleDrawer(true)}>
                      Filter
                    </FilterListIcon>
                  </div>
                  <div id='graph' style={{ padding: 10 }}>
                    <Line
                      height={400}
                      data={data}
                      options={{
                        ...options,
                        onClick: (evt: any, elem: any) => {
                          handleOnClickbar(evt, elem);
                        },
                      }}
                    />
                  </div>
                  <SwipeableDrawer
                    classes={{ paper: classes.drawerPaper }}
                    container={container}
                    anchor='right'
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    swipeAreaWidth={drawerBleeding}
                    disableSwipeToOpen={false}
                    ModalProps={{ keepMounted: true }}>
                    <div className='card' style={{ padding: 20 }}>
                      <div>
                        <Puller />
                        <IconButton
                          onClick={toggleDrawer(false)}
                          aria-label='settings'
                          className={classes.iconbutton}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <div>
                        <div className='form-grp '>
                          <label
                            htmlFor='comorbidityType'
                            className='form-label font-chng'>
                            Year
                          </label>
                          <MultiSelect
                            options={yearList}
                            value={yearoption}
                            onChange={changeYear}
                            labelledBy='Select'
                          />
                        </div>
                        <div className='form-grp '>
                          <label
                            htmlFor='comorbidityType'
                            className='form-label font-chng'>
                            Month
                          </label>
                          <MultiSelect
                            options={monthList}
                            value={monthoption}
                            onChange={changeMonth}
                            labelledBy='Select'
                          />
                        </div>
                      </div>
                      <div
                        role='group'
                        aria-labelledby='my-radio-group'
                        className='form-radio '>
                        <label className='form-label font-chng'>
                          Select Indicactor
                        </label>
                        <br />
                        <br />
                        <label className='font-chng'>
                          <input
                            type='checkbox'
                            name='NoofMF'
                            checked={NoofMFchecked}
                            onChange={() =>
                              handleindicatorselect(0, NoofMFchecked)
                            }
                          />
                          &nbsp; &nbsp; No. Of MF
                        </label>
                        <br />
                        <label className='font-chng'>
                          <input
                            type='checkbox'
                            name='NoofLF'
                            checked={NoofLFchecked}
                            onChange={() => {
                              handleindicatorselect(1, NoofLFchecked);
                            }}
                            value='true'
                          />
                          &nbsp; &nbsp; No. of LF
                        </label>
                        <br />
                        <label className='font-chng'>
                          <input
                            type='checkbox'
                            name='NoofHF'
                            checked={NoofHFchecked}
                            onChange={() => {
                              handleindicatorselect(2, NoofHFchecked);
                            }}
                            value='true'
                          />
                          &nbsp; &nbsp; No of HF
                        </label>
                        <br />
                      </div>
                      <div className='form-grp '>
                        <label
                          htmlFor='comorbidityType'
                          className='form-label font-chng'>
                          District
                        </label>
                        <MultiSelect
                          options={districtList}
                          value={districtoption}
                          onChange={changeDistrict}
                          labelledBy='Select'
                        />
                      </div>
                    </div>
                  </SwipeableDrawer>
                </>
              </TabPanel>
              <TabPanel value='2'>
                <div className='card-body '>
                  <div
                    style={{
                      marginTop: '2%',
                      marginBottom: '1%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}>
                    <CsvDownload
                      data={tablelist}
                      filename='dashboard.csv'
                      style={{ marginRight: '15px' }}
                      className='mt-m font-chng btn btn-secondary'>
                      Export Data
                    </CsvDownload>
                  </div>
                  <div className='dash-table'>
                    <DataTable
                      columns={columns}
                      data={tablelist}
                      highlightOnHover
                    />
                  </div>
                </div>
              </TabPanel>
            </TabContext>
            <DetailsTable
              show={show}
              selectedkey={selectedvalue}
              selectedId={selectedId}
              handleCloseModal={handleCloseModal}
              yearoption={yearoption}
              monthoption={monthoption}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

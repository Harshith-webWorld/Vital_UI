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
import { Bar } from 'react-chartjs-2';
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
  monthList,
  yearList,
} from '../../../../Components/constant';
import { options } from '../config';
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

export default function MFRateChart(props: any) {
  const [labels, setlabels] = useState<any>([]);
  const [selectedId, setselectedId] = useState<any>();
  const [tablelist, settablelist] = useState<any>([
    {
      Indicators: 'MF Rate',
    },
    {
      Indicators: 'No. of MF Positive',
    },
    {
      Indicators: 'No. of BS Collected',
    },
    {
      Indicators: 'No. Of Bs examined',
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
      label: 'MF Rate',
      pointStyle: 'rectRounded',
      backgroundColor: '#51A620',

      minBarLength: 20,
      data:
        tablelist && tablelist.length > 0
          ? Object.values(tablelist[0]).filter((x, i) => i !== 0)
          : [],
    },
    {
      id: 1,
      label: 'No. of MF Positive',
      pointStyle: 'rectRounded',
      backgroundColor: '#34a4eb',

      minBarLength: 200,
      data:
        tablelist && tablelist.length > 0
          ? Object.values(tablelist[1]).filter((x, i) => i !== 0)
          : [],
    },
    {
      id: 2,
      label: 'No. of BS Collected',
      pointStyle: 'rectRounded',
      backgroundColor: '#6e34eb',

      minBarLength: 20,
      data:
        tablelist && tablelist.length > 0
          ? Object.values(tablelist[2]).filter((x, i) => i !== 0)
          : [],
    },
    {
      id: 3,
      label: 'No. Of Bs examined',
      pointStyle: 'rectRounded',
      backgroundColor: '#F69D30',

      minBarLength: 20,
      data:
        tablelist && tablelist.length > 0
          ? Object.values(tablelist[3]).filter((x, i) => i !== 0)
          : [],
    },
  ];
  const [MfRateCheck, setMfRateCheck] = useState<any>(true);
  const [NoOfMfPositiveCheck, setNoOfMfPositiveCheck] = useState<any>(true);
  const [NoofBsCollectedCheck, setNoOfBsCollectedCheck] = useState<any>(true);
  const [NoofBsExaminedCheck, setNoofBsExaminedCheck] = useState<any>(true);
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
      ? setMfRateCheck(!MfRateCheck)
      : id === 1
      ? setNoOfMfPositiveCheck(!NoOfMfPositiveCheck)
      : id === 2
      ? setNoOfBsCollectedCheck(!NoofBsCollectedCheck)
      : id === 3
      ? setNoofBsExaminedCheck(!NoofBsExaminedCheck)
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
      setlabels(
        response.data.map((item: { districtName: any; id: any }) => {
          return item.districtName;
        }),
      );
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
  async function GetMFEndemicityGraphAllDistricts() {
    const response = await graphservice.getMFEndemicityGraphAllDistricts({
      year: `${yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      month: `${monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      districtId: `${districtoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
    });
    if (response && response.data) {
      setlabels(
        remove_duplicates_es6(
          response.data
            .map((item: any) => {
              if (
                item?.districtName !== null &&
                (item.mfRate !== null ||
                  item.NoMFPosetive !== null ||
                  item.NoBSCollected !== null ||
                  item.NoBSExamined !== null)
              )
                return item.districtName;
            })
            .filter((item: undefined) => {
              if (item !== undefined) return item;
            }),
        ),
      );
      let templabel = remove_duplicates_es6(
        response.data
          .map((item: any) => {
            if (
              item?.districtName !== null &&
              (item.mfRate !== null ||
                item.NoMFPosetive !== null ||
                item.NoBSCollected !== null ||
                item.NoBSExamined !== null)
            )
              return item.districtName;
          })
          .filter((item: undefined) => {
            if (item !== undefined) return item;
          }),
      );
      let temp = tablelist;
      response.data.map((item: any) => {
        item.mfRate !== null &&
          (temp[0] = {
            ...temp[0],
            [item.districtName]: item.mfRate,
          });
        item.NoMFPosetive !== null &&
          (temp[1] = {
            ...temp[1],
            [item.districtName]: item.NoMFPosetive,
          });
        item.NoBSCollected !== null &&
          (temp[2] = {
            ...temp[2],
            [item.districtName]: item.NoBSCollected,
          });
        item.NoBSExamined !== null &&
          (temp[3] = {
            ...temp[3],
            [item.districtName]: item.NoBSExamined,
          });
      });
      settablelist(temp);
      setdata((prevdata: any) => {
        return {
          ...prevdata,
          datasets: [
            {
              id: 0,
              label: 'MF Rate',
              pointStyle: 'rectRounded',
              backgroundColor: '#51A620',

              minBarLength: 20,
              data:
                temp && temp.length > 0
                  ? Object.values(temp[0]).filter((x, i) => i !== 0)
                  : [],
            },
            {
              id: 1,
              label: 'No. of MF Positive',
              pointStyle: 'rectRounded',
              backgroundColor: '#34a4eb',

              minBarLength: 20,
              data:
                temp && temp.length > 0
                  ? Object.values(temp[1]).filter((x, i) => i !== 0)
                  : [],
            },
            {
              id: 2,
              label: 'No. of BS Collected',
              pointStyle: 'rectRounded',
              backgroundColor: '#6e34eb',

              minBarLength: 20,
              data:
                temp && temp.length > 0
                  ? Object.values(temp[2]).filter((x, i) => i !== 0)
                  : [],
            },
            {
              id: 3,
              label: 'No. Of Bs examined',
              pointStyle: 'rectRounded',
              backgroundColor: '#F69D30',

              minBarLength: 20,
              data:
                temp && temp.length > 0
                  ? Object.values(temp[3]).filter((x, i) => i !== 0)
                  : [],
            },
          ],
          labels: [...templabel],
        };
      });
    }
  }
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
          width: '300px',
          minWidth: '300px',
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
    GetMFEndemicityGraphAllDistricts();
  }, []);
  useEffect(() => {
    GetMFEndemicityGraphAllDistricts();
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
                    <h5 className='card-title'>MF Cases</h5>
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
                    <Bar
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
                            name='mfRate'
                            checked={MfRateCheck}
                            onChange={() =>
                              handleindicatorselect(0, MfRateCheck)
                            }
                          />
                          &nbsp; &nbsp; MF Rate
                        </label>
                        <br />
                        <label className='font-chng'>
                          <input
                            type='checkbox'
                            name='NoMFPosetive'
                            checked={NoOfMfPositiveCheck}
                            onChange={() => {
                              handleindicatorselect(1, NoOfMfPositiveCheck);
                            }}
                            value='true'
                          />
                          &nbsp; &nbsp; No. of MF Positive
                        </label>
                        <br />
                        <label className='font-chng'>
                          <input
                            type='checkbox'
                            name='NoBSCollected'
                            checked={NoofBsCollectedCheck}
                            onChange={() => {
                              handleindicatorselect(2, NoofBsCollectedCheck);
                            }}
                            value='true'
                          />
                          &nbsp; &nbsp; No. of BS collected
                        </label>
                        <br />
                        <label className='font-chng'>
                          <input
                            type='checkbox'
                            name='NoBSExamined'
                            checked={NoofBsExaminedCheck}
                            onChange={() => {
                              handleindicatorselect(3, NoofBsExaminedCheck);
                            }}
                            value='true'
                          />
                          &nbsp; &nbsp; No. Of BS Examined
                        </label>
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

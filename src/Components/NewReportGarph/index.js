import configs from './configs';
import mfconfigs from './configs/mfindex';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Typography,
  Card,
  Divider,
  Icon,
  Tooltip,
  styled,
  FormControl,
  Select,
  InputLabel,
} from '@material-ui/core';

import React, { useState, useMemo } from 'react';

const MDBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignSelf: 'center',
  marginBottom: '50px',
  fontFamily: 'poppins',
}));

const MDTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '15px',
  lineHeight: '22px',
  color: '#495057',
}));

const CustomSelectField = styled(Select)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  background: '#EFF2F7',
  fontSize: '13px',
  fontFamily: 'poppins',
  fontWeight: '500',
  '&:before': {
    border: 'none',
    outline: 'none',
  },
  '&:after': {
    border: 'none',
    outline: 'none',
  },
  // "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
  //   border: "none",
  //   outline: "none",
  // },
  '&.MuiFilledInput-root:hover': {
    border: 'none',
    outline: 'none',
  },
  '&.MuiFilledInput-underline:hover:before': {
    border: 'none',
    outline: 'none',
  },

  '& .MuiSelect-filled.MuiSelect-filled': {
    paddingTop: '9px',
  },

  '& option': {
    fontWeight: '500',
    fontSize: '13px',
  },
}));
const MDP = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '13px',
  lineHeight: '20px',
  color: '#74788D',

  display: 'flex',
  alignContent: 'flex-end',
  alignItems: 'center',
  height: '29px',

  '@media (max-width: 1640px)': {
    fontSize: '10px',
  },
}));
function NewReportGraph({
  chart,
  config,
  title,
  rightTitle,
  isSelectField = false,
  selectField,
  plotTitleData,
  popupCallback,
}) {
  const { data, options } =
    config == 'mf'
      ? mfconfigs(
          chart.labels || [],
          chart.datasets || {},
          chart.displayY || false,
          chart.showunit || ''
        )
      : configs(
          chart.labels || [],
          chart.datasets || {},
          chart.displayY || false,
          chart.showunit || ''
        );
  const [district, setDistrict] = useState('0');

  const selectDistrictHandler = (e) => {
    setDistrict(e?.target?.value ? `${e.target.value}` : '0');
  };

  const triggerPopupCallback = (val) => {
    popupCallback(data.labels[val]);
  };
  return (
    <div style={{ padding: '20px' }}>
      {isSelectField ? (
        <>
          <MDBox style={{ marginBottom: '0px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MDTitle>{title} </MDTitle>

              {/* <MDTitle
              style={{
                // fontFamily: "Poppins",
                // fontStyle: "normal",
                // fontWeight: "500",
                // fontSize: "13px",
                // lineHeight: "22px",
                // color: "rgba(73, 80, 87, 0.5)",
                // marginLeft: "35px",

                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "500",
                fontSize: "13px",
                lineHeight: "20px",
                color: "#495057",
                marginLeft: "30px",
              }}
            >
              Till today
            </MDTitle> */}
            </div>
          </MDBox>
          <div
            className='newReportxs'
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              // width: "130px",
            }}
          >
            {rightTitle}
            {selectField?.length > 0 && (
              <div>
                <MDP>District</MDP>
                <div className='form-grp'>
                  <FormControl variant='filled'>
                    <CustomSelectField
                      value={district}
                      onChange={selectDistrictHandler}
                      style={{
                        outline: 'none',
                        border: 'none',
                      }}
                    >
                      {/* <option aria-label="None" value="" /> */}
                      {selectField.map((item) => (
                        <option value={`${item.value}`}>{item.label}</option>
                      ))}
                    </CustomSelectField>
                  </FormControl>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <MDBox>
          <MDTitle>{title}</MDTitle>
          {/* {rightTitle && (
            <p style={{ fontSize: "0.8rem", marginTop: "10px" }}>
              {rightTitle}
            </p>
          )} */}
        </MDBox>
      )}
      {/* <Bar data={data} options={options} /> */}
      {/* {console.log(data, 'datadatadatadata')} */}
      {useMemo(
        () => (
          <Box style={{ height: '250px', marginTop: 30 }}>
            <Bar
              data={data}
              options={options}
              getElementAtEvent={(i) => {
                if (
                  i[0]?._chart?.config?.data?.datasets[0]?.label === 'MF Rate'
                ) {
                  console.log('in');
                  let yearIndex = i[0]._index;
                  triggerPopupCallback(yearIndex);
                }
              }}
            />
          </Box>
        ),
        [chart]
      )}
      {!isSelectField && (
        <div
          style={{
            display: 'flex',
            marginLeft: '5px',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        >
          <div
            style={{
              display: 'flex',
              // width: "47%",
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            {plotTitleData.map((item, index) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '20px',
                }}
              >
                <div
                  style={{
                    height: '15px',
                    width: '15px',
                    background: item.color,
                    // marginTop: "0px",
                    marginRight: '5px',
                    borderRadius: '2px',
                  }}
                ></div>
                <p
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '13px',
                    lineHeight: '20px',
                    color: '#495057',
                    marginTop: '15px',
                  }}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NewReportGraph;

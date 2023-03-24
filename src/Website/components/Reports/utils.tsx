import moment from "moment"

export const months = [
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

const currentYear = new Date().getFullYear();
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
export const years = range(currentYear, currentYear - 50, -1);
export const columnYears = range(currentYear, currentYear - 4, -1).reverse();
export const reversedYears = range(currentYear, currentYear - 50, -1).reverse();

export const getDistrictName = (list: any, id: any) => {
  let districtOption = list.find((option) => option.value == id)
  if(!districtOption){
    districtOption = list.find((option) => option.id == id)
  }
  let districtName = districtOption?.label || ""
  if(!districtName){
    districtName = districtOption?.districtName || ""
  }
  return districtName || "";
}

export const genderList = [
  {
    label: 'Male',
    value: 1,
  },
  {
    label: 'Female',
    value: 2,
  },
  {
    label: 'Transgender',
    value: 3,
  },
];

export const ageGroupList = [
  {
    label: '0-15',
    value: '0-15',
  },
  {
    label: '16-40',
    value: '16-40',
  },
  {
    label: '41-65',
    value: '41-65',
  },
  {
    label: '65+',
    value: '65+',
  },
  // {
  //   label: "60-75",
  //   value: "60-75",
  // },
  // {
  //   label: "75-90",
  //   value: "75-90",
  // },
  // {
  //   label: "90-105",
  //   value: "90-105",
  // },
  // {
  //   label: "105-120",
  //   value: "105-120",
  // },
];

export const diseaseTypeList = [
  {
    label: 'Lymphedema',
    value: 'Lymphedema',
  },
  {
    label: 'Hydrocele',
    value: 'Hydrocele',
  },
];

export const isVerifiedList = [
  {
    label: 'Yes',
    value: 'true',
  },
  {
    label: 'No',
    value: 'false',
  },
];

export const stageHydrogele = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
];

export const coMorbidityTypeOptions = [
  { label: 'DM', value: 'DM' },
  { label: 'HT', value: 'HT' },
  { label: 'Asthma', value: 'Asthma' },
  { label: 'Others', value: 'Others' },
];

export const generateGenderLetter = (data: any) => {
  if (data === 'Male') {
    return 'M';
  } else if (data === 'Female') {
    return 'F';
  } else if (data === 'Transgender') {
    return 'T';
  }
};

const processNoOfYears = (year) => {
  if (year === null || year === 0) {
    return 0;
  }
  if (year.toString().length === 4) {
    let currentDate = moment();
    let date = moment([year]);
    let localYear = currentDate.diff(date, 'year');
    return localYear;
  } else {
    return year;
  }
};

export const ageTextGenerator = (year: any, month: any) => {
  const yearText = year === 0 || year === null ? '' : `${processNoOfYears(year)} years`;
  const monthText = month === 0 || month === null ? '' : `${month} months`;
  return `${yearText}${
    monthText === '' ? '' : yearText === '' ? `${monthText}` : `, ${monthText}`
  }`;
};

export const totalCountGenerator = (data: any, fieldName: any) => {
  const total = data.reduce(
    (acc: any, cur: any) => acc + parseInt(cur[`${fieldName}`]),
    0,
  );
  return total;
};

export const monthAlphabetGenerator = (monthNo: any) => {
  const monthsList = [
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

  if (monthNo === 0) {
    return '';
  } else {
    const filteredMonth = monthsList.filter((month) => month.month === monthNo);

    return filteredMonth[0].monthName;
  }
};

export const affectedPartsOptions = [
  { value: 1, label: 'Leg' },
  { value: 2, label: 'Hand' },
  { value: 3, label: 'Scrotum' },
  { value: 4, label: 'Breast' },
  { value: 5, label: 'Others' },
];

/**
 * Report Tables styling.
 */
const columnStyle = {
  whiteSpace: 'normal',
  color: '#000000',
  fontSize: '13px',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 600,
  wordBreak: 'break-word',
};
const columnHeaderStylenew = {
  background: '#0e9207',
  color: '#ffff',
  borderBottom: '1px solid #E0E0E0',
  borderRight: '1px solid #E0E0E0',
};

const columnDataStylenew = {
  borderBottom: '1px solid #E0E0E0',
  borderRight: '1px solid #E0E0E0',
};

const columnHeaderStyleLeftnew = {
  borderBottom: '1px solid #eff2f7',
  borderTop: '1px solid #eff2f7',
  backgroundColor: '#f8f9fa',
  marginTop: '20px',
  ...columnStyle,
};

const columnHeaderStyleRightnew = {
  backgroundColor: '#0e9207',
  color: '#ffff',
  borderBottomRightRadius: '10px',
  borderTopRightRadius: '10px',
  borderRight: '1px solid #E0E0E0',
  borderBottom: '1px solid #E0E0E0',
};

const columnHeaderStyleTopLeftnew = {
  background: '#0e9207',
  color: '#ffff',
  borderBottom: '1px solid #E0E0E0',
  borderTopLeftRadius: '10px',
  borderRight: '1px solid #E0E0E0',
};

const columnHeaderStyleBottomLeftnew = {
  backgroundColor: '#0e9207',
  color: '#ffff',
  borderBottomLeftRadius: '10px',
  borderRight: '1px solid #E0E0E0',
  borderBottom: '1px solid #E0E0E0',
};

const columnHeaderStyleTopRightnew = {
  background: '#0e9207',
  color: '#ffff',
  borderBottom: '1px solid #E0E0E0',
  borderTopRightRadius: '10px',
  borderRight: '1px solid #E0E0E0',
};

const columnHeaderStyleBottomRightnew = {
  backgroundColor: '#0e9207',
  color: '#ffff',
  borderBottomRightRadius: '10px',
  borderRight: '1px solid #E0E0E0',
  borderBottom: '1px solid #E0E0E0',
};

const columnHeaderStyle = {
  background: '#0e9207',
  color: '#ffff',
  borderBottom: '1px solid #E0E0E0',
  borderRight: '1px solid #E0E0E0',
};

const columnDataStyle = {
  borderBottom: '1px solid #E0E0E0',
  borderRight: '1px solid #E0E0E0',
};

const columnHeaderStyleLeft = {
  backgroundColor: '#0e9207',
  color: '#ffff',
  borderTopLeftRadius: '10px',
  borderBottomLeftRadius: '10px',
  borderRight: '1px solid #E0E0E0',
  borderBottom: '1px solid #E0E0E0',
};

const columnHeaderStyleRight = {
  backgroundColor: '#0e9207',
  color: '#ffff',
  borderBottomRightRadius: '10px',
  borderTopRightRadius: '10px',
  borderRight: '1px solid #E0E0E0',
  borderBottom: '1px solid #E0E0E0',
};

const columnHeaderStyleTopLeft = {
  background: '#0e9207',
  color: '#ffff',
  borderBottom: '1px solid #E0E0E0',
  borderTopLeftRadius: '10px',
  borderRight: '1px solid #E0E0E0',
};

const columnHeaderStyleBottomLeft = {
  backgroundColor: '#0e9207',
  color: '#ffff',
  borderBottomLeftRadius: '10px',
  borderRight: '1px solid #E0E0E0',
  borderBottom: '1px solid #E0E0E0',
};

const columnHeaderStyleTopRight = {
  background: '#0e9207',
  color: '#ffff',
  borderBottom: '1px solid #E0E0E0',
  borderTopRightRadius: '10px',
  borderRight: '1px solid #E0E0E0',
};

const columnHeaderStyleBottomRight = {
  backgroundColor: '#0e9207',
  color: '#ffff',
  borderBottomRightRadius: '10px',
  borderRight: '1px solid #E0E0E0',
  borderBottom: '1px solid #E0E0E0',
};

export const reportTableStyle = {
  columnStyle,
  columnHeaderStylenew,
  columnDataStylenew,
  columnHeaderStyleLeftnew,
  columnHeaderStyleRightnew,
  columnHeaderStyleTopLeftnew,
  columnHeaderStyleBottomLeftnew,
  columnHeaderStyleTopRightnew,
  columnHeaderStyleBottomRightnew,
  columnHeaderStyle,
  columnDataStyle,
  columnHeaderStyleLeft,
  columnHeaderStyleRight,
  columnHeaderStyleTopLeft,
  columnHeaderStyleBottomLeft,
  columnHeaderStyleTopRight,
  columnHeaderStyleBottomRight,
};

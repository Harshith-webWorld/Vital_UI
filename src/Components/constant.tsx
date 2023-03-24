import { years, months } from '../Website/components/Reports/utils';
import moment from 'moment';

export const isValidDate = moment().format('YYYY-MM-DD');
export const monthList = months.map((months, i) => {
  return { label: months.monthName, value: months.month };
});
export let NoneList = [{ label: 'None', value: 0 }];

export const yearList = years.map((years, i) => {
  return { label: years, value: years };
});
export const current_month = monthList.filter((item) => {
  if (item.value === new Date().getMonth() + 1) {
    return item;
  }
});
export const current_year = new Date().getFullYear();
export let previous_month: any =
  current_month[0]?.value - 1 > 0 ? current_month[0]?.value - 1 : 1;
export let initmonth = months?.find((option: any) => {
  if (option?.month == previous_month) return option;
})?.monthName;
export const endMonthList = (startMonth) => {
  let monthNoArray = months.map((li, index) => li.month);
  let slicedMonthArray = monthNoArray.slice(
    parseInt(startMonth) - 1,
    monthNoArray.length,
  );
  let filteredEndMonth = months.filter((months) =>
    slicedMonthArray.includes(months.month),
  );
  const endMonth = filteredEndMonth.map((months: any, i: any) => {
    return { label: months.monthName, value: months.month };
  });
  return [...endMonth];
};
export const endYearGenerate = (year: any) => {
  let startYear = parseInt(year)
  let yearList = [...years];
  let indexOfStartYear = yearList.indexOf(startYear);
  let sliceArray = yearList.slice(0, indexOfStartYear + 1);
  return sliceArray.map((years: any, i: any) => {
    return { label: years, value: years };
  });
};

export const options = {
  offsetGridLines: false,
  drawTicks: true,
  layout: {
    padding: {
      top: 30,
      right: 40,
      bottom: 40,
      left: 40,
    },
  },
  legend: {
    display: true,
    position: 'bottom',
    align: 'start',
    labels: {
      usePointStyle: true,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        stacked: false,
        ticks: {
          padding: 5,
        },
        gridLines: {
          display: true,
          drawBorder: true,
        },
        scaleLabel: {
          display: true,
          labelString: 'Months',
          fontSize: 14,
        },
      },
    ],
    yAxes: [
      {
        stacked: false,
        gridLines: {
          display: true,
          drawBorder: false,
        },
        scaleLabel: {
          display: true,
          labelString: 'No of Cases',
          fontSize: 14,
        },
        ticks: {
          beginAtZero: true,
          padding: 20,
          callback(n: any) {
            if (n < 1e3) return n;
            if (n >= 1e3) return +(n / 1e3).toFixed(1) + 'K';
          },
        },
      },
    ],
  },
};

export function findtotal(arr: any, key: string) {
  let total: any = 0;
  arr.forEach((element: any) => {
    total = total + parseInt(element[key]);
  });
  return isNaN(total) ? '' : total;
}

export function findMonthName(monthId) {
  const index = months.findIndex( (month) => month.month === parseInt(monthId));
  return months[index].monthName
}
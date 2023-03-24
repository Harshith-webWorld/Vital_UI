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
          labelString: 'Districts',
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

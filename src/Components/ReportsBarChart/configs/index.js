function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          backgroundColor: 'rgba(255, 255, 255, 255)',
          data: datasets.data,
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      offsetGridLines: true,
      drawTicks: true,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        labels: {
          boxWidth: 10,
          textAlign: 'left',
        },
      },
      scales: {
        xAxes: [
          {
            stacked: false,
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#fff',
            },
          },
        ],
        yAxes: [
          {
            stacked: false,
            gridLines: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#fff',
            },
          },
        ],
      },
    },
  };
}

export default configs;

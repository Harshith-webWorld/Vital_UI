function configs(labels, datasets, displayY, showunit) {
  const datasetGenerator = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => {
        return {
          label: item.label,
          backgroundColor: item.backgroundColor,
          data: item.data,
          maxBarThickness: 6,
        };
      });
    } else {
      return [
        {
          label: data.label,
          backgroundColor: data.backgroundColor,
          data: data.data,
          maxBarThickness: 6,
        },
      ];
    }
  };

  return {
    data: {
      labels,
      datasets: datasetGenerator(datasets),
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
              display: true,
            },
            scaleLabel: {
              display: false,
              labelString: 'Months',
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#525050',
            },
          },
        ],
        yAxes: [
          {
            stacked: false,
            gridLines: {
              display: false,
            },
            scaleLabel: {
              display: displayY,
              labelString: 'MF Rate %',
              fontSize: 14,
            },
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return `${value} ${showunit}`;
              },
              fontColor: '#525050',
              max: 100,
              min: 0,
            },
          },
        ],
      },
    },
  };
}

export default configs;

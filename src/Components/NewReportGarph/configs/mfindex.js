function mfconfigs(labels, datasets, displayY, showunit) {
  const datasetGenerator = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => {
        return {
          label: item.label,
          backgroundColor: "transparent",
          borderColor: item.backgroundColor,
          data: item.data,
          maxBarThickness: 6,
        };
      });
    } else {
      return [
        {
          label: data.label,
          backgroundColor: "transparent",
          borderColor: data.backgroundColor,
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
      // onClick: (e, element) => {
      //   if (element.length > 0) {
      //     var ind = element[0]._index;
      //     alert(ind);
      //   }
      // },
      onHover: (event, chartElement) => {
        event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
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
              max: 1.0,
              min: 0.0,
            },
          },
        ],
      },
    },
  };
}

export default mfconfigs;

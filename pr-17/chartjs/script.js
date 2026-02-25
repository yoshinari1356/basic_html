{
  const currentMonth = {
    displayCount: 10000, // 表示数
    clickCount: 800, // クリック数
    cvCount: 200 // CV数
  };

  const lastMonth = {
    displayCount: 8000,
    clickCount: 700,
    cvCount: 100
  };

  const displayRatio = currentMonth.clickCount / lastMonth.clickCount * 100; // 表示数の割合を100%とする
  const clickRatio = currentMonth.clickCount / lastMonth.displayCount * 100; // クリック数の割合
  const cvRatio = currentMonth.cvCount / lastMonth.displayCount * 100; // CV数の割合
  const colors = [
    {
      backgroundColor: 'rgba(255, 206, 86)',
      borderColor: 'rgba(255, 206, 86)',
    },
    {
      backgroundColor: '#5383EC',
      borderColor: '#5383EC',
    },
    {
      backgroundColor: '#D85140',
      borderColor: '#D85140',
    }
  ]
  const barChartData = {
    labels: ['表示数', 'クリック数', 'CV数'],
    datasets: [{
      label: '割合',
      backgroundColor: colors[0].backgroundColor,
      borderColor: colors[0].borderColor,
      borderWidth: 3,
      yAxisID: 'y2',
      type: 'line',
      data: [displayRatio, clickRatio, cvRatio],
    }, {
      label: '先月',
      backgroundColor: colors[1].backgroundColor,
      borderColor: colors[1].borderColor,
      borderWidth: 1,
      yAxisID: 'y',
      data: [lastMonth.displayCount, lastMonth.clickCount, lastMonth.cvCount]
    }, {
      label: '今月',
      backgroundColor: colors[2].backgroundColor,
      borderColor: colors[2].borderColor,
      borderWidth: 1,
      yAxisID: 'y',
      data: [currentMonth.displayCount, currentMonth.clickCount, currentMonth.cvCount],
    }]
  };

  const options = {
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          beginAtZero: true,
          stepSize: 2000
        }
      },
      y2: {
        type: 'linear',
        position: 'right',
        ticks: {
          beginAtZero: true,
          stepSize: 20,
          callback: function(value, index, values) {
            return value + '%';
          }
        }
      }
    }
  };

  const ctx = document.getElementById('multi_axis').getContext('2d');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: options
  });
}


{
  const dailyData = [
    { displayCount: 2, clickCount: 0, cvCount: 1 }, // 1日目
    { displayCount: 3, clickCount: 1, cvCount: 0 }, // 2日目
    { displayCount: 6, clickCount: 1, cvCount: 0 }, // 3日目
    { displayCount: 7, clickCount: 2, cvCount: 1 }, // 4日目
    { displayCount: 0, clickCount: 0, cvCount: 0 }, // 5日目
    { displayCount: 3, clickCount: 1, cvCount: 0 }, // 6日目
    { displayCount: 3, clickCount: 1, cvCount: 0 }, // 7日目
    { displayCount: 2, clickCount: 0, cvCount: 0 }, // 8日目
    { displayCount: 7, clickCount: 2, cvCount: 0 }, // 9日目
    { displayCount: 1, clickCount: 4, cvCount: 1 }, // 10日目
    { displayCount: 4, clickCount: 1, cvCount: 0 }, // 11日目
    { displayCount: 0, clickCount: 0, cvCount: 0 }, // 12日目
    { displayCount: 3, clickCount: 5, cvCount: 1 }, // 13日目
    { displayCount: 9, clickCount: 2, cvCount: 0 }, // 14日目
    { displayCount: 6, clickCount: 1, cvCount: 0 }, // 15日目
    { displayCount: 6, clickCount: 1, cvCount: 0 }, // 16日目
    { displayCount: 8, clickCount: 2, cvCount: 0 }, // 17日目
    { displayCount: 9, clickCount: 1, cvCount: 0 }, // 18日目
    { displayCount: 4, clickCount: 1, cvCount: 0 }, // 19日目
    { displayCount: 7, clickCount: 2, cvCount: 0 }, // 20日目
    { displayCount: 2, clickCount: 0, cvCount: 0 }, // 21日目
    { displayCount: 3, clickCount: 0, cvCount: 0 }, // 22日目
    { displayCount: 4, clickCount: 1, cvCount: 0 }, // 23日目
    { displayCount: 1, clickCount: 2, cvCount: 1 }, // 24日目
    { displayCount: 7, clickCount: 2, cvCount: 0 }, // 25日目
    { displayCount: 5, clickCount: 1, cvCount: 0 }, // 26日目
    { displayCount: 3, clickCount: 1, cvCount: 0 }, // 27日目
    { displayCount: 2, clickCount: 0, cvCount: 0 }, // 28日目
    { displayCount: 5, clickCount: 1, cvCount: 0 }, // 29日目
    { displayCount: 0, clickCount: 1, cvCount: 0 }, // 30日目
    { displayCount: 1, clickCount: 1, cvCount: 0 } // 31日目
  ];

  const labels = Array.from({ length: 31 }, (_, i) => i + 1); // 日付のラベルを作成

  const displayCounts = dailyData.map(datum => datum.displayCount); // 表示数の配列を作成
  const clickCounts = dailyData.map(datum => datum.clickCount); // クリック数の配列を作成
  const cvCounts = dailyData.map(datum => datum.cvCount); // CV数の配列を作成
  const colors = [
    {
      backgroundColor: 'rgba(83, 131, 236, 0.4)',
      borderColor: 'rgba(83, 131, 236, 0.4)',
    },
    {
      backgroundColor: 'rgba(83, 131, 236)',
      borderColor: 'rgba(83, 131, 236)',
    },
    {
      backgroundColor: '#D85140',
      borderColor: '#D85140',
    }
  ]
  const lineChartData = {
    labels: labels,
    datasets: [{
      label: '表示数',
      backgroundColor: colors[0].backgroundColor,
      borderColor: colors[0].borderColor,
      borderWidth: 1,
      yAxisID: 'y-axis-1',
      data: displayCounts
    }, {
      label: 'クリック数',
      backgroundColor: colors[1].backgroundColor,
      borderColor: colors[1].borderColor,
      borderWidth: 1,
      yAxisID: 'y-axis-1',
      data: clickCounts
    }, {
      label: 'CV数',
      backgroundColor: colors[2].backgroundColor,
      borderColor: colors[2].borderColor,
      borderWidth: 1,
      yAxisID: 'y-axis-1',
      data: cvCounts
    }]
  };

  const options = {
    scales: {
      yAxes: [{
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        ticks: {
          beginAtZero: true,
          stepSize: 50
        }
      }, {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        ticks: {
          beginAtZero: true,
          stepSize: 20
        },
        gridLines: {
          drawOnChartArea: false
        }
      }],
      xAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return value + '日';
          }
        }
      }]
    }
  };

  const ctx = document.getElementById('dayly_chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: lineChartData,
    options: options
  });

}


{
  const monthlyData = [
    { displayCount: 172, clickCount: 87, cvCount: 8 }, //  1月
    { displayCount: 167, clickCount: 95, cvCount: 9 }, //  2月
    { displayCount: 152, clickCount: 95, cvCount: 1 }, //  3月
    { displayCount: 188, clickCount: 91, cvCount: 7 }, //  4月
    { displayCount: 128, clickCount: 94, cvCount: 3 }, //  5月
    { displayCount: 110, clickCount: 81, cvCount: 3 }, //  6月
    { displayCount: 190, clickCount: 92, cvCount: 1 }, //  7月
    { displayCount: 117, clickCount: 91, cvCount: 8 }, //  8月
    { displayCount: 159, clickCount: 79, cvCount: 2 }, //  9月
    { displayCount: 145, clickCount: 76, cvCount: 9 }, // 10月
    { displayCount: 173, clickCount: 81, cvCount: 9 }, // 11月
    { displayCount: 121, clickCount: 82, cvCount: 7 }  // 12月
  ];

  const labels = Array.from({ length: 12 }, (_, i) => i + 1); // 月のラベルを作成

  const displayCounts = monthlyData.map(datum => datum.displayCount); // 表示数の配列を作成
  const clickCounts = monthlyData.map(datum => datum.clickCount); // クリック数の配列を作成
  const cvCounts = monthlyData.map(datum => datum.cvCount); // CV数の配列を作成
  const colors = [
    {
      backgroundColor: 'rgba(83, 131, 236, 0.4)',
      borderColor: 'rgba(83, 131, 236, 0.4)',
    },
    {
      backgroundColor: 'rgba(83, 131, 236)',
      borderColor: 'rgba(83, 131, 236)',
    },
    {
      backgroundColor: '#D85140',
      borderColor: '#D85140',
    }
  ]

  const lineChartData = {
    labels: labels,
    datasets: [{
      label: '表示数',
      backgroundColor: colors[0].backgroundColor,
      borderColor: colors[0].borderColor,
      borderWidth: 1,
      yAxisID: 'y-axis-1',
      data: displayCounts
    }, {
      label: 'クリック数',
      backgroundColor: colors[1].backgroundColor,
      borderColor: colors[1].borderColor,
      borderWidth: 1,
      yAxisID: 'y-axis-1',
      data: clickCounts
    }, {
      label: 'CV数',
      backgroundColor: colors[2].backgroundColor,
      borderColor: colors[2].borderColor,
      borderWidth: 1,
      yAxisID: 'y-axis-1',
      data: cvCounts
    }]
  };

  const options = {
    scales: {
      yAxes: [{
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        ticks: {
          beginAtZero: true,
          stepSize: 50
        }
      }, {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        ticks: {
          beginAtZero: true,
          stepSize: 20
        },
        gridLines: {
          drawOnChartArea: false
        }
      }],
      xAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return value + '日';
          }
        }
      }]
    }
  };

  const ctx = document.getElementById('monthly_chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: lineChartData,
    options: options
  });

}

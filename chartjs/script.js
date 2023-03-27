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

  const displayRatio = 100; // 表示数の割合を100%とする
  const clickRatio = currentMonth.clickCount / currentMonth.displayCount * 100; // クリック数の割合
  const cvRatio = currentMonth.cvCount / currentMonth.displayCount * 100; // CV数の割合

  const barChartData = {
    labels: ['表示数', 'クリック数', 'CV数'],
    datasets: [{
      label: '割合',
      backgroundColor: 'rgba(255, 206, 86)',
      borderColor: 'rgba(255, 206, 86)',
      borderWidth: 3,
      yAxisID: 'y2',
      type: 'line',
      data: [displayRatio, clickRatio, cvRatio]
    }, {
      label: '先月',
      backgroundColor: '#5383EC',
      borderColor: '#5383EC',
      borderWidth: 1,
      yAxisID: 'y',
      data: [lastMonth.displayCount, lastMonth.clickCount, lastMonth.cvCount]
    }, {
      label: '今月',
      backgroundColor: '#D85140',
      borderColor: '#D85140',
      borderWidth: 1,
      yAxisID: 'y',
      data: [currentMonth.displayCount, currentMonth.clickCount, currentMonth.cvCount]
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
        max: 100,
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

  const multi_axis_ctx = document.getElementById('multi_axis').getContext('2d');

  const multi_axis_chart = new Chart(multi_axis_ctx, {
    type: 'bar',
    data: barChartData,
    options: options
  });
}

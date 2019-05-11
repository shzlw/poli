import * as Util from '../api/Util';

const CHART_COLORS = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", 
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", 
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", 
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getPieOptionTemplate = (legend, series) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      data: legend,
      right: 10,
      top: 10,
      bottom: 10
    },
    series: [
      {
        type:'pie',
        center: ['50%', '50%'],
        radius: '50%',
        data: series
      }
    ]
  }
};

export const getPieOption = (queryResultData, pieKey, pieValue) => {
  let legend = [];
  let series = [];
  for (let i = 0; i < queryResultData.length; i++) {
    const row = queryResultData[i];
    legend.push(row[pieKey]);
    series.push({
      name: row[pieKey],
      value: row[pieValue]
    });  
  }
  return getPieOptionTemplate(legend, series);
}

const getBarOptionTemplate = (axisData, seriesData, isHorizontal) => {

  let xAxis = {};
  let yAxis = {};
  if (isHorizontal) {
    xAxis = {
      type: 'value'
    };
    yAxis = {
      type: 'category',
      data: axisData
    }
  } else {
    xAxis = {
      type: 'category',
      data: axisData
    };
    yAxis = {
      type: 'value'
    }
  }

  return {
    color: CHART_COLORS,
    tooltip: {
    },
    xAxis: xAxis,
    yAxis: yAxis,
    series: [
      {
        type: 'bar',
        data: seriesData
      }
    ]
  }
};

const getLineOptionTemplate = (xAxisData, seriesData, smooth) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        data: seriesData,
        smooth: smooth
      }
    ]
  }
};

const getTimeLineOptionTemplate = (seriesData) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value, index) => {
          const date = new Date(value);
          return [date.getMonth() + 1, date.getDate()].join('-');
        }
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        data: seriesData
      }
    ]
  }
};

const getAreaOptionTemplate = (xAxisData, seriesData, smooth) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        data: seriesData,
        areaStyle: {},
        smooth: smooth
      }
    ]
  }
};

const getHeatmapOptionTemplate = (min, max, xAxisData, yAxisData, seriesData) => {
  return {
    color: CHART_COLORS,
    animation: false,
    grid: {
      y: 10
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitArea: {
          show: true
      }
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: min,
      max: max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      itemWidth: 12,
      bottom: 5,
      inRange: {
        // color: ['#121122', 'rgba(3,4,5,0.4)', 'red']
        color: ['#FFFFFF', '#000000']
      }
    },
    series: [{
      type: 'heatmap',
      data: seriesData,
      label: {
        normal: {
          show: true,
          color: '#FFFFFF'
        }
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
};

const getTreemapOptionTemplate = (seriesData) => {
  return {
    series: [{
      name: 'ALL',
      type: 'treemap',
      data: seriesData,
      levels: [
        {
          itemStyle: {
            normal: {
              borderColor: '#f9f9f9',
              borderWidth: 2,
              gapWidth: 2
            }
          }
        }
      ]
    }]
  }
}

const getCalendarHeatmapOptionTemplate = (min, max, seriesData) => {
  return {
    visualMap: {
      show: false,
      min: 1,
      max: 10
    },
    calendar: {
      range: '2017'
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtulData(2017)
    }
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function getVirtulData(year) {
    year = year || '2017';
    var date = + new Date(year + '-01-01');
    var end = + new Date(year + '-12-31');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (let time = date; time <= end; time += dayTime) {
      const value = getRandomInt(1, 10);
      data.push([
        formatDate(new Date(time)),
        value
      ]);
    }
    
    return data;
}

const buildBarOption = () => {
  const xAxisData = [];
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const value = getRandomInt(1, 10);
    xAxisData.push(name);
    seriesData.push(value);
  }
  return getBarOptionTemplate(xAxisData, seriesData, false);
}

const buildBarOption2 = () => {
  const xAxisData = [];
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const value = getRandomInt(1, 10);
    xAxisData.push(name);
    seriesData.push(value);
  }
  return getBarOptionTemplate(xAxisData, seriesData, true);
}

const buildLineOption = () => {
  const xAxisData = [];
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const value = getRandomInt(1, 10);
    xAxisData.push(name);
    seriesData.push(value);
  }
  return getLineOptionTemplate(xAxisData, seriesData, false);
}

const buildAreaOption = () => {
  const xAxisData = [];
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const value = getRandomInt(1, 10);
    xAxisData.push(name);
    seriesData.push(value);
  }
  return getAreaOptionTemplate(xAxisData, seriesData, true);
}

const buildHeatmapOption = () => {
  const xAxisData = [];
  const yAxisData = [];
  const seriesData = [];
  const row = 5;
  const column = 10;
  for (let i = 0; i < row; i++) {
    xAxisData.push('x' + i);
  }
  for (let j = 0; j < column; j++) {
    yAxisData.push('y' + j);
  }

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      const value = getRandomInt(1, 10);
      seriesData.push([i, j, value]);
    }
  }
  return getHeatmapOptionTemplate(1, 10, xAxisData, yAxisData, seriesData);
}

const buildTreemapOption = () => {
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const value = getRandomInt(1, 10);
    seriesData.push({
      name: name,
      value: value
    });
  }
  return getTreemapOptionTemplate(seriesData);
}

const buildTimeLineOption = () => {
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const epoch = + new Date();
    const date = new Date(epoch);
    const value = getRandomInt(1, 10);
    seriesData.push({
      name: name,
      value: [
        [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/'), 
        value
      ]
    });
  }

  return getTimeLineOptionTemplate(seriesData);
}

const buildCalenarHeatmapOption = () => {
  return getCalendarHeatmapOptionTemplate();
}
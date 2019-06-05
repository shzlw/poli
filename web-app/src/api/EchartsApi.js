import * as Constants from '../api/Constants';

const CHART_COLORS = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", 
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", 
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", 
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getChartOption = (type, data, config) => {
  let chartOption = {};
  if (type === Constants.PIE) {
    chartOption = getPieOption(data, config);
  } else if (type === Constants.BAR) {
    chartOption = getBarOption(data, config);
  } else if (type === Constants.LINE) {
    chartOption = getLineOption(data, config);
  } else if (type === Constants.AREA) {
    chartOption = getAreaOption(data, config);
  } else if (type === Constants.HEATMAP) {
  } else if (type === Constants.TREEMAP) {
  }
  return chartOption;
}

/**
 * Pie chart
 */
const getPieOptionTemplate = (legend, series) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      data: legend,
      right: 15,
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

const getPieOption = (data, config) => {
  const {
    key,
    value
  } = config;
  let legend = [];
  let series = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    legend.push(row[key]);
    series.push({
      name: row[key],
      value: row[value]
    });  
  }
  return getPieOptionTemplate(legend, series);
}

/**
 * Bar Chart
 */
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
    grid:{
      top: 15,
      bottom: 5,
      left: 10,
      right: 15,
      containLabel: true
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

const getBarOption = (data, config) => {
  const {
    key,
    value,
    isHorizontal = false
  } = config;
  // Text
  const xAxisData = [];
  // Number
  const seriesData = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    xAxisData.push(row[key]);
    seriesData.push(row[value]);  
  }
  return getBarOptionTemplate(xAxisData, seriesData, isHorizontal);
}

/**
 * Line chart
 */
const getLineOptionTemplate = (xAxisData, seriesData, smooth) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    grid:{
      top: 15,
      bottom: 5,
      left: 10,
      right: 15,
      containLabel: true
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

const getLineOption = (data, config) => {
  const {
    key,
    value,
    isSmooth = false
  } = config;
  // Text
  const xAxisData = [];
  // Number
  const seriesData = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    xAxisData.push(row[key]);
    seriesData.push(row[value]);  
  }
  return getLineOptionTemplate(xAxisData, seriesData, isSmooth);
}

/**
 * Area chart
 */
const getAreaOptionTemplate = (xAxisData, seriesData, smooth) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    grid:{
      top: 15,
      bottom: 5,
      left: 10,
      right: 15,
      containLabel: true
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

const getAreaOption = (data, config) => {
  const {
    key,
    value,
    isSmooth = true
  } = config;
  // Text
  const xAxisData = [];
  // Number
  const seriesData = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    xAxisData.push(row[key]);
    seriesData.push(row[value]);  
  }
  return getAreaOptionTemplate(xAxisData, seriesData, isSmooth);
}

/**
 * TODO: Heatmap chart
 */
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



/**
 * TODO: Time line chart
 */
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

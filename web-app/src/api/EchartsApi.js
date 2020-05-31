import * as Constants from '../api/Constants';

const DEFAULT_COLOR_PALETTE = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", 
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", 
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", 
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

const VINTAGE_COLOR_PALETTE = ['#d87c7c','#919e8b', '#d7ab82', '#6e7074', 
  '#61a0a8','#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'
];

const ROMA_COLOR_PALETTE = ['#E01F54','#001852','#f5e8c8','#b8d2c7','#c6b38e',
  '#a4d8c2','#f3d999','#d3758f','#dcc392','#2e4783',
  '#82b6e9','#ff6347','#a092f1','#0a915d','#eaf889',
  '#6699FF','#ff6666','#3cb371','#d5b158','#38b6b6'
];


const MACARONS_COLOR_PALETTE = [
  '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
  '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
  '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
  '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
];

const SHINE_COLOR_PALETTE = [
  '#c12e34','#e6b600','#0098d9','#2b821d',
  '#005eaa','#339ca8','#cda819','#32a487'
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const keyValueToLegendSeries = (key, value, data) => {
  const legendData = [];
  const seriesData = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    legendData.push(row[key]);
    seriesData.push({
      name: row[key],
      value: row[value]
    });  
  }
  return {
    legendData,
    seriesData
  }
}

const rgbaToHex = (color) => {
  if (color.startsWith('#')) {
    return color;
  }

  const newRbga = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return newRbga ? "#" +
    ("0" + parseInt(newRbga[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(newRbga[2], 10).toString(16)).slice(-2) +
    ("0" + parseInt(newRbga[3], 10).toString(16)).slice(-2) 
    : '';
}

const getColorPlatte = (name) => {
  if (name === Constants.VINTAGE) {
    return VINTAGE_COLOR_PALETTE;
  } else if (name === Constants.ROMA) {
    return ROMA_COLOR_PALETTE;
  } else if (name === Constants.MACARONS) {
    return MACARONS_COLOR_PALETTE;
  } else if (name === Constants.SHINE) {
    return SHINE_COLOR_PALETTE
  }
  return DEFAULT_COLOR_PALETTE;
}

export const getChartOption = (type, data, config, title) => {
  let chartOption = {};
  if (type === Constants.PIE) {
    chartOption = getPieOption(data, config);
  } else if (type === Constants.BAR) {
    chartOption = getBarOption(data, config, title);
  } else if (type === Constants.LINE) {
    chartOption = getLineOption(data, config, title);
  } else if (type === Constants.AREA) {
    chartOption = getAreaOption(data, config, title);
  } else if (type === Constants.HEATMAP) {
    chartOption = getHeatmapOption(data, config);
  } else if (type === Constants.TREEMAP) {
    chartOption = getTreemapOption(data, config);
  } else if (type === Constants.FUNNEL) {
    chartOption = getFunnelOption(data, config);
  }
  return chartOption;
}

/**
 * Pie chart
 */
const getPieOptionTemplate = (colorPlatte = 'default', legendData, seriesData) => {
  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      data: legendData,
      right: 15,
      top: 10,
      bottom: 10
    },
    series: [
      {
        type:'pie',
        center: ['50%', '50%'],
        radius: '50%',
        data: seriesData
      }
    ]
  }
};

const getPieOption = (data, config) => {
  const {
    key,
    value,
    colorPlatte
  } = config;
  const result = keyValueToLegendSeries(key, value, data);
  return getPieOptionTemplate(colorPlatte, result.legendData, result.seriesData);
}

/**
 * Bar Chart
 */
const getBarOptionTemplate = (colorPlatte = 'default', legendData, axisData, series, config = {}) => {
  const {
    isHorizontal = false,
    showAllAxisLabels = false,
    gridTop = 30,
    gridBottom = 5,
    gridLeft = 10,
    gridRight = 15
  } = config;

  const axisLabel = showAllAxisLabels ? {
    interval: 0
  } : {};

  let xAxis = {};
  let yAxis = {};
  if (isHorizontal) {
    xAxis = {
      type: 'value'
    };
    yAxis = {
      type: 'category',
      data: axisData,
      axisLabel: {
        interval: 0
      }
    }
  } else {
    xAxis = {
      type: 'category',
      data: axisData,
      axisLabel: axisLabel
    };
    yAxis = {
      type: 'value'
    }
  }

  const legend = parseLegendData(legendData);

  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      top: Number(gridTop),
      bottom: Number(gridBottom),
      left: Number(gridLeft),
      right: Number(gridRight),
      containLabel: true
    },
    legend: legend,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
  }
};

const getBarOption = (data, config, title) => {
  const {
    xAxis,
    legend,
    yAxis,
    hasMultiSeries = false,
    isStacked = true,
    colorPlatte = 'default',
    multiSeriesDefaultValue = 0
  } = config;

  const type = 'bar';
  const seriesData = [];

  if (hasMultiSeries) {  
    const {
      legendList,
      xAxisList,
      grid 
    } = dataListToGrid(data, xAxis, yAxis, legend, multiSeriesDefaultValue);

    // From grid to series list.
    for (let i = 0; i < legendList.length; i++) {
      const series = {
        name: legendList[i],
        type: type,
        data: []
      };
      if (isStacked) {
        series.stack = title || 'Empty';
      } 
      for (let j = 0; j < xAxisList.length; j++) {
        series.data.push(grid[i][j]);
      }
      seriesData.push(series);
    }

    return getBarOptionTemplate(colorPlatte, legendList, xAxisList, seriesData, config);
  } else {
    const xAxisData = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      xAxisData.push(row[xAxis]);
      seriesData.push(row[yAxis]);
    }

    const series = {
      data: seriesData,
      type: type
    }
    return getBarOptionTemplate(colorPlatte, null, xAxisData, series, config);
  }
}

/**
 * Line chart
 */
const getLineOptionTemplate = (colorPlatte = 'default', legendData, xAxisData, series, config = {}) => {
  const {
    showAllAxisLabels = false,
    gridTop = 30,
    gridBottom = 5,
    gridLeft = 10,
    gridRight = 15
  } = config;

  const axisLabel = showAllAxisLabels ? {
    interval: 0
  } : {};


  const legend = parseLegendData(legendData);

  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      top: Number(gridTop),
      bottom: Number(gridBottom),
      left: Number(gridLeft),
      right: Number(gridRight),
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: axisLabel
    },
    yAxis: {
      type: 'value'
    },
    legend: legend,
    series: series
  }
};

const getLineOption = (data, config) => {
  const {
    xAxis,
    legend,
    yAxis,
    hasMultiSeries = false,
    isSmooth = false,
    colorPlatte = 'default',
    multiSeriesDefaultValue = 0
  } = config;

  const seriesData = [];
  const type = 'line';

  if (hasMultiSeries) { 
    const {
      legendList,
      xAxisList,
      grid 
    } = dataListToGrid(data, xAxis, yAxis, legend, multiSeriesDefaultValue);

    // From grid to series list.
    for (let i = 0; i < legendList.length; i++) {
      const series = {
        name: legendList[i],
        type: type,
        data: [],
        smooth: isSmooth
      };
      for (let j = 0; j < xAxisList.length; j++) {
        series.data.push(grid[i][j]);
      }
      seriesData.push(series);
    }

    return getLineOptionTemplate(colorPlatte, legendList, xAxisList, seriesData, config);
  } else {
    const xAxisData = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      xAxisData.push(row[xAxis]);
      seriesData.push(row[yAxis]);
    }

    const series = {
      data: seriesData,
      type: type,
      smooth: isSmooth
    }
    return getLineOptionTemplate(colorPlatte, null, xAxisData, series, config);
  }
}

/**
 * Area chart
 */
const getAreaOptionTemplate = (colorPlatte = 'default', legendData, xAxisData, series, config = {}) => {
  const {
    showAllAxisLabels = false,
    gridTop = 30,
    gridBottom = 5,
    gridLeft = 10,
    gridRight = 15
  } = config;

  const axisLabel = showAllAxisLabels ? {
    interval: 0
  } : {};

  const legend = parseLegendData(legendData);
  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      top: Number(gridTop),
      bottom: Number(gridBottom),
      left: Number(gridLeft),
      right: Number(gridRight),
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: axisLabel
    },
    yAxis: {
      type: 'value'
    },
    legend: legend,
    series: series
  }
};

const getAreaOption = (data, config) => {
   const {
    xAxis,
    legend,
    yAxis,
    hasMultiSeries = false,
    isSmooth = false,
    colorPlatte = 'default',
    multiSeriesDefaultValue = 0
  } = config;

  const seriesData = [];
  const type = 'line';

  if (hasMultiSeries) {
    const {
      legendList,
      xAxisList,
      grid 
    } = dataListToGrid(data, xAxis, yAxis, legend, multiSeriesDefaultValue);

    // From grid to series list.
    for (let i = 0; i < legendList.length; i++) {
      const series = {
        name: legendList[i],
        type: type,
        data: [],
        areaStyle: {},
        smooth: isSmooth
      };
      for (let j = 0; j < xAxisList.length; j++) {
        series.data.push(grid[i][j]);
      }
      seriesData.push(series);
    }

    return getAreaOptionTemplate(colorPlatte, legendList, xAxisList, seriesData, config);
  } else {
    const xAxisData = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      xAxisData.push(row[xAxis]);
      seriesData.push(row[yAxis]);
    }
    const series = {
      data: seriesData,
      type: type,
      areaStyle: {},
      smooth: isSmooth
    }
    return getAreaOptionTemplate(colorPlatte, null, xAxisData, series, config);
  }
}

/**
 * Funnel chart
 */
const getFunnelOptionTemplate = (colorPlatte = 'default', legendData, seriesData, config = {}) => {
  const {
    sort = 'descending'
  } = config;

  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      containLabel: true
    },
    legend: {
      data: legendData
    },
    calculable: true,
    series: [{
      type:'funnel',
      top: 40,
      bottom: 10,
      sort: sort,
      data: seriesData
    }]
  };
}

const getFunnelOption = (data, config) => {
  const {
    key,
    value,
    colorPlatte
  } = config;
  const result = keyValueToLegendSeries(key, value, data);
  return getFunnelOptionTemplate(colorPlatte, result.legendData, result.seriesData, config);
}

const getTreemapOptionTemplate = (colorPlatte = 'default', seriesData) => {
  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      containLabel: true
    },
    series: [{
      name: 'ALL',
      type: 'treemap',
      data: seriesData,
      levels: [
        {
          itemStyle: {
            normal: {
              borderColor: '#F9F9F9',
              borderWidth: 2,
              gapWidth: 2
            }
          }
        }
      ]
    }]
  }
}

const getTreemapOption = (data, config) => {
  const {
    key,
    value,
    colorPlatte
  } = config;
  const seriesData = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    seriesData.push({
      name: row[key],
      value: row[value]
    });  
  }
  return getTreemapOptionTemplate(colorPlatte, seriesData);
}

const getHeatmapOptionTemplate = (xAxisData, yAxisData, seriesData, min, max, config = {}) => {
  const {
    minColor = Constants.DEFAULT_MIN_COLOR, 
    maxColor = Constants.DEFAULT_MAX_COLOR,
    showAllAxisLabels = false
  } = config;

  const axisLabel = showAllAxisLabels ? {
    interval: 0
  } : {};

  return {
    animation: false,
    grid: {
      top: 10,
      bottom: 40,
      left: 10,
      right: 15,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitArea: {
        show: true
      },
      axisLabel: axisLabel
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: Number(min),
      max: Number(max),
      calculable: true,
      realtime: false,
      orient: 'horizontal',
      left: 'center',
      itemWidth: 12,
      bottom: 5,
      inRange: {
        color: [minColor, maxColor]
      }
    },
    series: [{
      type: 'heatmap',
      data: seriesData,
      animation: false,
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

const getHeatmapOption = (data, config) => {
  const {
    xAxis,
    yAxis,
    series
  } = config;

  const xAxisData = [];
  const yAxisData = [];
  const seriesData = [];
  
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const xAxisVal = row[xAxis];
    const yAxisVal = row[yAxis];
    const seriesVal = Number(row[series]);
    
    let xIndex = xAxisData.findIndex(a => a === xAxisVal);
    if (xIndex === -1) {
      xAxisData.push(xAxisVal);
      xIndex = xAxisData.length - 1;
    }

    let yIndex = yAxisData.findIndex(a => a === yAxisVal);
    if (yIndex === -1) {
      yAxisData.push(yAxisVal);
      yIndex = yAxisData.length - 1;
    }

    if (seriesVal < min) {
      min = seriesVal;
    }

    if (seriesVal > max) {
      max = seriesVal;
    }

    seriesData.push([xIndex, yIndex, seriesVal]);
  }

  return getHeatmapOptionTemplate(xAxisData, yAxisData, seriesData, min, max, config);
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
    color: DEFAULT_COLOR_PALETTE,
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


const dataListToGrid = (dataList = [], xAxis, yAxis, legend, defaultValue = 0) => {
  const legendData = new Set();
  const xAxisData = new Set();

  for (let i = 0; i < dataList.length; i++) {
    const row = dataList[i];
    const xAxisVal = row[xAxis];
    const legendVal = row[legend];
    xAxisData.add(xAxisVal);
    legendData.add(legendVal);
  }

  const legendList = Array.from(legendData);
  const xAxisList = Array.from(xAxisData);

  // Row: legend, Column: xAxis
  const grid = new Array(legendList.length);
  for (let i = 0; i < grid.length; i++) { 
    grid[i] = new Array(xAxisList.length); 
    grid[i].fill(defaultValue);
  } 

  // Empty element in the grid is undefined.
  for (let i = 0; i < dataList.length; i++) {
    const row = dataList[i];
    const x = legendList.findIndex(val => val === row[legend]);
    const y = xAxisList.findIndex(val => val === row[xAxis]);
    grid[x][y] = row[yAxis];
  }

  return {
    legendList,
    xAxisList,
    grid
  };
}

const parseLegendData = (legendData) => {
  if (legendData !== null) {
    const list = legendData || [];
    const dataList = list.map(val => String(val)); 
    return {
      data: dataList
    }
  } else {
    return {};
  }
}
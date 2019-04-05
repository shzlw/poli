import * as Util from '../api/Util';

const CHART_COLORS = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", 
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", 
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", 
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

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

export const getTableHeaders = (queryResultData) => {
  const headers = [];
  if (!Util.isArrayEmpty(queryResultData)) {
    const obj = queryResultData[0];
    const keys = Object.keys(obj);
    for (const key of keys) {
      headers.push({
        Header: key,
        accessor: key
      })
    }
  }
  return headers;
}

const CHART_COLORS = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", 
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", 
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", 
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

export const getPieOption = (legend, series) => {
  return {
    color: CHART_COLORS,
    tooltip: {
    },
    legend: {
      data: legend,
      orient: 'vertical',
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

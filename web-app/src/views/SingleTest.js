
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

const CHART_COLORS = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", 
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", 
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", 
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

class SingleTest extends Component {

  constructor(props) {
    super(props);
  }

  getOption = () => {
    return {
      color: CHART_COLORS,
      title: {
        text: 'Test'
      },
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['C1','C2','C3']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'C1',
          type:'line',
          stack: 'Total',
          areaStyle: {normal: {}},
          data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
          name:'C2',
          type:'line',
          stack: 'Total',
          areaStyle: {normal: {}},
          data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
          name:'C3',
          type:'line',
          stack: 'Total',
          areaStyle: {normal: {}},
          data:[150, 232, 201, 154, 190, 330, 410]
        }
      ]
    };
  };

  onChartClick = (param, echarts) => {
    console.log('onChartClick', param, echarts);
  };

  onChartLegendselectchanged = (param, echart) => {
    console.log('onChartLegendselectchanged', param, echart);
  };


  render() {
    let onEvents = {
      'click': this.onChartClick,
      'legendselectchanged': this.onChartLegendselectchanged
    };

    return (
      <div>
        <h5>SingleTest</h5>
        <div style={{width: '500px'}}>
          <ReactEcharts 
            option={this.getOption()} 
            style={{height: '350px', width: '100%'}}  
            className='react_for_echarts'
            onEvents={onEvents} />
        </div>
      </div>
    )
  };
}

export default SingleTest;
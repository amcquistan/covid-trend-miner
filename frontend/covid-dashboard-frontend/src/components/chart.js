import React from 'react'
import * as echarts from 'echarts';

export default class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.chartElement = null
    this.chart = null
  }

  componentDidMount() {
    this.chart = echarts.init(this.chartElement)
    this.setOptions(this.chart)
  }

  setOptions = (chart) => {
    // will want to make this options obj a prop
    return chart.setOption({
      title: {
          text: 'ECharts entry example'
      },
      tooltip: {},
      xAxis: {
          data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
      },
      yAxis: {},
      series: [{
          name: 'sales',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
      }]
    })
  }

  render() {
    return (
      <div
        ref={e => { this.chartElement = e }}
        style={{height: 300, width: 300}}
        className={'chart1'} // could make this a prop
      />
    )
  }
}
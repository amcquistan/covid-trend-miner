import React from 'react'
import * as echarts from 'echarts';

export default class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.chartElement = props.chartElement;
    this.chart = null
    this.options = props.options
  }

  componentDidMount() {
    this.chart = echarts.init(this.chartElement)
    this.setOptions(this.chart)
  }

  setOptions = (chart) => {
    // will want to make this options obj a prop
    chart.setOption(this.options)
  }

  render() {
    return (
      <div
        ref={e => { this.chartElement = e }}
        style={{height: 300, width: 300}}
        className={'chart1'} // could make this a prop
      />
    );
  }
}
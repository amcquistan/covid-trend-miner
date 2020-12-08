import React, { useRef, useEffect } from 'react'
import * as echarts from 'echarts';

export interface IExampleChart {
    chart: string;
}

const ExampleChart = (props: IExampleChart) => {

    const myChart = useRef(null)

    useEffect(() => {
        const chart = echarts.init(myChart.current)
    }, [])

    //canvas.setOption({
    //    title: {
    //        text: 'ECharts entry example'
    //    },
    //    tooltip: {},
    //    xAxis: {
    //        data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
    //    },
    //    yAxis: {},
    //    series: [{
    //        name: 'sales',
    //        type: 'bar',
    //        data: [5, 20, 36, 10, 10, 20]
    //    }]
    //})
    
    return (
        <div
            ref={e => { myChart }}
            style={{
                width: "100%",
                height: "100%",
            }}>
        </div>
    );
};

export default ExampleChart;

//export default class Chart extends React.Component {
//    constructor(props) {
//        super(props)
//        this.chartElement = null
//        this.chart = null
//    }

//    componentDidMount() {
//        this.chart = echarts.init(this.chartElement)
//        this.setOptions(this.chart)
//    }

//    setOptions = (chart) => {
//        // will want to make this options obj a prop
//        return chart.setOption({
//            title: {
//                text: 'ECharts entry example'
//            },
//            tooltip: {},
//            xAxis: {
//                data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
//            },
//            yAxis: {},
//            series: [{
//                name: 'sales',
//                type: 'bar',
//                data: [5, 20, 36, 10, 10, 20]
//            }]
//        })
//    }

//    render() {
//        return (
//            <div
//        ref= { e => { this.chartElement = e }
//    }
//    style = {{ height: 300, width: 300 }}
//className = { 'chart1'} // could make this a prop
//    />
//    )
//  }
//}
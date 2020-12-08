import React, { useRef, useEffect } from 'react'
import * as echarts from 'echarts';

export interface IExampleChart {
    chart: string;
}

const ExampleChart = () => {

    const myChart = useRef(null);
   
    useEffect(() => {

        const chart = echarts.init(myChart.current ? myChart.current : emptyDiv());

        chart.setOption({
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

    }, [])

    
    return (
        <div
            ref={myChart}
            style={{
                width: "300px",
                height: "300px",
            }}>
        </div>
    );
};

function emptyDiv(): any {
    return (<div></div>);
}

export default ExampleChart;

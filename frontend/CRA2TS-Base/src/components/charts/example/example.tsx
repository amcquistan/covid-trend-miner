import React, { useRef, useEffect } from 'react'
import * as echarts from 'echarts';
import styles from './example.module.css';

export interface IExampleChart {
    chart: string;
}

const ExampleChart = () => {

    const myChart = useRef(null);
   
    useEffect(() => {

        const chart = echarts.init(myChart.current ? myChart.current : emptyDiv());

        chart.setOption({
            title: {
                text: 'Example Bar Chart With Hooks'
            },
            tooltip: {},
            xAxis: {
                data: [
                    'shirt',
                    'cardign',
                    'chiffon shirt',
                    'pants',
                    'heels',
                    'socks',
                    'shoes',
                    'shorts',
                    't-shirt']
            },
            yAxis: {},
            series: [{
                name: 'sales',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20, 8, 100, 0]
            }]
        })

    }, [])

    
    return (
        <div
            className={styles['chart-container']}
            ref={myChart}>
        </div>
    );
};

//  The echarts init function will not allow nullables.  This returns an empty div until the hook gets a ref
function emptyDiv(): any {
    return (<div></div>);
}

export default ExampleChart;

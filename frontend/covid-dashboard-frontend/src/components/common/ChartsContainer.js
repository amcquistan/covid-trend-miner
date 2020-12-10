import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import ReactEcharts from 'echarts-for-react';

const chartContainerHeight = '375px';

const ChartsContainer = ({ lineOptions, gaugeOptions, title }) => {

  const renderNoData = () => {
    return (<p>No Data Available</p>);
  };

  return (
    <div className='chart-container'>
      <h4 className='text-left'>{title}</h4>
      {/* maybe vertically center these? */}
      <div className='row'>
        <div style={{height: chartContainerHeight}} className='col-md-8'>
            {_.isEmpty(lineOptions)
                ? (renderNoData())
                : (<ReactEcharts option={lineOptions} className='react_for_echarts' style={{height: '350px', width: '100%'}}/>)}
        </div>
        <div style={{height: chartContainerHeight}} className='col-md-4' >
          {_.isEmpty(gaugeOptions)
              ? (renderNoData())
              : (<ReactEcharts option={gaugeOptions} className='react_for_echarts' style={{height: '350px', width: '100%'}}/>)}
        </div>
      </div>
    </div>
  );
};

ChartsContainer.propTypes = {
  lineOptions: PropTypes.object.isRequired,
  gaugeOptions: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
}

export default ChartsContainer;

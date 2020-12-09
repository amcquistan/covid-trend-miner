

import React, { useEffect, useState } from 'react';

import { DatePicker } from "react-tempusdominus-bootstrap";
import { DateTime } from 'luxon';
import _ from 'lodash';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { connect } from 'react-redux';

import ReactEcharts from 'echarts-for-react';

import { action } from '../index';
import * as types from '../redux/actions/types';


const HomePage = ({cities, states, countries, loading, cityDetail, stateDetail, countryDetail}) => {
  const [start, setStart] = useState(DateTime.local().minus({months: 3}));
  const [end, setEnd] = useState(DateTime.local().endOf('day'));

  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState({});
  const [locations, setLocations] = useState([]);
  const [locationType, setLocationType] = useState('city');

  const [casesTotal, setCasesTotal] = useState(0);
  const [recoveriesTotal, setRecoveriesTotal] = useState(0);
  const [deathsTotal, setDeathsTotal] = useState(0);
  const [hospitalizationRate, setHospitalizationRate] = useState(0);
  const [testingRate, setTestingRate] = useState(0);

  const [casesOptions, setCasesOptions] = useState({});
  const [recoveriesOptions, setRecoveriesOptions] = useState({});
  const [deathsOptions, setDeathsOptions] = useState({});
  const [hospitalizationRateOptions, setHospitalizationRateOptions] = useState({});
  const [testingRateOptions, setTestingRateOptions] = useState({});
  const [isReady, setIsReady] = useState(false);



  useEffect(() => {
    refreshCharts();
  }, []);

  const formatLocations = (items, key) => {
    return items.map(item => {
      return { ...item, value: item.location_id, label: item[key] };
    });
  }

  const makeDummyData = () => {
    return {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
      }]
    };
  };

  const commonToolBox = () => {
    return {
      feature: {
        saveAsImage: { title: 'Save As Image' },
        dataView: { readOnly: false, title: 'Data', lang: ['', 'Close', 'Refresh'] }
      }
    }
  }

  const makeData = (type, data, startDate, endDate) => {
    const series = {
      name: type,
      type: 'line',
      data: data.map(item => item[type])
    };

    const xAxis = {
      type: 'category',
      data: data.map(item => item.date)
    }

    const yAxis = {
      type: 'value'
    }

    const option = {
      toolbox: commonToolBox(),
      tooltip: {
        trigger: 'item',
        formatter: (params) => `Date: ${params.name}<br>Name: ${params.seriesName}<br>Total: ${params.data}`
      },
      xAxis,
      yAxis,
      series: [series]
    }

    return option;
  }

  const chartableData = () => {
    if (locationType === 'city') {
      return cityDetail;
    } else if (locationType === 'state') {
      return stateDetail;
    }
    return countryDetail;
  }

  const refreshCharts = () => {
    setIsReady(false);
    setCasesOptions(makeData('cases', chartableData(), start, end));
    setDeathsOptions(makeData('deaths', chartableData(), start, end));
    setRecoveriesOptions(makeData('recoveries', chartableData(), start, end));
    setHospitalizationRateOptions(makeData('hospitalization_rate', chartableData(), start, end));
    setTestingRateOptions(makeData('testing_rate', chartableData(), start, end));
    setIsReady(true);
  };

  const loadOptions = (inputValue, callback) => {
    // _.delay((q) => {
      if (!inputValue) {
        return callback([]);
      }
      // debugger
      let items;
      if (locationType === 'city') {
        items = formatLocations(cities, 'city');
      } else if (locationType === 'state') {
        items = formatLocations(states, 'state');
      } else {
        items = formatLocations(countries, 'country');
      }
      callback(items.filter(l => l.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    // }, 600, inputValue);
  }

  const handleLocationInputChange = (newValue) => {
    setSearchText(newValue);
    return newValue;
  }

  const onLocationChange = (value) => {
    console.log(value)
    setLocation(value);

    if (_.isEmpty(value)) {
      return;
    }

    if (locationType === 'city') {
      action(types.FETCH_CITY, value.location_id);
    } else if (locationType === 'state') {
      action(types.FETCH_STATE, value.location_id);
    } else {
      action(types.FETCH_COUNTRY, value.location_id);
    }
  }

  const onLocationTypeChange = (evt) => {
    setLocationType(evt.target.value);
  }

  const handleStartChange = (evt) => {
    console.log('handleStartChange happened', evt);
    setStart(DateTime.fromISO(evt.date.toISOString()));
  };

  const handleEndChange = (evt) => {
    console.log('handleEndChange', evt);
    setEnd(DateTime.fromISO(evt.date.toISOString()));
  };


  return isReady && (
    <div className='container'>
      <div className='section my-5'>
        <h1 className='my-4'>Covid Trend Miner</h1>
        <div>
          <div className='form-group row'>
            <div className='col-md-2 col-form-label'>
              <label>Location Type</label>
            </div>
            <div className='col-md'>
              <select className='form-control' value={locationType} onChange={onLocationTypeChange}>
                <option value='city'>County</option>
                <option value='state'>State</option>
                <option value='country'>Country</option>
              </select>
            </div>
          </div>

          <div className='form-group row'>
            <div className='col-md-2 col-form-label'>
              <label>Location</label>
            </div>
            <div className='col-md'>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                onInputChange={handleLocationInputChange}
                onChange={onLocationChange}
                isClearable={true}/>
              {/* <Select
                options={locations}
              /> */}
            </div>
          </div>
        </div>
      </div>

      <div className='section my-5'>
        <div className='row'>
          <div className='col-6'>
            <DatePicker onChange={handleStartChange} format='YYYY-MM-DD' date={start.toISO()}/>
          </div>

          <div className='col-6'>
            <DatePicker onChange={handleEndChange} format='YYYY-MM-DD' date={end.toISO()}/>
          </div>
        </div>
      </div>

      <div className='section my-5'>
        <div className='row'>
          <div className='col mb-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Cases</h5>
                <h5 className='card-subtitle text-muted'>(cummulative)</h5>
                <h2 className='my-5 display-2'>{casesTotal}</h2>
              </div>
            </div>
          </div>

          <div className='col mb-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Tests</h5>
                <h5 className='card-subtitle text-muted'>(cummulative)</h5>
                <h2 className='my-5 display-2'>{recoveriesTotal}</h2>
              </div>
            </div>
          </div>

          <div className='col mb-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Deaths</h5>
                <h5 className='card-subtitle text-muted'>(cummulative)</h5>
                <h2 className='my-5 display-2'>{deathsTotal}</h2>
              </div>
            </div>
          </div>

          <div className='col mb-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Hospitalizations</h5>
                <h5 className='card-subtitle text-muted'>(rate)</h5>
                <h2 className='my-5 display-2'>{hospitalizationRate}</h2>
              </div>
            </div>
          </div>

          <div className='col mb-4'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Testing</h5>
                <h5 className='card-subtitle text-muted'>(rate)</h5>
                <h2 className='my-5 display-2'>{testingRate}</h2>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className='section my-5'>
        <div className='chart-container'>
          <h4>Cases</h4>
          <div>
            {
              _.isEmpty(casesOptions)
                ? (<p>Loading ...</p>)
                : (<ReactEcharts option={casesOptions} className='react_for_echarts' style={{height: '350px', width: '100%'}}/>)
            }
          </div>
        </div>

        <div className='chart-container'>
          <h4>Deaths</h4>
          <div>
            {
              _.isEmpty(casesOptions)
                ? (<p>Loading ...</p>)
                : (<ReactEcharts option={deathsOptions} className='react_for_echarts' style={{height: '350px', width: '100%'}}/>)
            }
          </div>
        </div>

        <div className='chart-container'>
          <h4>Recoveries</h4>
          <div>
            {
              _.isEmpty(casesOptions)
                ? (<p>Loading ...</p>)
                : (<ReactEcharts option={recoveriesOptions} className='react_for_echarts' style={{height: '350px', width: '100%'}}/>)
            }
          </div>
        </div>

        <div className='chart-container'>
          <h4>Hopsitalization Rate</h4>
          <div>
            {
              _.isEmpty(casesOptions)
                ? (<p>Loading ...</p>)
                : (<ReactEcharts option={hospitalizationRateOptions} className='react_for_echarts' style={{height: '350px', width: '100%'}}/>)
            }
          </div>
        </div>

        <div className='chart-container'>
          <h4>Testing Rate</h4>
          <div>
            {
              _.isEmpty(casesOptions)
                ? (<p>Loading ...</p>)
                : (<ReactEcharts option={testingRateOptions} className='react_for_echarts' style={{height: '350px', width: '100%'}}/>)
            }
          </div>
        </div>
      </div>

    </div>
  );
};

function mapStateToProps({ api }) {
  return {
    loading: api.loading,
    cities: api.cities,
    states: api.states,
    countries: api.countries,
    countryDetail: api.countryDetail,
    stateDetail: api.stateDetail,
    cityDetail: api.cityDetail
  }
}

export default connect(
  mapStateToProps
)(HomePage);
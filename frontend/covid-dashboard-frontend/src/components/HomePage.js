

import React, { useEffect, useState } from 'react';

import { DatePicker } from "react-tempusdominus-bootstrap";
import { DateTime } from 'luxon';
import _ from 'lodash';
import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';
import Loader from 'react-loader';

import ReactEcharts from 'echarts-for-react';

import { action } from '../index';
import * as types from '../redux/actions/types';

import ChartsContainer from './common/ChartsContainer';
import { calcTrend } from "../utils";


const HomePage = ({cities, states, countries, loading, cityDetail, stateDetail, countryDetail}) => {
  const [start, setStart] = useState(DateTime.fromObject({year: 2020, month: 1, day: 20}));
  const [end, setEnd] = useState(DateTime.local().endOf('day'));

  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState({});
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

  const [casesTrendOptions, setCasesTrendOptions] = useState({});
  const [recoveriesTrendOptions, setRecoveriesTrendOptions] = useState({});
  const [deathsTrendOptions, setDeathsTrendOptions] = useState({});
  const [testingTrendOptions, setTestingTrendOptions] = useState({});
  const [isReady, setIsReady] = useState(false);

  const chartContainerHeight = '375px';

  const CITY_LOCATION = 'city';
  const STATE_LOCATION = 'state';
  const COUNTRY_LOCATION = 'country';

  useEffect(() => {
    refreshCharts();
  }, [cityDetail, stateDetail, countryDetail, loading, start, end]);

  const makeLocationLabel = (item, loc) => {
    switch(loc) {
      case CITY_LOCATION: return `${item.city}, ${item.state}, ${item.country}`;
      case STATE_LOCATION: return `${item.state}, ${item.country}`;
      case COUNTRY_LOCATION: return item.country;
    }
  }

  const formatLocations = (items, loc) => {
    return items.map(item => {
      return { ...item, value: item.location_id, label: makeLocationLabel(item, loc) };
    });
  }

  const chartableData = (type, data) => {
    const series = [{
      name: type,
      type: 'line',
      data: data.map(item => {
        return [DateTime.fromHTTP(item.date).toISODate(), item[type]]
      })
    }];

    const xAxis = {
      type: 'time',
      splitLine: { show: false }
    }

    const yAxis = {
      type: 'value'
    }

    const dataZoom = [{
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'empty'
    }]

    const option = {
      toolbox: {
        feature: {
          saveAsImage: { title: 'Save As Image' },
          dataView: { readOnly: false, title: 'Data', lang: ['', 'Close', 'Refresh'] }
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => `Name: ${_.startCase(params.seriesName)}<br>Date: ${params.data[0]}<br>Total: ${params.data[1]}`
      },
      dataZoom,
      xAxis,
      yAxis,
      series
    }
    return option;
  }

  const locationData = () => {
    let data;
    if (locationType === CITY_LOCATION) {
      data = cityDetail;
    } else if (locationType === STATE_LOCATION) {
      data = stateDetail;
    } else if (locationType === COUNTRY_LOCATION) {
      data = countryDetail;
    }
    return data;
  }

  const refreshCharts = () => {
    const locData = locationData();

    if (loading || _.isEmpty(locData)) {
      clearChartData();
      return;
    }

    // probably makes decent sense to filter by date here
    const filteredData = locData.filter(item => {
      const date = DateTime.fromHTTP(item.date);
      return date >= start && date <= end;
    })

    setCasesOptions(chartableData('cases', filteredData));
    setDeathsOptions(chartableData('deaths', filteredData));
    setRecoveriesOptions(chartableData('recoveries', filteredData));
    setHospitalizationRateOptions(chartableData('hospitalization_rate', filteredData));
    setTestingRateOptions(chartableData('testing_rate', filteredData));

    setCasesTrendOptions(makeTrendData('cases', filteredData));
    setRecoveriesTrendOptions(makeTrendData('recoveries', filteredData));
    setDeathsTrendOptions(makeTrendData('deaths', filteredData));
    setTestingTrendOptions(makeTrendData('testing_rate', filteredData));
  };

  const makeTrendData = (key, data) => {
    const nth = data.length - 1;
    const n3th = nth - 3 >= 0 ? nth - 3 : 0;
    const n5th = nth - 5 >= 0 ? nth - 5 : 0;
    const n10th = nth - 10 >= 0 ? nth - 10 : 0;

    const nthValue = data[nth][key]
    
    const n3thTrend = calcTrend(data[n3th][key], nthValue);
    const n5thTrend = calcTrend(data[n5th][key], nthValue);
    const n10thTrend = calcTrend(data[n10th][key], nthValue);

    const formatter = '{value}%'
    const option = {
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { title: 'Save As Image' },
          dataView: { readOnly: false, title: 'Data', lang: ['', 'Close', 'Refresh'] }
        }
      },
      series: [
        // {
        //   name: '3 Day Trend',
        //   type: 'gauge',
        //   detail: { formatter },
        //   data: [{value: n3thTrend, name: '3 Day Trend'}]
        // },
        {
          name: '5 Day Trend',
          min: -20,
          max: 30,
          type: 'gauge',
          detail: { formatter },
          data: [{value: n5thTrend, name: '5 Day Trend'}]
        }
        // ,{
        //   name: '10 Day Trend',
        //   type: 'gauge',
        //   detail: { formatter },
        //   data: [{value: n10thTrend, name: '10 Day Trend'}]
        // }
      ]
    };
    return option;
  }

  const loadOptions = (inputValue, callback) => {
    _.delay((txt) => {
      if (!txt) {
        return callback([]);
      }
      // debugger
      let items;
      if (locationType === CITY_LOCATION) {
        items = formatLocations(cities, CITY_LOCATION);
      } else if (locationType === STATE_LOCATION) {
        items = formatLocations(states, STATE_LOCATION);
      } else {
        items = formatLocations(countries, COUNTRY_LOCATION);
      }
      callback(items.filter(l => l.label.toLowerCase().includes(txt.toLowerCase())));
    }, 200, inputValue);
  }

  const handleLocationInputChange = (newValue) => {
    setSearchText(newValue);
    return newValue;
  }

  const clearChartData = () => {
    setCasesOptions({});
    setDeathsOptions({});
    setRecoveriesOptions({});
    setHospitalizationRateOptions({});
    setTestingRateOptions({});

    setCasesTrendOptions({});
    setDeathsTrendOptions({});
    setRecoveriesTrendOptions({});
    setTestingTrendOptions({});
    
  };

  const onLocationChange = async (value) => {
    setLocation(value);

    if (_.isEmpty(value)) {
      clearChartData();
      return;
    }

    try {
      if (locationType === CITY_LOCATION) {
        await action(types.FETCH_CITY, value.location_id);
      } else if (locationType === STATE_LOCATION) {
        await action(types.FETCH_STATE, value.location_id);
      } else {
        await action(types.FETCH_COUNTRY, value.location_id);
      }
      refreshCharts()
    } catch(e) {
      console.log('Uh oh ... something funny happened', e)
    }
  }

  const onLocationTypeChange = (evt) => {
    setLocationType(evt.target.value);
    setLocation(null);
    clearChartData();
    refreshCharts();
  }

  const handleStartChange = (evt) => {
    setStart(DateTime.fromISO(evt.date.toISOString()));
    // refreshCharts();
  };

  const handleEndChange = (evt) => {
    setEnd(DateTime.fromISO(evt.date.toISOString()));
    // refreshCharts();
  };

  return (
    <div className='container'>
      <div className='section my-5'>
        <h1 className='my-4'>Covid Trend Miner</h1>
        <div>
          <div className='form-group row'>
            <div className='col-md-2 col-form-label'>
              <label>Granularity</label>
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
            </div>
          </div>
        </div>
      </div>

      <Loader loaded={!loading}></Loader>

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
        <ChartsContainer
          title='Cases'
          lineOptions={casesOptions}
          gaugeOptions={casesTrendOptions}/>

        <ChartsContainer
          title='Deaths'
          lineOptions={deathsOptions}
          gaugeOptions={deathsTrendOptions}/>

        <ChartsContainer
          title='Recoveries'
          lineOptions={recoveriesOptions}
          gaugeOptions={recoveriesTrendOptions}/>

        <ChartsContainer
          title='Hopsitalization Rate'
          lineOptions={hospitalizationRateOptions}
          gaugeOptions={{}}/>

        <ChartsContainer
          title='Testing Rate'
          lineOptions={testingRateOptions}
          gaugeOptions={testingTrendOptions}/>
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

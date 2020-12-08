

import React, { useEffect, useState } from 'react';

import { DatePicker } from "react-tempusdominus-bootstrap";
import { DateTime } from 'luxon';
import _ from 'lodash';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

import ReactEcharts from 'echarts-for-react';


const HomePage = () => {
  const [start, setStart] = useState(DateTime.local().minus({months: 3}));
  const [end, setEnd] = useState(DateTime.local().endOf('day'));

  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState({});
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [locationType, setLocationType] = useState('');

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
    axios.get(`https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod/states/`).then(response => {
        setStates(formatLocations(response.data, 'state'));
        setLocation(formatLocations(response.data, 'state'))
      })
      .catch(e => {
        console.log('error fetching states', e);
      })
    axios.get('https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod/countries/').then(response => {
        setCountries(formatLocations(response.data, 'country'))
      })
      .catch(e => {
        console.log('error fetching countries', e);
      })
    axios.get('https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod/cities/').then(response => {
        setCities(formatLocations(response.data, 'city'))
      })
      .catch(e => {
        console.log('error fetching cities', e)
      })
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

  const refreshCharts = () => {
    setIsReady(false);
    setCasesOptions(makeDummyData());
    setDeathsOptions(makeDummyData());
    setRecoveriesOptions(makeDummyData());
    setHospitalizationRateOptions(makeDummyData());
    setTestingRateOptions(makeDummyData());
    setIsReady(true);
  };

  const loadOptions = (inputValue, callback) => {
    _.delay((q) => {
      if (!q) {
        return callback([]);
      }
      callback(locations.filter(l => l.label.toLowerCase().contains(searchText.toLowerCase())));
    }, 600, inputValue);
  }

  const handleLocationInputChange = (newValue) => {
    setSearchText(newValue);
    return newValue;
  }

  const onLocationChange = (value) => {
    setLocation(value);
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
              <select className='form-control' onChange={onLocationTypeChange}>
                <option value='city'>City</option>
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
                onChange={onLocationChange}/>
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

export default HomePage;

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'db.json');

if (fs.existsSync(dbPath)) {
  const backupPath = path.join(__dirname, 'db-backup.json');
  fs.renameSync(dbPath, backupPath);
  console.log(`Previous database backed up to ${backupPath}`);
}

const mockData = {
  countries: [
    {
      name: 'United States of America',
      latitude: 12,
      longitude: 100,
      id: 1,
    },
    {
      name: 'Canada',
      latitude: 100,
      longitude: 1000,
      id: 2,
    }
  ],
  // This will actually be countries/{id} but separating the 2 for the mock
  countries_id: [
    {
      name: 'USA',
      totalDeaths: 250000,
      totalCases: 10000000,
      totalRecovered: 7500000,
      id: 1,
      dailyData: [
        {
        date: '12-3-2020-0-0-0-0',
        newCases: 10000,
        newDeaths: 500,
        newRecoveries: 1000,
        hospitalizations: 2000,
        tests: 20000,
        positivityRate: 0.75
        },
      ],
    },
    {
      name: 'Canada',
      totalDeaths: 250,
      totalCases: 10000,
      totalRecovered: 7500,
      id: 2,
      dailyData: [
        {
        date: '12-3-2020-0-0-0-0',
        newCases: 1000,
        newDeaths: 50,
        newRecoveries: 100,
        hospitalizations: 200,
        tests: 2000,
        positivityRate: 0.25
        },
      ],
    }
  ],
  cities:
    [
      {
        name: 'Dallas',
        state: 'Texas',
        country: 'USA',
        latitude: 2403,
        longitude: 12342,
        id: 3
      },
      {
        name: 'Denver',
        state: 'Colorado',
        country: 'USA',
        latitude: 6226,
        longitude: 1342642,
        id: 4
      },
    ],
  cities_id:
    [
      {
        name: 'Dallas',
        totalDeaths: 25350,
        totalCases: 105235000,
        totalRecovered: 734500,
        id: 3,
        dailyData: [
          {
            date: '12-3-2020-0-0-0-0',
            newCases: 13550,
            newDeaths: 5032,
            newRecoveries: 134600,
            hospitalizations: 204320,
            tests: 200520,
            positivityRate: 0.254
          },
        ]
      },
      {
        name: 'Denver',
        totalDeaths: 2530,
        totalCases: 1052000,
        totalRecovered: 73400,
        id: 4,
        dailyData: [
          {
          date: '12-3-2020-0-0-0-0',
          newCases: 1350,
          newDeaths: 532,
          newRecoveries: 13460,
          hospitalizations: 20320,
          tests: 20520,
          positivityRate: 0.23
          }
        ]
      }
    ],
  states:
    [
        {
          name: 'Texas',
          country: 'USA',
          latitude: 1431,
          longitude: 234523,
          id: 5
        },
        {
          name: 'Denver',
          country: 'USA',
          latitude: 143541,
          longitude: 234523423,
          id: 6
        }
    ],
  states_id:
    [
      {
        name: 'Texas',
        totalDeaths: 235230,
        totalCases: 10520004252,
        totalRecovered: 7300,
        id: 5,
        dailyData: [
          {
            date: '12-3-2020-0-0-0-0',
            newCases: 132550,
            newDeaths: 542,
            newRecoveries: 134640,
            hospitalizations: 204320,
            tests: 205520,
            positivityRate: 0.50
          }
        ]
      },
      {
        name: 'Denver',
        totalDeaths: 2330,
        totalCases: 100004252,
        totalRecovered: 730,
        id: 6,
        dailyData: [
          {
            date: '12-3-2020-0-0-0-0',
            newCases: 13255,
            newDeaths: 52,
            newRecoveries: 13640,
            hospitalizations: 20430,
            tests: 20550,
            positivityRate: 0.34
          }
        ]
      }
    ]
}

fs.writeFile(dbPath, JSON.stringify(mockData), err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Mock database created ${dbPath}`);
  }
});
/*
 *  There is also a built-in environment variable called NODE_ENV. You can read it from process.env.NODE_ENV. 
 *  When you run npm start, it is always equal to 'development', when you run npm test it is always equal to 'test', 
 *  and when you run npm run build to make a production bundle, it is always equal to 'production'. 
 *  You cannot override NODE_ENV manually. This prevents developers from accidentally deploying a slow development build to production.
 *  
 *      npm run start = 'development'
 *      npm run test = 'test'
 *      npm run build = 'production'
 *  
 */

const countriesAWS_SSL = 'https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod/countries/';
const local = 'https://29vk13ch1a.execute-api.us-east-2.amazonaws.com/Prod/countries/';
const environment = process.env.NODE_ENV;
const development = environment === 'development';
const test = environment === 'test';
const production = environment === 'production';

export const COUNTRIES_URL = development ? local : (test ? local : (production ? countriesAWS_SSL : local));
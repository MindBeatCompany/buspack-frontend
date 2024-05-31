export const API_VERSION = 'v1',
  ENDPOINTS = {
    API:{
        'dev': process.env.REACT_APP_URL_DEV,
        'prod': process.env.REACT_APP_URL_PROD,
        'qa': process.env.REACT_APP_URL_QA
    }
  },
  ENV = process.env.REACT_APP_ENV,
  TIME = 1000,
  CAPTCHA_KEY=process.env.REACT_APP_CAPTCHA_KEY;
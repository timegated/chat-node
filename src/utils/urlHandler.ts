import axios from "axios";
const BASE_URL_DEV = "http://localhost:5000";
const BASE_PROD_URL = "https://chatnode-api.com"

export const BASE_API_URL = import.meta.env.DEV ? BASE_URL_DEV : BASE_PROD_URL;

axios.defaults.headers.common['Referrer-Policy'] = 'no-referrer';
axios.defaults.headers.common['Referer'] = ''
axios.defaults.baseURL = BASE_API_URL;
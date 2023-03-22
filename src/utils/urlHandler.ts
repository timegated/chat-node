import axios from "axios";

axios.defaults.headers.common['Referrer-Policy'] = 'no-referrer';

const BASE_URL_DEV = "http://localhost:5000";
const BASE_PROD_URL = "chatnode-api.com"

export const BASE_API_URL = import.meta.env.DEV ? BASE_URL_DEV : BASE_PROD_URL;
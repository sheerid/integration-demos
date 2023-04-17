import { YotpoCustomer } from './types';
import config from './config';

const upsertCustomer = async (customerData: YotpoCustomer) => 
  fetch(config.YOTPO_API_URL+'customers', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': config.YOTPO_API_KEY,
      'x-guid': config.YOTPO_GUID,
    }, 
    body: JSON.stringify(customerData)
  });

export default upsertCustomer;

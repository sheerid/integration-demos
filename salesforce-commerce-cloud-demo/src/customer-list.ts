
import { GetAuthToken } from './auth';
import { config } from './config';
import { Customer } from './types';

export const GetURL = (path: string) => {
    return `https://${config.shortCode}.api.commercecloud.salesforce.com/customer/customers/v1` + path;
};

export const AddCustomer = async (customer: Customer) => {
    const token = await GetAuthToken();
    const body = JSON.stringify(customer);

    const response = await fetch(
        GetURL(`/organizations/f_ecom_${config.orgId}/customer-lists/${config.siteId}/customers`),
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token.access_token}`
            },
            body
        });
    const res = await response.json();
    return res;
};

export const UpdateCustomer = async (customer: Customer) => {
    const token = await GetAuthToken();
    const body = JSON.stringify(customer);

    const response = await fetch(
        GetURL(`/organizations/f_ecom_${config.orgId}/customer-lists/${config.siteId}/customers/${customer.customerNo}`),
        {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token.access_token}`
            },
            body
        });
    const res = await response.json();
    return res;
};

export const GetCustomer = async (customerNo: string): Promise<Customer> => {
    const token = await GetAuthToken();
    const response = await fetch(
        GetURL(`/organizations/f_ecom_${config.orgId}/customer-lists/${config.siteId}/customers/${customerNo}`),
        {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token.access_token}`
            }
        });
    const res = await response.json();
    return res;
};

export const FindCustomer = async (email: string): Promise<Customer> => {
    const token = await GetAuthToken();
    const body = JSON.stringify({
        "limit": 1,
        "offset": 0,
        "query": {
            "termQuery": {
                "fields": ["credentials.login", "email"],
                "operator": "is",
                "values": [email]
            }
        }
    });
    const url = GetURL(`/organizations/f_ecom_${config.orgId}/customer-lists/${config.siteId}/customer-search`);
    const response = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token.access_token}`
            },
            body
        });
    const res = await response.json();
    if (res.total > 0) {
        return await GetCustomer(res.hits[0].data.customerNo);
    }
    return Promise.reject(`Customer not found: ${email}`);
};

import { GetAuthToken } from "./auth";
import { config } from "./config";

export const GetURL = (path: string) => {
    return `https://${config.shortCode}.360a.salesforce.com/api` + path;
}

export const GetMetadata = async () => {
    const token = await GetAuthToken();
    const response = await fetch(
        GetURL(`/v1/profile/metadata`),
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


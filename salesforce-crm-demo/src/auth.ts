import { config } from "./config";

// https://developer.salesforce.com/docs/commerce/commerce-api/guide/auth-z-scope-catalog.html
const SCOPES = `SALESFORCE_COMMERCE_API:${config.orgId} sfcc.customerlists.rw`;

const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

export interface Auth {
  access_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

// https://developer.salesforce.com/docs/commerce/commerce-api/guide/authorization-for-admin-apis.html
export const GetAuthToken = async () => {
  const resp = await fetch("https://account.demandware.com/dw/oauth2/access_token", {
    "headers": {
      "authorization": "Basic " + basicAuth,
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "pragma": "no-cache"
    },
    "body": "grant_type=client_credentials&scope=" + encodeURIComponent(SCOPES),
    "method": "POST"
  });
  const auth = await resp.json() as Auth;
  return auth;
}

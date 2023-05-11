import express from "express";
import { WebhookBody, getVerificationDetails } from "./sheerid";
import { config } from "./config";
import { FindCustomer } from './customer-list';
import dotenv from 'dotenv';

const getContact = async (accessToken: String) => {
    console.log('Retrieving a contact using an access token');
    try {
      const  headers = await {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      const result = await fetch(process.env.SALESFORCE_INSTANCE_URL+'/services/data/v57.0/query?q=SELECT+Id,Name+FROM+User',
      {
        headers: headers,
      });
      const users = await result.json();
      console.log(users);
      const res2 = await fetch(process.env.SALESFORCE_INSTANCE_URL+'/services/data/v57.0/',
      {
        headers: headers,
      });
      const data = await res2.json();
      console.log(data);
      return Promise.resolve(data);
    } catch (e) {
      console.error('  > Unable to retrieve contact', e);
      return Promise.reject();
    }
  };

fetch(process.env.SALESFORCE_INSTANCE_URL + '/services/oauth2/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + process.env.SALESFORCE_CONSUMER_KEY + '&client_secret=' + process.env.SALESFORCE_CONSUMER_SECRET
}).then(async (response) => {
    const res = await response.json();
    console.log('Salesforce access token', res);
    getContact(res.access_token);
    return res;

    const app = express();
    app.use(express.json());

    app.post<{}, string, WebhookBody, {}>('/api/success-webhook', async (request, response) => {
        try {
            console.log(`post /api/success-webhook => ${config.sheerIdApiUrl}`);
            if (request.body != undefined && request.body.verificationId) {
                console.log(`processing verification ${config.sheerIdApiUrl}`, request.body);
                const verificationDetails = await getVerificationDetails(request.body.verificationId);
                if (verificationDetails.personInfo?.metadata != undefined) {
                    console.log('metadata', verificationDetails.personInfo.metadata);
                    const email = verificationDetails.personInfo.email;
                    const customer = await FindCustomer(email);
                    console.log(`updating user ${customer.customerNo} with configrmed segments`);
                } else {
                    console.log('no metadata', verificationDetails);
                }
            } else {
                console.log('no post body');
            }
            response.send("OK");
        } catch (err) {
            console.error('Error processing success webhook: ', err);
            if ((err as any).response) {
                console.log("server response ", await (err as any).response.text());
            }
            const message = (err as Error).message;
            response
                .status(500)
                .send(message);
        }
    });

    app.listen(config.port);
    console.log(`Server is running on http://localhost:${config.port}/`);

}).catch((err) => {
    console.error("Can't get access token (check environment variables):", err);
});
import express from "express";
import { WebhookBody, getVerificationDetails } from "./sheerid";
import { config } from "./config";
import { FindCustomer } from './customer-list';

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

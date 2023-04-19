import express from "express";
import { WebhookBody, getVerificationDetails } from "./sheerid";
import upsertCustomer from "./upsert-customer";
import config from "./config";

const app = express();
app.use(express.json());

app.post<{}, string, WebhookBody, {}>('/success-webhook', async (request, response) => {
    try {
        console.log(`post /success-webhook => ${config.SHEERID_API_URL}`);
        if (request.body != undefined && request.body.verificationId) {
            console.log(`processing verification ${config.SHEERID_API_URL}`, request.body);
            const verificationDetails = await getVerificationDetails(request.body.verificationId);
            const metadata = verificationDetails.personInfo.metadata;
            console.log('metadata:', verificationDetails.personInfo.metadata);
            const email = verificationDetails.personInfo.email;
            const segment = verificationDetails.confirmedSegments[0].segment;
            await upsertCustomer({
                first_name: verificationDetails.personInfo.firstName,
                last_name: verificationDetails.personInfo.lastName,
                email: email,
                opted_in: true,
                tags: `verified_${segment}`,
                customer_id: metadata.customer_id || undefined,
            });
            console.log('upserting customer with confirmed segments');
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

app.listen(config.PORT);
console.log(`Server is running on http://localhost:${config.PORT}/`);

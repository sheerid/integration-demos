import serverless from "serverless-http";
import express from "express";
import * as TalonOne from "talon_one";

const app = express();

const getVerificationDetails = async (
  verificationId: string
) => {
  const res = await fetch(
      `https://services.sheerid.com/rest/v2/verification/${verificationId}/details`, {
      'method': 'GET',
      'headers': {
          'Authorization': `Bearer ${process.env.SHEERID_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'SheerID Talon One Integration 0.1',
      },
  });
  return res.json();
}

const defaultClient = TalonOne.ApiClient.instance;
defaultClient.basePath = process.env.TALON_ONE_BASEPATH;

// Configure API key authorization: api_key_v1
const api_key_v1 = defaultClient.authentications["api_key_v1"];
api_key_v1.apiKey = process.env.TALON_ONE_API_KEY;
api_key_v1.apiKeyPrefix = "ApiKey-v1";

// Integration API example to send a session update
const integrationApi = new TalonOne.IntegrationApi();

app.get("/", (req, res, next) => {
  return res.status(200).send("Talon One / SheerID Webhook handler");
});

app.post("/success-webhook", async (req, res, next) => {
  const body = req.body;

  console.log('body', body.toString());

  const bodyString = body.toString();
  const bodyJSON = JSON.parse(bodyString);

  const verificationId = bodyJSON.verificationId;

  console.log('verificationId', verificationId);

  const verificationDetails = await getVerificationDetails(verificationId);

  console.log('verificationDetails', verificationDetails);

  const customerSession = TalonOne.NewCustomerSessionV2.constructFromObject(null,{
    profileId: 'demo-customer-session-id',
    attributes: {
      verifiedSegment: verificationDetails.confirmedSegments[0].segment,
      verifiedOrganization: verificationDetails.personInfo.organization.name,
    },
    cartItems: [
      {
        sku: 'demo-product-id',
        name: 'Demo Product',
        price: 100,
        quantity: 1,
      },
    ],
  });

  const integrationRequest = new TalonOne.IntegrationRequest(customerSession);

  await integrationApi.updateCustomerSessionV2("SheerID lambda", integrationRequest);

  return res.status(200).send("OK");
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);

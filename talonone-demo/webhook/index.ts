import serverless from "serverless-http";
import express from "express";
import * as TalonOne from "talon_one";

const app = express();

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

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

  const segment = verificationDetails.confirmedSegments[0].segment;

  let cartItems: CartItem[] = [];

  if (segment === 'student') {
    cartItems = [
      {
        sku: 'demo-laptop-sku',
        name: 'MacBook Pro',
        price: 1200,
        quantity: 1,
      },
    ];
  } else if (segment === 'military') {
    cartItems = [
      {
        sku: 'demo-pants-sku',
        name: 'Sturdy Work Pants',
        price: 100,
        quantity: 1,
      },
    ];
  } else if (segment === 'medical') {
    cartItems = [
      {
        sku: 'demo-ticket-sku-1',
        name: 'LHR-JFK Business Class',
        price: 1888,
        quantity: 1,
      },
      {
        sku: 'demo-ticket-sku-2',
        name: 'JFK-LHR Business Class',
        price: 2288,
        quantity: 1,
      },
      {
        sku: 'demo-hotel-sku',
        name: 'The Algonquin Hotel Times Square, Autograph Collection',
        price: 3517,
        quantity: 1,
      }
    ];
  }

  const name = verificationDetails.personInfo.firstName.toLowerCase() + '-' + verificationDetails.personInfo.lastName.toLowerCase();

  const obj = {
    profileId: 'demo-'+segment+'-'+name,
    attributes: {
      verifiedSegment: verificationDetails.confirmedSegments[0].segment,
      verifiedOrganization: verificationDetails.personInfo.organization.name,
    },
    cartItems,
  };

  console.log('sending', obj);

  const customerSession = TalonOne.NewCustomerSessionV2.constructFromObject(null, obj);

  const integrationRequest = new TalonOne.IntegrationRequest(customerSession);

  await integrationApi.updateCustomerSessionV2('demo-'+segment+'-'+name+'-session', integrationRequest);

  return res.status(200).send("OK");
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);

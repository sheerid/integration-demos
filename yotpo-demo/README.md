# Yotpo Integration demo

This is a demo of the Yotpo integration SheerID. 

It is a simple webhook handler that will receive a webhook from SheerID on a successful verification, ask back for verification details and then send the verification details to Yotpo.

## Where to find API keys

### SheerID Access Token

1. Log into SheerID dashboard (https://my.sheerid.com) or register for an account
2. Open Settings in left sidebar
3. If you have API access enabled, you will have and Access Tokens section with your API key. If you don't have API access enabled, you can enable it in the Team section, just click the pencil icon on your account, set API access, log out and log back in.
4. Copy the Access Token

### Yotpo API Key and GUID

1. Log into Yotpo Loyalty Platform dashboard
2. Open the General Settings: https://loyalty-app.yotpo.com/general-settings
3. Copy the API Key and GUID

## Setup

1. Clone this repo
2. Run `npm install`
3. Create a `.env` file in the root of the project with the following contents:

```
PORT=80
SHEERID_TOKEN=your access token from sheerid dashboard
SHEERID_API_URL=https://services.sheerid.com/rest/v2/
YOTPO_API_KEY=your api key from yotpo dashboard
YOTPO_GUID=your guid from yotpo dashboard
YOTPO_API_URL=https://loyalty.yotpo.com/api/v2/
```

Run this service somewhere that is publicly accessible, ideally behind a service that terminates TLS connection. You can use [ngrok](https://ngrok.com/) to create a public URL for your local machine.

4. Run `npm run start`

## Configuration in SheerID

1. Create a verification program in SheerID
2. Go into program's settings tab and set the webhook URL to `https://yourdomain.com/success-webhook`
3. If you have customer ID configured in Yotpo from the frontend, you can set the `customer_id` metadata field in program's settings tab and configure frontend to set the metadata when showing the verification form.

## How the demo works

1. User goes to your site and clicks on a link to verify their eligibility
2. User is shown a SheerID verification form and enters their information
3. SheerID sends a webhook to your webhook handler with the verification id
4. Your webhook handler asks SheerID for the verification details
5. Your webhook handler sends certain customer information to Yotpo


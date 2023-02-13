# Twilio Segment Integration Example

This is not a production ready application. It is an example of how integrate your (SheerID verification)[https://www.sheerid.com/]
with your [Twilio Segment Destinations](https://segment.com/twilio/).

This application will perform the following:
- Listen for succesful verification webhooks fired from SheerID.
- Query SheerID to find which SheerID segments were confirmed for the user being verified.
- Send traits to Twilio Segment for the user which include the SheerID segment(s), and the organization(s) the user is affiliated with.

## Requirements

- A Twilio Segment account
- A SheerID account
- NodeJS v18+

## Installation

- Clone the repository to your local machine.
- Run `npm install` to install dependencies.

## Setup

- Follow the steps in the [twilio segment getting started guide](https://segment.com/docs/getting-started/implementation-guide/#add-a-source) 
to setup a NodeJS source. The source will provide a write key that must be provided in order to send any data.
- Log in to your SheerID Dashboard and
    - Create a SheerID program, that you will use e.g. "Student discount"
    - Configure your program with eligibility, theme etc
    - Set Codes section to "No Code"
    - In Program Settings
        - set Webhook for eligible verification to http://<your_server_address>/api/success-webhook
        - add userId as Metadata Tracking field
    - Copy access token from Settings > Access Tokens page
- Copy the `.env.example` file to a new `.env` file.
- Edit the contents of the `.env` file to provide relevant configurations for the application, e.g.:
```
WRITE_KEY=<Your Twilio Segment Write Key>
PORT=3000
SHEERID_TOKEN=<Your Copied SheerID Access Token>
SHEERID_API_URL=https://services.sheerid.com/rest/v2/
```
- If you are changing the port, make sure to update the webhook URL in SheerID Dashboard and if you are using Docker or Kubernetes, make sure 
to update the port in Dockerfile and your deployment files.
- Run `npm start` to run the application. 

import serverless from "serverless-http";
import express from "express";

const app = express();

interface Profile {
  type: 'profile';
  id?: string;
  attributes: {
    last_name?: string;
    first_name?: string;
    properties: object;
  };
}

const KlaviyoHeaders = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'revision': '2023-02-22',
    'authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
};

const getVerificationDetails = async (
  verificationId: string
) => {
  const res = await fetch(
    `https://services.sheerid.com/rest/v2/verification/${verificationId}/details`, {
    'method': 'GET',
    'headers': {
      'Authorization': `Bearer ${process.env.SHEERID_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'SheerID Klaviyo Integration 0.1',
    },
  });
  return res.json();
}

const findProfile = async (email: string) => {
  const res = await fetch(`https://a.klaviyo.com/api/profiles/?filter=equals(email,%22${email}%22)`, {
    method: 'GET',
    headers: KlaviyoHeaders,
  });
  return res.json();
};

const createProfile = async (profile: object) => {
  const res = await fetch(`https://a.klaviyo.com/api/profiles`, {
    method: 'POST',
    headers: KlaviyoHeaders,
    body: JSON.stringify(profile),
  });
  return res.json();
};

const updateProfile = async (profileId: string, profile: object) => {
  const res = await fetch(`https://a.klaviyo.com/api/profiles/${profileId}`, {
    method: 'PATCH',
    headers: KlaviyoHeaders,
    body: JSON.stringify(profile),
  });
  return res.json();
};

app.get("/", (req, res, next) => {
  return res.status(200).send("Klaviyo / SheerID Webhook handler");
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

  const profileData = await findProfile(verificationDetails.personInfo.email);

  if (profileData?.data?.length > 0) {
    console.log('found profiles', profileData.data);

    // update profile
    const profile: Profile = {
      type: 'profile',
      id: profileData.data[0].id,
      attributes: {
        properties: {
          verified_segment: verificationDetails.confirmedSegments[0].segment,
          verified_organization: verificationDetails.personInfo.organization.name,
          birthdate: verificationDetails.personInfo.birthDate,
        },
      },
    };

    if (profile.attributes.last_name == null) {
      profile.attributes.last_name = verificationDetails.personInfo.lastName;
    }

    if (profile.attributes.first_name == null) {
      profile.attributes.first_name = verificationDetails.personInfo.firstName;
    }

    const profileResponse = await updateProfile(profileData.data[0].id, {data: profile});

    console.log('profileResponse', profileResponse);

  } else {
    // create profile
    const profile = {
      type: 'profile',
      attributes: {
        email: verificationDetails.personInfo.email,
        last_name: verificationDetails.personInfo.lastName,
        first_name: verificationDetails.personInfo.firstName,
        properties: {
          verified_segment: verificationDetails.confirmedSegments[0].segment,
          verified_organization: verificationDetails.personInfo.organization.name,
          birthdate: verificationDetails.personInfo.birthDate,
        },
      },
    };

    const profileResponse = await createProfile({data: profile});

    console.log('profileResponse', profileResponse);
  }

  return res.status(200).send("OK");
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);

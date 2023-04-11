import * as TalonOne from "talon_one";
import dotenv from "dotenv";

const defaultClient = TalonOne.ApiClient.instance;
defaultClient.basePath = process.env.TALON_ONE_BASEPATH;

const api = new TalonOne.ManagementApi();

export const CreateAttributes = async () => {
  const authBody = {
    email: process.env.TALON_ONE_ADMIN_EMAIL,
    password: process.env.TALON_ONE_PASSWORD,
  };
  console.log('authBody', authBody);

  const res = await api.createSession(authBody);
  const resJson = await res;

  console.log('resJson', resJson.token);

  defaultClient.defaultHeaders = {
    "Authorization": `Bearer ${resJson.token}`
  };

  const vsegment = await api.createAttribute({
    entity: "CustomerSession",
    name: "verifiedSegment",
    title: "Verified Segment",
    type: "string",
    description: "SheerID segment that has been verified.",
    suggestions: [
      "student",
      "military",
      "medical",
      "movers",
      "employee",
    ],
    editable: false,
  });
  console.log(await vsegment);
  const vOrgName = await api.createAttribute({
    entity: "CustomerSession",
    name: "verifiedOrganization",
    title: "Verified Organization",
    type: "string",
    description: "Organisation Name that has been verified by SheerID.",
    editable: false,
  });
  console.log(await vOrgName);  
};

import * as packageJson from '../package.json';
import config from './config';

// The request body provided by the SheerID success webhook
export type WebhookBody = {
    // The unique identifier for a verification attempt
    verificationId: string;
}

// Provided by the SheerID verification details endpoint. Includes comprehensive information about a verification attempt.
export type VerificationDetails = {
    // The personal information for the user being verified.
    personInfo: VerificationPersonInfo,
    // The confirmed SheerID segments the user being verified is a part of.
    confirmedSegments: ConfirmedSegment[],
}

// All personal information collected about the user being verified. For brevity, we are only including the field we need
// for this demo which is the metadata that includes the `userId` we send to Twilio Segment.
export type VerificationPersonInfo = {
    // Campaign Metadata collected as part of a verification
    firstName: string,
    lastName: string,
    email: string,
    birthDate: string,
    organization: Organization,
    metadata: Record<string, string>,
}

// Data the SheerID was able to confirm about the user being verified
export type ConfirmedSegment = {
    // Whether or not the confirmation is currently active. There are times when SheerID is able to verify the user was
    // affiliated with a segment at some point, but is not longer part of that segment.
    active: boolean,
    // The SheerID segment that was confirmed.
    segment: string,
    // The SheerID subSegment that was confirmed.
    subSegment: string | null,
    // Information about the organization the verified user is affiliated with.
    organization: Organization,
}

// Information about the organization the verified user is affiliated with.
export type Organization = {
    // The unique identifier for the organization. This will be ignored if idExtended is specified
    id: string,
    // The name of the organization.
    name: string,
    // The unique identifier for the Organization within the Organization service.
    idExtended: string,
    // The service containing information about the Organization. Example: "EMPLOYER"
    source: string,
}

/**
 * Retrieve current information about a given verification. Includes all collected personal information, metadata, 
 * and which segments (if any) were confirmed for the customer.
 */
export const getVerificationDetails = async (
    verificationId: string
): Promise<VerificationDetails> => {
    const res = await fetch(
        `${config.SHEERID_API_URL}/verification/${verificationId}/details`, {
        'method': 'GET',
        'headers': {
            'Authorization': `Bearer ${config.SHEERID_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': `SheerID Salesforce ${packageJson.version}`,
        },
    });
    return res.json() as Promise<VerificationDetails>;
}

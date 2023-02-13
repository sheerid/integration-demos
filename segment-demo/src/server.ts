/**
 * Example integration of SheerID and Twilio Segment
 */
import express from "express";
import { config } from "./config";
import { getVerificationDetails, WebhookBody, ConfirmedSegment } from "./sheerid";
import { Analytics } from '@segment/analytics-node';

console.log('Creating analytics client');
const analytics = new Analytics({ writeKey: config.writeKey });
analytics.on('error', (err) => console.error('Error received from segment: ', err));

/**
 * Given the confirmed segments from SheerID, send the important verified information to segment.
 * This includes:
 *      - segments: The SheerID segment(s) that were verified, e.g. 'student', 'firstResponder', etc.
 *      - subSegments: The SheerID subSegment(s) that were verified (if any), e.g. `highSchool`, 'fireFighter', etc.
 *      - organizationNames: The organization name(s) affiliated with the verified individual, e.g. `University of Chicago`.
 */
const addConfirmedSegments = (userId: string, confirmedSegments: ConfirmedSegment[]) => {
    let segments = [];
    let subSegments = [];
    let organizationNames = [];
    confirmedSegments.forEach((confirmedSegment) => {
        // Only send data for active segments
        if (confirmedSegment.active) {
            segments.push(confirmedSegment.segment);
            organizationNames.push(confirmedSegment.organization.name);
            if (confirmedSegment.subSegment) {
                subSegments.push(confirmedSegment.subSegment);
            }
        }
    })
    analytics.identify({
        userId,
        traits: {
            segments,
            subSegments,
            organizationNames,
        }
    });
};


// Create a simple express server that will handle a SheerID success webhook
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
                const userId = verificationDetails.personInfo.metadata.userId;
                addConfirmedSegments(userId, verificationDetails.confirmedSegments);
                console.log(`updated user ${userId} with configrmed segments`);
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

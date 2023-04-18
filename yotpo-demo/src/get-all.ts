import dotenv from 'dotenv';

fetch(`${process.env.YOTPO_API_URL}customers/recent?per_page=100`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-key': process.env.YOTPO_API_KEY,
                'x-guid': process.env.YOTPO_GUID,
            }
}).then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
});

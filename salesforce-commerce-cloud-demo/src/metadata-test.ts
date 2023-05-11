import { GetMetadata } from "./cdp";

GetMetadata().then(metadata => {
    console.log(metadata);
}).catch(err => {
    console.log("error", err);
});


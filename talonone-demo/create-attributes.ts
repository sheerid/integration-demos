import { CreateAttributes } from "./management-api";

CreateAttributes().then(() => {
    console.log("Done");
}).catch((err) => {
    console.log("Error", err);
});

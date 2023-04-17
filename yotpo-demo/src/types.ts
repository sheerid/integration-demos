// Yotpo Customer pseudo type, just for the sake of this demo

export type YotpoCustomer = {
    first_name: string;
    last_name: string;
    email: string;
    customer_id?: string;
    tags: string;
    opted_in: boolean;
};
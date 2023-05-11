// 
export type Customer = {
    credentials: {
        enabled: boolean;
        locked?: boolean;
        login: string;
        passwordQuestion?: string;
    };
    firstName: string;
    lastName: string;
    email: string;
    customerNo: string;
};

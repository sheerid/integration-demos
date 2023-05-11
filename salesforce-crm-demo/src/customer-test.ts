import { FindCustomer, UpdateCustomer, AddCustomer } from './customer-list';

const email = "test@email.com";
const customer = FindCustomer(email).then((customer) => {
    console.log("customer found", customer.customerNo);
    const newCustomer = {
        ...customer,
        email,
    };
    newCustomer.credentials.login = email;
    UpdateCustomer(newCustomer).then((res) => {
        console.log("updated customer", res);
    }).catch((err) => {
        console.error("update error", err);
    });
}).catch((err) => {
    if (err === 'Customer not found: ' + email) {
        const newCustomer = {
            customerNo: '',
            email,
            firstName: 'Test',
            lastName: 'Customer',
            credentials: {
                enabled: true,
                login: email,
            }
        };
        AddCustomer(newCustomer).then((res) => {
            console.log("added customer", res);
        }).catch((err) => {
            console.error("add error", err);
        });
        return;
    }
    console.error("find error", err);
});

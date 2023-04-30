const user = require('./user.json')
const request = require("supertest")
const baseURL = "https://map-work-shop.herokuapp.com"



describe("Testing auth/user", () => {
    afterAll(async () => {
        await request(baseURL).delete('/MapWorkShop/users/deleteuser').send(user);
    })

    it("register user", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/signup').send(user);
        //expect(response.headers["Content-Type"]).toMatch(/json/);
        expect(response.status).toBe(201);
        expect(response.body.user.email).toEqual(user.email);
        expect(response.body.user.username).toEqual(user.username);
    });
    it("login user", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/signin').send(user);
        //expect(response.headers["Content-Type"]).toMatch(/json/);
        expect(response.status).toBe(201);
        expect(response.body.user.email).toEqual(user.email);
        expect(response.body.user.username).toEqual(user.username);
    });
    it("logout user", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/signout');
        expect(response.status).toBe(200);
    });
})

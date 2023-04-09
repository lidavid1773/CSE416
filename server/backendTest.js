const request = require("supertest");
const app = require("./CounterButton.js");

describe ("Test Counter API", () => {
    beforeEach (() => {
        counter = 0;
    });

    it("should increment counter", async () => {
        const res = await request(app).post("/counter/increment");
        expect(res.statusCode).toEqual(200) ; 
        expect(res.body.counter).toEqual(1) ;
    });

    it ("should decrement counter", async () => {
        const res = await request(app).post("/counter/decrement");
        expect(res.statusCode).toEqual(200); 
        expect(res.body.counter).toEqual(-1) ;
    });
});
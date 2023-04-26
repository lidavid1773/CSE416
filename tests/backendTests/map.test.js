// const geodata = require('./countries_test.json');
const geodata = require('./count_test.json');
const user = require('./user.json');
const request = require("supertest");
const baseURL = "https://map-work-shop.herokuapp.com";

let mapId = null;
let token = null;

describe("Testing Map", () => {

    beforeAll(async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/signin').send(user);
        token = response.body.token;
    });

    afterAll(async () => {
        await request(baseURL).delete('/MapWorkShop/users/deleteuser').send(user);
    });

    it("Create Map", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/newMap').send({
            username: "test",
            title: "test",
            visibility: true,
            geodata: geodata
        });
    
        expect(response.status).toBe(201);
        expect(response.body.map.title).toEqual("test");
        expect(response.body.map.username).toEqual("test");
        expect(response.body.map.geodata.type).toEqual("FeatureCollection");

        mapId = response.body.map._id;
        await request(baseURL).delete(`/MapWorkShop/users/deleteMap/${ mapId }`);
    });


    it("viewMap", async () => {
        const response = await request(baseURL).get('/MapWorkShop/users/viewMap/644604a7f21e2f8b15dff8fc');

        expect(response.status).toBe(201);
    });

    it("singleMap", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/singleMap/644604a7f21e2f8b15dff8fc');

        expect(response.status).toBe(201);
    });

    it("Numofdownload", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/download/644604a7f21e2f8b15dff8fc');

        expect(response.status).toBe(201);
        //expect(response.body.downloads).toEqual(1);
    });

    // it("upvoteformap", async () => {
    //     const response = await request(baseURL).post('/MapWorkShop/users/upvoteformap/644604a7f21e2f8b15dff8fc')
    //     .set('Authorization',`Bearer ${token}`).send({
    //         user: {
    //             _id: "6431fee585d676b689bd8c6c",
    //             username: "lol",
    //             email: "lol@gmail.com",
    //             password: "$2b$10$wS6HO51jxh1OTWonbEpL9ezSwjgfDRL9VH35pHpgu1pI.1xlxjtFq",
    //             __v: 0
    //         }
    //     });
        
    //     expect(response.status).toBe(201);
    //     expect(response.body.votes.length).toEqual(1);

    // });

    // it("downvoteformap", async () => {
    //     const response = await request(baseURL).post('/MapWorkShop/users/downvoteformap/644604a7f21e2f8b15dff8fc')
    //     .set('Authorization',`Bearer ${token}`).send({
    //         user: {
    //             _id: "6431fee585d676b689bd8c6c",
    //             username: "lol",
    //             email: "lol@gmail.com",
    //             password: "$2b$10$wS6HO51jxh1OTWonbEpL9ezSwjgfDRL9VH35pHpgu1pI.1xlxjtFq",
    //             __v: 0
    //         }
    //     });
        
    //     expect(response.status).toBe(201);
    //     expect(response.body.votes.length).toEqual(1);
    // });

    it("updateMap", async () => {

        const newData = geodata.features.splice(1,10);
        const response = await request(baseURL).post('/MapWorkShop/users/updateMap/644604a7f21e2f8b15dff8fc').send({
            username: "test",
            title: "test",
            visibility: true,
            geodata: newData
        });
    
        expect(response.status).toBe(201);
        expect(response.body.message).toEqual("Updated map!");
       
    });


});
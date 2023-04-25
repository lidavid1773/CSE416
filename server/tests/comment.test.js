const comment = require('./comment.json');
const request = require("supertest");
const baseURL = "https://map-work-shop.herokuapp.com";
const user = require('./user.json');

let token = null;

describe("Testing comment before login", () => {

    it("post comment", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/postcomment/644604a7f21e2f8b15dff8fc').send(comment);  
        expect(response.status).toBe(401);
    });

    it("reply comment", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/postcomment/644604a7f21e2f8b15dff8fc').send(comment);  
        expect(response.status).toBe(401);
    });
    
    it("upvote", async () => {
        const response = await request(baseURL).post(`/MapWorkShop/users/upvoteforcomment/643f405f58103736e514105d`).send(comment);  
        expect(response.status).toBe(401);
    });

    it("downvote", async () => {
        const response = await request(baseURL).post(`/MapWorkShop/users/downvoteforcomment/643f405f58103736e514105d`).send(comment);  
        expect(response.status).toBe(401);
    });
})



describe("Testing comment after login", () => {
    beforeAll(async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/signup').send(user);
        token = response.body.token;
    });

    afterAll(async () => {
        await request(baseURL).delete('/MapWorkShop/users/deletecomment').send(comment);
        await request(baseURL).delete('/MapWorkShop/users/deleteuser').send(user);
    });

    it("post comment", async () => {
        const response = await request(baseURL).post('/MapWorkShop/users/postcomment/644604a7f21e2f8b15dff8fc')
        .set('Authorization',`Bearer ${token}`).send(comment);
        
        expect(response.status).toBe(201);
        expect(response.body.comment.text).toEqual(comment.text);
        expect(response.body.comment.username).toEqual(comment.username);
        
    });

    it("Upvote comment", async () => {
        
        const response = await request(baseURL).post(`/MapWorkShop/users/upvoteforcomment/643f405f58103736e514105d`)
        .set('Authorization',`Bearer ${token}`)
        .send({
            user: {
                _id: "6431fee585d676b689bd8c6c",
                username: "lol",
                email: "lol@gmail.com",
                password: "$2b$10$wS6HO51jxh1OTWonbEpL9ezSwjgfDRL9VH35pHpgu1pI.1xlxjtFq",
                __v: 0
            }
        });

        expect(response.status).toBe(201);
        expect(response.body.votes.length).toEqual(2);
    });

    it("downvote comment", async () => {
        const response = await request(baseURL).post(`/MapWorkShop/users/downvoteforcomment/643f405f58103736e514105d`).set('Authorization',`Bearer ${token}`).send({
            user: {
                _id: "6431fee585d676b689bd8c6c",
                username: "lol",
                email: "lol@gmail.com",
                password: "$2b$10$wS6HO51jxh1OTWonbEpL9ezSwjgfDRL9VH35pHpgu1pI.1xlxjtFq",
                __v: 0
            }
        });

        expect(response.status).toBe(201);
        expect(response.body.votes.length).toEqual(2);
    });
    
})



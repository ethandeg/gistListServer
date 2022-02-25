"use strict"
const request = require("supertest");
const { set } = require("../app");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    getItems,
    jsonifyDate
} = require("./_testCommon");
let lists;
let listItems
let users;
beforeAll(async () => {
    await commonBeforeAll();
    const values = await getItems();
    lists = values.lists;
    listItems = values.listItems;
    users = values.users;
    for (let list of lists) {
        list.created = jsonifyDate(list.created)
    }
    for (let item of listItems) {
        item.created = jsonifyDate(item.created)
    }
    for (let user of users) {
        user.created = jsonifyDate(user.created);
    }
})
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("GET /users", () => {
    test("Get all user data on 1 user if query passed in right", async () => {
        const resp = await request(app)
            .get(`/user?limit=1`)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toBe(1);
        expect(resp.body[0].id).toBeDefined();
        expect(resp.body[0]).toEqual(users[0]);
    })
    test("Get all user data on 2 uesrs if query passed in right", async () => {
        const resp = await request(app)
            .get(`/user?limit=2`)
        expect(resp.statusCode).toBe(200)
        expect(resp.body.length).toBe(2);
        expect(resp.body[0].id).toBeDefined();
        expect(resp.body[0]).toEqual(users[0]);
        expect(resp.body[1].id).toBeDefined();
        expect(resp.body[1]).toEqual(users[1]);
    })
})

describe("GET /users/id", () => {
    test("passing in a correct id should give a valid response", async () => {
        const resp = await request(app)
            .get(`/user/1`)
        const usersX = users.filter(u => u.id === 1);
        const l = lists.filter(x => x.userId === 1);
        usersX[0].lists = l;
        expect(new Set(Object.keys(usersX[0]))).toEqual(new Set(Object.keys(resp.body)));
        expect(resp.statusCode).toEqual(200);
        expect(usersX[0]).toEqual(resp.body);
    })

    test("passing in a non numeric value should give a 400", async () => {
        const resp = await request(app)
            .get('/user/badtest')
        expect(resp.statusCode).toEqual(400);
    });

    test("Passing a non existent id should give a 400", async () => {
        const resp = await request(app)
            .get('/user/8483933')
        expect(resp.statusCode).toEqual(400);
    })
})

describe("POST /user", () => {
    test("should successfully create a user", async () => {
        const sendVal = {
            "username": "testUser",
            "password": "testPassword",
            "email": "email@gmail.com",
            "profilePic": "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg"
        }
        const resp = await request(app)
            .post('/user')
            .send(sendVal)
        expect(resp.statusCode).toEqual(201);
        const id = resp.body.id;
        const getUser = await request(app)
            .get(`/user/${id}`)
        expect(getUser.statusCode).toEqual(200);
        sendVal.id = id;
        sendVal.created = getUser.body.created;
        sendVal.lists = getUser.body.lists;
        expect(getUser.body).toEqual(sendVal);
    })

    test("incorrect data sent should throw a 400", async () => {
        const sendVal = {
            "name": "testUser",
            "password": "testPassword",
            "eml": "email@gmail.com",
            "profilePic": "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg"
        }
        const resp = await request(app)
            .post("/user")
            .send(sendVal)
        expect(resp.statusCode).toEqual(400);
    })

    test("correct data but too many fields should throw a 400", async () => {
        const sendVal = {
            "username": "testUser",
            "password": "testPassword",
            "email": "email@gmail.com",
            "profilePic": "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
            "joeMomma": "this should not work"
        }
        const resp = await request(app)
            .post("/user")
            .send(sendVal)
        expect(resp.statusCode).toEqual(400);
    })
})


describe("PATCH /user", () => {
    test("valid data should succesfully update user", async () => {
        const sendId = 2;
        const sendVal = {
            "id": sendId,
            "password": "new password",
            "oldPassword": "thorton",
            "email": "billybobthorton923@gmail.com",
            "profilePic": "https://www.incimages.com/uploaded_files/image/1920x1080/getty_481292845_77896.jpg"
        }
        const resp = await request(app)
            .patch("/user")
            .send(sendVal)
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ "id": sendId, "success": true })

        const getResp = await request(app)
            .get(`/user/${sendId}`)
        expect(getResp.statusCode).toEqual(200);
        delete sendVal.oldPassword;
        delete getResp.body.lists;
        delete getResp.body.created;
        delete getResp.body.username;
        expect(getResp.body).toEqual(sendVal);
    })

    test("invalid password should throw a 400", async () => {
        const sendId = 2;
        const sendVal = {
            "id": sendId,
            "password": "new password",
            "oldPassword": "woooooonnngg pass",
            "email": "billybobthorton923@gmail.com",
            "profilePic": "https://www.incimages.com/uploaded_files/image/1920x1080/getty_481292845_77896.jpg"
        }
        const resp = await request(app)
            .patch("/user")
            .send(sendVal)
        expect(resp.statusCode).toEqual(400);
        const getResp = await request(app)
            .get(`/user/${sendId}`)
        expect(getResp.body.email).not.toEqual("billybobthorton923@gmail.com");
    })

    test("non existent id should return a 400", async () => {
        const sendId = 9239;
        const sendVal = {
            "id": sendId,
            "password": "new password",
            "oldPassword": "woooooonnngg pass",
            "email": "billybobthorton923@gmail.com",
            "profilePic": "https://www.incimages.com/uploaded_files/image/1920x1080/getty_481292845_77896.jpg"
        }
        const resp = await request(app)
            .patch('/user')
            .send(sendVal)
        expect(resp.statusCode).toEqual(400);
        const getResp = await request(app)
            .get(`/user/${sendId}`)
        expect(getResp.statusCode).toEqual(400);
    })

    test("bad data should return a 400", async () => {
        const sendId = 2;
        const sendVal = {
            "id": sendId,
            "password": "new password",
            "oldPassword": "woooooonnngg pass",
            "email": "billybobthorton923@gmail.com",
            "profilePic": "https://www.incimages.com/uploaded_files/image/1920x1080/getty_481292845_77896.jpg",
            "workljsdf": "this should cause an error"
        }
        const resp = await request(app)
            .patch("/user")
            .send(sendVal)
        expect(resp.statusCode).toEqual(400);
        const getResp = await request(app)
            .get(`/user/${sendId}`)
        expect(getResp.body.email).not.toEqual("billybobthorton923@gmail.com");
    })
})


describe("DELETE /user", () => {
    test("valid id should delete user", async () => {
        const sendId = 2;
        const resp = await request(app)
            .delete("/user")
            .send({ "id": sendId })
        expect(resp.statusCode).toEqual(200);
        const getResp = await request(app)
            .get(`/user/${sendId}`)
        expect(getResp.statusCode).toEqual(400);
    })
    test("invalid id should return a 400", async () => {
        const sendId = 59494;
        const resp = await request(app)
            .delete("/user")
            .send({ "id": sendId })
        expect(resp.statusCode).toEqual(400);
    })
})

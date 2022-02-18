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
  beforeAll(async() => {
      await commonBeforeAll();
      const values  = await getItems();
      lists = values.lists;
      listItems = values.listItems;
      for(let list of lists){
          list.created = jsonifyDate(list.created)
      }
      for(let item of listItems){
          item.created = jsonifyDate(item.created)
      }
  })
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);



describe("GET /lists", () => {
    test("Displays only one list if limit is set to one", async() => {
            const resp = await request(app)
            .get(`/list?limit=1`)
            expect(resp.statusCode).toBe(200)
            expect(resp.body.length).toBe(1);
            expect(resp.body[0].id).toBeDefined();
            expect(resp.body[0]).toEqual(lists[0]);

    });

    test("Shows more than 1 if limit is set higher", async() => {
            const resp = await request(app)
            .get(`/list?limit=2`)
            expect(resp.statusCode).toEqual(200);
            expect(resp.body.length).toBe(2);
            expect(resp.body[0]).toEqual(lists[0]);
            expect(resp.body[1]).toEqual(lists[1]);
 
    })
});

describe("GET /list/id", () => {
    test("Correct listId should return valid response", async () => {
        const resp = await request(app)
        .get(`/list/1`)
        const listsX = lists.filter(l => l.id === 1);
        const listItemsX = listItems.filter(x => x.listId === 1);
        listsX[0].items = listItemsX;
        expect(new Set(Object.keys(listsX[0]))).toEqual(new Set(Object.keys(resp.body)));
        expect(resp.statusCode).toEqual(200);
        expect(listsX[0]).toEqual(resp.body);
    })

    test("Not existent listId should return bad request error", async() => {
        const resp = await request(app)
        .get(`/list/2934823`)
        expect(resp.statusCode).toEqual(400);
    })

    test("Invalid type of id should return bad request error", async() => {
        const resp = await request(app)
        .get(`/list/hellothere`)
        expect(resp.statusCode).toEqual(400);
    })

})

describe("POST /list", () => {
    test("Valid data should create record", async() => {
        const resp = await request(app)
        .post("/list")
        .send({"userId": 1,"name": "test list","description": "lets hope this test passes"})
        expect(resp.statusCode).toEqual(201);
        expect(Object.keys(resp.body)).toEqual(['id', 'success']);
    })

    test("Invalid data should return a 400", async() =>{
        const resp = await request(app)
        .post("/list")
        .send({"test": "does it work"})
        expect(resp.statusCode).toEqual(400);
    })

})


describe("POST /list/item", () => {
    test("Valid data should create an item", async() => {
        const resp = await request(app)
        .post("/list/item")
        .send({"item": "Kit Katsdfsd","itemLink": "https://msdfasdfsdf.media-amazon.com/images/I/71j6uumiskL._SL1500_.jpg","listId": 1})
        expect(resp.statusCode).toEqual(201);
        expect(Object.keys(resp.body)).toEqual(['id', 'success']);
    })

    test("Invalid data should return a 400", async() =>{
        const resp = await request(app)
        .post("/list/item")
        .send({"test": "does it work"})
        expect(resp.statusCode).toEqual(400);
    })
    test("Invalid list ID should respond with a 400", async() =>{
        const resp = await request(app)
        .post("/list/item")
        .send({"item": "Kit Katsdfsd","itemLink": "https://msdfasdfsdf.media-amazon.com/images/I/71j6uumiskL._SL1500_.jpg","listId": 2343})
        expect(resp.statusCode).toEqual(400);
    })

})

describe("PATCH /list", () => {
    test("Valid body should successfully update value", async() => {
        const sendVals = {"name": "Thanksgiving List 2022","description": "Now lets have a thanksgiving list","id": 3}
        const resp = await request(app)
        .patch('/list')
        .send(sendVals)
        expect(resp.statusCode).toEqual(200);
        expect(Object.keys(resp.body)).toEqual(['id', 'success']);
        const newList = await request(app)
        .get("/list/3")
        const {name, description, id} = newList.body;
        expect([name,description,id]).toEqual(Object.values(sendVals));
    })

    test("Invalid body should return a 400", async() => {
        const resp = await request(app)
        .patch("/list")
        .send({"test": "no work"})
        expect(resp.statusCode).toEqual(400)
    })
    test("ID not found in db should return a 400", async() => {
        const resp = await request(app)
        .patch("/list")
        .send({"name": "Thanksgiving List 2022","description": "Now lets have a thanksgiving list","id": 938343})
        expect(resp.statusCode).toEqual(400);
    })
})


describe("PATCH /list/item", () => {
    test("Valid body should successfully update value", async() => {
        const sendVals = {
            "item": "Jeans",
            "itemLink": "https://shop.goop-img.com/cdn-cgi/image/height=960,width=960,dpr=1,format=auto,onerror=redirect,metadata=copyright/spree/images/attachments/000/072/726/large/open-uri20211020-13-l4fnmj?version=1634761894.webp",
            "id": 2,
            "listId": 3
        }
        const resp = await request(app)
        .patch('/list/item')
        .send(sendVals)
        expect(resp.statusCode).toEqual(200);
        expect(Object.keys(resp.body)).toEqual(['id', 'success']);
        const newList = await request(app)
        .get("/list/3")
        const {items} = newList.body;
        const itemX = items.find(i => i.id == 2)
        expect([itemX.item, itemX.itemLink, itemX.id, itemX.listId]).toEqual(Object.values(sendVals));
    })
    test("Valid body should successfully update value even if some keys are missing", async() => {
        const sendVals = {
            "item": "Jeans",
            "id": 2,
            "listId": 1
        }
        const resp = await request(app)
        .patch('/list/item')
        .send(sendVals)
        expect(resp.statusCode).toEqual(200);
        expect(Object.keys(resp.body)).toEqual(['id', 'success']);
        const newList = await request(app)
        .get("/list/1")
        const {items} = newList.body;
        const itemX = items.find(i => i.id == 2)
        expect([itemX.item,  itemX.id, itemX.listId]).toEqual(Object.values(sendVals));
    })

    test("Invalid body should return a 400", async() => {
        const resp = await request(app)
        .patch("/list/item")
        .send({"test": "no work"})
        expect(resp.statusCode).toEqual(400)
    })
    test("ID not found in db should return a 400", async() => {
        const sendVals = {
            "item": "Jeans",
            "itemLink": "https://shop.goop-img.com/cdn-cgi/image/height=960,width=960,dpr=1,format=auto,onerror=redirect,metadata=copyright/spree/images/attachments/000/072/726/large/open-uri20211020-13-l4fnmj?version=1634761894.webp",
            "id": 4,
            "listId": 383923
        }
        const resp = await request(app)
        .patch("/list/item")
        .send(sendVals)
        expect(resp.statusCode).toEqual(400);
    })
})

describe("DELETE /list", () => {
    test("Should successfully delete list", async() => {
        const resp = await request(app)
        .delete("/list")
        .send({"id": 3})
        expect(resp.statusCode).toEqual(200);
        expect(Object.keys(resp.body)).toEqual(['id', 'success']);
        const newList = await request(app)
        .get("/list/3")
        expect(newList.statusCode).toEqual(400)
    });

    test("Invalid body should cause a 400", async() => {
        const resp = await request(app)
        .delete("/list")
        .send({"id": 3, "name": "test"})
        expect(resp.statusCode).toEqual(400)
    });

    test("Not existent list ID should return a 400", async() => {
        const resp = await request(app)
        .delete("/list")
        .send({"id": 39483})
        expect(resp.statusCode).toEqual(400)
    });
    

})

describe("DELETE /list/item", () => {
    test("Should successfully delete list item", async() => {
        const resp = await request(app)
        .delete("/list/item")
        .send({"id": 3})
        expect(resp.statusCode).toEqual(200);
        expect(Object.keys(resp.body)).toEqual(['id', 'success']);
        const newListItem = await request(app)
        .patch("/list/item")
        .send({"id": 3, "item": "should not work"})
        expect(newListItem.statusCode).toEqual(400)
    });

    test("Invalid body should cause a 400", async() => {
        const resp = await request(app)
        .delete("/list/item")
        .send({"id": 2, "name": "test"})
        expect(resp.statusCode).toEqual(400)
    });

    test("Not existent list ID should return a 400", async() => {
        const resp = await request(app)
        .delete("/list/item")
        .send({"id": 39483})
        expect(resp.statusCode).toEqual(400)
    });
    

})
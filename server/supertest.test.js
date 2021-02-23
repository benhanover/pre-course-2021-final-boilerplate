const request = require("supertest");

const app = require("./postman.js");

// GET
//  V  // can get a bin by id Object 
//  V  // if an illegal id is requested an appropriate response is sent (status + message) 
//  V  // if a bin is not found an appropriate response is sent (status + message) 

describe("GETS REQUESTS", () => {
  const expectedBinData = {
    "my-todo": [
        {
            "priority": "5",
            "date": "2021-02-23T16:53:19.792Z",
            "text": "Forever",
            "id": "fiQLRh"
        }
    ]
  };
  
// GET

  test("can get a bin by id", async ()=>{
    const response = await request(app).get('/b/2');
    expect(response.body.record).toEqual(expectedBinData);
  });
  
  test("should reject illegal id appropriate response", async ()=>{
      const response = await request(app).get('/b/re');
      expect(`{message: ${response.text},status:${response.status}}`).toEqual("{message: Bad Request - Invalid Bin Id provided,status:400}");
  });

    test("should send an appropriate response if such bin not found", async ()=>{
      const response = await request(app).get('/b/-1');
      expect(`{message: ${response.text},status:${response.status}}`).toEqual("{message: Not Found - Bin not found,status:404}");
  });
});
 
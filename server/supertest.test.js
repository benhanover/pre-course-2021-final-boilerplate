const request = require("supertest");

const app = require("./postman.js");
const fs = require("fs");

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
 
// PUT
//  V  // can update a bin by id
//  V  // no new bin is created when updating
//  V  // if an illegal id is requested an appropriate response is sent (status + message)
//  V  // if a bin is not found an appropriate response is sent (status + message)



describe("PUT REQUEST", () => {
  
  // PUT

  const requestBody = {
    "my-todo": [
        {
            "priority": "3",
            "date": "2021-02-23T01:53:19.792Z",
            "text": "Putin is a friend of Stalin, and they all just a PUT massage",
            "id": "riHLRh"
        }
    ]
  };
  
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };
  
  test("can update a bin by id", async ()=>{
    const response = await request(app).put('/b/3').send(options);
    expect(response.body.record).toEqual(true);
    expect(response.body['metadata']['id']).toEqual("3");
  });
  
  test("no new bin is created when updating", async () => {
    let lengthBeforeRequest = fs.readdirSync("./server/db/bins").length;
    
    await request(app).put('/b/3').send(options);
    let lengthAfterRequest = fs.readdirSync("./server/db/bins").length;
    expect(lengthAfterRequest).toBe(lengthBeforeRequest);
    
  });
  
  test("should reject illegal id appropriate response", async ()=>{
    const response = await request(app).put('/b/re').send(options);
    
    expect(`status:${response.status}, message:${response.text}`).toEqual("status:400, message:Bad Request - Invalid Bin Id provided");
  });
  
  test("should send an appropriate response if such bin not found", async ()=>{
    const response = await request(app).put('/b/-1').send(options);
    
    expect(`status:${response.status}, message:${response.text}`).toEqual("status:404, message:Not Found - Bin not found");
  });
});


// DELETE
//  V  // can delete a bin by id
//  V  //if an illegal id is requested an appropriate response is sent (status + message)
//  V  //if a bin is not found an appropriate response is sent (status + message)


describe("DELETE REQUEST",()=>{
  
  const requestBody = {
    "my-todo": [
      {
        "priority": "3",
        "date": "2021-02-23T01:53:19.792Z",
        "text": "HAKUNA MATATA",
        "id": "-2"
      }
    ]
  };
  test("can delete a bin by id" , async ()=>{
    fs.writeFileSync("./server/db/bins/bin--2.json",JSON.stringify(requestBody, null, 4));
    const response = await request(app).delete("/b/-2");
    expect(response.body.record).toEqual(true);
    expect(response.body.metadata.id).toBe("-2");
  });
  
  test("should reject illegal id appropriate response", async ()=>{
    const response = await request(app).delete('/b/re');
    
    expect(`status:${response.status}, message:${response.text}`).toEqual("status:400, message:Bad Request - Invalid Bin Id provided");
  });
  
  test("should send an appropriate response if such bin not found", async ()=>{
    const response = await request(app).delete('/b/-1');
    
    expect(`status:${response.status}, message:${response.text}`).toEqual("status:404, message:Not Found - Bin not found");
  });
  
});

// POST
//  X  // can add a new bin
//  X  //BONUS can not add a bin with illegal body and an appropriate response is sent (status + message)



describe("POST REQUEST",()=>{

  const requestBody = {
    "my-todo": [
        {
            "priority": "3",
            "date": "2021-02-23T01:53:19.792Z",
            "text": "Putin is a friend of Stalin, and they all just a PUT massage",
            "id": "riHLRh"
        }
    ]
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  };

  test("can add new a bin" , async ()=>{
    // check files length before POST request
    const filesBeforePost= fs.readdirSync('./server/db/bins');
    const oldFilesCount = filesBeforePost.length;
    
    // create the POST request
    const response = await request(app).post('/b').send(options);
    
    // check files length after POST request
    const filesAfterPost= fs.readdirSync('./server/db/bins');
    const newFilesCount = fs.readdirSync('./server/db/bins').length;
    const newFileId = Number(response.body.record.id);

    // checks id the new file exists in the db folder
    const doesFileExist = filesAfterPost.includes(`bin-${newFileId}.json`);

    //  tests 3 different aspects.
    expect(doesFileExist).toEqual(true);
    expect(newFilesCount-1).toEqual(oldFilesCount);
    expect(response.status).toEqual(200);

    // restores last state
    fs.unlinkSync(`./server/db/bins/bin-${newFileId}.json`);
    fs.writeFileSync(`./server/db/counter.json`, JSON.stringify({id: Number(newFileId)-1 } , null, 4));
  
  });
   
});
















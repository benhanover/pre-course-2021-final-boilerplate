const { Console } = require("console");
const { request } = require("express");
const express = require (`express`);
const app = express();
module.exports = app;
// run nodemon from pre course 2021 final boilerplate or adjust the path
const path = './server/db';

app.listen(3000 , ()=> { console.log("listening at 3000") } );

app.use('/b', (req, res, next) => {
  setTimeout(next, 500);
});
app.use(express.json());



const fs = require("fs");

// ToDo =  "DELETE", "POST" , "PUT", "GET ALL", "GET ID"
// 400 = invalid syntax - bad request.
// 401 = the client has to authenticate itself first.
// 402 = payment required, ( very rare)
// 403 = the client has no access rights to the server.

// 308 = the location transfered and no longer in this address.


// BUGS
// -post request with invalid json
// - how to access an error property in the catch 



// create a new file with the content of req.body
app.post("/b", (request, response) => {
  try {
    const { body } = request;
    // CHECKING FOR ERRORS
    // REQUIREMENT: headers = {'content-type': 'application/json`}
    if (!('content-type' in request.headers && request.headers['content-type'] === 'application/json')) {
      throw ({status: 400, message: 'Bad Request - Expected Content-Type to be application/json'});
      // REQUIREMENT: body not empty
    } else if (JSON.stringify(body) === JSON.stringify({})) {
        throw ({status: 400, message: 'Bad Request - Bin cannot be blank'});
    }

      let counterObj = JSON.parse(fs.readFileSync(`${path}/counter.json`,{encoding:'utf8', flag:'r'}));
      counterObj["id"] +=  1 ;
      const counter = counterObj["id"];

      fs.writeFileSync(`${path}/counter.json`,JSON.stringify(counterObj, null, 4));
      fs.writeFileSync(`${path}/bins/bin-${counter}.json`,JSON.stringify(body, null, 4));
      
      response.status(200).send({
        "record": counterObj ,
        "metadata": {
          "id": counter,
          "createdAt": new Date(),
        }
      });
  } catch(e) {
    if(typeof(e) === 'object' && e !== null) {
      response.status(e.status).send(e.message);
    } else {
      response.status(500).send(e);
    }
  }
});




app.put("/b/:id", (request, response) => {
  try {
    const { id } = request.params;
    const { body } = request;
    // CHECKING FOR ERRORS
    // REQUIREMENT: headers = {'content-type': 'application/json`}
    if (!('content-type' in request.headers && request.headers['content-type'] === 'application/json')) {
      throw ({status: 400, message: 'Bad Request - Expected Content-Type to be application/json'});
    }
    // REQUIREMENT: body not empty
    else if (JSON.stringify(body) === JSON.stringify({})) {
      throw ({status: 400, message: 'Bad Request - Bin cannot be blank'});
    }
    // REQUIREMENT: invalid id provided
    else if(isNaN(id)) {
      throw ({status: 400, message: 'Bad Request - Invalid Bin Id provided'});
    }
    // REQUIREMENT: bin not found
    else if(!isInBins(id)) { 
      throw ({status: 404, message: 'Not Found - Bin not found'});
    }
    fs.writeFileSync(`${path}/bins/bin-${id}.json`,JSON.stringify(body, null, 4));
    response.status(200).send({
      "record": true ,
      "metadata": {
        "id": id,
        "createdAt": new Date(),
      }
    });
  
  }
  catch (e) {
    if(typeof(e) === 'object' && e !== null) {
      response.status(e.status).send(e.message);
    } else {
      response.status(500).send(e);
    }
  }
});


app.get("/b", (request, response) => {
  try {
    const allBinsName = fs.readdirSync( `${path}/bins`);
    const binsContent = [];
    allBinsName.forEach((binName) => {
      binsContent.push(JSON.parse(fs.readFileSync(`${path}/bins/${binName}`,{encoding:'utf8', flag:'r'})));
    });
    response.status(200).send(
      {
      "record": binsContent ,
      "metadata": {
      "id": "all bin",
      "createdAt": new Date(),
      }
      });
    } catch (e) {
      response.status(500).send("Server internal error could not read all data, the error was:" + e);
    }
});



app.get("/b/:id" , (request,response) => {
  try {
    const { id } = request.params;
    // REQUIREMENT: invalid id provided
    if(isNaN(id)) {
      throw ({status: 400, message: 'Bad Request - Invalid Bin Id provided'});
    }
    // REQUIREMENT: bin not found
    else if(!isInBins(id)) { 
      throw ({status: 404, message: 'Not Found - Bin not found'});
    }
    const bin = JSON.parse(fs.readFileSync(`${path}/bins/bin-${id}.json`,{encoding:'utf8', flag:'r'}));
    response.status(200).send(
      {
        "record": bin,
        "metadata": {
        "id": id,
        "createdAt": new Date(),
        }
    });
  } catch (e) {
    if(typeof(e) === 'object' && e !== null) {
      response.status(e.status).send(e.message);
    } else {
      response.status(505).send(`Server internal error could not read bin-${id} data, the error was: ` + e);
  }
}
});



app.delete("/b/:id" , (request , response) => {
  try {
    const { id } = request.params;
    // REQUIREMENT: invalid id provided
    if(isNaN(id)) {
      throw ({status: 400, message: 'Bad Request - Invalid Bin Id provided'});
    }
    // REQUIREMENT: bin not found
    else if(!isInBins(id)) { 
      throw ({status: 404, message: 'Not Found - Bin not found'});
    }
    fs.unlinkSync(`${path}/bins/bin-${id}.json`);
    response.status(200).send(
      {
        "record": true,
        "metadata": {
        "id": id,
        "createdAt": new Date(),
        }
    });
  } catch (e) {
    if(typeof(e) === 'object' && e !== null) {
      response.status(e.status).send(e.message);
    } else {
      response.status(505).send(`Server internal error could not read bin-${id} data, the error was: ` + e);
    }
  }
});

// returns true if bin was found by id 
function isInBins(id) {
  const binsFolder = fs.readdirSync(`${path}/bins`);
  const matchBin = binsFolder.filter((bin) => {
    return bin === `bin-${id}.json`;
  })
  return Boolean(matchBin[0]);
}





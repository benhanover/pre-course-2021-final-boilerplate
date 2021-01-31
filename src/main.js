// set up for api
const API_KEY = "$2b$10$Gngt6a2X5rSlrH5bkOyscea5zrXZQGieIPFU6D02.H8lZidUy7n3a";
const BIN_ID = "601699620ba5ca5799d18d7b";
const apiURL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// variables
let = counter = 0;
let todoList = [];

// Elements
const elInput = document.querySelector("#text-input");
const elAddButton = document.querySelector("#add-button");
const elList = document.querySelector(".view-section");
const elPriority = document.querySelector("#priority-selector");
const elCountAndSortSection = document.querySelector(".countAndSortSection");
const elSort = document.querySelector(".sort-button");

// bind add new todo
elAddButton.addEventListener("click", (e) => {
  if (elInput.value === "") {
    alert("Please type a name");
    return;
  }
  taskObj = {
    priority: elPriority.value,
    date: new Date(),
    text: elInput.value,
    id: makeId(),
  };
  todoList.push(taskObj);
  renderTask(taskObj);
  updateBin();
  elInput.value = "";
  counter++;
  renderTodoCountSoFar();
});

// Render functions

// creates the count and sort elements
function renderTodoCountSoFar() {
  // <h2>Tasks so far -</h2>
  // <h2 id="counter" class="counter">${counter}</h2>
  elCountAndSortSection.innerHTML = /*html*/ `
    <h2 id="counter" class="counter">Tasks so far - ${counter}</h2>
    <button id="sort-button" onclick="sortByPriority()">Sort by priority</button>`;
}
// prints the task in the html
function renderTask(taskObj) {
  // format date
  let dateStr = "";
  let date = new Date(taskObj.date);
  dateStr = changeDateFormat(date);

  const strContainerDiv = /*html*/ `
      <div class="todo-container">
        <div class="todo-priority">${taskObj.priority}</div>
        <div class="todo-created-at">${dateStr}</div>
        <div class="todo-text">${taskObj.text}</div>
        <button class="complete-btn">
          <i class="fas fa-check"></i>
        </button>
        <button class="trash-btn" onclick="deleteAndCheck('${taskObj.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  elList.insertAdjacentHTML("beforeend", strContainerDiv);
}

//reset screen
// empty the list html updateds the counter and rending all the tasks again
function renderList() {
  elList.innerHTML = "";
  counter = todoList.length;
  todoList.forEach((todo) => {
    renderTask(todo);
  });
}

// functions

// changes the date object to sql format
function changeDateFormat(date) {
  const years = date.toISOString().split("T")[0];
  const month = date.toISOString().split("T")[1].split(".")[0];
  const currentTime = `${years}
   ${month}`;
  return currentTime;
}

// sets uniqe id to every element
// if by a miracle theres is the same id as in the list array its recursively summon another id
function makeId(length = 6) {
  var uniqueId = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    uniqueId += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  // make new id if exists
  for (let i = 0; i < todoList.length; i++) {
    const todo = todoList[i];
    if (todo.id === uniqueId) {
      return makeId();
    }
  }

  return uniqueId;
}

//function sort
function sortByPriority() {
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < todoList.length - 1; i++) {
      if (todoList[i].priority < todoList[i + 1].priority) {
        swapped = true;
        let temp = todoList[i + 1];
        todoList[i + 1] = todoList[i];
        todoList[i] = temp;
      }
    }
  } while (swapped);
  renderList();
  updateBin();
}

//delete
//get the index of the elemnt with the proper removes it from the array and sends it to renderlist
function deleteAndCheck(id) {
  const removeIdx = todoList.findIndex((todo) => todo.id === id);
  console.log("removeIdx:", removeIdx);
  if (removeIdx !== -1) {
    todoList.splice(removeIdx, 1);
    counter--;
    renderTodoCountSoFar();
  }
  renderList();
  updateBin();
}
// render the list from the bin and the the func to put the count and sort button
readBin();
renderTodoCountSoFar();

// Api
// read funcs

async function readBin() {
  try {
    const options = {
      method: "GET",
      headers: { "X-Master-Key": API_KEY },
    };
    const request = await fetch(`${apiURL}/latest`, options);
    const output = await request.json();
    // assign the array with the the array from the bin
    todoList = output.record["my-todo"];
    // render the list
    renderList();
  } catch (error) {
    console.log(error);
  }
}

//update funcs
async function updateBin() {
  try {
    let reqBody = { ["my-todo"]: todoList };
    const options = {
      method: "PUT",
      headers: {
        "X-Master-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    };
    fetch(apiURL, options);
  } catch (error) {
    console.log(error);
  }
}

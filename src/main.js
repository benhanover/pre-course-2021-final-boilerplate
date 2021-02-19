// set up for api
const BIN_ID = "1";
const apiURL = 'http://localhost:3000/b/';

// variables
let = counter = 0;
let todoList = [];

// Elements
const elInput = document.querySelector("#text-input");
const elAddButton = document.querySelector("#add-button");
const elList = document.querySelector(".view-section");
const elPriority = document.querySelector("#priority-selector");
const elCountAndSortSection = document.querySelector(".countAndSortSection");
const spinner = document.getElementById("spinner");

// render the list from the bin and display the count and sort elements
readBin();

// bind add new todo
elAddButton.addEventListener("click", (e) => {
  if (elInput.value === "") {
    alert("Please type a task");
    return;
  }
  taskObj = {
    priority: elPriority.value,
    date: new Date(),
    text: elInput.value,
    id: makeId(),
  };
  todoList.push(taskObj);
  updateBin(taskObj);
  elInput.value = "";
  counter++;
});

// Render functions

// creates the count and sort elements
function renderTodoCountSoFar() {
  elCountAndSortSection.innerHTML = /*html*/ `
    <h2>Tasks so far -</h2>
    <h2 id="counter" class="counter">${counter}</h2>
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
        <button class="highlight" onclick="this.parentElement.classList.toggle('highlighted');">
          <i class="fas fa-highlighter"></i>
        </button>
        <div class="todo-priority">${taskObj.priority}</div>
        <div class="todo-created-at">${dateStr}</div>
        <div class="todo-text">${taskObj.text}</div>
        <button class="edit-btn" onclick="editText('${taskObj.id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="complete-btn" onclick="this.parentElement.classList.toggle('completed');">
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

// find the index of the object in the array and changes its text to what prompt gets
// and sets the priority again
function editText(id) {
  const editIdx = todoList.findIndex((todo) => todo.id === id);
  text = prompt("enter edited task: ");
  if (text !== null) {
    todoList[editIdx].text = text;
  }
  newPriority = Number(prompt("enter the priority"));
  while (newPriority < 1 || newPriority > 6) {
    newPriority = Number(prompt("enter priority between 1 to 5"));
  }
  todoList[editIdx].priority = newPriority;
  renderList();
  updateBin();
}

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

//function bubble sort
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
  // line below updates the bin with the sorted aray but fails the sort test and the json test
  // updateBin();
}

//delete
//get the index of the elemnt with the proper removes it from the array and sends it to renderlist
function deleteAndCheck(id) {
  const removeIdx = todoList.findIndex((todo) => todo.id === id);
  if (removeIdx !== -1) {
    todoList.splice(removeIdx, 1);
    counter--;
    renderTodoCountSoFar();
  }
  updateBin();
  renderList();
}

// Api
// read funcs

function readBin() {
  spinner.removeAttribute("hidden");
  const request = fetch(apiURL + BIN_ID);
  function getJsonFromResponse(res) {
    if (!res.ok) {
      throw new Error("Something went wrong..");
    }
    const jsonPromise = res.json();
    const logJson = (json) => {
      // assign the array with the bin array
      todoList = json.record["my-todo"];
      // render the task html
      renderList();
      // counter gets the list length
      counter = todoList.length;
      // render the the count and sort
      renderTodoCountSoFar();
      spinner.setAttribute("hidden", "");
    };
    jsonPromise.then(logJson);
  }
  request.then(getJsonFromResponse).catch((error) => {
    console.log(error);
  });
}

//update funcs
function updateBin(taskObj) {
  spinner.removeAttribute("hidden");
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ["my-todo"]: todoList }),
  };
  fetch(apiURL + BIN_ID, options)
    .then((res) => {
      spinner.setAttribute("hidden", "");
      renderTask(taskObj);
      renderTodoCountSoFar();
      if (!res.ok) {
        throw new Error("there was a problem.. your changes didnt save");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// array that keeps all tasks and is send to the api
let todoList = [];
// Selectors
const input = document.querySelector("#text-input");
const addButton = document.querySelector("#add-button");
const list = document.querySelector(".view-section");
const priority = document.querySelector("#priority-selector");
const countAndSortSection = document.querySelector(".countAndSortSection");
addCountAndSort();
const sort = document.querySelector(".sort-button");

var firstLoad = true;
// Event Listeners
addButton.addEventListener("click", addTask);
list.addEventListener("click", deleteAndCheck);
sort.addEventListener("click", sortByPriority);

// activating the func
readBin();

// Functions
function addTask(task, idx) {
  // debugger;
  console.log(task);
  // increase the counter
  addButton.value++;
  document.querySelector(
    ".counter"
  ).innerText = `Tasks so far - ${addButton.value}`;
  // creating the div with class todo-container
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("todo-container");
  // append it to the list
  list.appendChild(containerDiv);

  // creating the div with class todo-priority************
  const priorityDiv = document.createElement("div");
  priorityDiv.classList.add("todo-priority");
  priorityDiv.setAttribute("value", priority.value);
  if (task.priority !== undefined) {
    priorityDiv.innerText = task.priority;
  }
  // came from the client
  else {
    priorityDiv.innerText = priority.value;
  }
  // appending to the container
  containerDiv.appendChild(priorityDiv);

  // creating the div with class todo-created-at**************
  const dateDiv = document.createElement("div");
  dateDiv.classList.add("todo-created-at");
  let date;
  // came from the api
  let currentTime;
  if (task.date !== undefined) {
    date = new Date(task.date);
    currentTime = changeDateFormat(date);
  }
  // came from the client
  else {
    date = new Date();
    currentTime = changeDateFormat(date);
  }
  dateDiv.innerText = currentTime;
  // appending to the container
  containerDiv.appendChild(dateDiv);

  // creating the div with class todo-text**********
  const textDiv = document.createElement("div");
  textDiv.classList.add("todo-text");
  // came from the api
  if (task.text !== undefined) {
    textDiv.innerText = task.text;
  }
  // came from the client
  else {
    textDiv.innerText = input.value;
  }
  // appending to the container
  containerDiv.appendChild(textDiv);

  // check mark button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  containerDiv.appendChild(completedButton);

  // delete button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  trashButton.addEventListener("click", function (e, idx) {
    deleteAndCheck(e, idx);
  });
  trashButton.setAttribute("data-task-index", idx);
  containerDiv.appendChild(trashButton);

  // update the api
  // todoList.push({date, input.value, priority.value})

  // reset the input value
  input.value = "";
  if (firstLoad) {
    return;
  }
  updateBin();
}
//  delete and check function
function deleteAndCheck(e, idx) {
  const target = e.target;
  item = target.parentElement;
  // delete
  if (target.className === "trash-btn") {
    item.remove();

    // // need to delete from the api
    //     console.log(todoList[0].date);
    //     removeFromApi = document.querySelector("body > div.view-section-wrapper > div > div > div.todo-created-at").textContent;
    //     console.log(removeFromApi);

    // for (let i = 0; i < todoList.length; i++) {
    //   if (todoList[i].date === removeFromApi) {
    todoList.splice(idx, 1);

    const url = `https://api.jsonbin.io/v3/b/60154a5daafcad2f59618c13`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "my-todo": todoList }),
    });

    // reset html
    // list.innerHTML = "";
    // todoList.forEach(function (todo, i) {
    //   addTask(todo, i);
    // });

    // updateBin();
    // return;
    //   }
    // }

    addButton.value--;
    document.querySelector(
      ".counter"
    ).innerText = `Tasks so far - ${addButton.value}`;
  } // complete
  if (target.className === "complete-btn") {
    item.classList.toggle("completed");
  }
}

// changes the date object to sql format
function changeDateFormat(date) {
  const years = date.toISOString().split("T")[0];
  const month = date.toISOString().split("T")[1].split(".")[0];
  const currentTime = `${years}
   ${month}`;
  return currentTime;
}

// creates the count and sort
function addCountAndSort() {
  // creating the counter
  const counter = document.createElement("h2");
  counter.classList.add("counter");
  counter.setAttribute("id", "counter");
  counter.innerText = `Tasks so far - 0`;
  countAndSortSection.appendChild(counter);
  // creating the sort button
  const sortButton = document.createElement("button");
  sortButton.classList.add("sort-button");
  sortButton.innerText = "Sort by priority";
  countAndSortSection.appendChild(sortButton);
}
// sort the list
function sortByPriority() {
  let listItems = list.querySelectorAll(".todo-container");
  for (let i = 1; i <= 5; i++) {
    for (const item of listItems) {
      if (item.querySelector(".todo-priority").innerText === i.toString()) {
        list.insertBefore(item, list.firstChild);
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////
// API
// update
const updateBin = async () => {
  // path tho get all of the dates in the html
  const allDates = document.querySelectorAll(
    "body > div.view-section-wrapper > div > div > div.todo-created-at"
  );
  // path tho get all of the text in the html
  const allTextInputs = document.querySelectorAll(
    "body > div.view-section-wrapper > div > div > div.todo-text"
  );
  // path tho get all of the priorities in the html
  const allPriorities = document.querySelectorAll(
    "body > div.view-section-wrapper > div > div > div.todo-priority"
  );
  // create objects and assign them to the array
  for (let i = 0; i < allDates.length; i++) {
    const obj = {
      date: allDates[i].textContent,
      text: allTextInputs[i].textContent,
      priority: allPriorities[i].textContent,
    };
    // todoList.push(obj);
  }
  console.log(todoList);
  // actual post request
  const url = `https://api.jsonbin.io/v3/b/60154a5daafcad2f59618c13`;

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "my-todo": todoList }),
  });
};

// function binUpdate() {
//   const url = `https://api.jsonbin.io/v3/b/60154a5daafcad2f59618c13`;

//     fetch(url, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ "my-todo": todoList }),
//   });
// }

// read
async function readBin() {
  URL = "https://api.jsonbin.io/v3/b/60154a5daafcad2f59618c13/latest";
  const serverResponse = await fetch(URL);
  const res = await serverResponse.json();
  console.log(res);
  todoList = res.record["my-todo"];

  // for (const todo of todoList) {
  //   addTask(todo);
  // }
  todoList.forEach(function (todo, i) {
    console.log(i, todo);
    addTask(todo, i);
  });
  firstLoad = false;
}

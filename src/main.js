// Selectors
const input = document.querySelector('#text-input');
const addButton = document.querySelector('#add-button');
const list = document.querySelector('.view-section');
const priority = document.querySelector('#priority-selector');
const countAndSortSection = document.querySelector('.countAndSortSection');
// adds them to the html
addCountAndSort();
const sort = document.querySelector('.sort-button');


/////////////////////////////////////////////////////////////////////////////////////////////

// Event Listeners
document.addEventListener('DOMContentLoaded', getTasks);
addButton.addEventListener('click', addTask);
list.addEventListener('click', deleteAndCheck);
sort.addEventListener('click', sortByPriority);


/////////////////////////////////////////////////////////////////////////////////////////////

// Functions
  // ADD TASK FUNCTION-
    // - increasing the counter of tasks
    // creating div container and assigns to it the 3 propetys
    // adding check and delete button to every task
function addTask(e) {
  // increase the counter
  addButton.value++;
  document.querySelector('.counter').innerText = `Tasks so far - ${addButton.value}`;
  // creating the div with class todo-container
  const containerDiv = document.createElement('div');
  containerDiv.classList.add("todo-container");
  // append it to the list
  list.appendChild(containerDiv);

  // creating the div with class todo-priority
  const priorityDiv = document.createElement('div');
  priorityDiv.classList.add("todo-priority");
  priorityDiv.innerText = priority.value;

  // appending to the container
  containerDiv.appendChild(priorityDiv);

  // creating the div with class todo-created-at
  const dateDiv = document.createElement('div');
  dateDiv.classList.add("todo-created-at");
  const date = new Date();

  // costumizing the date to SQL FORMAT
  const years = date.toISOString().split('T')[0];
  const month = date.toISOString().split('T')[1].split('.')[0];
  const currentTime = `${years}
   ${month}`;
  dateDiv.innerText = currentTime; 
   // appending to the container
  containerDiv.appendChild(dateDiv);

  // creating the div with class todo-text
  const textDiv = document.createElement('div');
  textDiv.classList.add("todo-text");
  textDiv.innerText = input.value;
   // appending to the container
  containerDiv.appendChild(textDiv);

  // check mark button
  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  containerDiv.appendChild(completedButton);

  // delete button
  const trashButton = document.createElement('button');
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add('trash-btn');
  containerDiv.appendChild(trashButton);

  // add task to localStorage
  saveLocalTasks([priority.value, currentTime, input.value]);

  // reset the input value
  input.value = "";
}
//  delete and check function 
function deleteAndCheck(e) {
  const target = e.target;
  item = target.parentElement;
  // delete
  if (target.className === 'trash-btn') {
    removeLocalTasks(item);
    item.remove();
    addButton.value--;
    document.querySelector('.counter').innerText = `Tasks so far - ${addButton.value}`;
  } // complete
  if (target.className === 'complete-btn') {
    item.classList.toggle('completed');
  } 
}
// creates the count and sort
function addCountAndSort() {
  // creating the counter
  const counter = document.createElement('h2');
  counter.classList.add('counter');
  counter.setAttribute("id", "counter");

  counter.innerText = `Tasks so far - 0`;

  countAndSortSection.appendChild(counter);
  // creating the sort button
  const sortButton = document.createElement('button');
  sortButton.classList.add("sort-button");
  sortButton.innerText = 'Sort by priority';
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
// saves to local storage
function saveLocalTasks(task) {
  // check if i have things in the local storage
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.push(task);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// get from the local storage by printing the array all over again 
function getTasks() {
  // check if i have things in the local storage
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.forEach(function (todo) {
    // increase the counter
    addButton.value++;
    document.querySelector('.counter').innerText = `Tasks so far - ${addButton.value}`;
    // creating the div with class todo-container
    const containerDiv = document.createElement('div');
    containerDiv.classList.add("todo-container");
    // append it to the list
    list.appendChild(containerDiv);

    // creating the div with class todo-priority
    const priorityDiv = document.createElement('div');
    priorityDiv.classList.add("todo-priority");
    priorityDiv.innerText = todo[0];

    // appending to the container
    containerDiv.appendChild(priorityDiv);

    // creating the div with class todo-created-at
    const dateDiv = document.createElement('div');
    dateDiv.classList.add("todo-created-at");
    const date = new Date();

    // costumizing the date to SQL FORMAT
    const years = date.toISOString().split('T')[0];
    const month = date.toISOString().split('T')[1].split('.')[0];
    const currentTime = `${years}
   ${month}`;
    dateDiv.innerText = todo[1];
    // appending to the container
    containerDiv.appendChild(dateDiv);

    // creating the div with class todo-text
    const textDiv = document.createElement('div');
    textDiv.classList.add("todo-text");
    textDiv.innerText = todo[2];
    // appending to the container
    containerDiv.appendChild(textDiv);

    // check mark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    containerDiv.appendChild(completedButton);

    // delete button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    containerDiv.appendChild(trashButton);
  });
}

function removeLocalTasks(task) {
   // check if i have things in the local storage
   let todos;
   if (localStorage.getItem('todos') === null) {
     todos = [];
   } else {
     todos = JSON.parse(localStorage.getItem('todos'));
  }
  const taskIndex = task.children[2].innerText;
  todos.splice(todos.indexOf(taskIndex), 1);
  localStorage.setItem('todos', JSON.stringify(todos));
}
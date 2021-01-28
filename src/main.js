// Selectors
const input = document.querySelector('#text-input');
const addButton = document.querySelector('#add-button');
const list = document.querySelector('.view-section');
const priority = document.querySelector('#priority-selector')

// Event Listeners
addButton.addEventListener('click', addTask);

// Functions
function addTask(e) {
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
  const date = new Date().toISOString().split('T');
  dateDiv.innerText = date; 
   // appending to the container
  containerDiv.appendChild(dateDiv);
  // creating the div with class todo-text
  const textDiv = document.createElement('div');
  textDiv.classList.add("todo-text");
  textDiv.innerText = input.value;
   // appending to the container
  containerDiv.appendChild(textDiv);


}
// Selectors
const input = document.querySelector('#text-input');
const addButton = document.querySelector('#add-button');
const list = document.querySelector('.view-section');
const priority = document.querySelector('#priority-selector')

// Event Listeners
addButton.addEventListener('click', addTask);
list.addEventListener('click', deleteAndCheck);

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
  const date = new Date();
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

  // reset the input value
  input.value = "";
}

function deleteAndCheck(e) {
  const target = e.target;
  item = target.parentElement;
  if (target.className === 'trash-btn') {
    item.remove();
  }
  if (target.className === 'complete-btn') {
    item.classList.toggle('completed');
  } 
}


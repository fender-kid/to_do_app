class Task {
    constructor(title, dueDate) {
        this.title = title;
        this.dueDate = dueDate;
        this.completed = false; // by default, a new task is not completed
    }
}

const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const addTaskBtnInModal = document.querySelector('#addTaskBtnInModal');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

addTaskBtnInModal.addEventListener('click', function() {
    const title = document.querySelector('#task-input').value;
    const dueDate = document.querySelector('#date-input').value;

    const newTask = new Task(title, dueDate);
    tasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Clear input fields after adding
    document.querySelector('#task-input').value = '';
    document.querySelector('#date-input').value = '';

    displayTasks();

    // You can also close the modal here and refresh your task list view
});


function validateInputs() {
    //Check if both fields have values
    if (taskInput.value && dateInput.value) {
        addTaskBtnInModal.removeAttribute('disabled');
    } else {
        addTaskBtnInModal.setAttribute('disabled', 'true');
    }
}

// Attach Event Listeners to Input Fields
taskInput.addEventListener('input', validateInputs);
dateInput.addEventListener('input', validateInputs);

function displayTasks() {
    //Clear the list first.
    taskList.innerHTML = '';

    // Loop through the tasks array and add each item to the UL
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        // If task is complete, strike through the text
        if (task.completed) {
            li.style.textDecoration = 'line-through';
        }

        // Create a complete button
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete Task';
        completeButton.classList.add('btn', 'btn-sm', 'btn-success', 'mr-2');
        completeButton.addEventListener('click', () => toggleTaskCompletion(index));

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Task';
        deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ml-2');
        deleteButton.addEventListener('click', () => deleteTask(index));

        // Task text
        li.textContent = `${task.title} (Due: ${task.dueDate})`;

        // Append the complete and delete buttons
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        // Append the entire list item to the task list
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed; // Toggle completion status
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks(); // Refresh the display
}

displayTasks();
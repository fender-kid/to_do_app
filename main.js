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
const taskModal = document.getElementById('taskModal');

// Prevent the toast from showing when the modal is shown
taskModal.addEventListener('shown.bs.modal', function(e) {
    e.stopPropagation();
});

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
    //Clears the list first.
    taskList.innerHTML = '';

    const currentDate = new Date();
    currentDate.setHours(0,0,0,0); // Set tiem to midnight for date comparison


    // Loop through the tasks array and add each item to the UL
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        // Check if task is overdue and not completed
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0,0,0,0); // Consider date only, ignore time

        // If task is complete, strike through the text
        if (task.completed) {
            li.style.textDecoration = 'line-through';
        }

        // Create a complete button
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete Task';
        completeButton.classList.add('btn', 'btn-sm', 'btn-success', 'mr-2', 'ml-3');
        completeButton.addEventListener('click', () => toggleTaskCompletion(index));

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ml-2');
        deleteButton.addEventListener('click', () => deleteTask(index));

        if (taskDueDate < currentDate && !task.completed) {
            li.style.backgroundColor = 'rgba(255,0,0,.5)';
            li.style.color = 'white'; // Adjust text color for better contrast
            // deleteButton.style.backgroundColor = 'orange';
        }

        // Task text
        li.textContent = `${task.title} (Due: ${task.dueDate})`;

        // Append the complete and delete buttons
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        // Append the entire list item to the task list
        taskList.appendChild(li);

    });
}

function editTask(index) {
    taskInput.value = tasks[index].title;
    dateInput.value = tasks[index].dueDate;

    // Needs more code to work    
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
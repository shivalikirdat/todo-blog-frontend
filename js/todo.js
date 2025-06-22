document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date");
const prioritySelect = document.getElementById("priority");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

taskForm.addEventListener("submit", addTask);
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterTasks(btn.dataset.filter);
  });
});

function loadTasks() {
  const tasks = getStoredTasks();
  tasks.forEach(task => renderTask(task));
}

function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    dueDate: dueDateInput.value,
    priority: prioritySelect.value
  };

  saveTask(task);
  renderTask(task);

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "Low";
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <div class="task-meta">
      Due: ${task.dueDate || "N/A"} | Priority: ${task.priority}
    </div>
    <div class="task-actions">
      <button class="complete-btn">Mark ${task.completed ? "Pending" : "Completed"}</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  taskList.appendChild(li);

  li.querySelector(".complete-btn").addEventListener("click", () => {
    task.completed = !task.completed;
    updateTask(task);
    li.classList.toggle("completed");
    li.querySelector(".complete-btn").textContent = `Mark ${task.completed ? "Pending" : "Completed"}`;
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    deleteTask(task.id);
  });
}

function saveTask(task) {
  const tasks = getStoredTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(updatedTask) {
  let tasks = getStoredTasks();
  tasks = tasks.map(task =>
    task.id === updatedTask.id ? updatedTask : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskId) {
  let tasks = getStoredTasks();
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getStoredTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function filterTasks(filter) {
  const tasks = getStoredTasks();
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach(task => renderTask(task));
}

document.addEventListener("DOMContentLoaded", loadTasks);

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

taskForm.addEventListener("submit", addTask);

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task));
}

function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  saveTask(task);
  renderTask(task);

  taskInput.value = "";
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${task.text}</span>
    <div>
      <button class="complete-btn">✓</button>
      <button class="delete-btn">🗑️</button>
    </div>
  `;

  taskList.appendChild(li);

  li.querySelector(".complete-btn").addEventListener("click", () => {
    task.completed = !task.completed;
    updateStorage();
    li.classList.toggle("completed");
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    deleteTask(task);
  });
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskToDelete) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter(task => task.text !== taskToDelete.text);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

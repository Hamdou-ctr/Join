document.addEventListener("DOMContentLoaded", async () => {
  await initAddTask();
});

const BASE_URL =
  "https://jointest-202a5-default-rtdb.europe-west1.firebasedatabase.app/";

const priorityImage = {
  Urgent: "assets/img/urgent-image-rot.svg",
  Medium: "assets/img/medium-image-gelbe.svg",
  Low: "assets/img/low-image-grune.svg",
};

let allTasks = [];

async function initAddTask() {
  let priorityIcons = document.querySelectorAll(".priority-icon");
  priorityIcons.forEach((icon) =>
    icon.addEventListener("click", () => {
      priorityIcons.forEach((icon) => icon.classList.remove("selected"));
      icon.classList.add("selected");
    })
  );
  loadAllTasks();
  show();
  includeHTML();
  //await fetchTasksAndDisplay();
}

async function postData(path = "", data = {}) {
  try {
    let response = await fetch(`${BASE_URL}${path}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.json());
    return await response.json();
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
}

async function deleteData(path = "") {
  try {
    let response = await fetch(`${BASE_URL}${path}.json`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("Data deleted successfully");
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }

  initAddTask();
}

async function addTask(event) {
  event.preventDefault();
  let task = {
    inputTitle: document.getElementById("input-title").value,
    description: document.getElementById("input-description").value,
    assigned: document.getElementById("assigned-to-select").value,
    //category: document.getElementById(" category-todo").value,
    subtasks: document.getElementById("subtasks-input").value,
    createsTasks: document.getElementById("category-select").value,
    priority: getSelectedPriority(),
    priorityImage: priorityImage[getSelectedPriority()] || "",
    dueDate: document.getElementById("due-date-input").value,
    createdAt: new Date().getTime(),
  };
  try {
    let addedTask = await postData("tasks", task);
    allTasks.push({ ...task, id: addedTask.name });
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    show();
    //clearForm();
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

function getSelectedPriority() {
  let priorityIcons = document.querySelectorAll(".priority-icon");
  for (let icon of priorityIcons) {
    if (icon.classList.contains("selected")) return icon.alt;
  }
  return "Keiner ?";
}

/* function show() {
  let content = document.getElementById("content");
  if (content) {
    content.innerHTML = "";
    for (let task of allTasks) {
      content.innerHTML += contentHtml(task);
    }
  } else {
    console.error("Element with ID 'content' not found.");
  }
} */

function show() {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let task of allTasks) {
    content.innerHTML += contentHtml(task);
  }
}

function loadAllTasks() {
  let allTasksAsString = localStorage.getItem("allTasks");
  if (allTasksAsString) allTasks = JSON.parse(allTasksAsString);
}

function clearForm() {
  [
    "input-title",
    "input-description",
    "assigned-to-select",
    "category-select",
    "due-date-input",
    "subtasks-input",
  ].forEach((id) => (document.getElementById(id).value = ""));
}

function urgentButtonBackgrundcolor() {
  let urgenRed = document.getElementById("priority-urgent-red");
  let urgentWhite = document.getElementById("priority-urgent-white");

  if (urgenRed.classList.contains("visible")) {
    urgenRed.classList.remove("visible");
    urgentWhite.classList.add("visible");
    urgentButtonBackgrundcolorRed();
  } else {
    urgenRed.classList.add("visible");
    urgentWhite.classList.remove("visible");
    urgentButtonBackgrundcolorWhite();
  }
}

function urgentButtonBackgrundcolorRed() {
  document
    .getElementById("Urgent-div")
    .classList.replace("priority-div", "Urgent-color-red");
}

function urgentButtonBackgrundcolorWhite() {
  document
    .getElementById("Urgent-div")
    .classList.replace("Urgent-color-red", "priority-div");
}

function mediumButtonBackgrundcolor() {
  let mediumYellow = document.getElementById("priority-medium-yellow");
  let mediumWhite = document.getElementById("priority-medium-white");

  if (mediumYellow.classList.contains("visible")) {
    mediumYellow.classList.remove("visible");
    mediumWhite.classList.add("visible");
    mediumButtonBackgrundcolorYellow();
  } else {
    mediumYellow.classList.add("visible");
    mediumWhite.classList.remove("visible");
    mediumButtonBackgrundcolorWhite();
  }
}

function mediumButtonBackgrundcolorYellow() {
  document
    .getElementById("Medium-div")
    .classList.replace("priority-div", "medium-color-yellow");
}

function mediumButtonBackgrundcolorWhite() {
  document
    .getElementById("Medium-div")
    .classList.replace("medium-color-yellow", "priority-div");
}

function lowButtonBackgrundcolor() {
  let lowgreen = document.getElementById("priority-low-green");
  let lowWhite = document.getElementById("priority-low-white");

  if (lowgreen.classList.contains("visible")) {
    lowgreen.classList.remove("visible");
    lowWhite.classList.add("visible");
    lowButtonBackgrundcolorgreen();
  } else {
    lowgreen.classList.add("visible");
    lowWhite.classList.remove("visible");
    lowButtonBackgrundcolorWhite();
  }
}

function lowButtonBackgrundcolorgreen() {
  document
    .getElementById("Low-div")
    .classList.replace("priority-div", "priority-color-green");
}

function lowButtonBackgrundcolorWhite() {
  document
    .getElementById("Low-div")
    .classList.replace("priority-color-green", "priority-div");
}

function contentHtml(task) {
  return `
    <div class="overlay">
      <h1>Title</h1>
      <div>${task.inputTitle}</div>
      <h2>Description</h2>
      <div>${task.description}</div>
      <h3>Assigned</h3>
      <div>${task.assigned}</div>
      <h3>Category</h3>
      <div>${task.category}</div>
      <h3>subtasks</h3>
      <div>${task.subtasks}</div>
      <h3>date</h3>
      <div>${createdAtHtml(task)}</div>
      <h3>Priority</h3>
      <h2>${task.priority}</h2>
      <img src="${task.priorityImage}" alt="">
      <button onclick="handleDelete('${task.id}')">Löschen</button>
    </div>
  `;
}

async function handleDelete(taskId) {
  try {
    await deleteData(`tasks/${taskId}`);
    allTasks = allTasks.filter((task) => task.id !== taskId);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    show();
    console.log("Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

function createdAtHtml(task) {
  let createdAt = new Date(task.createdAt);
  let day = createdAt.getDate();
  let month = createdAt.getMonth() + 1;
  let year = createdAt.getFullYear();

  let hours = createdAt.getHours();
  let minutes = createdAt.getMinutes();
  let seconds = createdAt.getSeconds();

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return `
    <div>
      <h4>${day}.${month}.${year}</h4>
      <p>${hours}:${minutes}:${seconds}</p>
    </div>
  `;
}

async function fetchTasksAndDisplay() {
  try {
    let tasksData = await fetchTasks();
    displayTasks(tasksData);
  } catch (error) {
    handleFetchError(error);
  }
}

async function fetchTasks() {
  let response = await fetch(`${BASE_URL}tasks.json`);
  if (!response.ok) {
    throw new Error(
      `Fehler beim Abrufen der Aufgaben. Status: ${response.status}`
    );
  }
  return await response.json();
}

function handleFetchError(error) {
  //console.error("Fehler beim Laden der Aufgaben:", error);
  document.getElementById("task-list").innerText =
    "Fehler beim Laden der Aufgaben.";
}

function displayTasks(tasksData) {
  try {
    let taskListDiv = getTaskListDiv();
    let tasksHtml = generateTasksHtml(tasksData);
    taskListDiv.innerHTML = tasksHtml;
  } catch (error) {
    handleDisplayError(error);
  }
  //console.log(tasksData)
}

function getTaskListDiv() {
  let taskListDiv = document.getElementById("task-list");
  if (!taskListDiv) {
    throw new Error(`Element mit ID 'task-list' nicht gefunden.`);
  }
  return taskListDiv;
}

function generateTasksHtml(tasksData) {
  let tasksHtml = "<ul>";
  Object.keys(tasksData).forEach((taskId) => {
    tasksHtml += generateTaskHtml(tasksData[taskId]);
  });
  tasksHtml += "</ul>";
  return tasksHtml;
}

function displayTasksAsJson(tasksData) {
  try {
    let jsonOutputDiv = getJsonOutputDiv();
    let jsonData = JSON.stringify(tasksData, null, 2); // Formatiertes JSON
    jsonOutputDiv.innerHTML = `<pre>${jsonData}</pre>`;
    //console.log(jsonData);
  } catch (error) {
    handleJsonDisplayError(error);
  }
}

function generateTaskHtml(task) {
  return `
      <li>
          <button>${task.inputTitle}</button>
          <button>${task.assigned}</button>
          <button>${task.description}</button>
          <button>${task.category}</button>
      </li>`;
}

function handleDisplayError(error) {
  console.error("Fehler beim Anzeigen der Aufgaben:", error);
}

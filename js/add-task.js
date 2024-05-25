/* const BASE_URL =
  "https://join-210-default-rtdb.europe-west1.firebasedatabase.app/";
 */
let allTasks = [];

function initial() {
  let priorityIcons = document.querySelectorAll(".priority-icon");

  for (let icon of priorityIcons) {
    icon.addEventListener("click", function () {
      priorityIcons.forEach((icon) => icon.classList.remove("selected"));

      this.classList.add("selected");
    });
  }
  init();

  loadAllTasks();
  show();
  loadFireBaseUrl();

  //postData("/tasks", { Hamidou: "Diallo" });
}

async function loadFireBaseUrl(path = "") {
  let respose = await fetch(BASE_URL + path + ".json");
  let resposeToJson = await respose.json();
  console.log(resposeToJson);
}

async function postData(path = "", data = {}) {
  let respose = await fetch(BASE_URL + ".json", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let resposeToJson = await respose.json();
}

function addTask() {
  let inputTitle = document.getElementById("input-title").value;
  let description = document.getElementById("input-description").value;
  let assigned = document.getElementById("assigned-to-select").value;
  let category = document.getElementById("category-select").value;
  let dueDateInput = document.getElementById("due-date-input").value;
  let subtasks = document.getElementById("subtasks-input").value;

  let selectedPriority;
  let priorityIcons = document.querySelectorAll(".priority-icon");
  for (let icon of priorityIcons) {
    if (icon.classList.contains("selected")) {
      selectedPriority = icon.alt;
      break;
    }
  }

  if (!selectedPriority) {
    selectedPriority = "Priority ?"; // Fallback-Pfad, falls keine Priorität ausgewählt wurde
  }

  let task = {
    inputTitle,
    description,
    assigned,
    category,
    subtasks,
    priority: selectedPriority,
    createdAt: new Date().getTime(),
  };

  allTasks.push(task);

  let allTasksAsString = JSON.stringify(allTasks);
  localStorage.setItem("allTasks", allTasksAsString);

  //console.log("allTasks", allTasks);

  show();
}

function show() {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let task of allTasks) {
    content.innerHTML += contentHtml(task);
  }
}

/* function show() {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < allTasks.length; i++) {
    content.innerHTML += contentHtml(allTasks[i]);
  }
} */

function loadAllTasks() {
  let allTasksAsString = localStorage.getItem("allTasks");
  if (allTasksAsString) {
    allTasks = JSON.parse(allTasksAsString);
  }
  //console.log("loaded all Tasks", allTasks);
}

function clearForm() {
  document.getElementById("input-title").value = "";
  document.getElementById("input-description").value = "";
  document.getElementById("assigned-to-select").value = "";
  document.getElementById("category-select").value = "";
  document.getElementById("due-date-input").value = "";
  document.getElementById("subtasks-input").value = "";
}

function contentHtml(task) {
  return /* html */ `
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
      <img src="${task.priority}" alt="">
    </div>
  `;
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

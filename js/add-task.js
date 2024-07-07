

let allTasks = [];

async function initAddTask() {
  let priorityIcons = document.querySelectorAll(".priority-icon");
  priorityIcons.forEach((icon) =>
    icon.addEventListener("click", () => {
      priorityIcons.forEach((icon) => icon.classList.remove("selected"));
      icon.classList.add("selected");
    })
  );

}




async function addTask(event) {
  event.preventDefault();
  let task = {
    inputTitle: document.getElementById("input-title").value,
    description: document.getElementById("input-description").value,
    assigned: document.getElementById("assigned-to-select").value,
    category: document.getElementById("category-select").value,
    subtasks: document.getElementById("subtasks-input").value,
    priority: getSelectedPriority(),
    priorityImage: priorityImage[getSelectedPriority()] || "",
    dueDate: document.getElementById("due-date-input").value,
    createdAt: new Date().getTime(),
  };

}

function getSelectedPriority() {
  let priorityIcons = document.querySelectorAll(".priority-icon");
  for (let icon of priorityIcons) {
    if (icon.classList.contains("selected")) return icon.alt;
  }
  return "Keiner ?";
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

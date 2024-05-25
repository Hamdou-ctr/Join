let allTasks = [];

function initial() {
  // Abrufen aller Prioritätsbilder
  let priorityIcons = document.querySelectorAll(".priority-icon");

  // Eventlistener für Klick auf Prioritätsbilder hinzufügen
  for (let icon of priorityIcons) {
    icon.addEventListener("click", function () {
      // Auswahl für alle Bilder entfernen
      priorityIcons.forEach((icon) => icon.classList.remove("selected"));
      // Auswahl für das geklickte Bild hinzufügen
      this.classList.add("selected");
    });
  }
  init();

  loadAllTasks();
  show();
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

  console.log("allTasks", allTasks);
  

  show();
}

function show() {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < allTasks.length; i++) {
    content.innerHTML += contentHtml(allTasks[i]);
  }
}

function clearForm() {
  document.getElementById("input-title").value = "";
  document.getElementById("input-description").value = "";
  document.getElementById("assigned-to-select").value = "";
  document.getElementById("category-select").value = "";
  document.getElementById("due-date-input").value = "";
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

function loadAllTasks() {
  let allTasksAsString = localStorage.getItem("allTasks");
  if (allTasksAsString) {
    allTasks = JSON.parse(allTasksAsString);
  }
  console.log("loaded all Tasks", allTasks);
}
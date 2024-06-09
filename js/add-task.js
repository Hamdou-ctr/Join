

const priorityImage = {
  Urgent: "assets/img/Property_Urgent.svg",
  Medium: "assets/img/Property_Medium.svg",
  Low: "assets/img/Property_Low.svg",
};

const BASE_URL =
  "https://join-210-default-rtdb.europe-west1.firebasedatabase.app/";

let allTasks = [];

function initial() {
  let priorityIcons = document.querySelectorAll(".priority-icon");

  for (let icon of priorityIcons) {
    icon.addEventListener("click", function () {
      priorityIcons.forEach((icon) => icon.classList.remove("selected"));
      this.classList.add("selected");
    });
  }
  loadAllTasks();
  show();
  init();
}

 async function postData(path = "", data = {}) {
  console.log("Sending data to Firebase:", data); // Konsolenausgabe hinzugefügt
  try {
    let response = await fetch(`${BASE_URL}${path}.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let error = await response.json();
      console.error("Error posting data:", error);
      throw new Error("Error posting data: " + error.error);
    }
    let responseToJson = await response.json();
    console.log("Data posted successfully:", responseToJson);
    return responseToJson;
  } catch (error) {
    console.error("Error in postData function:", error);
    throw error;
  }
} 

async function addTask() {
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
    selectedPriority = "Keiner ?";
  }

  let task = {
    inputTitle,
    description,
    assigned,
    category,
    subtasks,
    priority: selectedPriority,
    priorityImage: priorityImage[selectedPriority] || "",
    dueDate: dueDateInput,
    createdAt: new Date().getTime(),
  };

  try {
    let addedTask = await postData("tasks", task);
    allTasks.push({ ...task, id: addedTask.name });
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    show();
    clearForm();
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

function show() {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let task of allTasks) {
    content.innerHTML += contentHtml(task);
  }
}

function loadAllTasks() {
  let allTasksAsString = localStorage.getItem("allTasks");
  if (allTasksAsString) {
    allTasks = JSON.parse(allTasksAsString);
  }
}

function clearForm() {
  document.getElementById("input-title").value = "";
  document.getElementById("input-description").value = "";
  document.getElementById("assigned-to-select").value = "";
  document.getElementById("category-select").value = "";
  document.getElementById("due-date-input").value = "";
  document.getElementById("subtasks-input").value = "";
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
    .classList.replace("priority-div", "priority-clor-green");
}

function lowButtonBackgrundcolorWhite() {
  document
    .getElementById("Low-div")
    .classList.replace("priority-clor-green", "priority-div");
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
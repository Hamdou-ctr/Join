document.addEventListener("DOMContentLoaded", async () => {
  await initBoard();
});

async function initBoard() {
  await includeHTML(); // Warten Sie, bis die HTML-Dateien geladen sind
  loadTodoCards();
  await fetchTasksAndDisplay();
  updateHTML();
}

let contacts = [];
let tasks = [];
let todoCards = [];
let currentDraggedElement;

function loadTodoCards() {
  let savedTodoCards = localStorage.getItem("todoCards");
  if (savedTodoCards) {
    todoCards = JSON.parse(savedTodoCards);
  }
  //console.log('Loaded todoCards:', todoCards); // Debugging-Ausgabe
}

function save() {
  let todoCardsString = JSON.stringify(todoCards);
  localStorage.setItem("todoCards", todoCardsString);
  //console.log('Saved todoCards:', todoCards); // Debugging-Ausgabe
}

function updateHTML() {
  renderTodo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

function renderTodo() {
  let todo = todoCards.filter((t) => t["category"] === "todo");
  let todoContainer = document.getElementById("todo");

  if (!todoContainer) {
    console.error("Element mit ID 'todo' wurde nicht gefunden.");
    return;
  }

  todoContainer.innerHTML = "";

  for (let i = 0; i < todoCards.length; i++) {
    const element = todoCards[i];
    todoContainer.innerHTML += renderCardHTML(element, i);
  }

  console.log("bei todo", todo); // Debugging-Ausgabe
  //console.log('bei todoCards', todoCards);  // Debugging-Ausgabe
}

function renderInProgress() {
  let inProgress = todoCards.filter((t) => t["category"] === "inProgress");
  let inProgressContainer = document.getElementById("inProgress");

  if (!inProgressContainer) {
    console.error("Element mit ID 'inProgress' wurde nicht gefunden.");
    return;
  }

  inProgressContainer.innerHTML = "";

  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    inProgressContainer.innerHTML += renderCardHTML(element, i);
  }
}

function renderAwaitFeedback() {
  let awaitFeedback = todoCards.filter(
    (t) => t["category"] === "awaitFeedback"
  );
  let awaitFeedbackContainer = document.getElementById("awaitFeedback");

  if (!awaitFeedbackContainer) {
    console.error("Element mit ID 'awaitFeedback' wurde nicht gefunden.");
    return;
  }

  awaitFeedbackContainer.innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    awaitFeedbackContainer.innerHTML += renderCardHTML(element, i);
  }
}

function renderDone() {
  let done = todoCards.filter((t) => t["category"] === "done");
  let doneContainer = document.getElementById("done");

  if (!doneContainer) {
    console.error("Element mit ID 'done' wurde nicht gefunden.");
    return;
  }

  doneContainer.innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    doneContainer.innerHTML += renderCardHTML(element, i);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function renderCardHTML(task, i) {
  return `
    <div draggable="true" ondragstart="startDragging(${task.id})" id="smallCard${i}" class="renderCardHTML" onclick="showdetailedInformation(${task.id})">
      <div class="category">
        <h4>${task.category}</h4>
      </div>
      <div class="title">
        <h3>${task.title}</h3>
      </div>
      <div class="description">
        <p>${task.description}</p>
      </div>
      <div>Progress Bar</div>
      <div class="information">
        <div class="users" id="users">${task.assigned}</div>
        <div class="priority" id="priority">
            <img src="" alt="">
        </div>
      </div>
    </div> 
  `;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(ev, category) {
  ev.preventDefault();
  let taskIndex = todoCards.findIndex((t) => t.id == currentDraggedElement);
  if (taskIndex >= 0) {
    todoCards[taskIndex]["category"] = category;
    updateHTML();
    save(); // Speichern der Änderung nach dem Verschieben
  }
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function showdetailedInformation(id) {
  let element = todoCards.find((t) => t.id === id);
  if (element) {
    document.getElementById("detailed-information").style.display = "flex";
    let content = document.getElementById("detailed-information");
    content.innerHTML = detailedInformationHTML(element);
  } else {
    console.error(`Element with id ${id} not found.`);
  }
}

function closeCard() {
  document.getElementById("detailed-information").style.display = "none";
}

function detailedInformationHTML(element, id) {
  return `
    <div id="bigCard${element.id}" class="">
      <div class="">
        <p>category</p>
        <h2>${element.category}</h2>
        <div onclick="closeCard()">
            <img
            class=""
            onclick="closeCard()"
            src="assets/img/close.svg"
            alt="schließen"
            />
        </div>
      </div>
      <h1>${element.title}</h1>
      <div><p>${element.description || "No description available"}</p></div>
      <div class="Create-date">
        <div>
          <span>Create date ${element.createDate || "Unknown"}</span>
        </div>
      </div>
      <div class="">
        <div><span>Priority:</span></div>
        <div> <img src="assets/img/medium-image-gelbe.svg" ></div>
      </div>
      <div class="">
        <div><span>Assigned to:</span></div>
        <div class="">
            <div>
                <img src="assets/img/perm_contact_calendar.svg" alt="">
                <span>${element.assigned || "Unassigned"}</span>
            </div>
        </div>
        <div class="">
            <div><span>Subtasks</span></div>
            <div><span>${element.subtasks || "No subtasks"}</span></div>
        </div>
        <div class="">
            <div class="">
                <img src="assets/img/delete.svg" alt="">
                <span>Delete</span>
            </div>
            <div class=""></div>
            <div class="">
                <img src="assets/img/edit.svg" alt="">
                <span>Edit</span>
            </div>
      </div>
    </div>
  `;
}

async function fetchTasksAndDisplay() {
  try {
    let tasksData = await fetchTasks();
    tasks = tasksData;

    console.log("Fetched tasks:", tasksData); // Debugging-Ausgabe

    todoCards = Object.keys(tasksData).map((taskId) => {
      let task = tasksData[taskId];
      return {
        id: taskId,
        title: task.inputTitle,
        category: task.category,
        description: task.description,
        assigned: task.assigned || "Unassigned",
      };
    });

    console.log("Updated todoCards:", todoCards); // Debugging-Ausgabe

    save();
    updateHTML();
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
  console.error("Fehler beim Laden der Aufgaben:", error);
  document.getElementById("todo").innerText = "Fehler beim Laden der Aufgaben.";
}

function displayTasks(tasksData) {
  try {
    updateHTML(tasksData);
  } catch (error) {
    handleDisplayError(error);
  }
}

function handleDisplayError(error) {
  console.error("Fehler beim Anzeigen der Aufgaben:", error);
}

// jQuery Click-Ereignisbehandlung für das Hinzufügen eines Alerts
$(".add-alert-form").click(function () {
  $(".panel-pop")
    .animate(
      {
        top: "-100%",
      },
      10
    )
    .hide();
  $(".alert").show().animate(
    {
      top: "10%",
    },
    500
  );
  $("body").prepend("<div class='wrap-pop'></div>");
  wrap_pop();
  return false;
});

// jQuery Click-Ereignisbehandlung für das Schließen des Alerts
$(document).on("click", ".close-alert", function () {
  $(".alert")
    .animate(
      {
        top: "-100%",
      },
      500
    )
    .hide();
  $(".wrap-pop").remove();
});

// Beispiel-Definition der Funktion wrap_pop
function wrap_pop() {
  console.log("wrap_pop wurde aufgerufen");
  // Hier könnte zusätzlicher Code eingefügt werden, um das Popup zu handhaben
}

async function initBoard() {
  includeHTML();
  loadTodoCards();
  updateHTML();
  await fetchTasksAndDisplay();
}

let contacts = [];
let tasks = [];

let todoCards = [
  { id: 0, title: "Aufgabenliste", category: "todo" },
  { id: 1, title: "Im Gange", category: "inProgress" },
  { id: 2, title: "Wartet auf Feedback", category: "awaitFeedback" },
  { id: 3, title: "Fertig", category: "done" },
];

let currentDraggedElement;

function loadTodoCards() {
  let savedTodoCards = localStorage.getItem("todoCards");
  if (savedTodoCards) {
    todoCards = JSON.parse(savedTodoCards);
  }
}

function save() {
  let todoCardsString = JSON.stringify(todoCards);
  localStorage.setItem("todoCards", todoCardsString);
}

function updateHTML() {
  renderTodo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

function renderTodo() {
  let todo = todoCards.filter((t) => t["category"] == "todo");
  document.getElementById("todo").innerHTML = "";

  for (let i = 0; i < todo.length; i++) {
    const element = todo[i];
    document.getElementById("todo").innerHTML += renderCardHTML(element, i);
  }
}

function renderInProgress() {
  let inProgress = todoCards.filter((t) => t["category"] == "inProgress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    document.getElementById("inProgress").innerHTML += renderCardHTML(element, i);
  }
}

function renderAwaitFeedback() {
  let awaitFeedback = todoCards.filter((t) => t["category"] == "awaitFeedback");
  document.getElementById("awaitFeedback").innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    document.getElementById("awaitFeedback").innerHTML += renderCardHTML(element, i);
  }
}

function renderDone() {
  let done = todoCards.filter((t) => t["category"] == "done");
  document.getElementById("done").innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    document.getElementById("done").innerHTML += renderCardHTML(element, i);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function renderCardHTML(task, i) {
  return /*html*/ `
    <div draggable="true" ondragstart="startDragging(${task.id})" id="smallCard${i}" class="renderCardHTML" onclick="showdetailedInformation(${task.id})">
      <div class="category">
        <h2>${task.category}</h2>
        <img src="" alt="">
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
  todoCards[currentDraggedElement]["category"] = category;
  updateHTML();
  save(); // Speichern der Änderung nach dem Verschieben
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

function detailedInformationHTML(element) {
  return /*html*/ `
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
      <div><p>${element.description || 'No description available'}</p></div>
      <div class="Create-date">
        <div>
          <span>Create date ${element.createDate || 'Unknown'}</span>
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
                <span>${element.assigned || 'Unassigned'}</span>
            </div>
        </div>
        <div class="">
            <div><span>Subtasks</span></div>
            <div><span>${element.subtasks || 'No subtasks'}</span></div>
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
    tasks = tasksData; // Update the global tasks variable
    displayTasks(tasksData);
  } catch (error) {
    handleFetchError(error);
  }
}

async function fetchTasks() {
  let response = await fetch(`${BASE_URL}tasks.json`);
  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen der Aufgaben. Status: ${response.status}`);
  }
  return await response.json();
}

function handleFetchError(error) {
  console.error("Fehler beim Laden der Aufgaben:", error);
  document.getElementById("task-list").innerText = "Fehler beim Laden der Aufgaben.";
}

function displayTasks(tasksData) {
  try {
    let taskListDiv = getTaskListDiv();
    let tasksHtml = generateTasksHtml(tasksData);
    taskListDiv.innerHTML = tasksHtml;
    // Call the updateHTML function to re-render the board
    updateHTML();
  } catch (error) {
    handleDisplayError(error);
  }
  console.log(tasksData);
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
  Object.keys(tasksData).forEach(taskId => {
    tasksHtml += generateTaskHtml(tasksData[taskId]);
  });
  tasksHtml += "</ul>";
  return tasksHtml;
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




        // jQuery Click-Ereignisbehandlung für das Hinzufügen eines Alerts
        $(".add-alert-form").click(function () {
          $(".panel-pop").animate({
              "top": "-100%"
          }, 10).hide();
          $(".alert").show().animate({
              "top": "10%"
          }, 500);
          $("body").prepend("<div class='wrap-pop'></div>");
          wrap_pop();
          return false;
      });

      // jQuery Click-Ereignisbehandlung für das Schließen des Alerts
      $(document).on('click', '.close-alert', function() {
          $(".alert").animate({
              "top": "-100%"
          }, 500).hide();
          $(".wrap-pop").remove();
      });

      // Beispiel-Definition der Funktion wrap_pop
      function wrap_pop() {
          console.log("wrap_pop wurde aufgerufen");
          // Hier könnte zusätzlicher Code eingefügt werden, um das Popup zu handhaben
      }




































/*

async function initBoard() {
  includeHTML();
  loadTodoCards();
  updateHTML();

  await fetchTasksAndDisplay();
}

let contacts = [];
let tasks = [];

let todoCards = [
  { id: 0, title: "Aufgabenliste", category: "todo" },
  { id: 1, title: "Im Gange", category: "inProgress" },
  { id: 2, title: "Wartet auf Feedback", category: "awaitFeedback" },
  { id: 3, title: "Fertig", category: "done" },
];

let currentDraggedElement;

function loadTodoCards() {
  let savedTodoCards = localStorage.getItem("todoCards");
  if (savedTodoCards) {
    todoCards = JSON.parse(savedTodoCards);
  }
}

function save() {
  let todoCardsString = JSON.stringify(todoCards);
  localStorage.setItem("todoCards", todoCardsString);
}

function updateHTML() {
  renderTodo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

function renderTodo() {
  let todo = todoCards.filter((t) => t["category"] == "todo");
  document.getElementById("todo").innerHTML = "";

  for (let i = 0; i < todo.length; i++) {
    const element = todo[i];
    document.getElementById("todo").innerHTML += renderCardHTML(element, i);
  }
}

function renderInProgress() {
  let inProgress = todoCards.filter((t) => t["category"] == "inProgress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    document.getElementById("inProgress").innerHTML += renderCardHTML(
      element,
      i
    );
  }
}

function renderAwaitFeedback() {
  let awaitFeedback = todoCards.filter((t) => t["category"] == "awaitFeedback");
  document.getElementById("awaitFeedback").innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    document.getElementById("awaitFeedback").innerHTML += renderCardHTML(
      element,
      i
    );
  }
}

function renderDone() {
  let done = todoCards.filter((t) => t["category"] == "done");
  document.getElementById("done").innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    document.getElementById("done").innerHTML += renderCardHTML(element, i);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}




/*
function renderCardHTML(element, i) {
  return /*html `
    <div draggable="true" ondragstart="startDragging(${element["id"]})" id="smallCard${i}" class="renderCardHTML" onclick="showdetailedInformation(${element["id"]})">
      <div class="category">
        <h2>${element["category"]}</h2>
        <img src="" alt="">
      </div>
      <div class="title">
        <h3>${element["title"]}</h3>
      </div>
      <div class="description">
        <p>description</p>
      </div>
      <div>Progress Bar</div>
      <div class="information">
        <div class="users" id="users">User1</div>
        <div class="priority" id="priority">
            <img src="" alt="">
        </div>
      </div>
    </div> 
  `;
}
*/
/*
function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(ev, category) {
  todoCards[currentDraggedElement]["category"] = category;
  updateHTML();
  save(); // Speichern der Änderung nach dem Verschieben
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

function detailedInformationHTML(element) {
  return /*html `
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
      <h1>Title</h1>
      <div><p>Description</p></div>
      <div class="Create-date">
        <div>
          <span>Create date 19.05.2023</span>
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
                <span>Name1</span>
            </div>
            <div>
                <img src="assets/img/perm_contact_calendar.svg" alt="">
                <span>Name2</span></div>
            <div>
                <img src="assets/img/perm_contact_calendar.svg" alt="">
                <span>Name3</span>
            </div>
        </div>
        <div class="">
            <div><span>Subtasks</span></div>
            <div><span>Implement Recipe Recommendation</span></div>
            <div><span>Start Page Layout</span></div>
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
    displayTasks(tasksData);
  } catch (error) {
    handleFetchError(error);
  }
}

async function fetchTasks() {
  let response = await fetch(`${BASE_URL}tasks.json`);
  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen der Aufgaben. Status: ${response.status}`);
  }
  return await response.json();
}

function handleFetchError(error) {
  console.error("Fehler beim Laden der Aufgaben:", error);
  document.getElementById("task-list").innerText = "Fehler beim Laden der Aufgaben.";
}

function displayTasks(tasksData) {
  try {
    let taskListDiv = getTaskListDiv();
    let tasksHtml = generateTasksHtml(tasksData);
    taskListDiv.innerHTML = tasksHtml;
  } catch (error) {
    handleDisplayError(error);
  }
  console.log(tasksData)
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
  Object.keys(tasksData).forEach(taskId => {
    tasksHtml += generateTaskHtml(tasksData[taskId]);
  });
  tasksHtml += "</ul>";
  return tasksHtml;
}

function generateTaskHtml(task) {
  return `
    <button>${task.inputTitle}</button>
    <button>${task.assigned}</button>
    <button>${task.description}</button>
    <button>${task.category}</button>`;
}

function handleDisplayError(error) {
  console.error("Fehler beim Anzeigen der Aufgaben:", error);
}

























// Füge den Event-Listener für das Klicken auf den leeren Bereich hinzu
document.addEventListener('click', function(event) {
  // Überprüfe, ob das geklickte Element außerhalb der Karten ist
  if (!event.target.closest('.smallcard')) {
      removeHighlightFromAll();
  }
});

// Funktion zum Entfernen der Hervorhebung von allen Elementen
function removeHighlightFromAll() {
  let smallCards = document.querySelectorAll('.smallcard');
  smallCards.forEach(card => {
      card.classList.remove('highlight');
  });
}
  */
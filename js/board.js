async function initBoard() {
  init();
  await includeHTML();
  loadTodoCards();
  updateHTML();
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

function renderCardHTML(element, i) {
  return /*html*/ `
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

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(ev, category) {
  todoCards[currentDraggedElement]["category"] = category;
  updateHTML();
  save();  // Speichern der Änderung nach dem Verschieben
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function showdetailedInformation(id) {
  let element = todoCards.find(t => t.id === id);
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
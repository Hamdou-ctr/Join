async function initBoard() {
  init();
  await includeHTML();
  //loadAllTasks();
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
    document.getElementById("todo").innerHTML += renderCardHTML(element);
  }
}

function renderInProgress() {
  let inProgress = todoCards.filter((t) => t["category"] == "inProgress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    document.getElementById("inProgress").innerHTML += renderCardHTML(element);
  }
}

function renderAwaitFeedback() {
  let awaitFeedback = todoCards.filter((t) => t["category"] == "awaitFeedback");
  document.getElementById("awaitFeedback").innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    document.getElementById("awaitFeedback").innerHTML +=
      renderCardHTML(element);
  }
}

function renderDone() {
  let done = todoCards.filter((t) => t["category"] == "done");
  document.getElementById("done").innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    document.getElementById("done").innerHTML += renderCardHTML(element);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function renderCardHTML(element, i) {
  return /*html*/ `
    <div draggable="true" ondragstart="startDragging(${element["id"]})" id="smallCard${i}" class="renderCardHTML" onclick="showdetailedInformation(${i})">
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
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function showdetailedInformation(i) {
  document.getElementById("detailed-information").style.display = "flex";
  content = document.getElementById("detailed-information");
  content.innerHTML = detailedInformationHTML(i);
}

function closeCard() {
  document.getElementById("detailed-information").style.display = "none";
}

function detailedInformationHTML(i) {
  const element = todoCards[i];
  return /*html*/ `
    <div id="bigCard${i}" class="">
      <div class="">
        <p>category</p>
        <h2>${element["category"]}</h2>
        <div onclick="closCard()">
            <img
            class=""
            onclick="closeCard()"
            src=""
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
        <div> <img src="assets/img/Property 1=Medium.svg" ></div>
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
                <img src="" alt="">
                <span>Delete</span>
            </div>
            <div class=""></div>
            <div class="">
                <img src="" alt="">
                <span>Edit</span>
            </div>
      </div>
    </div>
  `;
}
let allTasks = [];

function loadAllTasks() {
  let allTasksAsString = localStorage.getItem("allTasks");
  allTasks = JSON.parse(allTasksAsString);

  console.log("loaded all Tasks", allTasks);

  content();
}

function addTask() {
  let description = document.getElementById("description").value;
  let category = document.getElementById("category").value;

  let task = {
    description: description,
    category: category,
    createdAt: new Date().getTime(),
  };

  allTasks.push(task);

  let allTasksAsString = JSON.stringify(allTasks);
  localStorage.setItem("allTasks", allTasksAsString);

  console.log("allTask Datein im Browser", allTasks);
  console.log("Task", task);

  console.log("description", description);
  console.log(" category", category);
}

function content() {
  let content = document.getElementById("content");
  content.innerHTML = "";

  for (let i = 0; i < allTasks.length; i++) {
    content.innerHTML += contentHtml(allTasks[i]);
  }
  console.log(content);
}

function contentHtml(allTasks) {
  return /* html */ `
  <div class="overley">
    <h1>${allTasks.description}</h1>
    <h2>${allTasks.category}</h2>
    <h2>${createdAtHtml(allTasks)}</h2>
  </div>
`;
}

function createdAtHtml(allTasks) {
  let createdAt = new Date(allTasks.createdAt);
  let day = createdAt.getDate();
  let month = createdAt.getMonth() + 1; // Monate starten bei 0 (Januar ist 0)
  let year = createdAt.getFullYear();

  let uhr = createdAt.getHours();
  let minutes = createdAt.getMinutes();
  let seconde = createdAt.getSeconds(); 

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconde = seconde <10 ? '0' + seconde : seconde
  return /* html */ `
    <div>
      <h2>${day} . ${month} . ${year}</h2>
      <p>${uhr} : ${minutes} : ${seconde}</p>
    </div>
  `;
}
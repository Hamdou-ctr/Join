let tasks = [
  { id: 1, category: "todo", title: "Task 1" },
  { id: 2, category: "progress", title: "Task 2" },
  { id: 3, category: "awaitingFeedback", title: "Task 3" },
  { id: 4, category: "done", title: "Task 4" }
];

let currentDraggedElement;

function updateHTML() {
  let containerIds = {
    "todo": "todo",
    "progress": "progress",
    "awaitingFeedback": "awaiting-feedback",
    "done": "done"
  };

  for (let key in containerIds) {
    document.getElementById(containerIds[key]).innerHTML = '';
  }

  for (let task of tasks) {
    let containerId = containerIds[task.category];
    if (containerId) {
      document.getElementById(containerId).innerHTML += generateTodoHTML(task);
    }
  }
}

function generateTodoHTML(task) {
  return `
    <div draggable="true" ondragstart="startDragging(${task.id})" class="todo">
      ${task.title}
      <img id="hoverDiv" class="check" src="assets/img/pencil rectangle button v1 (1).svg" alt="">
     
      </div>
  `;
}

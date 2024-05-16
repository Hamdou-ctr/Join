async function init() {
  await includeHTML();
  hover();

  updateHTML();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function hover() {
  const hoverDiv = document.getElementById("hoverDiv");

  hoverDiv.addEventListener("mouseover", function () {
    hoverDiv.classList.add("hovered");
  });

  hoverDiv.addEventListener("mouseout", function () {
    hoverDiv.classList.remove("hovered");
  });
}

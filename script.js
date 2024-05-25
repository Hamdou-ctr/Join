async function init() {
  await includeHTML();
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

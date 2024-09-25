const addTodoBtn = document.querySelector("#new-todo-btn");
const newTodoInput = document.querySelector("#new-todo");
const todoList = document.querySelector("#list");

let todos = [];

// Todos vom Server laden
function loadTodos() {
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      todos = todosFromApi;
      console.log("Loaded todos:", todos); // Konsolen-Log zur Überprüfung
      renderTodos();
    });
}

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const newLi = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;

    // Eventlistener für Checkbox (Fertig/Unfertig)
    checkbox.addEventListener("change", () => {
      fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: checkbox.checked }),
      })
        .then((res) => res.json())
        .then((updatedTodo) => {
          todo.done = updatedTodo.done;
          console.log("Updated todo:", updatedTodo); // Konsolen-Log
          renderTodos();
        });
    });

    const text = document.createTextNode(todo.description);
    newLi.appendChild(checkbox);
    newLi.appendChild(text);
    todoList.appendChild(newLi);
  });
  console.log("Rendered todos:", todos); // Konsolen-Log
}

// Neues Todo hinzufügen
addTodoBtn.addEventListener("click", () => {
  const newTodoText = newTodoInput.value.trim();

  // Verhindere leere Eingaben
  if (!newTodoText) {
    alert("Todo cannot be empty!");
    return;
  }

  // Duplikat-Prüfung
  const isDuplicate = todos.some(
    (todo) =>
      todo.description && // Sicherstellen, dass description existiert
      todo.description.toLowerCase() === newTodoText.toLowerCase()
  );

  if (isDuplicate) {
    alert("Todo already exists!");
    return;
  }

  const newTodo = {
    description: newTodoText, // Beschreibung des neuen Todos
    done: false,
  };

  // Todo an den Server senden
  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      todos.push(newTodoFromApi); // Füge das neue Todo zur Liste hinzu
      console.log("Todo added:", newTodoFromApi); // Konsolen-Log
      renderTodos(); // Aktualisiere die Ansicht
      newTodoInput.value = ""; // Leere das Eingabefeld nach dem Hinzufügen
    });
});

// Löschen der erledigten Todos
const deleteDoneBtn = document.createElement("button");
deleteDoneBtn.textContent = "Delete Done Todos";
document.body.appendChild(deleteDoneBtn);

deleteDoneBtn.addEventListener("click", () => {
  const completedTodos = todos.filter((todo) => todo.done);

  // Lösche alle erledigten Todos
  Promise.all(
    completedTodos.map((todo) =>
      fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: "DELETE",
      })
    )
  ).then(() => {
    // Nach dem Löschen die Liste aktualisieren
    todos = todos.filter((todo) => !todo.done);
    console.log("Completed todos deleted"); // Konsolen-Log
    renderTodos();
  });
});

// Todos laden
loadTodos();

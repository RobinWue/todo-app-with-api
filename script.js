const addTodoBtn = document.querySelector("#new-todo-btn");
const newTodoInput = document.querySelector("#new-todo");
const todoList = document.querySelector("#list");

let todos = [];

function loadTodos() {
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      console.log(todosFromApi);
      todos = todosFromApi;
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

    // Eventlistener für checkbox
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
          renderTodos();
        });
    });

    const text = document.createTextNode(todo.description);
    newLi.appendChild(checkbox);
    newLi.appendChild(text);
    todoList.appendChild(newLi);
  });
}

addTodoBtn.addEventListener("click", () => {
  const newTodoText = newTodoInput.value;
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      todos.push(newTodoFromApi);
      renderTodos();
    });
});

// Löschen der todos die fertig sind
const deleteDoneBtn = document.createElement("button");
deleteDoneBtn.textContent = "Delete Done Todos";
document.body.appendChild(deleteDoneBtn);

deleteDoneBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/todos/completed", {
    method: "DELETE",
  }).then(() => {
    todos = todos.filter((todo) => !todo.done);
    renderTodos();
  });
});

loadTodos();

// Массив для хранения задач
let tasks = [];

// Загрузка задач из localStorage при открытии страницы
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }
}

// Сохранение задач в localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Создание одного элемента задачи в списке
function createTaskElement(task, index) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;
  if (task.done) {
    span.classList.add("done");
  }

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "task-buttons";

  const doneButton = document.createElement("button");
  doneButton.textContent = task.done ? "Не готово" : "Готово";
  doneButton.className = "done-button";
  doneButton.addEventListener("click", function () {
    toggleTaskDone(index);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Удалить";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", function () {
    deleteTask(index);
  });

  buttonsDiv.appendChild(doneButton);
  buttonsDiv.appendChild(deleteButton);

  li.appendChild(span);
  li.appendChild(buttonsDiv);

  return li;
}

// Перерисовка всего списка задач
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const li = createTaskElement(task, i);
    list.appendChild(li);
  }
}

// Добавление новой задачи
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text === "") {
    return; // не добавляем пустую задачу
  }

  const newTask = {
    text: text,
    done: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  input.value = "";
}

// Удаление задачи по индексу
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Переключение статуса задачи (выполнена / не выполнена)
function toggleTaskDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

// Настройка обработчиков событий после загрузки страницы
window.addEventListener("load", function () {
  loadTasks();
  renderTasks();

  const addButton = document.getElementById("addTaskButton");
  addButton.addEventListener("click", addTask);

  const input = document.getElementById("taskInput");
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
});


# Мини-приложение «Список задач»

Это простое веб-приложение (HTML + CSS + JavaScript), где можно:
- добавить задачу;
- отметить задачу выполненной / вернуть обратно;
- удалить задачу;
- сохранить список задач после перезагрузки страницы (через `localStorage`).

Главный упор сделан на **простую JavaScript-логику**: работа с DOM, события, массив задач, функции добавления/удаления/обновления и сохранение в `localStorage`.

---

## Как запустить

1. Откройте файл `index.html` в браузере.
2. Введите текст задачи и нажмите **«Добавить»** (или Enter).
3. Кнопка **«Готово / Не готово»** меняет статус выполнения.
4. Кнопка **«Удалить»** удаляет задачу.
5. Обновите страницу — задачи останутся, потому что они сохраняются в `localStorage`.

---

## Структура проекта

- `index.html` — разметка страницы (инпут, кнопка, список).
- `style.css` — минималистичный стиль.
- `script.js` — вся логика (массив задач, функции, события, `localStorage`).
- `wiki/` — папка под git wiki (по требованию).

---

## Как устроены данные (модель задач)

В приложении есть переменная:

- `tasks` — это **массив задач**.

Каждая задача — это **объект** такого вида:

```js
{
  text: "Купить хлеб",
  done: false
}
```

- `text` — текст задачи (строка).
- `done` — выполнена ли задача (`true` или `false`).

Почему так удобно:
- можно хранить не только текст, но и статус выполнения;
- легко сохранять и восстанавливать массив целиком через JSON.

---

## Подробно про `index.html`

Файл: `index.html`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Список задач</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Список задач</h1>

    <div class="add-task">
      <input id="taskInput" type="text" placeholder="Новая задача">
      <button id="addTaskButton">Добавить</button>
    </div>

    <ul id="taskList"></ul>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

Разбор по частям:

- `<!DOCTYPE html>`  
  Говорит браузеру, что документ — HTML5.

- `<html lang="ru">`  
  Устанавливает язык страницы (русский).

- `<meta charset="UTF-8">`  
  Нужен, чтобы русский текст отображался корректно.

- `<title>Список задач</title>`  
  Заголовок вкладки браузера.

- `<link rel="stylesheet" href="style.css">`  
  Подключает файл стилей `style.css`.

### Основные элементы интерфейса

- `<div class="container">`  
  Главный контейнер, чтобы ограничить ширину и красиво расположить всё по центру.

- `<input id="taskInput" ...>`  
  Поле ввода. Важно:
  - `id="taskInput"` — по этому `id` JavaScript легко находит инпут (`document.getElementById("taskInput")`).
  - `placeholder="Новая задача"` — подсказка внутри поля.

- `<button id="addTaskButton">Добавить</button>`  
  Кнопка добавления задачи. Важно:
  - `id="addTaskButton"` — JavaScript навесит обработчик клика.

- `<ul id="taskList"></ul>`  
  Сюда JavaScript будет добавлять элементы списка (`<li>`) для каждой задачи.

### Подключение JavaScript

- `<script src="script.js"></script>`  
  Подключает файл `script.js`. Он стоит в конце `body`, чтобы:
  - HTML уже был создан к моменту запуска JavaScript;
  - элементы можно было сразу найти через `getElementById`.

---

## Подробно про `script.js` (вся логика)

Файл: `script.js`

Ниже — подробный разбор кода и логики.

### 1) Массив задач

```js
let tasks = [];
```

- `tasks` хранит все задачи.
- `let`, потому что массив будет изменяться (мы загружаем его из `localStorage`, добавляем и удаляем элементы).

---

### 2) `loadTasks()` — загрузка задач из localStorage

```js
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }
}
```

Что делает:
- берёт значение по ключу `"tasks"` из `localStorage`;
- если оно существует — превращает JSON-строку обратно в массив и кладёт в `tasks`;
- если нет — делает `tasks` пустым массивом.

Зачем `JSON.parse`:
- в `localStorage` всё хранится строками;
- мы сохраняем массив как JSON, поэтому при чтении его надо “распаковать”.

---

### 3) `saveTasks()` — сохранение задач в localStorage

```js
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
```

Что делает:
- превращает массив `tasks` в JSON-строку (`JSON.stringify`);
- записывает эту строку в `localStorage` по ключу `"tasks"`.

Когда вызывается:
- после добавления задачи;
- после удаления задачи;
- после изменения статуса задачи.

То есть после любого изменения массива `tasks`.

---

### 4) `createTaskElement(task, index)` — создание DOM-элемента одной задачи

```js
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
```

Задача функции: **собрать один `<li>`** (одну строку списка) по данным задачи.

#### Входные параметры

- `task` — объект задачи (например `{ text: "Учить JS", done: false }`).
- `index` — позиция задачи в массиве `tasks`.  
  Она нужна, чтобы понимать, с какой задачей работать при клике на кнопки.

#### Что создаётся внутри

- `li` — `<li class="task-item">`  
  контейнер для одной задачи.

- `span` — `<span class="task-text">`  
  отображает текст задачи.

#### Как показываем “выполнено”

```js
if (task.done) {
  span.classList.add("done");
}
```

- если `done === true`, добавляем CSS-класс `done`;
- CSS делает зачёркнутый текст.

#### Кнопка “Готово / Не готово”

```js
doneButton.textContent = task.done ? "Не готово" : "Готово";
doneButton.addEventListener("click", function () {
  toggleTaskDone(index);
});
```

- если задача уже выполнена — показываем “Не готово”, чтобы можно было вернуть обратно;
- при клике вызываем `toggleTaskDone(index)` (меняет `done` на противоположное).

#### Кнопка “Удалить”

```js
deleteButton.addEventListener("click", function () {
  deleteTask(index);
});
```

- при клике вызывается `deleteTask(index)`;
- задача удаляется из массива.

#### Возврат результата

Функция возвращает готовый элемент `li`, который потом вставляется в `<ul id="taskList">`.

---

### 5) `renderTasks()` — отрисовка всего списка

```js
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const li = createTaskElement(task, i);
    list.appendChild(li);
  }
}
```

Главная идея: **DOM — это “картинка”, а `tasks` — это “данные”**.  
Мы всегда строим картинку заново из актуальных данных.

Что делает функция:

1. Находит `ul` со списком задач:
   - `document.getElementById("taskList")`

2. Очищает список:
   - `list.innerHTML = ""`

3. Проходит циклом по массиву `tasks`:
   - создаёт `li` для каждой задачи (`createTaskElement(task, i)`);
   - добавляет `li` в `ul` (`appendChild`).

Почему это просто и понятно:
- после любого изменения массива мы просто вызываем `renderTasks()` и получаем правильное отображение;
- не нужно отдельно “чинить” HTML после каждого действия — мы его пересобираем.

---

### 6) `addTask()` — добавление новой задачи

```js
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
```

Разбор по шагам:

1. Находим поле ввода:
   - `const input = document.getElementById("taskInput");`

2. Берём введённый текст и убираем пробелы по краям:
   - `const text = input.value.trim();`
   - `trim()` нужен, чтобы строка из пробелов считалась пустой.

3. Проверка на пустую строку:
   - если `text === ""`, выходим из функции через `return`.
   - это выполняет требование: “если поле пустое — задача не добавляется”.

4. Создаём объект новой задачи:
   - `text` — введённый текст,
   - `done: false` — новая задача всегда не выполнена.

5. Добавляем задачу в массив:
   - `tasks.push(newTask);`

6. Сохраняем и перерисовываем:
   - `saveTasks();` — чтобы задача не пропала после перезагрузки;
   - `renderTasks();` — чтобы задача появилась на странице.

7. Очищаем инпут:
   - `input.value = "";`

---

### 7) `deleteTask(index)` — удаление задачи

```js
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}
```

Что происходит:
- `tasks.splice(index, 1)` удаляет **1 элемент** массива, начиная с позиции `index`.
- затем сохраняем и перерисовываем, чтобы:
  - изменения попали в `localStorage`;
  - список на странице обновился.

---

### 8) `toggleTaskDone(index)` — изменить статус выполнено/не выполнено

```js
function toggleTaskDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}
```

Что происходит:
- берём задачу `tasks[index]`;
- меняем `done` на противоположное:
  - если было `false`, станет `true`;
  - если было `true`, станет `false`.
- затем сохраняем и перерисовываем.

Почему используется `!`:
- это самый простой способ переключать “да/нет”.

---

### 9) События (обработчики) — что запускает функции

```js
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
```

Этот блок выполняется, когда страница полностью загрузилась.

#### Почему событие `load`

- `window.addEventListener("load", ...)` гарантирует, что DOM уже готов.
- значит, `getElementById("...")` точно найдёт элементы.

#### Что происходит при загрузке

1) Загружаем задачи из `localStorage`:
- `loadTasks();`

2) Рисуем список на странице:
- `renderTasks();`

Таким образом, если раньше уже были сохранённые задачи — они появятся сразу.

#### Кнопка «Добавить»

```js
addButton.addEventListener("click", addTask);
```

- при клике запускается `addTask()`.

#### Enter в поле ввода

```js
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
```

- мы слушаем нажатия клавиш (`keydown`);
- если нажали Enter — добавляем задачу, как будто нажали кнопку.

---

## Общая логика проекта (коротко, но понятно)

1. При старте страницы:
   - `loadTasks()` читает сохранённый массив из `localStorage` в `tasks`;
   - `renderTasks()` рисует список задач из `tasks`.

2. Когда пользователь добавляет задачу:
   - `addTask()` проверяет ввод, добавляет объект в `tasks`;
   - `saveTasks()` сохраняет массив;
   - `renderTasks()` обновляет список.

3. Когда пользователь отмечает задачу выполненной:
   - `toggleTaskDone(index)` меняет `done`;
   - `saveTasks()` + `renderTasks()`.

4. Когда пользователь удаляет задачу:
   - `deleteTask(index)` удаляет элемент массива;
   - `saveTasks()` + `renderTasks()`.

Ключевая идея: **всё хранится в `tasks`, а страница — это отображение этого массива**.


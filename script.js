// run when html downloaded
document.addEventListener("DOMContentLoaded", () => {

  // varianles of html elements
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskList = document.getElementById("taskList");
  const filterButtons = document.querySelectorAll(".todo-filters button");

  const languageButtons = document.querySelectorAll(".language-selector button");

  // getting written tasks from local storage and parse them into objects array. if there local storage empty tasks will be also empty
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


  // creating object that contains dictionary
  const translations = {
    uk: {
      title: "ToDoApp",
      placeholder: "Введіть завдання...",
      addButton: "Додати",
      all: "Усі",
      active: "Активні",
      completed: "Виконані",
    },
    en: {
      title: "ToDoApp",
      placeholder: "Enter a task...",
      addButton: "Add",
      all: "All",
      active: "Active",
      completed: "Completed",
    },
  };

  // language

  // function to change the texts on the page according to the selected language
  function setLanguage(lang) {
    // find the elements to change the text
    const title = document.querySelector("h1");
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const filterButtons = document.querySelectorAll(".todo-filters button");

    // change the text according to the selected language
    title.textContent = translations[lang].title;
    taskInput.placeholder = translations[lang].placeholder;
    addTaskButton.textContent = translations[lang].addButton;

    filterButtons[0].textContent = translations[lang].all;
    filterButtons[1].textContent = translations[lang].active;
    filterButtons[2].textContent = translations[lang].completed;

    // save selected language in localStorage
    localStorage.setItem("language", lang);
  }

  // function to change the language
  function setLanguage(lang) {
    const title = document.querySelector("h1");
    const filterButtons = document.querySelectorAll(".todo-filters button");

    // updating text of the interface
    title.textContent = translations[lang].title;
    taskInput.placeholder = translations[lang].placeholder;
    addTaskButton.textContent = translations[lang].addButton;

    filterButtons[0].textContent = translations[lang].all;
    filterButtons[1].textContent = translations[lang].active;
    filterButtons[2].textContent = translations[lang].completed;

    // save selected language
    localStorage.setItem("language", lang);
  }

  // processing language change buttons
  languageButtons.forEach(button => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang; // get selected language
      setLanguage(lang); // change the interface language
    });
  });

  // loading the selected language at startup
  const savedLanguage = localStorage.getItem("language") || "uk";
  setLanguage(savedLanguage); // set the language


  //tasks

  // update html
  function renderTasks(filter = "all") {

    taskList.innerHTML = ""; // clear ol
    // filter and return task 'active', 'completed', 'all'
    const filteredTasks = tasks.filter(task => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true; // Для "all"
    });

    // html for each added task
    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <span style="text-decoration: ${task.completed ? "line-through" : "none"};">
            ${task.name}
          </span>
          <div>
            <button class="complete-btn" data-index="${index}">✓</button>
            <button class="delete-btn" data-index="${index}">✗</button>
          </div>
        `;
      taskList.appendChild(li);
    });

    // add listener for buttons and toggle task data filter
    document.querySelectorAll(".complete-btn").forEach(button => {
      button.addEventListener("click", () => toggleTask(button.dataset.index));
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", () => deleteTask(button.dataset.index));
    });
  }

  // saving data to local storage and update html
  function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); //saves a running list of tasks at the local storage JSON.stringify: recreate the array of a JSON string
    renderTasks(); //update tasks html
  }

  // add task func
  function addTask() {
    //getting task from input field 
    const taskName = taskInput.value.trim();
    if (taskName) {
      tasks.push({ name: taskName, completed: false }); //push tasks into array of tasks     
      taskInput.value = ""; //clear input field        
      saveAndRender();//update tasks array
    }
  }

  // delete task func
  function deleteTask(index) {
    tasks.splice(index, 1); //delete task from tasks array
    saveAndRender(); //update tasks array
  }

  // toggle task done or not
  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed; //change the "completed" stage to set the index
    saveAndRender(); //update tasks array
  }

  // filter tasks for done or not
  filterButtons.forEach(button => {
    //when clicked, renderTasks from the corresponding filter
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      renderTasks(filter); //update tasks html
    });
  });

  // adding EventListener to addTaskButton
  addTaskButton.addEventListener("click", addTask);

  // call func addTask by click 'enter'
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  // first render all tasks after downloading html
  renderTasks();
});

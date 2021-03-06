import { format } from 'date-fns';
import Project from './projects';
import Task from './task';
import Storage from './storage';

export default class UI {
  static loadHomepage() {
    UI.loadProjects();
    UI.initProjectButtons();
    UI.openProject('All', document.getElementById('button-all-projects'));
    document.addEventListener('keydown', UI.handleKeyboard);
  }

  static loadProjects() {
    let projectList = '';
    Storage.getTodoList()
      .getProjects()
      .forEach((project, index) => {
        if (
          project.name !== 'All'
          && project.name !== 'Today'
          && project.name !== 'This week'
        ) {
          projectList = projectList.concat(UI.loadProject(project.name, index));
          UI.createProject(projectList);
        }
      });
    UI.initAddProjectButton();
  }

  static loadTasks() {
    let taskList = '';
    // console.log('yo tasks: ', Storage.getTodoList().getProjects());
    Storage.getTodoList()
      .getProjects().forEach((task) => {
        taskList = taskList.concat(UI.loadTask(task.name, task.dueDate));
        UI.createTask(taskList);
      });
  }

  static loadProjectContent(projectName) {
    const projectPreview = document.getElementById('project-preview');
    projectPreview.innerHTML = `
      <h1 id="project-name">${projectName}</h1>
      <div id="tasks-list" class="tasks-list"></div>
    `;
    if (projectName !== 'Today' && projectName !== 'This week') {
      projectPreview.innerHTML = `
      <form action="" class="d-flex">
        <input
          id="input-add-task"
          type="text"
          class="form-control"
          placeholder="new task"
        />
        <button class="btn btn-primary button-add-task mx-2" id="button-add-task">
        <i class="fas fa-plus"></i>
        </button>
      </form>
      <div id="tasks-list" class="tasks-list mt-3"></div>
      `;
    }
    UI.loadTasks();
  }

  static loadProject(name, index) {
    const str = `<div class="d-flex justify-content-between button-project" data-project-button>
    <div class="left-project-panel">
    <i class="fas fa-tasks mr-2"></i>
    <span value=${index}>${name}</span>
    </div>
    <div class="right-project-panel mr-2">
    <i class="fas fa-times"></i>
    </div>
    </div>
    `;
    return str;
  }

  static createProject(projects) {
    const userProjects = document.getElementById('projects-list');
    userProjects.innerHTML = projects;
    UI.initProjectButtons();
  }

  static loadTask(name, dueDate) {
    const str = `
    <button class="button-task" data-task-button>
      <div class="left-task-panel">
        <i class="far fa-circle"></i>
        <p class="task-content">${name}</p>
        <input type="text" class="input-task-name"  data-input-task-name>
      </div>
      <div class="right-task-panel">
        <p class="due-date" id="due-date">${dueDate}</p>
        <input type="date" class="input-due-date"   data-input-due-date>
        <i class="fas fa-times"></i>
      </div>
    </button>
  `;
    return str;
  }

  static createTask(tasks) {
    const taskList = document.getElementById('tasks-list');
    taskList.innerHTML = tasks;
    UI.initTaskButton();
  }

  static clear() {
    UI.clearProjectPreview();
    UI.clearProjects();
    UI.clearTasks();
  }

  static clearProjectPreview() {
    const projectPreview = document.getElementById('project-preview');
    projectPreview.textContent = '';
  }

  static clearProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.textContent = '';
  }

  static clearTasks() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.textContent = '';
  }

  static initAddProjectButton() {
    const addProjectButton = document.getElementById('button-add-project');
    const addProjectInput = document.getElementById('input-add-project');

    addProjectInput.addEventListener('keypress', UI.handleAddProjectInput);
    addProjectButton.addEventListener('click', UI.createProject);
  }

  static addProject() {
    const addProjectInput = document.getElementById('input-add-project');
    const projectName = addProjectInput.value;

    Storage.addProject(new Project(projectName));
    UI.createProject(projectName);
  }

  static handleAddProjectInput(e) {
    e.preventDefault();
    if (e.key === 'Enter') UI.addProject();
  }

  static initProjectButtons() {
    const allProjectsButton = document.getElementById('button-all-projects');
    const todayProjectsButton = document.getElementById('button-today-projects');
    const weekProjectsButton = document.getElementById('button-week-projects');
    const projectButtons = document.querySelectorAll('[data-project-button]');

    allProjectsButton.addEventListener('click', UI.openAllTasks);
    todayProjectsButton.addEventListener('click', UI.openTodayTasks);
    weekProjectsButton.addEventListener('click', UI.openWeekTasks);
    projectButtons.forEach((projectButton) => projectButton.addEventListener('click', UI.handleProjectButton));
  }

  static openAllTasks() {
    UI.openProject('All', this);
  }

  static openTodayTasks() {
    Storage.updateTodayProject();
    UI.openProject('Today', this);
  }

  static openWeekTasks() {
    Storage.updateWeekProject();
    UI.openProject('This week', this);
  }

  static handleProjectButton(e) {
    e.preventDefault();
    const projectName = this.children[0].children[1].textContent;
    window.activeProject = this.children[0].children[1].getAttribute('value');
    if (e.target.classList.contains('fa-times')) {
      UI.deleteProject(projectName, this);
      return;
    }
    UI.openProject(projectName, this);
  }

  static openProject(projectName, projectButton) {
    const defaultProjectButtons = document.querySelectorAll('.button-default-project');
    const projectButtons = document.querySelectorAll('.button-project');
    const buttons = [...defaultProjectButtons, ...projectButtons];

    buttons.forEach((button) => button.classList.remove('active'));
    projectButton.classList.add('active');
    UI.loadProjectContent(projectName);
  }

  static deleteProject(projectName, button) {
    if (button.classList.contains('active')) UI.clearProjectPreview();
    Storage.deleteProject(projectName);
    UI.clearProjects();
    UI.loadProjects();
  }

  static initAddTaskButtons() {
    const addTaskButton = document.getElementById('button-add-task');
    const addTaskInput = document.getElementById('input-add-task');

    addTaskButton.addEventListener('click', UI.addTask());
    addTaskInput.addEventListener('keypress', UI.handleAddTaskInput);
  }

  static addTask(e) {
    e.preventDefault();
    const addTaskInput = document.getElementById('input-add-task');
    const taskName = addTaskInput.value;
    const todoList = Storage.getTodoList();
    todoList.projects[window.activeProject].tasks.push({ name: taskName, dueDate: '' });
    Storage.saveTodoList(todoList);

    Storage.addTask(window.activeProject, new Task(taskName));
    UI.createTask(taskName, 'No Date');
  }

  static handleAddTaskInput(e) {
    if (e.key === 'Enter') UI.addTask();
  }

  static initTaskButton() {
    const taskButtons = document.querySelectorAll('[data-task-button]');
    const taskNameInputs = document.querySelectorAll('[data-input-task-name]');
    const dueDateInputs = document.querySelectorAll('[data-input-due-date]');

    taskButtons.forEach((taskButton) => taskButton.addEventListener('click', UI.handleTaskButton));
    taskNameInputs.forEach((taskNameInput) => taskNameInput.addEventListener('keypress', UI.renameTask));
    dueDateInputs.forEach((dueDateInput) => dueDateInput.addEventListener('change', UI.setTaskDate));
  }

  static handleTaskButton(e) {
    e.preventDefault();
    window.activeProject = this.children[0].children[1].getAttribute('value');
    e.preventDefault();
    if (e.target.classList.contains('fa-circle')) {
      UI.setTaskCompleted(this);
      return;
    }

    if (e.target.classList.contains('fa-times')) {
      UI.deleteTask(this);
      return;
    }

    if (e.target.classList.contains('task-content')) {
      UI.openRenameInput(this);
      return;
    }

    if (e.target.classList.contains('due-date')) {
      UI.openSetDateInput(this);
    }
  }

  static setTaskCompleted(taskButton) {
    const projectName = document.getElementById('project-name').textContent;
    const taskName = taskButton.children[0].children[1].textContent;

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0];
      Storage.deleteTask(mainProjectName, taskName);
    }
    Storage.deleteTask(projectName, taskName);
    UI.clearTasks();
    UI.loadTasks();
  }

  static deleteTask(taskButton) {
    const projectName = document.getElementById('project-name').textContent;
    const taskName = taskButton.children[0].children[1].textContent;

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0];
      Storage.deleteTask(mainProjectName, taskName);
    }
    Storage.deleteTask(projectName, taskName);
    UI.clearTasks();
    UI.loadTasks();
  }

  static renameTask(e) {
    e.preventDefault();
    if (e.key !== 'Enter') return;
    const projectName = document.getElementById('project-name').textContent;
    const taskName = this.previousElementSibling.textContent;
    const newTaskName = this.value;

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0];
      const mainTaskName = taskName.split(' ')[0];
      Storage.renameTask(
        projectName,
        taskName,
        `${newTaskName} (${mainProjectName})`,
      );
      Storage.renameTask(mainProjectName, mainTaskName, newTaskName);
    } else {
      Storage.renameTask(projectName, taskName, newTaskName);
    }
    UI.clearTasks();
    UI.loadTasks();
  }

  static openSetDateInput(taskButton) {
    const dueDate = taskButton.children[1].children[0];
    const dueDateInput = taskButton.children[1].children[1];

    dueDate.classList.add('active');
    dueDateInput.classList.add('active');
  }

  static setTaskDate() {
    const taskButton = this.parentNode.parentNode;
    const projectName = document.getElementById('project-name');
    const taskName = taskButton.children[0].children[1];
    const newDueDate = format(new Date(this.value), 'dd/MM/yyyy');

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0];
      const mainTaskName = taskName.split(' (')[0];
      Storage.setTaskDate(projectName, taskName, newDueDate);
      Storage.setTaskDate(mainProjectName, mainTaskName, newDueDate);
      if (projectName === 'Today') {
        Storage.updateTodayProject();
      } else {
        Storage.updateWeekProject();
      }
    } else {
      Storage.setTaskDate(projectName, taskName, newDueDate);
    }
    UI.clearTasks();
    UI.loadTasks();
  }
}
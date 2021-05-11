import {
  toDate, isToday, isThisWeek, subDays,
} from 'date-fns';

export default class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  getTasks() {
    return this.tasks;
  }

  getTask(taskName) {
    return this.tasks.find((task) => task.getName() === taskName);
  }

  contains(taskName) {
    return this.tasks.some((task) => task.getName() === taskName);
  }

  addTask(task) {
    if (this.tasks.indexOf(task) > 0) return;
    this.tasks.push(task);
  }

  deleteTask(taskName) {
    const taskToDelete = this.tasks.find((task) => task.getName() === taskName);
    this.tasks.splice(this.tasks.indexOf(taskToDelete), 1);
  }

  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted());
      return isToday(toDate(taskDate));
    });
  }

  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted());
      return isThisWeek(subDays(toDate(taskDate), 1));
    });
  }
}

// const projectContainer = document.querySelector('[project-list]');

// const projects = ['name', 'todo'];

// function clearElement(element) {

// }

// function render() {
//   clearElement(projectContainer);
//   projects.forEach(project => {
//     const projectElement = document.createElement('li');
//     projectElement.classList.add('projects-list');
//     projectElement.innerText(project);
//     projectContainer.appendChild(projectElement);
//   });
// }

// render();
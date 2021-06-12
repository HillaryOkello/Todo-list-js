// import {
//   projects, setProject, addTodo, Storage,
// } from '../src/models/storage';
import Project from '../src/models/projects';
import Task from '../src/models/task';
import Storage from '../src/models/storage';
import TodoList from '../src/models/List';

test('Retrieve default project list', () => {
  expect(Storage.getTodoList().getProjects()).toEqual({ name: 'All', tasks: [] }, { name: 'Today', tasks: [] }, { name: 'This week', tasks: [] });
});

test('Add new project', () => {
  Storage.addProject('New Project');
  expect(Project).toEqual({ Default: [], 'New Project': [] });
});

test('Retrieve Project todos', () => {
  TodoList.setProject('New Project');
  const todo = new Task(
    'Title',
    'Description',
    1,
    '2021-02-18',
  );
  Storage.addTodo(todo);
  expect(Project['New Project']).toEqual([todo]);
});
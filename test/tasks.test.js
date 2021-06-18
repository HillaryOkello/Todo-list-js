import Task from '../src/models/task';

test('should return todo object with the given arguments including name and due date', () => {
  const todo = new Task('My Task', '19/06/2021');
  expect(todo.name).toBe('My Task');
  expect(todo.dueDate).toBe('19/06/2021');
});

test('should return an object with name undefined and no date for dueDate if it was not given any arguments', () => {
  const todo = new Task();
  expect(todo).toEqual({
    name: undefined,
    dueDate: 'No date',
  });
});
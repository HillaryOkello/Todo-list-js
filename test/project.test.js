import Project from '../src/models/projects';

test('Should return project object with the given arguments including title and task', () => {
  const project = new Project('My Project', []);
  expect(project.name).toBe('My Project');
  expect(project.tasks).toStrictEqual([]);
});

test('should return an object with undefined name property and empty task array if it was not given any arguments', () => {
  const project = new Project();
  expect(project).toEqual({
    name: undefined,
    tasks: [],
  });
});

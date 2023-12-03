import { generateUniqueId } from './utils.js';
import { validateByEmptyTask, validateByExistingTask } from './validate.js';
import data from './tasks-data.json' assert {type: "json"};

const appContainerNode = document.querySelector('.container');
const highPriorityFormNode = document.querySelector('.high-priority-form');
const highPriorityInputNode = document.querySelector('.input-adding-high-task');
const lowPriorityInputNode = document.querySelector('.input-adding-low-task');
const taskContainers = document.querySelectorAll('.task-conteiner');
const errorContainers = document.querySelectorAll('.error-msg');
const forms = document.querySelectorAll('.form');

const STATUSES = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done"
}

const PRIORITIES = {
  LOW: 'low',
  HIGH: 'high'
}

let tasks = data;

const resetTaskInputValue = (form) => {
  form.reset();
}

const getCurrentTaskInput = (evt) => {
  return evt.target === highPriorityFormNode ? highPriorityInputNode : lowPriorityInputNode;
}

const getCurrentPriority = (evt) => {
  return evt.target === highPriorityFormNode ? PRIORITIES.HIGH : PRIORITIES.LOW;
}

const getCurrentContainer = (priority) => {
  return document.querySelector(`.task-conteiner-${priority}`);
}

const getCurrentForm = (evt) => {
  return getCurrentTaskInput(evt).parentElement;
}

const getCurrentErrorContainer = (evt) => {
  return evt.target.closest('.priority-container').querySelector('.error-msg');
}

const addTask = (evt) => {
  evt.preventDefault();
  errorContainers.forEach(container => container.innerHTML = '');
  const taskName = getCurrentTaskInput(evt).value;

  try {
    validateByEmptyTask(evt);
    validateByExistingTask(evt);
    const taskId = generateUniqueId();
    const taskPriority = getCurrentPriority(evt);

    const task = { name: taskName, status: STATUSES.TO_DO, priority: taskPriority, id: taskId }
    tasks.push(task);

    resetTaskInputValue(getCurrentForm(evt));
    render();
  } catch (err) {
    getCurrentErrorContainer(evt).textContent = err.message;
  }
}

const createTask = ({ name, status, priority, id }) => {
  const templateNode = document.querySelector('#task').content;
  const taskNode = templateNode.cloneNode(true);

  const taskNameNode = taskNode.querySelector('.task-label');
  taskNameNode.textContent = name;

  const taskCheckboxNode = taskNode.querySelector('.task-checkbox');
  if (status === STATUSES.TO_DO) {
    taskCheckboxNode.checked = false;
    taskNameNode.classList.remove('task-label__done');
  } else {
    taskCheckboxNode.checked = true;
    taskNameNode.classList.add('task-label__done');
  }

  const taskIdNode = taskNode.querySelector('.task');
  taskIdNode.dataset.id = id;

  getCurrentContainer(priority).append(taskNode);
}

const render = () => {
  taskContainers.forEach(container => container.innerHTML = '');
  tasks.forEach(task => createTask(task));
}

const deleteTask = (evt) => {
  if (!evt.target.closest('.button-delete')) return;
  tasks = tasks.filter(task => task.id !== evt.target.closest('.task').dataset.id);
  render();
}

const changeStatus = (evt) => {
  if (!evt.target.closest('.task-checkbox')) return;
  const targetTask = tasks.find(task => task.id === evt.target.closest('.task').dataset.id);
  targetTask.status === STATUSES.TO_DO ? targetTask.status = STATUSES.DONE : targetTask.status = STATUSES.TO_DO;
  render();
}

appContainerNode.addEventListener('submit', addTask);
appContainerNode.addEventListener('click', deleteTask);
appContainerNode.addEventListener('change', changeStatus);

render();

export { getCurrentTaskInput, tasks, resetTaskInputValue, forms }

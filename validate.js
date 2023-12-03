import { getCurrentTaskInput, tasks, resetTaskInputValue, forms } from './main.js';

const errorMessage = {
  emptyTask: 'Введите задачу',
  repeatedTask: 'Такая задача уже есть',
};

const normalizeValue = (evt) => {
  let value = getCurrentTaskInput(evt).value;
  value = value.toLowerCase().replace(/\s+/g, ' ').trim();
  return value;
}

const validateByEmptyTask = (evt) => {
  if (normalizeValue(evt) === '') {
    forms.forEach(form => resetTaskInputValue(form));
    throw new Error(errorMessage.emptyTask);
  }
}

const validateByExistingTask = (evt) => {
  if (tasks.find(task => task.name === getCurrentTaskInput(evt).value)) {
    throw new Error(errorMessage.repeatedTask);
  }
}

export { validateByEmptyTask, validateByExistingTask };

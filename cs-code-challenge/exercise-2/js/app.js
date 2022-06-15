var taskInput = document.getElementById("new-task");
// var addButton = document.getElementsByTagName("button")[0];
var addButton = document.getElementById("add-new-task")
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");
var createNewTaskElement = function (taskString, type = "") {
  listItem = document.createElement("li");
  checkBox = document.createElement("input");
  label = document.createElement("label");
  editInput = document.createElement("input");
  editButton = document.createElement("button");
  deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskString;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  if (!type) {
    //localstorage
    let dataList = [];
    if (localStorage.getItem('dataList')) {
      dataList = JSON.parse(localStorage.getItem('dataList'));
    }
    dataList.push(taskString);
    localStorage.setItem('dataList', JSON.stringify(dataList))
  }

  return listItem;
};

var addTask = function () {
  if (!taskInput.value) {
    taskInput.style.borderColor = "red";
    return false;
  }
  // var listItemName = taskInput.value;
  listItem = createNewTaskElement(taskInput.value)
  incompleteTasksHolder.appendChild(listItem)
  bindTaskEvents(listItem, taskCompleted)
  taskInput.value = "";
};

var editTask = function () {
  var listItem = this.parentNode;
  var editInput = listItem.querySelectorAll("input[type=text")[0];
  var label = listItem.querySelector("label");
  if (editInput.value) {
    let lastInput = label.innerText;
    updateAndDeleteFromLocalStorage(lastInput, editInput.value);
  }

  var button = listItem.getElementsByTagName("button")[0];
  var containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
    label.innerText = editInput.value
    button.innerText = "Edit";
  } else {
    editInput.value = label.innerText
    button.innerText = "Save";
  }

  listItem.classList.toggle("editMode");
};

var deleteTask = function (el) {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  var label = listItem.querySelector("label");
  let lastInput = label.innerText;
  updateAndDeleteFromLocalStorage(lastInput, "", "delete");
  ul.removeChild(listItem);
};

var taskCompleted = function (el) {
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
};

var taskIncomplete = function () {
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
};

var bindTaskEvents = function (taskListItem, checkBoxEventHandler, cb) {
  var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  var editButton = taskListItem.querySelectorAll("button.edit")[0];
  var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};
addButton.addEventListener("click", addTask);
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
window.addEventListener('DOMContentLoaded', (event) => {
  let datalist = localStorage.getItem('dataList') ? JSON.parse(localStorage.getItem('dataList')) : [];
  for (let x of datalist) {
    createNewTaskElement(x, "local");
    incompleteTasksHolder.appendChild(listItem)
    bindTaskEvents(listItem, taskCompleted)
  }
});


function updateAndDeleteFromLocalStorage(lastInput, currentVal, type = "edit") {
  //localstorage
  let localData = localStorage.getItem('dataList') ? JSON.parse(localStorage.getItem('dataList')) : [];
  if (type === "edit") {
    localData.filter((val, i, arr) => {
      if (val == lastInput) {
        arr[i] = currentVal;
      }
      return arr;
    })
    localStorage.setItem('dataList', JSON.stringify(localData));
  } else {
    let filterData = localData.filter((input) => {
      return input != lastInput;
    })
    localStorage.setItem('dataList', JSON.stringify(filterData));
  }
}


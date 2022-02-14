const backlogList = document.getElementById("backlogs-container");
const progressList = document.getElementById("progress-container");
const completeList = document.getElementById("complete-container");
const onHoldList = document.getElementById("hold-container");
const listColumns = document.querySelectorAll(".item-container-list");

const addItems = document.querySelectorAll(".textfield");
let updatedOnLoad = false;

let currentColumn;
let draggedItem;
let dragging = false;

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

function getSavedItems() {
  if (
    localStorage.getItem("backlogItems") &&
    localStorage.getItem("progressItems") &&
    localStorage.getItem("completeItems") &&
    localStorage.getItem("onHoldItems")
  ) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

function updateSavedItems() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add("list-item");
  listEl.draggable = true;

  listEl.setAttribute("ondragstart", "drag(event)");

  // Append
  columnEl.appendChild(listEl);
}

function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedItems();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedItems();
}

function addToColumn(column) {
  const itemText = addItems[column].value;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].value = "";
  updateDOM();
}

function handledragover(e) {
  e.preventDefault();
}

function structureArrays() {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

function handledrop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];

  listColumns.forEach((column) => {
    column.classList.remove("over");
  });

  parent.appendChild(draggedItem);

  dragging = false;
  structureArrays();
}

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

function dragAllow(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}
updateDOM();

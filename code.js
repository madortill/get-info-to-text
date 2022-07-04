const COURSES = {
  'בה"ד-6': ["קורס-בהד-6", "קורס-2", "קורס-3", "קורס-4"],
  'בה"ד-7': ["קורס-בהד-7", "קורס-2", "קורס-3", "קורס-4"],
  'בה"ד-10': ["קורס-בהד-10", "קורס-2", "קורס-3", "קורס-4"],
  'בה"ד-11': ["קורס-1", "קורס-2", "קורס-3", "קורס-4"],
  'בה"ד-13': ["קורס-1", "קורס-2", "קורס-3", "קורס-4"],
  'בה"ד-20': ["קורס-1", "קורס-2", "קורס-3", "קורס-4"],
  'בה"ד-חינוך': ["קורס-1", "קורס-2", "קורס-3", "קורס-4"],
  מפקדה: ["קורס-1", "קורס-2", "קורס-3", "קורס-4"],
};

const LOMDOT = {
  tools: { name: "כלים", questions: 24 },
  mitztainim: { name: "מצטיינים", questions: 10},
  davidShower: { name: "דוד מתקלח", questions: 10 },
  tableTask: { name: "משימת שולחן", sortGroups: 2}
};
// const QUESTION_TYPES = ["questions", "sortGroups", "completeSentence"];

let questionObj;
let questionCounter = 0;
let maxQuestions; /* change later */
let questionStyle = "multiple"; /* change later */
let currBahad;
let currCourse;
let currLomda;
let submitBtn;
let itemCounter = 0;

window.addEventListener("load", () => {
  handleFirstPage();
  //   toInput();
  //   document.getElementById("submit").addEventListener("click", insertFile);
});

const handleFirstPage = () => {
  for (key in COURSES) {
    document.getElementById("bahad").append(El("option", { attributes: { value: `${key}` } }, `${addSpace(key)}`));
  }
  document.getElementById("bahad").addEventListener("input", addCourseSelection);
};

const addCourseSelection = () => {
  document.getElementById("course").disabled = false;
  document.getElementById("course").innerHTML = "";
  document.getElementById("course").append(El("option", { attributes: { value: ``, disabled: "", selected: "" } },`איזה קורס אתם מעבירים?`));
  let courseList = COURSES[document.getElementById("bahad").value];
  for (course in courseList) {
    document.getElementById("course").append(
        El("option",{ attributes: { value: `${courseList[course]}` } },`${addSpace(courseList[course])}`)
      );
  }
  document.getElementById("course").addEventListener("input", addLomdaSelection);
};

const addLomdaSelection = () => {
  document.getElementById("lomda").disabled = false;
  document.getElementById("lomda").innerHTML = "";
  document.getElementById("lomda").append(El("option", { attributes: { value: ``, disabled: "", selected: "" } },`לאיזו לומדה תרצו להכניס שאלות?`)
    );
  for (key in LOMDOT) {
    document.getElementById("lomda").append(
      El("option",{ attributes: { value: `${key}` } },`לומדת ${LOMDOT[key]["name"]}`)
      );
  }
  document.getElementById("lomda").addEventListener("input", () => {
    document.getElementById("to-input").disabled = false;
    document.getElementById("to-input").addEventListener("click", toInput);
  });
};

const addSpace = (phrase) => {
  return phrase.replace(/-/g, " ");
};

const toInput = () => {
  if (document.getElementById("lomda").value !== "" && document.getElementById("course").value !== "" && document.getElementById("bahad").value !== "") {
    // Initiate variables
    document.getElementById("to-input").removeEventListener("click", toInput);
    currBahad = document.getElementById("bahad").value;
    currCourse = document.getElementById("course").value;
    currLomda = document.getElementById("lomda").value;
    submitBtn = document.getElementById("submit");
    questionCounter = 0;
    document.getElementById("open-screen").style.display = "none";
    if (LOMDOT[currLomda].questions !== undefined) {
      maxQuestions = Number(LOMDOT[currLomda]["questions"]);
      document.getElementById("question-num").innerText = `הכנסת ${questionCounter} שאלות מתוך ${maxQuestions}`;
      questionObj = {
        [currBahad]: {
          [currCourse]: {
            [currLomda]: {
              questions: [],
            },
          },
        },
      };
      document.getElementById("question-screen").style.display = "block";
      document.getElementById("type-of-question").addEventListener("input", (event) => {
        document.getElementById(`${questionStyle}-screen`).style.display = "none";
        questionStyle = document.getElementById("type-of-question").value;
        changeInputPage();
      });
      submitBtn.addEventListener("click", saveInfo);
    } else if (LOMDOT[currLomda].sortGroups > 0) {
      sortPage();
      questionObj = {
        [currBahad]: {
          [currCourse]: {
            [currLomda]: {
              sortGroups: {},
            },
          },
        },
      };
      questionObj[currBahad][currCourse][currLomda].sortGroups.drag = []
    }
  } else {
    alert("לא כל השדות מלאים");
  }
};

changeInputPage = () => {
  document.getElementById(`${questionStyle}-screen`).style.display = "block";
  let inputList = document.querySelectorAll(`#${questionStyle}-screen input`);
  for (let i = 0; i < inputList.length; i++) {
    inputList[i].value = "";
  }
  let inputArray = [...document.querySelectorAll(`#${questionStyle}-screen input`), ...document.querySelectorAll(`#${questionStyle}-screen select`)];
  document.getElementById(`${questionStyle}-screen`).addEventListener("input", (event) => {
     for (let index = 0; index < inputArray.length; index++) {
       if (inputArray[index].value === "") {
          submitBtn.disabled = true;
          return
        }
     }
     submitBtn.disabled = false;
  })
};

const saveInfo = (event) => {
  if (checkValidInput()) {;
    questionCounter++;
    document.getElementById("question-num").innerText = `הכנסת ${questionCounter} שאלות מתוך ${maxQuestions}`;
    changeButtonColor();
    window[questionStyle]();
    if (questionCounter === maxQuestions) {
      if (LOMDOT[currLomda].sortGroups > 0) {
        sortPage();
        questionObj[currBahad][currCourse][currLomda].sortGroups = {};
      } else if (LOMDOT[currLomda].completeSentence > 0) {
        // code
      } else {
        createFile();
      }
    } else {
      changeInputPage();
    }
  }
};

const checkValidInput = () => {
  return true;
  // make sure there is text inside every input
}

const changeButtonColor = () => {
    // change submit button color
    submitBtn.disabled = false;
    submitBtn.removeEventListener("click", saveInfo);
    submitBtn.innerText = "נוסף!";
    submitBtn.style.backgroundColor = "green";
    setTimeout(() => {
      submitBtn.innerText = "הוספה";
      submitBtn.style.backgroundColor = "rgb(196, 104, 196)";
      submitBtn.addEventListener("click", saveInfo);
      submitBtn.disabled = true;
    }, 1000);
}

const sortPage = () => {
  document.getElementById("sort-screen").style.display = "block";
  for (let groupCounter = 0; groupCounter < LOMDOT[currLomda].sortGroups; groupCounter++) {
    document.getElementById("group-container").appendChild(
      El("span", {cls: "open-text"}, `${groupCounter + 1}.`,
      El("input", {id: `group${groupCounter}`, cls: "text-input"})))
    }
  document.getElementById("group-container").appendChild(El("button", {id: `group-submit`, cls: "btn", listeners: {click: showItems}}, "הקבוצות מוכנות?"))
}

const showItems = () => {
  if (checkValidSort()) {
    document.getElementById("group-submit").removeEventListener("click", showItems);
    document.getElementById(`group-container`).style.display = "none";
    // Add group names
    questionObj[currBahad][currCourse][currLomda].sortGroups.drop = [];
    document.getElementById("group-names").innerText = `הקבוצות שבחרת הן: `
    for (let groupCounter = 0; groupCounter < LOMDOT[currLomda].sortGroups; groupCounter++) {
      document.getElementById("group-names").innerText += ` ${document.getElementById(`group${groupCounter}`).value}, `;
      questionObj[currBahad][currCourse][currLomda].sortGroups.drop.push(document.getElementById(`group${groupCounter}`).value);
    }
    document.getElementById("group-names").innerText = document.getElementById("group-names").innerText.replace(/.$/,".");
    // Add buttons and event listeners to inputs
    itemCounter = -1;
    document.getElementById("sort-screen").append(El("button", {cls: "sort-btn", id:"add-item", listeners: {"click": addItem}, attributes: {disabled: true}}, "הוספת פריט"));
    document.getElementById("sort-screen").append(El("button", {cls: "sort-btn", id: "sort-submit", listeners: {"click": () => {addItem(); createFile();}}, attributes: {disabled: true}}, "סיימתי"));
    addItem()
  }
}

const checkValidSort = () => {
  return true;
  // make sure there are not two same names of group
}

const disableBtn = () => {
  let inputArray = [...document.querySelectorAll("#items-container input"), ...document.querySelectorAll("#items-container select")];
  for (let index = 0; index < inputArray.length; index++) {
    if (inputArray[index].value === "") {
      document.getElementById("add-item").disabled = true;
      document.getElementById("sort-submit").disabled = true;
      return false;
    } 
  }
  document.getElementById("add-item").disabled = false;
  document.getElementById("sort-submit").disabled = false;
}

const addItem = () => {
  itemCounter++;
  let minusImg = itemCounter > 0 ? El("img", {attributes: {src: "assets/media/minus.png"}, cls: "minus", listeners: {"click": removeItem}}): "";
  document.getElementById("items-container").append(
    El("div", {cls:"item"},
    minusImg,
    El("span", {cls:"open-text"}, `${itemCounter+1}.`),
    El("input", {attributes: {"type": "text"}, id: `item${itemCounter}-name`, cls: "dropdown"}),
    // Select a group
    El("select", {cls: "dropdown", id: `item${itemCounter}-group`}, El("option", {attributes: {disabled: true, selected:true, value:""}}, "לאיזו קבוצה לשייך?"))));
  for (let optionCounter = 0; optionCounter < LOMDOT[currLomda].sortGroups; optionCounter++) {
    document.getElementById(`item${itemCounter}-group`).append(
      El("option", {attributes: {value: optionCounter + 1}}, document.getElementById(`group${optionCounter}`).value)
      );
  }
    document.getElementById("add-item").disabled = true;
    document.getElementById("sort-submit").disabled = true;
    document.getElementById(`sort-screen`).addEventListener("input", disableBtn);
    saveSort();
}

const removeItem = (event) => {
  event.currentTarget.parentElement.remove();
  disableBtn();
  itemCounter--;
  let spanArray = document.querySelectorAll("#items-container span");
  let inputArray = document.querySelectorAll("#items-container input");
  let selectArray = document.querySelectorAll("#items-container select");
  for (let index = 0; index < spanArray.length; index++) {
    spanArray[index].innerText = `${index + 1}.`;
    inputArray[index].setAttribute("id", `item${index}-name`);
    selectArray[index].setAttribute("id", `item${index}-group`);
  }
}

const saveSort = () => {
  questionObj[currBahad][currCourse][currLomda].sortGroups.drag = []
  for (let i = 0; i < itemCounter; i++) {
    questionObj[currBahad][currCourse][currLomda].sortGroups.drag.push({
      drag: document.getElementById(`item${i}-name`).value,
      group: Number(document.getElementById(`item${i}-group`).value)
    })
  }
  console.log(questionObj)
}

const createFile = () => {
  if (document.getElementById("sort-submit") !== null) {
    document.getElementById("sort-submit").disabled;
    document.getElementById("sort-screen").style.display = "none";
  } else {
    submitBtn.removeEventListener("click", saveInfo);
    document.getElementById("question-screen").style.display = "none";
  }
  document.getElementById("finish-screen").style.display = "block";
  // Add check to see if the user want to add another Lomda
  let text = JSON.stringify(questionObj);
  let textFile = null;
  let fileData = new Blob([String(text)], { type: "text/plain" });
  textFile = window.URL.createObjectURL(fileData);
  let link = document.getElementById("downloadlink");
  link.href = textFile;
  link.style.display = "block";
  // returns a URL you can use as a href
  return textFile;
}


/* Types Functions
--------------------------------------------------------------
Description: saves info in questionsObj based on different types of questions */
var multiple = () => {
  questionObj[currBahad][currCourse][currLomda]["questions"].push({
    type: "multiple",
    question: String(document.getElementById(`multiple-question`).value),
    ans1: String(document.getElementById("ans1").value),
    ans2: String(document.getElementById("ans2").value),
    ans3: String(document.getElementById("ans3").value),
    ans4: String(document.getElementById("ans4").value),
    correctAns: "ans" + String(document.getElementById("correctAns").value)
  });
}

var binary = () => {
  questionObj[currBahad][currCourse][currLomda]["questions"].push({
    type: "binary",
    question: String(document.getElementById(`binary-question`).value),
    correctAns: String(document.getElementById("binary-ans").value),
    selectedAns: ""
  });
}


function El(tagName, options = {}, ...children) {
  let el = Object.assign(document.createElement(tagName), options.fields || {});
  if (options.classes && options.classes.length)
    el.classList.add(...options.classes);
  else if (options.cls) el.classList.add(options.cls);
  if (options.id) el.id = options.id;
  el.append(...children.filter((el) => el));
  for (let listenerName of Object.keys(options.listeners || {}))
    if (options.listeners[listenerName])
      el.addEventListener(listenerName, options.listeners[listenerName], false);
  for (let attributeName of Object.keys(options.attributes || {})) {
    if (options.attributes[attributeName] !== undefined)
      el.setAttribute(attributeName, options.attributes[attributeName]);
  }
  return el;
}

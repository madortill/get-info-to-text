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
  tools: { name: "כלים", questions: { multiple: 12 } },
  mitztainim: { name: "מצטיינים", questions: { multiple: 5, binary: 1 } },
  davidShower: { name: "דוד מתקלח", questions: {multiple: 5, binary: 5 } }
};
const QUESTION_TYPES = ["multiple", "binary"];
let questionObj;
let questionCounter = 0;
let currQuestionCounter = 0;
let maxQuestions = 3; /* change later */
let questionStyle = "multiple"; /* change later */
let currBahad;
let currCourse;
let currLomda;
let submitBtn;

window.addEventListener("load", () => {
  handleFirstPage();
  //   toInput();
  //   document.getElementById("submit").addEventListener("click", insertFile);
});

const handleFirstPage = () => {
  for (key in COURSES) {
    document
      .getElementById("bahad")
      .append(
        El("option", { attributes: { value: `${key}` } }, `${addSpace(key)}`)
      );
  }
  document
    .getElementById("bahad")
    .addEventListener("input", addCourseSelection);
};

const addCourseSelection = () => {
  document.getElementById("course").disabled = false;
  document.getElementById("course").innerHTML = "";
  document
    .getElementById("course")
    .append(
      El(
        "option",
        { attributes: { value: ``, disabled: "", selected: "" } },
        `איזה קורס אתם מעבירים?`
      )
    );
  let courseList = COURSES[document.getElementById("bahad").value];
  for (course in courseList) {
    document
      .getElementById("course")
      .append(
        El(
          "option",
          { attributes: { value: `${courseList[course]}` } },
          `${addSpace(courseList[course])}`
        )
      );
  }
  document
    .getElementById("course")
    .addEventListener("input", addLomdaSelection);
};

const addLomdaSelection = () => {
  document.getElementById("lomda").disabled = false;
  document.getElementById("lomda").innerHTML = "";
  document.getElementById("lomda").append(El("option", { attributes: { value: ``, disabled: "", selected: "" } },`לאיזו לומדה תרצו להכניס שאלות?`)
    );
  for (key in LOMDOT) {
    document
      .getElementById("lomda")
      .append(
        El(
          "option",
          { attributes: { value: `${key}` } },
          `לומדת ${LOMDOT[key]["name"]}`
        )
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
  // Initiate variables
  currBahad = document.getElementById("bahad").value;
  currCourse = document.getElementById("course").value;
  currLomda = document.getElementById("lomda").value;
  submitBtn = document.getElementById("submit");
  questionCounter = 0;
  currQuestionCounter = 0;
  document.getElementById("open-screen").style.display = "none";
  maxQuestions = 0;
  questionStyle = QUESTION_TYPES[0];

  let currIndex;
  while (LOMDOT[currLomda]["questions"][questionStyle] === undefined) {
    currIndex = QUESTION_TYPES.findIndex(item => item === questionStyle) + 1;
    questionStyle = QUESTION_TYPES[currIndex];
    if (currIndex === QUESTION_TYPES.length) {
      throw new Error("שמות השאלות שהוזנו באובייקט הלומדות לא תואמים את שמות השאלות ברשימת השאלות");
    }
  }

  // Compute the amount of all the questions
  for (let key in LOMDOT[currLomda]["questions"]) {
    maxQuestions += Number(LOMDOT[currLomda]["questions"][key]);
  }
  document.getElementById(
    "question-num"
  ).innerText = `הכנסת ${questionCounter} שאלות מתוך ${maxQuestions}`;
  questionObj = {
    [currBahad]: {
      [currCourse]: {
        [currLomda]: {
          questions: [],
        },
      },
    },
  };
  document.getElementById("input-screen").style.display = "block";
  changeInputPage();
  submitBtn.addEventListener("click", saveInfo);
};

changeInputPage = () => {
  console.log(questionStyle)
  document.getElementById(`${questionStyle}-screen`).style.display = "block";
  let inputList = document.querySelectorAll(`#${questionStyle}-screen input`);
  for (let i = 0; i < inputList.length; i++) {
    inputList[i].value = "";
  }
};

const saveInfo = (event) => {
  if (checkValidInput()) {
    currQuestionCounter++;
    questionCounter++;
    document.getElementById("question-num").innerText = `הכנסת ${questionCounter} שאלות מתוך ${maxQuestions}`;
    changeButtonColor();
    window[questionStyle]();
    checkStyleChange();
    // check if the user entered all the questions
    if (questionCounter === maxQuestions) {
      summary();
    } else {
      changeInputPage();
    }
  }
};

const changeButtonColor = () => {
    // change submit button color
    submitBtn.removeEventListener("click", saveInfo);
    submitBtn.innerText = "נוסף!";
    submitBtn.style.backgroundColor = "green";
    setTimeout(() => {
      submitBtn.innerText = "הוספה";
      submitBtn.style.backgroundColor = "rgb(196, 104, 196)";
      submitBtn.addEventListener("click", saveInfo);
    }, 1000);
}

const checkStyleChange = () => {
  // Check if need to change the type of questions
  if (currQuestionCounter === Number(LOMDOT[currLomda]["questions"][questionStyle])) {
    currQuestionCounter = 0;
    document.getElementById(`${questionStyle}-screen`).style.display = "none";
    let currIndex = QUESTION_TYPES.findIndex(item => item === questionStyle) + 1;
    questionStyle = QUESTION_TYPES[currIndex];
    while (LOMDOT[currLomda]["questions"][questionStyle] === undefined) {
      currIndex = QUESTION_TYPES.findIndex(item => item === questionStyle) + 1;
      questionStyle = QUESTION_TYPES[currIndex];
      if (currIndex === QUESTION_TYPES.length) {
        summary();
        break;
      }
    }
  }
}

const checkValidInput = () => {
  // Change - Make sure the user does not leave empty spaces
  return true;
};

const summary = () => {
  document.getElementById("finish-screen").style.display = "block";
  document.getElementById("input-screen").style.display = "none";
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
    question: String(document.getElementById(`multiple-question`).value),
    correctAns: "ans" + String(document.getElementById("correctAns").value)
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

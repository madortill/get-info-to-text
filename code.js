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
  tablesTask: { name: "משימת שולחן", sortGroups: 2},
  animals: {name: "חיות", questions: 10},
  rules: {name: "חוקים", sortGroups: 3},
  tillder: {name: "טילדר", questions: 10},
  mapStorage: {name: "מפה", questions: 10},
  asteroid: {name: "אסטרואיד", questions: 10},
  complete: {name: "ניסיון", completeSentence: 3}
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
  // window.addEventListener('beforeunload', function (e) {
  //   // Cancel the event
  //   e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  //   // Chrome requires returnValue to be set
  //   e.returnValue = '';
  // });
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
      if (currLomda === "tillder") {
        document.getElementById("type-of-question").value = "binary";
        questionStyle = "binary";
        document.getElementById('type-of-question').getElementsByTagName('option')[1].selected = 'selected';
        document.getElementById("type-of-question").disabled = true;
        changeInputPage();
        console.log(document.getElementById("question-screen").children[2])
        document.getElementById("question-screen").insertBefore(El("div", {cls: "tillder-text"}, "ללומדה זו צריך להוסיף גם תמונות. את התמונות יש לשלוח למייל mador.till@gmail.com לפי סדר השאלות."), document.getElementById("question-screen").children[2])
      } else {
        document.getElementById("type-of-question").addEventListener("input", (event) => {
          document.getElementById(`${questionStyle}-screen`).style.display = "none";
          questionStyle = document.getElementById("type-of-question").value;
          changeInputPage();
        });
      }
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
    } else if (LOMDOT[currLomda].completeSentence > 0) {
      goToSentences();
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
  // Makes sure inputs are not empty
  let inputArray = [...document.querySelectorAll(`#${questionStyle}-screen input`), ...document.querySelectorAll(`#${questionStyle}-screen select`)];
  document.getElementById(`${questionStyle}-screen`).addEventListener("input", (event) => {
     for (let index = 0; index < inputArray.length; index++) {
       if (inputArray[index].value === "") {
          submitBtn.disabled = true;
          return
        }
     }
     submitBtn.disabled = false;
  });
};

const saveInfo = (event) => {
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
};


const changeButtonColor = () => {
    // change submit button color
    submitBtn.disabled = false;
    submitBtn.removeEventListener("click", saveInfo);
    submitBtn.innerText = "נוסף!";
    submitBtn.style.backgroundColor = "green";
    setTimeout(() => {
      submitBtn.innerText = "הוספה";
      submitBtn.style.backgroundColor = "rgb(196, 104, 196)";
      if (questionCounter === maxQuestions - 1) {
        submitBtn.innerText = "הוספה והמשך";
      }
      submitBtn.addEventListener("click", saveInfo);
      submitBtn.disabled = true;
    }, 1000);
}



const createFile = () => {
  console.log(questionObj);
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

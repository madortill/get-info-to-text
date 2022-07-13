let sentenceItemCounter;
let sentenceCounter;

const goToSentences = () => {
    document.getElementById("sentence-screen").style.display = "flex";
    sentenceCounter = -1;
    sentenceItemCounter = 0;
    document.getElementById("sentence-num").innerText = `הכנסת ${sentenceCounter} משפטים מתוך ${LOMDOT[currLomda].completeSentence}`;
    questionObj = {
        [currBahad]: {
          [currCourse]: {
            [currLomda]: {
              completeSentence: [
                  {},
              ],
            },
          },
        },
    };

    document.getElementById("sentence-screen").append(El("button", {cls: "sort-btn", id: "sentence-submit", listeners: {click: newSentence}}, "המשך"));
    newSentence();
}

const newSentence = () => {
    sentenceCounter++;
    sentenceItemCounter = 0;
    document.getElementById("sentence-screen").append(
        El("div", {id:`${sentenceCounter}-container`, classes: ["sentence-container"]}, 
        El ("div", {cls: "flex"},
        El("span", {cls: "open-text"}, "החלק הראשון של המשפט:"),
        El("input", {cls: "sentence-input", id: `${sentenceCounter}part1`, attributes: {placeholder: "חלק א'"}})),
        El("div", {cls: "scroll-bar"},
            El("div", {classes: ["flex", "sentence-option-container"], id: `${sentenceCounter}sentence-option-container`},)),
        El("div", {classes: ["sort-btn", "add-option-btn"], id: `add-option-btn${sentenceCounter}`,listeners: {click: addOptionItem}}, "הוספת אפשרות"),
        El ("div", {cls: "flex"},
        El("span", {cls: "open-text"}, "החלק השני של המשפט:"),
        El("input", {cls: "sentence-input", id: `${sentenceCounter}part2`, attributes: {placeholder: "חלק ב'"}})),
        El("div", {id: "radio-container"}),
        El("div", {},
        ))
    )
    const eve = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      console.log(document.getElementById(`add-option-btn${sentenceCounter}`));
    document.getElementById(`add-option-btn${sentenceCounter}`).dispatchEvent(eve);
    document.getElementById(`add-option-btn${sentenceCounter}`).dispatchEvent(eve);
    document.getElementById(`sentence-screen`).addEventListener("input", disableSentenceBtn);
}

const addOptionItem = (event) => {
    let attribueStore = sentenceItemCounter <= 1 ? {src: "assets/media/minus.png", disabled: true, style: "visibility: hidden;", alt: "hi"}:{src:"assets/media/minus.png", alt: "remove item"} ;
    let inputArray = document.getElementsByClassName(`input-${Number(event.currentTarget.id.at(-1))}`);
    console.log(event.currentTarget.id.at(-1))
    document.getElementById(`${event.currentTarget.id.at(-1)}sentence-option-container`).append(
      El("div", {cls:"item", id: `${event.currentTarget.id.at(-1)}`},
      El("img", {attributes: attribueStore, cls: "minus", listeners: {"click": removeSentenceItem }}),
      El("span", {classes:["open-text", `span-${event.currentTarget.id.at(-1)}`]}, `${inputArray.length + 1}.`),
      El("input", {attributes: {"type": "text"}, id: `${event.currentTarget.id.at(-1)}option${sentenceItemCounter}-name`, classes: ["sentence-input", "word-input", `input-${event.currentTarget.id.at(-1)}`]}),
      El("div", {cls: "radio", id: `${event.currentTarget.id.at(-1)}option${sentenceItemCounter}`})
    ));
    sentenceItemCounter++;
    document.getElementById(`${sentenceCounter}`).scrollIntoView();
    document.getElementById("sentence-submit").disabled = true;

  }
  
  // IF THERE ARE MORE THAN 10 QUESTIONS, NEED TO CHANGE divId
  const removeSentenceItem = (event) => {
    let divId = event.currentTarget.parentElement.parentElement.id[0];
    event.currentTarget.parentElement.remove();
    disableSentenceBtn();
    sentenceItemCounter--;
    let spanArray = document.querySelectorAll(`.span-${Number(divId)}`);
    let inputArray = document.getElementsByClassName(`input-${Number(divId)}`);
    for (let index = 0; index < spanArray.length; index++) {
        spanArray[index].innerText = `${index + 1}.`;
        // spanArray[index].classList.remove(`span-${divId}`);
        // spanArray[index].classList.add(`span-${index}`);
        // inputArray[index].classList.remove(`input-${divId}`);
        // inputArray[index].classList.add(`input-${index}`);
        inputArray[index].setAttribute("id", `${divId}option${index}-name`);
        //selectArray[index].setAttribute("id", `option${index}-answer`);
    }
  }

  const disableSentenceBtn = () => {
    // Makes sure inputs are not empty
    let inputArray = [...document.querySelectorAll("#sentence-screen input"), ...document.querySelectorAll("#sentence-screen select")];
    for (let index = 0; index < inputArray.length; index++) {
      if (inputArray[index].value === "") {
        document.getElementById("sentence-submit").disabled = true;
        return false;
      } 
    }
    document.getElementById("sentence-submit").disabled = false;
  }

  addRadioButtons = () => {
    document.getElementById("radio-container").innerHTML = "";
    document.querySelectorAll("#sentence-option-container input").forEach((element, index) => {
        console.log(element)
        document.getElementById("radio-container").append(
            El("input", {attributes: {type: "radio", name: "correctAns", value: `ans${index}`}}),
            El("label", {cls: "comment-text", for: `ans${index}`}, element.value? element.value: "הכניסו אפשרות")
        );
    })
    document.getElementById("sentence-submit").innerText = "למשפט הבא";
    document.getElementById("sentence-submit").removeEventListener("click", addRadioButtons);
    document.getElementById("sentence-submit").addEventListener("click", nextSentence);
}

const nextSentence = () => {
    questionObj[currBahad][currCourse][currLomda].completeSentence[sentenceCounter].correctAns = document.querySelector('input[name="correctAns"]:checked').value;     
  }
  
  const saveQuestions = () => {
      for (let j = 0; j < sentenceCounter; j++) {
        questionObj[currBahad][currCourse][currLomda].completeSentence[j].sentence = [document.getElementById(`${sentenceCounter}`)]
        questionObj[currBahad][currCourse][currLomda].completeSentence[j].dropDownAns = []
        for (let i = 0; i < sentenceItemCounter; i++) {
            questionObj[currBahad][currCourse][currLomda].completeSentence[j].dropDownAns.push(document.getElementById(`${j}option${i}-name`).value);
          }
    }
  }

 
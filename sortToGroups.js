const sortPage = () => {
    document.getElementById("sort-screen").style.display = "block";
    for (let groupCounter = 0; groupCounter < LOMDOT[currLomda].sortGroups; groupCounter++) {
      document.getElementById("group-container").appendChild(
        El("span", {cls: "open-text"}, `${groupCounter + 1}.`,
        El("input", {id: `group${groupCounter}`, cls: "text-input"})))
      }
      document.getElementById("group-container").appendChild(El("button", {attributes: {disabled: true}, id: `group-submit`, cls: "btn", listeners: {click: showItems}}, "הקבוצות מוכנות?"))
      // Makes sure inputs are not empty
      let inputArray = document.querySelectorAll(`#sort-screen input`);
      document.getElementById(`sort-screen`).addEventListener("input", (event) => {
       for (let index = 0; index < inputArray.length; index++) {
         if (inputArray[index].value === "") {
            document.getElementById(`group-submit`).disabled = true;
            return
          }
       }
       document.getElementById(`group-submit`).disabled = false;
    })
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
      document.getElementById("sort-screen").append(El("button", {cls: "sort-btn", id:"add-item", listeners: {"click": addItem}}, "הוספת פריט"));
      document.getElementById("sort-screen").append(El("button", {cls: "sort-btn", id: "sort-submit", listeners: {"click": () => {addItem(); createFile();}}, attributes: {disabled: true}}, "סיימתי"));
      addItem()
    } else {
      alert("נתת לשתי קבוצות את אותו השם. צריך להחליף את השמות.");
    }
  }
  
  const checkValidSort = () => {
    let groupArray = [];
    for (let groupCounter = 0; groupCounter < LOMDOT[currLomda].sortGroups; groupCounter++) {
      groupArray.push(document.getElementById(`group${groupCounter}`).value);
    }
    let isValid = true;
      for (let i = 0; i < groupArray.length - 1; i++) {
          for (let j = i; j < groupArray.length - 1; j++) {
              if (groupArray[i].trim() === groupArray[j+1].trim()) {
                isValid = false;
              }
          }
      }
    // make sure there are not two same names of group
    return isValid;
  }
  
  const disableSortBtn = () => {
    // Makes sure inputs are not empty
    let inputArray = [...document.querySelectorAll("#items-container input"), ...document.querySelectorAll("#items-container select")];
    for (let index = 0; index < inputArray.length; index++) {
      if (inputArray[index].value === "") {
        document.getElementById("sort-submit").disabled = true;
        return false;
      } 
    }
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
      document.getElementById("sort-submit").disabled = true;
      document.getElementById(`sort-screen`).addEventListener("input", disableSortBtn);
      saveSort();
  }
  
  const removeItem = (event) => {
    event.currentTarget.parentElement.remove();
    disableSortBtn();
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
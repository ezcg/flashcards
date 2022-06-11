export function getDrillDeckArr(numDrilled, arr) {
  //console.log("getDrillDeckArr numDrilled", numDrilled)
  //console.log("getDrillDeckArr arr:", arr)

  // only 5 questions and their defs at a time
  let numQuestions = 5
  let start = numDrilled * numQuestions
  let end = start + numQuestions
  // if there is only one question remaining after current set of questions, add the one card to the current set
  if (arr.length - end === 1) {
    ++end
  }
  let newArr = JSON.parse(JSON.stringify(arr.slice(start, end)))
  //console.log("A", newArr)
  // will create a deck of 10 cards total
  let deckArr = this.createDrillDeck(newArr)
  //console.log("B", deckArr)
  // shuffle the questions
  deckArr = this.shuffleDrillDeck(deckArr)
  //console.log("C", deckArr)

  return deckArr;
}

export function createDrillDeck(arr) {
  let deckArr = [];
  //console.log("createDrillDeck Length:", arr.length)
  for(let i = 0; i < arr.length; i++) {
    let obj = arr[i]
    let question = obj.question
    let answer = obj.answer
    let cardObj = { cardId: i, whatis: question, is:"question", clicked:0, done:0 };
    deckArr.push(cardObj)
    //console.log("createDrillDeck A", deckArr)
    cardObj = { cardId: i, whatis: answer, is:"answer", clicked:0, done:0 };
    deckArr.push(cardObj);
    //console.log("createDrillDeck B", deckArr)
  }
  return deckArr;
}

export function shuffleDrillDeck(deckArr) {
  let currentIndex = deckArr.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = deckArr[currentIndex];
    deckArr[currentIndex] = deckArr[randomIndex];
    deckArr[randomIndex] = temporaryValue;
  }

  return deckArr;

}



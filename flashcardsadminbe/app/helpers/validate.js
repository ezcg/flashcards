const categoriesService = require("../services/categories");

const maxCharsTitle = 70;
const minCharsTitle = 3;
const maxCharsDescription = 200;
const minCharsDescription = 10;
const maxCharsQuestion = 300;
const minCharsQuestion = 1;
const maxCharsAnswer = 450;
const minCharsAnswer = 1;
const maxCharsHint = 255;

exports.titleAndDescription = function(title, description) {

  // Validate request
  if (!title || !description) {
    return "Title and description required"
  }

  if (title.length > maxCharsTitle || description.length > maxCharsDescription) {
   return "Title cannot be longer than " + maxCharsTitle + " characters and description cannot be longer than " + maxCharsDescription + " characters.";
  } else if (title.length < minCharsTitle || description.length < minCharsDescription) {
   return "Title cannot be shorter than " + minCharsTitle + " characters and description cannot be shorter than " + minCharsDescription + " characters.";
  }

  return true;

}

exports.questionAnswerAndHint = function(question, answer, hint) {
  if (!question || !answer) {
    return "Question and answer required.";
  }
  if (question.length > maxCharsQuestion || answer.length > maxCharsAnswer) {
    return "Question cannot be longer than " + maxCharsQuestion + " characters and answer cannot be longer than " + maxCharsAnswer + " characters.";
  } else if (question.length < minCharsQuestion || answer.length < minCharsAnswer) {
    return "Question cannot be shorter than " + maxCharsQuestion + " character and answer cannot be shorter than " + minCharsAnswer + " characters.";
  } else if (hint && hint.length > maxCharsHint) {
    return "Hint cannot be longer than " + maxCharsHint + " characters.";
  }
  return true;
}

exports.isCategoryValid = function(subcategory) {
  let categoryArr = categoriesService.setCategoryArr();
  for(let index in categoryArr) {
    let subcategoryArr = categoryArr[index];
    if (subcategoryArr.includes(subcategory)) {
      return true;
    }
  }
  return subcategory + " is an invalid category.";
}

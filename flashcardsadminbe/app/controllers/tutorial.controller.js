const db = require("../models");
const HintCategories = db.hint_categories;
const Categories = db.categories;
const Tutorial = db.tutorial;
const Card = db.card;
const TutorialsNumCreated = db.tutorials_num_created;
const NumAction = db.num_action;
const Op = db.Sequelize.Op;
const Url  = require('url');
const Sequelize = require("sequelize");
const categoriesService = require("../services/categories");
const awsService = require("../services/aws");
const validateHelper = require("../helpers/validate");
const Roles = require("../config/roles.config.js");
const fs = require('fs')

/*

ACCESS LEVELS

user:
  once user has published their tutorial (published = 1), they can access it by
  clicking on the 'Take' button in the 'My' flashcard create site. Once a moderator approves it, it will be
  'distributed' and show up in the publicly accessible category list. eg. http://flashcards.ezcg.com/categories.
  Once distributed, it cannot be edited further by the user
moderator:
  can publish/unpublish/delete/edit/distribute any tutorial
admin:
  same as moderator but can set access levels of others

Once a user publishes their tutorial, published gets set to 1. Once a moderator distributes it, published gets set to 2.

*/

const isModerator = (req) => (Roles.moderator & req.validatedAccessLevel) === Roles.moderator;

async function verifyTutorialAccess(tutorialId, req, res) {

  let canModerate = isModerator(req);

  if (!canModerate) {
    // Limit the number of server interactions that can happen inside of 24 hours.
    let maxActions = 300;
    let yyyymmdd = new Date().toISOString().slice(0,10);
    let numAction24Hours = 0;
    let r = await NumAction.findOrCreate({
      where:{
        userId:req.validatedUserId,
        yyyymmdd:yyyymmdd
      },
      order: [[Sequelize.literal("yyyymmdd"), 'DESC']]
    });
    if (r[1] === false) {
      numAction24Hours = r[0]['num'];
      await NumAction.increment('num', {where:{userId:req.validatedUserId, yyyymmdd:yyyymmdd}});
    }
    if (numAction24Hours > maxActions) {
      return res.status(400).send({message:`You've hit the max server interactions inside of 24 hours. Try again tomorrow.`});
    }
  }

  let resultObj = {};
  resultObj.success = 0;
  // moderators and above can access all tutorials
  let whereObj = {where: {id:tutorialId}};
  // If user is not moderator or admin, userId is required
  if (!canModerate) {
    whereObj.where['userId'] = req.validatedUserId;
  }
  let tutorialObj = await Tutorial.findOne(whereObj);
  if (!tutorialObj) {
    resultObj.message = "You do not have access to tutorial id: " + tutorialId + ".";
    return res.status(400).send({message: resultObj.message});
    return false;
  }
  // If request is something other than GET, user must be moderator or more to be able to do something to a tutorial
  // that is already distributed aka published=2
  if (req.method !== 'GET' && tutorialObj.published == 2 && !canModerate) {
    res.status(400).send({message: "Sorry, but you've already published your tutorial, the moderator made it publicly accessible to all so you cannot edit it further."});
    return false;
  }
  resultObj.success = 1;
  resultObj.tutorialObj = tutorialObj.dataValues;
  return resultObj;
}

// get all cards for given tutorial id
exports.getCards = async (req, res) => {

  let tutorialId = req.params.id;
  let resultObj = await verifyTutorialAccess(tutorialId, req, res, true);
  if (resultObj === false){
    return;
  }

  let whereObj = { tutorialId: tutorialId};
  Card.findAll({
    where:whereObj,
    order: [[Sequelize.literal("card.rank"), 'ASC' ]]
  })
  .then(dataArr => {
    res.send(dataArr);
  }).catch(err => {
    res.status(500).send({message:
        err.message || "Some error occurred while retrieving tutorials."
    });
  });

}

exports.addCard = async (req, res) => {

  let tutorialId = req.body.id;
  let result = validateHelper.questionAnswerAndHint(req.body.question, req.body.answer, req.body.hint);
  if (result !== true) {
    return res.status(400).send({message: result});
  }

  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  if (resultObj === false){
    return;
  }
  let tutorialObj = resultObj.tutorialObj;

  let numCards = await Card.count({where: {tutorialId: req.body.id}});
  if (numCards >= 30) {
    return res.status(400).send({message:`You've already created 30 flashcards which is the max per tutorial. Feel free to make a sequel.`});
  }

  const card = {
    question: req.body.question,
    answer: req.body.answer,
    tutorialId:tutorialObj.id,
    published:1,
    hint:req.body.hint,
    hintCategoryId:req.body.hintCategoryId
  };

  Card.create(card)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({message:
        err.message || "Some error occurred while creating the card."
    });
  });

}

exports.updateCard = async (req, res) => {

  const tutorialId = req.params.tutorialId;
  const {answer, question, cardId, hintCategoryId, hint} = req.body;
  let result = validateHelper.questionAnswerAndHint(question, answer, hint);
  if (result !== true) {
    return res.status(400).send({message: result});
  }

  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  if (resultObj === false){
    return;
  }

  let isDup = false;
  try {
    // make sure it is not a duplicate
    isDup = await Card.count({where:
        {
          question:question,
          tutorialId:tutorialId,
          id: {[Op.ne]:cardId}
        }
    });
  } catch (e) {
    return res.status(500).send({message: "Server error"});
  }

  if (isDup) {
    res.status(400).send({message: "That question is already part of this flashcard set and no update was performed"});
  } else {
    Card.update({question:question,answer:answer, hint:hint, hintCategoryId:hintCategoryId}, {
      where: { tutorialId: tutorialId, id: cardId}
    })
    .then(num => {
      if (num == 1) {
        res.send({message: "Tutorial was updated successfully."});
      } else {
        res.status(400)({message: `Cannot update Tutorial with id=${tutorialId}. Maybe Tutorial was not found or req.body is empty!`});
      }
    })
    .catch(err => {
      res.status(500).send({message: "Error updating Tutorial with id=" + tutorialId});
    });
  }

}

// Delete a card with the specified id in the request
exports.deleteCard = async (req, res) => {

  const cardId = req.params.id;
  const tutorialId = req.query.tutorialId;

  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  if (resultObj === false){
    return;
  }

  Card.destroy({
    where: { id: cardId, tutorialId: tutorialId }
  })
  .then(num => {
    if (num == 1) {
      res.send({message: "Card was deleted successfully!"});
    } else {
      res.send({message: `Cannot delete card with id=${cardId} and userId ${req.validatedUserId}`});
    }
  })
  .catch(err => {
    res.status(500).send({message: "Could not delete Card with id=" + cardId + " and userId=" + req.validatedUserId});
  });

}

// Create and Save a new Tutorial
exports.create = async (req, res) => {

  let result = validateHelper.titleAndDescription(req.body.title, req.body.description);
  if (result !== true) {
    return res.status(400).send({message: result});
  }

  result = validateHelper.isCategoryValid(req.body.subcategory);
  if (result !== true) {
    return res.status(400).send({message: result});
  }

  // Limit to X tutorials created per day for regular user
  let numTutorials24Hours = 0;
  if (!isModerator(req)) {
    let yyyymmdd = new Date().toISOString().slice(0,10);
    numTutorials24Hours = await TutorialsNumCreated.findOne({where: {
      userId:req.validatedUserId,
      yyyymmdd:yyyymmdd
    }});
    if (numTutorials24Hours > 2) {
      return res.status(400).send({message: "Wow, you've created " + numTutorials24Hours + "! Congrats! However, that is the limit that can be made every 24 hours. Check back again tomorrow. Thanks!"});
    }
  }

  // Create a Tutorial
  const tutorial = {
    userId: req.validatedUserId,
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : 0,
    subcategory: req.body.subcategory
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
}

const getPagination = (page, size) => {
  // 5 is the default limit
  let limit = size ? +size : 5;
  limit = limit > 20 ? 20 : limit;
  let offset = page ? page * limit : 0;

  return { limit, offset };
}

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, tutorials, totalPages, currentPage };
}

// Retrieve all Tutorials or all of a users tutorials from the database.
exports.findAll = async (req, res) => {

  const { page, size, title, published } = req.query;
  const { limit, offset } = getPagination(page, size);
  const pathname = Url.parse(req.url).pathname;
  let whereObj = {};
  if (title) {
    whereObj =  { title: { [Op.like]: `%${title}%` } };
  }
  if (published) {
    whereObj['published'] = published;
  }
  return new Promise(function(resolve, reject) {
    if (req.validatedUserId && pathname == '/my') {
      whereObj['userId'] = req.validatedUserId;
      resolve(whereObj);
    } else if (!isModerator(req)) {
      reject({message:"You must have moderator or admin status to do that"});
    }
    resolve(whereObj);
  })
  .then(whereObj => {
    Tutorial.findAndCountAll({
      order: [[Sequelize.literal("tutorial.updatedAt"), 'DESC']],
      limit: limit,
      offset: offset,
      where: whereObj,
      include: [{
        model: db.user,
        attributes: {
          exclude: ['password', 'googleId', 'email']
        }
      }]
      })
      .then(async function(data) {
        for(let i = 0; i < data.rows.length; i++) {
          let tutorialId = data.rows[i].dataValues.id;
          let numCards = await Card.count({
            where: {
              tutorialId: tutorialId
            }
          });
          data.rows[i].dataValues.numCards = numCards;
          data.rows[i].dataValues.category = categoriesService.getParentCategory(data.rows[i].dataValues.subcategory);
        }
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "A.) Some error occurred while retrieving tutorials."
        });
      });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "B.) Some error occurred while retrieving tutorials."
    });
  });

}

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  const tutorialId = req.params.id;
  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  if (resultObj === false){
    return;
  }
  res.send(resultObj.tutorialObj);
}

// create a json list of tutorials
const updateList = () => {

  return new Promise((resolve, reject) => {
    Tutorial.findAll({
      order: [[Sequelize.literal("tutorial.subcategory"), 'ASC'],[Sequelize.literal("tutorial.updatedAt"), 'DESC']],
      where: {published:{[Op.gte]:1}},
      include: [{
        model: db.user,
        attributes: {
          exclude: ['password']
        }
      }]
    })
    .then(async function(data) {
      let arr = [];
      try {
        for(let i = 0; i < data.length; i++) {
          let tutorialId = data[i].dataValues.id;
          let numCards = await Card.count({
            where: {
              tutorialId: tutorialId
            }
          });
          let tmp = data[i].dataValues;
          arr[i] = {};
          arr[i].tutorialId = tmp.id;
          arr[i].title = tmp.title
          arr[i].description = tmp.description;
          arr[i].userId = tmp.userId;
          arr[i].username = tmp.user.username;
          arr[i].subcategory = tmp.subcategory;
          arr[i].createdAt = tmp.createdAt;
          arr[i].updatedAt = tmp.updatedAt;
          arr[i].numCards = numCards;
          arr[i].canDrillIt = tmp.canDrillIt;
        }
        return arr;
      } catch(e) {
        reject(e);
      }
    }).then(function(arr) {
      awsService.saveDataToS3(arr, "list.json")
      .then(() => {
        resolve();
      }).catch(e => {
        reject(e);
      });
    }).catch(err => {
      reject({message:err.message || "Some error occurred while retrieving tutorials."});
    });

  });

}

// Update order of questions displayed
exports.updateOrder = async (req, res) => {

  const tutorialId = req.params.id;
  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  if (resultObj === false){
    return;
  }
  let rankIdArr = req.body;
  for(let i = 0; i < rankIdArr.length; i++) {
    let rank = i + 1;
    let id = rankIdArr[i];
    await Card.update({rank:rank}, {
      where: { id: id }
    })
  }
  res.send({message: "Flashcard order saved!"});

}

// Update a Tutorial
exports.update = async (req, res) => {

  const tutorialId = req.params.id;
  let result = validateHelper.titleAndDescription(req.body.title, req.body.description);
  if (result !== true) {
    return res.status(400).send({message: result});
  }

  result = validateHelper.isCategoryValid(req.body.subcategory);
  if (result !== true) {
    return res.status(400).send({message: result});
  }

  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  if (resultObj === false){
    return;
  }
  delete req.body.published;
  Tutorial.update(req.body, {
    where: { id: tutorialId, userId:req.validatedUserId }
  })
  .then(async num => {
    if (num == 1) {
      res.send({message: "Tutorial updated."});
    } else {
      res.status(400).send({
        message: `Failed to update Tutorial with id=${tutorialId}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Tutorial with id=" + tutorialId
    });
  });

}

exports.publish = async (req, res) => {

  const tutorialId = req.params.id;
  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  // If user is moderator_user and no more and it's not their tutorial, resultObj would be false
  if (resultObj === false) {
    return;
  }

  let tutorialObj = resultObj.tutorialObj;
  let dbPublished = resultObj.tutorialObj.published;
  // If they're publishing it and it wasn't published before
  if (dbPublished == 0 && req.body.published == 1) {
    let numCards = await Card.count({
      where: {
        tutorialId: tutorialId, published:1
      }
    });
    if (numCards < 5) {
      return res.status(400).send({
        message: `You must have 5 flash cards that are PUBLISHED in order to publish the tutorial. You have ${numCards} published flashcards.`
      });
    }
    //
    // Get all flashcards associated with tutorial and write tutorial json to s3 (but not to list.json, that is done
    // via /distribute
    //
    let tmpHintCategoryArr = await HintCategories.findAll({raw:true, order: [[Sequelize.literal("hint_categories.id"), 'ASC']]});
    let hintCategoryArr = [];
    for(let i = 0; i < tmpHintCategoryArr.length; i++) {
      hintCategoryArr[tmpHintCategoryArr[i].id] = tmpHintCategoryArr[i].hintCategory;
    }
    let dataArr = await Card.findAll({
      where:{ tutorialId: tutorialId, published:1},
      order: [[Sequelize.literal("card.rank"), 'ASC']]
    })
    tutorialObj.flashcards = [];
    dataArr.forEach(row => {
      let obj = {};
      obj.cardId = row.dataValues.id;
      obj.question = row.dataValues.question;
      obj.answer = row.dataValues.answer;
      obj.hintCategory = "";
      if (row.dataValues.hintCategoryId) {
        obj.hintCategory = hintCategoryArr[row.dataValues.hintCategoryId]
        obj.hint = row.dataValues.hint;
      }
      tutorialObj.flashcards.push(obj);
    });

    try {
      let fileName = tutorialId + ".json";
      await awsService.saveDataToS3(tutorialObj, fileName);
      await Tutorial.update({published:1}, {where: { id: tutorialId }})
      res.send({message: "You can access your flashcards by clicking on the 'Take' button in the 'My' section of the flashcard admin page. It will not be available via the main public category list until a moderator approves it."});
    } catch(e) {
      res.status(500).send({message: "Error writing flashcard json to s3. " + e.message});
    }
  } else if (dbPublished >= 1 && req.body.published == 0) {
    //
    // delete tutorial json from s3
    //
    await Tutorial.update({published:0}, {where: { id: tutorialId}})
    let fileName = 'json/' + tutorialId + '.json';
    await awsService.deleteJson(fileName);
    res.send({message: "The tutorial is no longer accessible via the 'Take' button on the My page nor the publicly accessible categories page. You may edit it, Publish it again and retrieve it via the 'Take' button. After you Publish it again, a moderator may distribute it again for everyone to access via the category list."});
  } else {
    res.status(400).send({message: "dbPublished == " + dbPublished + " && req.body.published == " + req.body.published + ". Nothing to do."});
  }

}

// Delete a Tutorial
exports.delete = async (req, res) => {

  const tutorialId = req.params.id;
  let resultObj = await verifyTutorialAccess(tutorialId, req, res);
  if (resultObj === false) {
    return;
  }
  let tutorialObj = resultObj.tutorialObj;
  let whereObj = {where: {id:tutorialId}};
  if (!isModerator(req)) {
    whereObj.where['userId'] = req.validatedUserId;
  }
  Tutorial.destroy(whereObj)
  .then(async num => {
    if (num == 1) {
      await Card.destroy({
        where: { tutorialId: tutorialId }
      })
      if (tutorialObj.published >= 1) {
        let fileName = 'json/' + tutorialId + '.json';
        await awsService.deleteJson(fileName);
      }
      if (tutorialObj.published === 2) {
        await updateList();
      }
      res.send({message: "Tutorial was deleted successfully!"})
    } else {
      res.send({message: `Cannot delete Tutorial with id=${tutorialId} and userId ${req.validatedUserId}`});
    }
  }).catch(err => {
    res.status(500).send({message: "Could not delete Tutorial with id=" + tutorialId});
  });
}

// Send all published=1 tutorials to list.json so that they may be accessed via main public category list
exports.distribute = async (req, res) => {
  if (!isModerator(req)) {
    return res.status(400).send({message: "You do not have the access level to do that."});
  }
  try {
    await updateList();
    await Tutorial.update({published:2}, {where: { published: 1}})
    res.send({message: "All published tutorials now accessible via the public categories list."});
  } catch(e) {
    res.status(500).send({message: "Error writing flashcard json to s3. " + e.message});
  }
}

// via http request, get category object for use in client app
exports.getCategoriesJson = async (req, res) => {
  let categoryObj = await getCategoriesJson()
  res.send(categoryObj)
}

// get category object for use in client app
async function getCategoriesJson() {
  let categoryObj = {}
  let r = await Categories.findAll({raw:true})
  if (r.length) {
    for(let obj of r) {
      let catChildArr = await Categories.findAll({raw:true, where:{parentId:obj.id}})
      if (catChildArr.length) {
        categoryObj[obj.category] = []
        for(let i in catChildArr) {
          categoryObj[obj.category].push(catChildArr[i].category)
        }
      }
    }
  }
  return categoryObj
}

// get category object for use in fe admin forms
exports.getCategories= async (req, res) => {
  let categoryObj = {}
  let r = await Categories.findAll({raw:true, where:{parentId:0}})
  if (r.length) {
    for(let obj of r) {
      let catChildArr = await Categories.findAll({raw:true, where:{parentId:obj.id}})
      categoryObj[obj.id] = {id:obj.id, parentId:0, category:obj.category, childArr:catChildArr, categoryChildAdd:""}
    }
  }
  res.send(categoryObj)
}

exports.createCategory = (req, res) => {
  let parentId = req.body.parentId ? req.body.parentId : 0
  let category = req.body.category
  Categories.findOne({where: {category:category, parentId:parentId}})
    .then(r => {
      if (r) {
        res.status(400).send({ message: "Category '" + category + "' already exists."})
      } else {
        let obj = {category:category, parentId:parentId}
        Categories.create(obj).then(r => {
          let entity = r.get({plain:true})
          let newObj = {id:entity.id, category:entity.category, parentId:parentId}
          if (parentId === 0) {
            newObj.childArr = []
            newObj.childCategoryAdd = ""
          }
          res.send(newObj)
        })
      }
    })
}

exports.updateCategory = (req, res) => {
  let id = req.body.id ? req.body.id : 0
  let parentId = req.body.parentId ? req.body.parentId : 0
  let category = req.body.category
  Categories.update({category:category}, {
    where: { id: id, parentId: parentId}
  }).then(r => {
    res.sendStatus(200)
  })
}

exports.deleteCategory = (req, res) => {
  let id = req.body.id ? req.body.id : 0
  let parentId = req.body.parentId ? req.body.parentId : 0
  if (parentId >0 ) {
    // deleting a single child
    Categories.destroy({where:{parentId:parentId,id:id}}).then(r => {
      res.sendStatus(200)
    }).catch(e => {
      res.sendStatus(400)
    })
  } else {
    // deleting a parent and all of its children
    Categories.destroy({where:{[Op.or]: [{parentId: id}, {id: id}]}}).then(r => {
      res.sendStatus(200)
    }).catch(e => {
      res.sendStatus(400)
    })
  }
}

exports.deployCategoriesJson = async (req, res) => {

  if (!isModerator(req)) {
    return res.status(400).send({message: "You do not have the access level to do that."});
  }
  let categoryObj = await getCategoriesJson()
  return new Promise((resolve, reject) => {
    awsService.saveDataToS3(categoryObj, "categories.json")
      .then((r) => {
        res.status(200).send(resolve(r))
      }).catch(e => {
        res.status(400).send(reject(e))
      })
  })
}

exports.getHintCategoryArr = (req, res) => {

  HintCategories.findAll({order: [[Sequelize.literal("hint_categories.id"), 'ASC']]})
    .then(dataArr => {
      res.send(dataArr);
    }).catch(err => {
      res.status(500).send({message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}

exports.parseFile = async (req, res) => {
  let data = fs.readFileSync('multiplechoiceqanda2.txt', {encoding:'utf8', flag:'r'})
  data = data.replace(/.*2022 Digital Cloud Training ?\r\n/, "")
  let r = data.match(/QUESTION [0-9]+.*?\r\nAnswer: .*?\r\n+/sg)
  for (let i = 0; i < r.length; i++) {
    if (i === 0) continue;
    let block = r[i]
    block = block.replace(/QUESTION \d+ \r\n/, "")
    let x = block.match(/Select TWO/)
    if (x) {
      console.log("Select TWO", i)
continue
    } else {
      //continue
    }
    let answer = block.match(/(Answer: )([1-4]), ?([1-4])/)
    let answerLine = ""
    if (answer == null) {
      answer = block.match(/(Answer: )([1-4])/)
      //console.log("answer", answer[2])
      let str = new RegExp(answer[2] + ". .*")
      //console.log("regex str", str)
      answerLine = block.match(str)
      //console.log("answerLine", answerLine)
      //console.log("answer", answer[0])
      console.log("X----------")
    } else {
      console.log("Y----------")
      let str = new RegExp(answer[2] + ". .*")
      let answerLine = block.match(str) + "\r\n"
      str = new RegExp(answer[3] + ". .*")
      answerLine+= block.match(str)
      console.log("2 answers:\r\n", answerLine)
    }
    //block = block.replace(/Answer: .*/, "")
    //console.log(block)
    //console.log("answer", answer[2])
    //let str = new RegExp(answer[2] + ". .*")
    //console.log("regex str", str)
    //let answerLine = block.match(str)
    //console.log("answerLine", answerLine)
    //console.log("answer", answer[0])

    // console.log("----------")
    // const card = {
    //   question: block,
    //   answer: answerLine[0],
    //   tutorialId:65,
    //   published:1,
    //   hint:"",
    //   hintCategoryId:0
    // };
    //console.log("card", card)

    // Card.create(card)
    //   .then(data => {
    //     console.log("created", data)
    //   })
    //   .catch(err => {
    //     res.status(500).send({message:
    //         err.message || "Some error occurred while creating the card."
    //     });
    //   });

  }

  res.sendStatus(200)
}
const { authJwt } = require("../middleware");
const tutorialController = require('../controllers/tutorial.controller')

module.exports = app => {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const tutorialController = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  // TUTORIAL

  // MULTIPLE CHOICE
  router.get("/parsefile", tutorialController.parseFile);

  // Create a new Tutorial
  router.post("/", [authJwt.verifyToken], tutorialController.create);

  // Retrieve all Tutorials
  router.get("/", [authJwt.verifyToken], tutorialController.findAll);

  router.get("/my",[authJwt.verifyToken], tutorialController.findAll);

  // Retrieve all published Tutorials
  //router.get("/published", [authJwt.verifyToken], tutorialController.findAllPublished);

  // Get categories
  router.get("/getcategories", [authJwt.verifyToken], tutorialController.getCategories);

  router.post("/deletecategory", [authJwt.verifyToken], tutorialController.deleteCategory);

  // Create category
  router.post("/createcategory", [authJwt.verifyToken], tutorialController.createCategory)

  // Update category
  router.put("/updatecategory",[authJwt.verifyToken], tutorialController.updateCategory);

  // Get hint categories
  router.get("/gethintcategoryarr", [authJwt.verifyToken], tutorialController.getHintCategoryArr);

  // Push all published tutorials json to s3 so that is it accessible via the main public categories list
  router.get("/distribute",[authJwt.verifyToken], tutorialController.distribute);

  // Retrieve a single Tutorial with id
  router.get("/:id",[authJwt.verifyToken], tutorialController.findOne);

  // Update a Tutorial with id
  router.put("/:id",[authJwt.verifyToken], tutorialController.update);

  // Update a Tutorial publish status with id
  router.put("/publish/:id",[authJwt.verifyToken], tutorialController.publish);

  // Update the order in which the flashcards are presented
  router.put("/updateorder/:id",[authJwt.verifyToken], tutorialController.updateOrder);

  // Delete a Tutorial with id
  router.delete("/:id", [authJwt.verifyToken], tutorialController.delete);

  // CARD

  // Add a flashcard to a tutorial
  router.post("/addcard", [authJwt.verifyToken], tutorialController.addCard);

  // Retrieve all flashcards with given tutorial id
  router.get("/getcards/:id", [authJwt.verifyToken], tutorialController.getCards);

  //router.put("/updatecardpublishstatus/:tutorialId", [authJwt.verifyToken], tutorialController.updateCardPublishStatus);

  router.put("/updatecard/:tutorialId", [authJwt.verifyToken], tutorialController.updateCard);

  router.delete("/deletecard/:id", [authJwt.verifyToken], tutorialController.deleteCard);

  app.use('/api/tutorials', router);

};

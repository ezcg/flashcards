To zip flashcardsadminbe for elasticbeanstalk:
cd flashcards/flashcardsadminbe
zip -r ../flashcardsadminbe.zip * -x "vendor/*" ".git/*" "docker*" "node_modules*"

Using aws-cli
eb init
eb create -d prod --database --database.engine mysql --database.instance db.t3.micro --database.size 5 --elb-type application --keyname aws-eb --platform node.js --region us-west-1 --envvars ENVIRONMENT=prod

PUBLISH AND DISTRIBUTE

When you PUBLISH a flashcard set aka a tutorial, the tutorial gets written as json to an s3 bucket. The flashcards can
be used by calling the endpoint directly via the "Take" button in the /my section of the admin.
When you DISTRIBUTE  a tutorial, that tutorial then shows up and is accesible via the main directory listing of 
tutorials.

SETTING UP AN ENDPOINT

In controllers/tutorial.js create a function named appropriately. eg. exports.getHintCategoryArr = (req, res) => { }. 
Refer to existing functions in the same file to figure out database calls, responses, etc.
In routes/tutorial.routes.js copy an existing endpoint with the method you are looking to set up (eg. PUT, GET, etc) and
replace url segment with the name the flashcardsadminfe will be calling (eg. /gethintcategoryarr) and 
the function name with the function you created in controllers/tutorial.js. (eg. tutorialController.getHintCategoryArr)
See: router.get("/gethintcategoryarr", [authJwt.verifyToken], tutorialController.getHintCategoryArr);
Create your table(s) in the db as needed. Table names that have more than one word are separated by underscores. All lowercase.
Create a file in models for your tables. Copy an existing file in /models and rename and modify it as needed. 
In models/index.js, add the model to the 'db' object based on how the existing 'db' properties are. 
In controller/tutorials.js, add the model, eg. const HintCategories = db.hint_categories;

See flashcardsadminfe/README.md to see how to call the endpoint
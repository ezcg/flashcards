To zip flashcardsadminbe for elasticbeanstalk:
cd flashcards/flashcardsadminbe
zip -r ../flashcardsadminbe.zip * -x "vendor/*" ".git/*" "docker*" "node_modules*"

Using aws-cli
eb init
eb create -d prod --database --database.engine mysql --database.instance db.t3.micro --database.size 5 --elb-type application --keyname aws-eb --platform node.js --region us-west-1 --envvars ENVIRONMENT=prod

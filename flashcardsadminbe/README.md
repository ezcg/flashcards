To zip flashcardsadminbe for elasticbeanstalk:
cd flashcards/flashcardsadminbe
zip -r ../flashcardsadminbe.zip * -x "vendor/*" ".git/*" "docker*" "node_modules*"

Using aws-cli
eb init
eb create -d prod --database --database.engine mysql --database.instance db.t3.micro --database.size 5 --elb-type application --keyname aws-eb --platform node.js --region us-west-1 --envvars ENVIRONMENT=prod


--single

Create the environment with a single Amazon EC2 instance and without a load balancer.

Warning
A single-instance environment isn't production ready. If the instance becomes unstable during deployment, or Elastic Beanstalk terminates and restarts the instance during a configuration update, your application can be unavailable for a period of time. Use single-instance environments for development, testing, or staging. Use load-balanced environments for production.


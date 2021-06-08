## Set up

- Update all the config files located in flashcardsadminbe/app/config with values specific to your project.
- Create an s3 bucket to run as a static website. Use files in flashcards/flashcardsapp/s3aws as reference.
- Create a directory in the s3 bucket named json.
- Create an aws user with full permissions on the s3 bucket you just created.
- Update flashcardsadminbe/app/config/aws.config.js with users credentials and the bucketname.
- First time bringing up, after docker finishes setting everything up, on HOST machine, run: 
    docker exec -it dbflashcards bash -c "bash /app/init.sh"
    * I've had mysql crash and create a permission issue somehow that prevents it from being restarted. In that case, 
    I run: sudo rm -fr flashcards/mysql/docker
    * Be sure the case of the properties in db.config.js are correct for the environment. eg. devObj.user not devObj.USER
    * Note that mysql is accessible via port 3308, (not 3306) so as not to conflict with others. However, all calls to 
    db make use of the docker host name to access mysql. That is, assuming mysql-client is installed in be_admin 
    docker container,  mysql -uroot -proot --host=dbflashcards from inside be_admin docker container will connect 
    properly.  
- To give yourself the role of admin, update user table. (Once you log in with Google, you're automatically put into the user table). update users set role=7 where id = YOURID    
- As an admin that has created a flashcard tutorial, once you distribute it, you may need to clear your browser's cache to 
  view the flashcards in the app
    
See README.md in flashcardsadminbe for deploying admin backend to Beanstalk.    
See README.md in flashcardsapp for deploying to S3

http://localhost:8081 - frontend that calls the backend at http://localhost:8080
The app for training yourself with flashcards is at http://localhost:3000


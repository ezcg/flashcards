Login in with Google Identity and React v18.

Users can have roles with permissions: admin, moderator, user, banned.

**Set up google credentials for project.**

In the Credentials section of the Google Developer Console, create an OAuth Client ID credential of type Web Application.
https://console.developers.google.com/apis/credentials

**Update configs in /flashcardsadminbe/config/ directory.**

For each config.example.js file, create a new file but without the '.example' part in the file name. Eg. db.config.example.js becomes db.config.js.

Update the new files with your config values and do not commit to your repo. db.config.example.js should work without modification but for the file name change.

Set the values in auth.config.js to the values retrieved from Google credentials above.

**Update configs in /flashcardsadminfe/src/configs.js**

1. Rename configs.example.js file to configs.js and update the properties in it.

2. The ports set for dev.apiUrl and dev.apiAuthUrl should match the ports set in docker-compose

3. Set the google credentials that were set for the project above.

## Further Set up

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

If it is the first time doing docker-compose up, you'll need to initialize the db. Once docker-compose up has finished, open a new terminal window on your host machine. In the terminal, change into the s3OnlySite directory and paste the following command into the terminal and hit enter:
```
docker exec -it dbflashcards bash -c "cd /app && bash init.sh"
```
If you try and call the site in your browser before running the above db_init.sh command, you'll get an error like
(node:791) UnhandledPromiseRejectionWarning: #<Object> ...

Unless you do a destroy or build command, the database will persist in between your use of the app.

However, back up your data. To back up your data, on the host machine, open your command line terminal and change into the s3OnlySite  directory. Paste this into the terminal and hit enter:
```
docker exec -it dbflashcards bash -c "cd /app && bash dump.sh"
```


**Start it up**

* Open your terminal, cd to the root directory and run:

`docker-compose up`

* When it's done building, in a new terminal window, run:

`docker exec -it db bash -c "bash /mysql/docker_init_mysql.sh"`

* You can now view loginreactjs in the browser.

`Local: http://localhost:3000`

**Access the db**

On the host from the command line:

docker exec -it db bash

mysql -uroot -proot

show databases;

use login;

show tables;

select * from users\G

**ERRORS**

If you do docker-compose up and get an error like:

```
Creating network "loginreactjs_default" with the default driver
Building db
Traceback (most recent call last):
File "/usr/bin/docker-compose", line 11, in <module>
blah
blah 
blah
```

On the command line run where YOUR_WHO_AM_I is who you are running your shell as:

`sudo chown -R YOUR_WHO_AM_I:YOUR_WHO_AM_I .`

http://localhost:8081 - frontend that calls the backend at http://localhost:8080
The app for training yourself with flashcards is at http://localhost:3000






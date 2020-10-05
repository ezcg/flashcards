## Set up

Update all the config files located in flashcardsadminbe/app/config with values specific to your project.

- Create an s3 bucket to run as a static website. Use files in flashcards/flashcardsapp/s3aws as reference.
- Create a directory in the s3 bucket named json.
- Create an aws user with full permissions on the s3 bucket you just created.
- Update flashcardsadminbe/app/config/aws.config.js with users credentials and the bucketname.
- First time bringing up, after docker finishes setting everything up, on HOST machine, run: 
    docker exec -it dbflashcards bash -c "bash /app/init.sh"
- To give yourself the role of admin, update user table. (Once you log in with Google, you're automatically put into the user table). update users set role=7 where id = YOURID    
    
See README.md in flashcardsadminbe for deploying to Beanstalk.    

This is how you make a link in this readme. [push your change back to Bitbucket with SourceTree](https://confluence.atlassian.com/x/iqyBMg)

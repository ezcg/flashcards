#!/bin/bash

pathToSecurityRepo=/home/matt/PhpstormProjects/security/flashcardsadminbe
pathToFlashcardsAdminBe=/home/matt/PhpstormProjects/flashcards/flashcardsadminbe/app/config

printf "\n\nCopying auth.config.js, aws.config.js, db.config.js from outside and separate 'security' repo into flashcardsadminbe\n\n"
printf "Command:\n\ncp ${pathToSecurityRepo}/* ${pathToFlashcardsAdminBe}\n"

cp -r ${pathToSecurityRepo}/* ${pathToFlashcardsAdminBe}

printf "\n\nDone\n\n"

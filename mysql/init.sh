#!/bin/bash

. /app/base.sh

printf "\n\nOperating on db $DB \n\n"

mysql -u${USER} -p${PASSWORD} < ${DB}_structure.sql
mysql -u${USER} -p${PASSWORD} < ${DB}_data.sql

printf "\n\nDone\n\n"
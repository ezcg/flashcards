#!/bin/bash

. /app/base.sh

mysql -u${USER} -p${PASSWORD} < ${DB}_structure.sql
mysql -u${USER} -p${PASSWORD} < ${DB}_data.sql

#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

TARGET=$( pwd )/$1
echo $TARGET | grep "//" > /dev/null && TARGET=$1
(cd $DIR; exec ./app.js  $TARGET $2)

#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

TARGET=$( pwd )/
(cd $DIR; exec ./app.js  $TARGET$1 $2)

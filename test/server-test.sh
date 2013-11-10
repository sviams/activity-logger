#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Jasmine-Node for server side tests"
echo "-------------------------------------------------------------------"

jasmine-node $BASE_DIR/unit/server/

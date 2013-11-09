#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Protractor and Selenium for E2E tests..."
echo "-------------------------------------------------------------------"

protractor $BASE_DIR/../config/protractor-e2e.conf.js


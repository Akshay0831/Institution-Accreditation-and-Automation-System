#!/bin/bash

backend_path="$( cd "$(dirname "$0")"/backend && pwd )"
frontend_path="$( cd "$(dirname "$0")"/frontend && pwd )"

echo Installing backend dependencies...
cd $backend_path
npm install
echo Starting backend server...
x-terminal-emulator -e npm start

echo Installing frontend dependencies...
cd $frontend_path
npm install
echo Starting frontend app...
x-terminal-emulator -e npm start

echo App initialized and running!
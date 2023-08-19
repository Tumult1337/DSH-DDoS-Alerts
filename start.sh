#!/bin/bash

# Check if screen is already installed
if ! command -v screen &>/dev/null; then
    echo "Installing screen..."
    sudo apt-get update
    sudo apt-get install screen -y
fi
# Start a new screen session named "alerts" and run alerts.js
screen -dmS alerts bash -c "node alerts.js"
echo "Screen session 'alerts' started with alerts.js"

#! /usr/bin/env bash

# set up environment variable defaults
if [[ -z "$SPOILERBOT_DB_DIR" ]]; then
  SPOILERBOT_DB_DIR="/data/spoilerbot/db"
fi 

# make sure that the host db directory exists
sudo mkdir -p $SPOILERBOT_DB_DIR

# run mongo db container
sudo docker run -d --name mongodb -v $SPOILERBOT_DB_DIR:/data/db mongo:3.1

#!/bin/bash

read -p "Are you sure? You are going to wipe all stock data! [y/N]" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff

    # config vars
    timestamp=1420070400     #timestap of Jan 1, 2015

    # kill all node instances brutally
    killall node

    # start new node instance and save pid
    node index.js&
    pid=$!
    sleep 3

    # delete old stock datasets
    mongo fimatech --eval "printjson(db.stockhistos.drop())"

    # call node endpoints
    while read p; do
	p=`echo $p | awk 'BEGIN{FS=","} {print $2}'`;
	
	path='localhost:8080/api/feed/'$p'/'$timestamp;
	echo $path
	curl $path
	echo
    done <../shared/companies.csv

    sleep 30

    kill $pid

fi

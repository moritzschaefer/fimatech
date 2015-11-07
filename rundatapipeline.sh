#!/bin/bash

./articlefetcher/main.py
./stockdb/load_company_stock_data.sh -y
# ./sentimentanalysis/analyse_sentiment.py
./dataanalytics/main.py

echo "Done"

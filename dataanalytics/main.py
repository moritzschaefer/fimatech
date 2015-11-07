#!/usr/bin/env python3
import json
import logging

from lib import process_company

from pymongo import MongoClient
import numpy as np


MONGO_CONF_FILE = '../shared/mongoconf.json'
COMPANIES_CSV = '../shared/companies.csv'

with open(MONGO_CONF_FILE) as f:
    MONGO_CONF = json.load(f)

def read_companies(companies_file = COMPANIES_CSV):
    with open(companies_file) as f:
        return [s.strip().split(',') for s in f.readlines()]

def get_stock_data(db, symbol):
    """ Returns from mongodb
    :returns: stock_data for given company. format: numpy array with columns for date (timestamp) and value
    """
    return list(db.stockhistos.find({'symbol': symbol}))

def get_articles(db, company):
    """ Return articles as numpy array from mongodb

    :returns: numpy array with columns for 'url', 'title', 'company', 'newspaper', 'publication_timestamp'

    """
    return list(db.articles.find({'company': company}))


def put_newspaper_data(db, company, newspapers_data):
    results = db.newspapers.insert_many(newspapers_data)


def main():
    # TODO get data from library one company at a time, do data processing and write data to the mongodb
    client = MongoClient("mongodb://{host}:{port}".format(**MONGO_CONF))
    db = client[MONGO_CONF['database']]

    # wipe all calculated data
    db.newspapers.drop()

    for company, symbol in read_companies():
        # get data for company
        stock_data = get_stock_data(db, symbol)
        articles = get_articles(db, company)

        try:
            newspapers_data = process_company(company, stock_data, articles)
        except ValueError as e:
            logging.fatal('ValueError: {}: {}'.format(company, e))
            continue
        else:
            put_newspaper_data(db, company, newspapers_data)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    main()


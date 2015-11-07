from lib import process_company

from pymongo import MongoClient
import numpy as np

# GET MONGO_CONF from conf..

COMPANIES_CSV = '../shared/companies.csv'

def read_companies(companies_file = COMPANIES_CSV):
    with open(companies_file) as f:
        return [s.strip() for s in f.readlines()]

def get_stock_data(db, company):
    """ Returns from mongodb
    :returns: stock_data for given company. format: numpy array with columns for date (timestamp) and value
    """
    return db.stockhistos.find({'symbol': company})

def get_articles(db, company):
    """ Return articles as numpy array from mongodb

    :returns: numpy array with columns for 'url', 'title', 'company', 'newspaper', 'publication_timestamp'

    """
    return db.articles.find({'company': company})


def put_newspaper_data(db, company, newspapers_data):


    results = db.newspapers.insert_many(newspapers_data)


def main():
    # TODO get data from library one company at a time, do data processing and write data to the mongodb
    client = MongoClient("mongodb://{host}:{port}".format(**MONGO_CONF))
    db = client[MONGO_CONF['database']]


    for company in read_companies():
        # get data for company
        stock_data = get_stock_data(db, company)
        articles = get_articles(db, company)

        newspapers_data = process_company(stock_data, articles)
        put_newspaper_data(db, company, newspapers_data)

if __name__ == '__main__':
    main()



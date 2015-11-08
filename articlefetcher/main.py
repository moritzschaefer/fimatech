#!/usr/bin/env python3
import urllib
import logging
import json
import sys
import random

import requests
from pymongo import MongoClient
import arrow

from conf import ALCHEMY_API_KEYS, MONGO_CONF_FILE, BASE_QUERY, COMPANIES_CSV

# get list of companies
#
# make requests for every company
#
# feed to mongodb
#
# PROBLEMS:
# - pagination ? (just call next). how many articles max per company? (10000 would mean)
# -

def get_companies(filename=COMPANIES_CSV):
    """ Loads csv and reads companies

    :filename: csv file with companies
    :returns: list of company names

    """

    with open(filename) as f:
        companies = f.readlines()

    return [company.strip().split(',')[0] for company in companies]

def pull_company_articles(company):
    """ Pulls article from alchemyAPI

    :company: company to fetch articles for
    :returns: list of article objects

    """
    MAX_COUNT = 20  # go to conf
    WISH_COUNT = 15
    positive_count, total_count = 0, 0
    try:
        del value_next
    except UnboundLocalError:
        pass
    docs = []

    while positive_count < WISH_COUNT and total_count < MAX_COUNT:
        apikey = random.choice(ALCHEMY_API_KEYS)
        formatted_query = BASE_QUERY.format(apikey=apikey, company=urllib.parse.quote_plus(company))
        try:
            formatted_query_next = formatted_query + '&next={}'.format(value_next)
        except UnboundLocalError:
            formatted_query_next = formatted_query
        response = requests.get(formatted_query_next).json()

        try:
            docs.extend(response['result']['docs'])
        except KeyError:
            logging.info('Didn\'t succeed fetching URL')
            pass
        else:
            logging.info('Succeeded fetching URL')
            positive_count += 1
            try:
                value_next = response['result']['next']
            except KeyError:
                logging.warn('API ran out of value for company {}'.format(company))
                return docs

            with open('raw_{}.json'.format(arrow.now().timestamp), 'w') as f:
                json.dump(response, f)
        total_count += 1

    return docs

def prepare_articles(company, articles):
    """ Prepare object array so it can be put into mongodb directly

    :articles: list of objects of articles
    :returns: prepared (filtered and selected) list of objects of articles
    """

    # 1. use source.enriched.url.publicationDate.date(20151005T000000) if available, else use 'timestamp'
    # 2. url: source.enriched.url.url
    # 3. title: source.enriched.url.title
    # 4. company name
    # 5. News article page name extracted from url (basicly ownly basename domain (extracted from url))

    def prepare_article(company, article):
        try:
            data = article['source']['enriched']['url']
        except KeyError as e:
            logging.warn('API Error. Missing data: {}'.format(e))
            return None
        try:
            publication_date = arrow.get(data['publicationDate']['date'], 'YYYYMMDDTHHmmss')
        except Exception: # ParserError: # TODO: find import..
            publication_date = arrow.get(article['timestamp'])

        return {
                'url': data['url'],
                'title': data['title'],
                'company': company,
                'newspaper': urllib.parse.urlparse(data['url']).netloc,
                'publication_timestamp': publication_date.timestamp
                }

    # TODO should we filter out values (for example the ones without publicationDate)??

    return filter(None, [prepare_article(company, article) for article in articles])


def put_company_articles(company, articles):
    """ Puts articles for a given company into mongodb

    :company: company which associates to the articles
    :articles: array of article objects to be put

    """

    with open(MONGO_CONF_FILE) as f:
        mongo_conf = json.load(f)
    client = MongoClient("mongodb://{host}:{port}".format(**mongo_conf))
    db = client[mongo_conf['database']]

    results = db.articles.insert_many(articles)


def main():
    companies = get_companies()

    for company in companies:
        articles = pull_company_articles(company)

        prepared_articles = prepare_articles(company, articles)

        put_company_articles(company, prepared_articles)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    main()

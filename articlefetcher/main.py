import urllib
import logging
import json

import requests
from pymongo import MongoClient
import arrow

from conf import ALCHEMY_API_KEY, MONGO_CONF_FILE, BASE_QUERY, COMPANIES_CSV

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
    formatted_query = BASE_QUERY.format(apikey=ALCHEMY_API_KEY, company=urllib.parse.quote_plus(company))
    logging.debug('Fetching URL: {}'.format(formatted_query))



    # TODO: use "next" parameter to add more values

    response = requests.get(formatted_query).json()
    return response['result']['docs']

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
        data = article['source']['enriched']['url']
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

    return [prepare_article(company, article) for article in articles]


def put_company_articles(company, articles):
    """ Puts articles for a given company into mongodb

    :company: company which associates to the articles
    :articles: array of article objects to be put

    """

    with open(MONGO_CONF_FILE) as f:
        mongo_conf = json.load(f)
    client = MongoClient("mongodb://{host}:{port}".format(**mongo_conf))
    db = client[MONGO_CONF['database']]

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

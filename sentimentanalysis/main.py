#!/usr/bin/env python3
import json
import logging
import sys

from pymongo import MongoClient

from analyse_sentiment import format_article

MONGO_CONF_FILE = '../shared/mongoconf.json'

# - Fetch all articles
# - One by one run format_article and update it..


def main():
    with open(MONGO_CONF_FILE) as f:
        mongo_conf = json.load(f)
    client = MongoClient("mongodb://{host}:{port}".format(**mongo_conf))
    db = client[mongo_conf['database']]

    articles = db.articles.find({'sentiment_text': {'$exists': False}})

    for article in articles:
        try:
            sentiment_text = format_article(article['url'])
        except RuntimeError:
            logging.fatal('Couldnt get sentiment for url {}'.format(article['url']))
            continue
        else:
            if not db.articles.update({'_id': article['_id']}, {'$set': {'sentiment_text': sentiment_text}}):
                logging.warn('Couldn\'t update article with id {}'.format(article['_id']))

def localmain(url):
    try:
        sentiment_text = format_article(url)
        return json.dumps({'error': '', 'text': sentiment_text})
    except RuntimeError:
        return json.dumps({'error': 'Error fetching URL', 'text': ''})



if __name__ == '__main__':
    if len(sys.argv) > 1:
        print(localmain(sys.argv[1]))
    else:
        logging.basicConfig(level=logging.INFO)
        main()

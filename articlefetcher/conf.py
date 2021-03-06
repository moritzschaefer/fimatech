ALCHEMY_API_KEYS = ['96a5bad2b00632a91fe71780b174da374345e82d',
                    'e11b162c82eca5751f18b9681b8d73a12763e113',
                    'cd622c47752c7958394563711bba14943b3f7142',
                    '200ad25f8ac57df7637c7112470b6f3bc1e49b36',
                    '62ce8a2efbb4ed3ade324144560117545b19e817',
                    '1ff0064a6c8b52f9b88a657d716367b76bdebaa6']

BASE_QUERY = 'https://access.alchemyapi.com/calls/data/GetNews?apikey={apikey}&return=enriched.url.title,enriched.url.url,enriched.url.author,enriched.url.publicationDate&start=1443657600&end=1446937200&q.enriched.url.enrichedTitle.entities.entity=|text={company},type=company|&count=500&outputMode=json' # TODO: increase count, maxResults?

COMPANIES_CSV = '../shared/companies.csv'
MONGO_CONF_FILE = '../shared/mongoconf.json'

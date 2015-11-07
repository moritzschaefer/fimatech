

ALCHEMY_API_KEY = '96a5bad2b00632a91fe71780b174da374345e82d'
ALCHEMY_API_KEY = 'e11b162c82eca5751f18b9681b8d73a12763e113'
ALCHEMY_API_KEY = '1ff0064a6c8b52f9b88a657d716367b76bdebaa6'

BASE_QUERY = 'https://access.alchemyapi.com/calls/data/GetNews?apikey={apikey}&return=enriched.url.title,enriched.url.url,enriched.url.author,enriched.url.publicationDate&start=1441929600&end=1446937200&q.enriched.url.enrichedTitle.entities.entity=|text={company},type=company|&count=25&outputMode=json' # TODO: increase count, maxResults?

COMPANIES_CSV = '../shared/companies.csv'
MONGO_CONF_FILE = '../shared/mongoconf.json'

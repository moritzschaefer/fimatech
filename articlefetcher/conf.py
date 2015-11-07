MONGO_CONF = {
        'host': 'localhost',
        'port': 27017,
        'database': 'fimatech'
        }

ALCHEMY_API_KEY = '96a5bad2b00632a91fe71780b174da374345e82d'
ALCHEMY_API_KEY = 'e11b162c82eca5751f18b9681b8d73a12763e113'

BASE_QUERY = 'https://access.alchemyapi.com/calls/data/GetNews?apikey={apikey}&return=enriched.url.title,enriched.url.url,enriched.url.author,enriched.url.publicationDate&start=1441929600&end=1446937200&q.enriched.url.enrichedTitle.entities.entity=|text={company},type=company|&count=25&outputMode=json' # TODO: increase count, maxResults?

COMPANIES_CSV = '../shared/companies.csv'

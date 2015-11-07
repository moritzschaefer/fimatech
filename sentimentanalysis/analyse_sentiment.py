from simplejson import loads
from urllib2 import urlopen, quote
HAVEN_API_KEY = "e3118bd3-75ea-4d29-ad0e-81bcfe4850c4"
HAVEN_BASE_URL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1?text={text}&apikey={apikey}"

def analyse_sentiment(text):
    response = urlopen(HAVEN_BASE_URL.format(text=quote(text), apikey=HAVEN_API_KEY)).read()
    return loads(response)



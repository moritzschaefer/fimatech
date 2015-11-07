
from simplejson import loads
from urllib import request, parse
#pip3 install newspaper3k
from newspaper import Article
HAVEN_API_KEY = "e3118bd3-75ea-4d29-ad0e-81bcfe4850c4"
HAVEN_BASE_URL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1?text={text}&apikey={apikey}"

#Takes a string array as input and sends a request to Haven for each element and returns an array of json structures
def get_sentiment_data(text_array):
    sentiment_list = []
    for para in text_array:
        response = request.urlopen(HAVEN_BASE_URL.format(text=parse.quote(para), apikey=HAVEN_API_KEY)).read()
        sentiment_list.append(loads(response))
    return sentiment_list

#Returns an array of text fragments from the article URL
def get_article_data(url):
    article = Article(url)
    article.download()
    article.parse()
    return article.text.split('\n\n')

#Takes an array of json data as input(which is from the retval of get_sentiment_data()
#Returns a single float factor that represents positive connotation if bias factor >0 and
#negative if bias factor < 0
def get_bias(sentiment_data_list):
    bias = 0
    for sentence_sentiment in sentiment_data_list:
        if sentence_sentiment['positive']:
            #Sentence is positive
            bias += sentence_sentiment['aggregate']['score']
        if sentence_sentiment['negative']:
            #Sentence is negative
            bias += sentence_sentiment['aggregate']['score']
    return bias
    


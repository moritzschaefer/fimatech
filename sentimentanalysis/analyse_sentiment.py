import logging
from simplejson import loads
from urllib import request, parse
import urllib
#pip3 install newspaper3k
from newspaper import Article, article
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
#Returns an array of sentiment factors ranging from -1 to +1, corresponding to each element in the text array(as above)
def get_bias(sentiment_data_list):
    bias = []
    for i in range(len(sentiment_data_list)):
        bias.append( sentiment_data_list[i]['aggregate']['score'])
    return bias

#Just need to run this function
def format_article(url):
    try:
        text = get_article_data(url)
        sentiments = get_sentiment_data(text)
    except (article.ArticleException, urllib.error.HTTPError):
        raise RuntimeError('Error fetching article')

    bias = get_bias(sentiments)
    rms_bias = 0
    for i in bias:
        rms_bias += i**2
    rms_bias /= len(bias)
    rms_bias = rms_bias ** 0.5

    formatted_article = ""

    for i in range(len(bias)):
        if bias[i] > rms_bias:
            formatted_article += "\n[["+text[i]+"]]\n"
        elif bias[i] < -rms_bias:
            formatted_article += "\n{{"+text[i]+"}}\n"
        else:
            formatted_article += (text[i])
    return formatted_article


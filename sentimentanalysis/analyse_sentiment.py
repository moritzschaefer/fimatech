import logging
from simplejson import loads
from urllib import request, parse
#pip3 install newspaper3k
from newspaper import Article
HAVEN_API_KEY = "e3118bd3-75ea-4d29-ad0e-81bcfe4850c4"
HAVEN_BASE_URL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1?text={text}&apikey={apikey}"

#Takes a string  input and sends a request to Haven returning a json structure
def get_sentiment_data(text):
    response = request.urlopen(HAVEN_BASE_URL.format(text=parse.quote(text), apikey=HAVEN_API_KEY)).read()
    return loads(response)
    
#Returns an array of text fragments from the article URL
def get_article_data(url):
    article = Article(url)
    article.download()
    article.parse()
    return article.text

#Takes an array of json data as input(which is from the retval of get_sentiment_data()
#Returns an array of sentiment factors ranging from -1 to +1, corresponding to each element in the text array(as above)
def get_bias(sentiment_data_list):
    bias = []
    for i in range(len(sentiment_data_list)):
        bias.append( sentiment_data_list[i]['aggregate']['score'])
    return bias

#Just need to run this function
def format_article(url):
    #Create article from link
    #Download and parse article
    text = get_article_data(url)
    
    #Get sentiment data of entire text
    sentiment = get_sentiment_data(text)
    #Split text
    text = text.split('\n\n')
    
    #For all the negative 'original texts' filter through the text and find the appropriate sentences to match, add brackets to them
    for negative in sentiment['negative']:
        match = negative['original_text']
        print (match)
        for i in range(len(text)):
            if match in text[i] and (text[0] != '[' or text[0] != '{' ):
                text[i] = "{"+text[i]+"}"
    #Same for positive
    for positive in sentiment['positive']:
        match = positive['original_text']
        for i in range(len(text)):
            if match in text[i] and (text[0] != '[' or text[0] != '{' ):
                text[i] = "["+text[i]+"]"
    #combine the text array back into a single block of text and return
    return ''.join(text)

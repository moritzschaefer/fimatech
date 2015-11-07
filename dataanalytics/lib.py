import math

import numpy as np
import pandas as pd

def _get_stock_data_around_timestamp(timestamp, stock_data, interval=3600*24): # TODO: make this bigger
    """ Returns the datapoints in stock_data which are in the interval timestamp-interval:timestamp+interval
    :timestamp: the timestamp around we want the stock data
    :stock_data: array with timed stock data values
    :interval: seconds to include data points
    """
    return stock_data[np.logical_and(stock_data['timestamp']+interval>timestamp, stock_data['timestamp']-interval < timestamp)]

def _calculate_cc(article, stock_data):
    """Calculates correlation coefficient between article and stock data
    :stock_data: The stock data in the interesting time interval
    """
    interesting_stock_data = _get_stock_data_around_timestamp(article['publication_timestamp'], stock_data)

    if len(interesting_stock_data) == 0:
        return None

    A = np.vstack([interesting_stock_data['timestamp'], np.ones(len(interesting_stock_data['timestamp']))]).T

    try:
        m, c = np.linalg.lstsq(A, interesting_stock_data['open'])[0] # TODO: should we divide this through the value of the stock? actually i think yes because percentage is more interesting than absolute values.. In the end both works..
    except ValueError:
        import ipdb; ipdb.set_trace()


    # import matplotlib.pyplot as plt
    # y = interesting_stock_data['open']
    # x = interesting_stock_data['timestamp']
    # plt.plot(x, y, 'o', label='Original data', markersize=10)
    # plt.plot(x, m*x + c, 'r', label='Fitted line')
    # plt.legend()
    # plt.show()

    return m

def process_company(company, stock_data, articles):
    """ Processes the articles for given company and returns a list of newspapers with according calculated values. check README.md for more information

    :company: name of the company to be used
    :stock_data: stock_data for given company. format: numpy array with columns for date (timestamp) and value
    :articles: numpy array with columns ['url', 'title', 'company', 'newspaper', 'publication_timestamp'] for given !company!
    :returns: list of newspapers-dicts with according values for max, best and worst impact

    """

    stock_data_df = pd.DataFrame(stock_data)
    articles_df = pd.DataFrame(articles, columns=['url', 'title', 'company', 'newspaper', 'publication_timestamp'])
    if len(articles_df) == 0:
        raise ValueError('articles must not be empty')
    articles_df['cc'] = articles_df.apply(lambda article: _calculate_cc(article, stock_data_df), axis=1)
    articles_df = articles_df[np.logical_not(np.isnan(articles_df['cc']))]
    newspapers = []
    for newspaper, group in articles_df.groupby('newspaper'):
        # TODO: maybe calculate best and worst differently (without filtering, square without losing sign)
        best_impact = math.sqrt(sum([cc**2 for cc in group[group['cc'] > 0]['cc']]))
        worst_impact = math.sqrt(sum([cc**2 for cc in group[group['cc'] < 0]['cc']]))
        max_impact = math.sqrt(sum([cc**2 for cc in group['cc']]))

        newspapers.append({
            'newspaper': newspaper,
            'best_impact': best_impact,
            'worst_impact': worst_impact,
            'max_impact': max_impact,
            'company': company
            })

    return newspapers


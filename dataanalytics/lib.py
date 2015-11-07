import numpy as np
import pandas as pd

def _get_stock_data_around_timestamp(timestamp, stock_data, interval=3600*8):
    """ Returns the datapoints in stock_data which are in the interval timestamp-interval:timestamp+interval
    :timestamp: the timestamp around we want the stock data
    :stock_data: array with timed stock data values
    :interval: seconds to include data points
    """
    return stock_data[np.logical_and(stock_data['timestamp']+interval<timestamp, stock_data['timestamp']-interval < timestamp)]

def _calculate_cc(article, stock_data):
    """Calculates correlation coefficient between article and stock data
    :stock_data: The stock data in the interesting time interval
    """
    interesting_stock_data = _get_stock_data_around_timestamp(article['timestamp'], stock_data)

    A = np.vstack([interesting_stock_data['timestamp'], np.ones(len(x))]).T

    m, c = numpy.linalg.lstsq(A, interesting_stock_data['value'])[0] # TODO: should we divide this through the value of the stock? actually i think yes because percentage is more interesting than absolute values.. In the end both works..


    # TODO plot like here: http://docs.scipy.org/doc/numpy/reference/generated/numpy.linalg.lstsq.html#numpy.linalg.lstsq to control..
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
    articles_df['cc'] = articles_df.apply(lambda article: _calculate_cc(articles_df, stock_data_df), axis=1)
    newspapers = pd.DataFrame(columns=['newspaper', 'max_impact', 'best_impact', 'worst_impact'])
    for newspaper, group in articles_df.groupby('newspaper'):
        # TODO: maybe calculate best and worst differently (without filtering, square without losing sign)
        best_impact = sqrt(sum([cc**2 for cc in group[group['cc'] > 0]['cc']]))
        worst_impact = sqrt(sum([cc**2 for cc in group[group['cc'] < 0]['cc']]))
        max_impact = sqrt(sum([cc**2 for cc in group['cc']]))
        newspapers.append(Series({
            'newspaper': newspaper,
            'best_impact': best_impact,
            'worst_impact': worst_impact,
            'max_impact': max_impact,
            'company': company
            }))

    return list(newspapers.apply(lambda s: s.to_dict()))


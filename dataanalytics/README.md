# This is

This is the code for creating the ranking of newspapers for a given company.

## Input

This works as a library and gets as inputs python arrays (or numpy arrays):

- company: The name of the company to process
- stock_data: a numpy 2d array, with values for timestamp and value

## How

We have stock data for all companies. We have a list of articles with attributes date and company. For every company we do:

- fetch all articles for a given company
- for every article we look at the stock for the given company in a period around the date of the article. We analyze the correlation between article and stock data (linear regression). This correlation C is the base for the score of the newspaper of the article.
- we group all article with their values C by newspaper and compute on each group. Three values:
  - maximum impact: sqrt(sum(C**2 for C in AllarticlesCs))
  - best impact: sqrt(sum(C**2 for C in AllarticlesCs if C > 0))
  - worst impact: sqrt(sum(C**2 for Cin AllarticlesCs if C < 0))

- After this process we have data like this: for every company a list of newspapers with three scores each: max impact, best impact, worst impact


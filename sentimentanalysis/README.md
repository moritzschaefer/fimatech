#Set-up Guide

##Installing Dependencies
###SimpleJSON:
pip3 install simplejson

###[Newspaper]:(https://github.com/codelucas/newspaper)
Requires python3
####Debian/Ubuntu:
sudo apt-get install libxml2-dev libxslt-dev libjpeg-dev zlib1g-dev libpng12-dev
pip3 install newspaper3k
curl https://raw.githubusercontent.com/codelucas/newspaper/master/download_corpora.py | python3
####OSX
brew install libxml2 libxslt
brew install libtiff libjpeg webp little-cms2
pip3 install newspaper3k
curl https://raw.githubusercontent.com/codelucas/newspaper/master/download_corpora.py | python3 



import urllib.request
import re

def crawl(url, depth, keyword):	
	if (depth <= 0):
		return
	page = urllib.request.urlopen(url);	
	pageContent = page.read();
	match = re.search(keyword ,pageContent.decode('utf-8'));
	if (match):
		print(url);

crawl('http://www.hackernews.com', 5, 'python')
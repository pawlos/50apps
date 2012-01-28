import httplib
import urllib2
from urlparse import urlparse
from urlparse import urljoin
import sys
import re

visitedUrls = []

def crawl(url, depth, keyword, substring = ''):		
	"""crawls web page, finds all links and check them recurevly"""
	if (depth < 0):
		return
		
	if ('http' not in url):
		url = 'http://'+url	
		
	visitedUrls.append(url)
	
	address = urlparse(url)		
	#print(address)
	connection = httplib.HTTPConnection(address[1])	
	request = connection.request("GET", address[2]+address[3])
	response = connection.getresponse();
	if response.status in (301,302,):
		#handle redirects				
		url = urljoin(url, response.getheader('location', ''))		
		crawl(url, depth-1, keyword, substring) #should it be one level deeper?
		return
	
	content = response.read()		
	connection.close()
	#check if page content contains our keword
	matches = re.findall(b'href="http://(.+?)"', content)		
	if re.search(keyword.encode(), content):
		if (len(substring) == 0) or (substring in url):
			print '--> Keyword ',keyword,' found on: ', url
			
	#spawn more crawlers
	for href in matches:
		pageToVisit = href.decode()		
		if (pageToVisit not in visitedUrls):
			crawl(pageToVisit, depth-1,keyword, substring)			
			
crawl('http://www.wp.pl', 3, 'sport')
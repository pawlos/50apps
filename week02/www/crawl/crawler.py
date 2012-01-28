import httplib
import urllib2
from urlparse import urlparse
from urlparse import urljoin
import sys
import re

visitedUrls = []

def crawl(url, depth, keyword, urls):		
	"""crawls web page, finds all links and check them recurevly"""
	if depth < 0:
		return
		
	if 'http' not in url:
		url = 'http://'+url	
	if url in visitedUrls:
		return
	
	visitedUrls.append(url)
	print 'crawling: ' + url
	
	address = urlparse(url)			
	
	try:
		#print(address)
		connection = httplib.HTTPConnection(address[1])	
		request = connection.request("GET", address[2]+address[3])
		response = connection.getresponse();
		if response.status in (301,302,):
			#handle redirects				
			url = urljoin(url, response.getheader('location', ''))		
			crawl(url, depth-1, keyword, urls) #should it be one level deeper?		
	
		content = response.read()		
		connection.close()
		#check if page content contains our keword
		matches = re.findall(b'href="http://(.+?)"', content)	
		if re.search(keyword.encode(), content):
			print 'found ' + keyword + ' on page ' + url
			urls.append({'url': url, 'depth': depth})
				
		if depth == 0:
			return
		print 'Found ', len(matches), ' additional links'
		#spawn more crawlers
		for href in matches:
			pageToVisit = href.decode()		
			if pageToVisit not in visitedUrls:
				crawl(pageToVisit, depth-1,keyword, urls)
	except:
		print sys.exc_info()[0]
		pass
import http.client
import urllib.parse
import sys
import re

startUrl = 'http://www.hackernews.net'
depth = 2
keyword = 'python'
substringInUrl = ''

visitedUrls = []

def crawl(url, depth, keyword, substring = ''):		
	"""crawls web page, finds all links and check them recurevly"""
	if (depth < 0):
		return
		
	if ('http' not in url):
		url = 'http://'+url
	#print('Checking page (',depth,'):', url)	
		
	visitedUrls.append(url)
	
	address = urllib.parse.urlparse(url)		
	#print(address)
	connection = http.client.HTTPConnection(address[1])	
	request = connection.request("GET", address[2]+address[3])
	response = connection.getresponse();
	if response.status in (301,302,):
		#handle redirects				
		url = urllib.parse.urljoin(url, response.getheader('location', ''))		
		crawl(url, depth-1, keyword, substring) #should it be one level deeper?
		return
	
	content = response.read()		
	connection.close()
	#check if page content contains our keword
	matches = re.findall(b'href="http://(.+?)"', content)		
	if re.search(keyword.encode(), content):
		if (len(substring) == 0) or (substring in url):
			print('--> Keyword ',keyword,' found on: ', url)	
			
	#spawn more crawlers
	for href in matches:
		pageToVisit = href.decode()		
		if (pageToVisit not in visitedUrls):
			crawl(pageToVisit, depth-1,keyword, substring)			
			
if (len(sys.argv) > 1):
	startUrl = sys.argv[1]
if (len(sys.argv) > 2):
	depth = int(sys.argv[2])
if (len(sys.argv) > 3):
	keyword = sys.argv[3]
if (len(sys.argv) > 4):
	substringInUrl = sys.argv[4]
	
crawl(startUrl, depth, keyword, substringInUrl)
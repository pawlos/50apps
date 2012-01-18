import urllib.request
import html.parser
import http.client
import re
from bs4 import BeautifulSoup

visitedUrls = []

def crawl(url, depth, keyword, substring = ''):		
	"""crawls web page, finds all links and check them recurevly"""
	if (depth <= 0):
		return
	print('Checking page (',depth,'): ', url)
	visitedUrls.append(url)
				
	try:
		#get page
		page = urllib.request.urlopen(url)
		soup = BeautifulSoup(page.read())			
		#check if page content contains our keword
		if (soup.find(text=re.compile(keyword))):
			#print(substring, url)
			if ((len(substring) == 0) or (url.contains(substring))):
				print('-->', url)	
		#find links on the page	
		anchors = soup.findAll('a', href=not '')		
		#spawn more crawlers
		for a in anchors:		
			#print(a)
			if (not a['href'].startswith('http')):
				continue
			if (a['href'] in visitedUrls):
				continue
			crawl(a['href'], depth-1,keyword, substring)
	except KeyboardInterrupt:
		print("Breaking...")
		sys.exit(-1)
		return
	except:
		return

crawl('http://www.hackernews.com', 5, 'python', substring='hackernews')
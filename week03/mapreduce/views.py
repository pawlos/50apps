from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader
import urllib2
import logic
import re
import BeautifulSoup
import dehtml

def mapReduce(request):	
	t = loader.get_template('mapreduce.html')
	c = Context()
	c.update(csrf(request))
	if request.method == 'POST':		
		url = request.POST['url']		
		content = urllib2.urlopen(url).read()
		soup = BeautifulSoup.BeautifulSoup(content)		
		text = dehtml.strip_tags(soup.body.prettify())
		text = re.sub(r"[ \t\v]+", " ", text)
		list = text.split(' ')		
		occurences = logic.findOccurence(list)
		shortest = logic.findShortest(list)
		longest = logic.findLongest(list)
		c['occurences'] = occurences
		c['shortest'] = shortest.popitem()[0]
		c['longest'] = longest.popitem()[0]
		c['maxOccurance'] = max(occurences.values())
	return render_to_response('mapreduce.html',c)
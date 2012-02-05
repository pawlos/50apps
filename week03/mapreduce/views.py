from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader
import urllib2
import logic
import re
import BeautifulSoup
import dehtml
import operator

def mapReduce(request):	
	t = loader.get_template('mapreduce.html')
	c = Context()
	c.update(csrf(request))
	if request.method == 'POST':		
		url = request.POST['url']		
		content = urllib2.urlopen(url).read()
		soup = BeautifulSoup.BeautifulSoup(content)		
		text = dehtml.strip_tags(soup.body.prettify())
		text = re.sub(r"[\s\t\v]+", " ", text)
		text = re.sub(r"\n|\r|", "", text)
		list = filter(logic.filterNonWords, text.split(" "))
		occurences = logic.findOccurence(list)
		print list
		top10 = sorted(occurences.iteritems(), key=operator.itemgetter(1), reverse=True)[:10]
		shortest = logic.findShortest(occurences)
		longest = logic.findLongest(occurences)
		c['occurences'] = top10
		c['shortest'] = shortest.popitem()
		c['longest'] = longest.popitem()
		c['maxOccurance'] = max(top10, key=lambda item: item[1])
		c['itemCount'] = len(top10)
	return render_to_response('mapreduce.html',c)
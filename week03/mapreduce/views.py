from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader
import urllib
import logic

def mapReduce(request):	
	t = loader.get_template('mapreduce.html')
	c = Context()
	c.update(csrf(request))
	if request.method == 'POST':		
		#url = request.POST['url']		
		#content = urlopen(url).read() 
		occurences = logic.findOccurence(['ala','ma','kota','a','kot','ma','ale'])
		shortest = logic.findShortest(['ala','ma','kota','a','kot','ma','ale'])
		longest = logic.findLongest(['ala','ma','kota','a','kot','ma','ale'])
		c['occurences'] = occurences
		c['shortest'] = shortest.popitem()[0]
		c['longest'] = longest.popitem()[0]
		c['maxOccurance'] = max(occurences.values())
	return render_to_response('mapreduce.html',c)
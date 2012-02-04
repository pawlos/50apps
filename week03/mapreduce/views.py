from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader
import urllib
import mapreduce

def mapReduce(request):	
	t = loader.get_template('mapreduce.html')
	c = Context()
	c.update(csrf(request))
	if request.method == 'POST':
		print 'post'
		url = request.POST['url']
		print url
		content = urlopen(url).read() 
		print content
		
	return render_to_response('mapreduce.html',c)
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader
import httplib
import mapreduce

def mapReduce(request):	
	if request.method == 'POST':
		url = request.POST['url']
		try:
			connection = httplib.HTTPConnection(url)
			request = connection.request("GET", url)
			response = connection.getresponse()
			
			content = response.read()
			connection.close()
			print content
			
		except:
			pass
	else:
		t = loader.get_template('mapreduce.html')
		c = Context()
		c.update(csrf(request))
		return render_to_response('mapreduce.html')
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import Context, loader

def mapReduce(request):	
	t = loader.get_template('mapreduce.html')
	c = Context()
	c.update(csrf(request))
	return render_to_response('mapreduce.html')
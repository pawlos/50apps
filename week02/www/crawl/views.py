from django.core.context_processors import csrf
from django.http import HttpResponse
from django.template import Context, loader

def index(request):
	t = loader.get_template('index.html')
	c = Context()	
	c.update(csrf(request))
	return HttpResponse(t.render(c))

def go(request):
	return HttpResponse('Go...')
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.template import Context, loader
from crawler import *

def index(request):
	t = loader.get_template('index.html')
	c = Context()	
	c.update(csrf(request))
	return HttpResponse(t.render(c))

def go(request):
	if ('url' not in request.POST):
		return index(request)
	
	url = request.POST['url']
	depth = request.POST['depth']
	phrase = request.POST['phrase']
	urls = []
	crawl(url, int(depth), phrase, urls)
	
	t = loader.get_template('index.html')
	c = Context({ 'url': url, 'depth': depth, 'phrase': phrase, 'urls': urls})	
	c.update(csrf(request))
	return HttpResponse(t.render(c))	
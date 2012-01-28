from django.core.context_processors import csrf
from django.http import HttpResponse
from django.template import Context, loader
import crawler

def index(request):
	t = loader.get_template('index.html')
	c = Context()	
	c.update(csrf(request))
	return HttpResponse(t.render(c))

def go(request):
	url = request.POST['url']
	depth = request.POST['depth']
	phrase = request.POST['phrase']
	crawl(url, depth, phrase)
	
	t = loader.get_template('index.html')
	c = Context({ 'url': url, 'depth': depth, 'phrase': phrase})	
	c.update(csrf(request))
	return HttpResponse(t.render(c))	
import functools

def mapReduce(list):	
	return functools.reduce(lambda x,y: reduceFunc(x,y), map(lambda x: {x: 1}, filter(filterFunc, list)))
		
def reduceFunc(x,y):	
	second = y.popitem()	
	if second[0] in x:
		x[second[0]] += second[1]
	else:
		x[second[0]] = second[1]
	return x
	
def filterFunc(x):
	return x not in ['a', 'an','the','on','in','for','and','to']


list = ["two","acta","acta","bacta","a","the","two", "to",'single','most','most','most','most']
mapReduce(list)
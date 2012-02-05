
def reduceFunc(x,y):	
	second = y.popitem()	
	if second[0] in x:
		x[second[0]] += second[1]
	else:
		x[second[0]] = second[1]
	return x

def findShortestWord(x,y):	
	second = y.popitem()	
	first = x.popitem()
	if second[1] < first[1]:
		return {second[0]: second[1]}
	else:
		if not first:
			return {second[0]: second[1]}
		return {first[0]: first[1]}

def findLongestWord(x,y):	
	second = y.popitem()	
	first = x.popitem()
	if second[1] > first[1]:
		return {second[0]: second[1]}
	else:
		return {first[0]: first[1]}
	
def filterFunc(x):
	return x not in ['a', 'an','the','on','in','for','and','to']
	
def findShortest(list):
	return reduce(lambda x,y: findShortestWord(x,y), map(lambda x: {x: len(x)}, filter(filterFunc, list)))

def findOccurence(list):	
	return reduce(lambda x,y: reduceFunc(x,y), map(lambda x: {x: 1}, filter(filterFunc, list)))
	
def findLongest(list):
	return reduce(lambda x,y: findLongestWord(x,y), map(lambda x: {x: len(x)}, filter(filterFunc, list)))

list = ["two","acta","acta","bacta","a","the","two", "to",'single','most','most','most','most']
print findOccurence(list)
print findShortest(list)
print findLongest(list)
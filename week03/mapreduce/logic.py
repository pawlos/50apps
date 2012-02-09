import re

def reduceFunc(x,y):	
	word, count = y.popitem()	
	if word in x:
		x[word] += count
	else:
		x[word] = count
	return x

def findShortestWord(x,y):	
	secondWord, secondLen = y.popitem()	
	firstWord, firstLen = x.popitem()
	if secondLen < firstLen:
		return { secondWord: secondLen}
	else:
		if not firstWord:
			return { secondWord: secondLen}
		return {firstWord: firstLen}

def findLongestWord(x,y):	
	secondWord, secondLen = y.popitem()	
	firstWord, firstLen = x.popitem()
	if secondLen > firstLen:
		return {secondWord: secondLen}
	else:
		return {firstWord: firstLen}

def filterNonWords(x):
	return re.match("^\w+$", x)

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
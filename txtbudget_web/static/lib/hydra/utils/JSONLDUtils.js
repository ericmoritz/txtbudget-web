
function forceArray(x) {
    if(x instanceof Array) {
	return x;
    } else {
	return [x];
    }
}

module.exports = {
    types(obj) {
	var ret = [];
	// If the obj is an array, it has been expanded
	if(obj instanceof Array) {
	    var expanded = obj;
	    // iterate over each object in the expanded 
	    for(var obj of expanded) {
		for(var type of this.types(obj)) {
		    ret.push(type);
		}
	    }
	} else {
	    for(var type of forceArray(obj['@type'])) 
		ret.push(type);
	}
	return ret;

    },
    hasType(needle, obj) {
	// TODO use the equiv of any(predicate)
	for(var type of this.types(obj)) {
	    if(needle == type) {
		return true
	    }
	}
	return false;
    }
}

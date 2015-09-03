module.exports = {
	create : function(details){
		return makeCR(details);
	},
	update : function(cr){
		return addKeys(cr);
	}	
};
function makeCR(details){
	var temp = {}
	for(var key in details)	{
		temp[key] =details[key]
	}
	return temp
}
function addKeys(cr){
	
}
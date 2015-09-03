var test = require('./individual')

options = {
	'id':268527
	,'type':'physician'
}


var physician = test.query(options)
console.log('Results:')
console.log(physician)


var expect = require("chai").expect;
var cr = require('../lib/open-payments.js');
//var path = require('path');
//var def = require('../lib/definitions.json');

describe('open-payments',function(){
	describe('identify()',function(){
		it('It should return identifying information about a physician', function(done){
			var options = {'id':'268527','type': 'physician'};
			cr.identify(options, function(err, data){
				expect(data[0]).to.have.a.property('physician_profile_id', options.id);
				done();
			});
		});
		it('It should return identifying information about a company', function(done){
			var options = {'id':'100000000286','type': 'company'};
			cr.identify(options, function(err, data){
				expect(data[0]).to.have.a.property('amgpo_making_payment_id', options.id);
				done();
			});
		});
		it('It should return identifying information about a teaching hospital', function(done){
			var options = {'id':'644','type': 'hospital'};
			cr.identify(options, function(err, data){
				expect(data[0]).to.have.a.property('teaching_hospital_id', options.id);
				done();
			});
		});
	});
	describe('summary()',function(){
        it('It should return data from for physician from every program year and every dataset where data exists', function(done){
            var options = {'id':'268527','type': 'physician'};
            this.timeout(15000)
            cr.summary(options, function(err, data){
                expect(data[0].data[0]).to.have.a.property('count','81')
                done()
            });
        });
        it('It should return data from for company from every program year and every dataset where data exists', function(done){
            var options = {'id':'100000000286','type': 'company'};
            this.timeout(15000)
            cr.summary(options, function(err, data){
                expect(data[0].data[0]).to.have.a.property('count','176265')
                done()
            });
        });
        it('It should return data from for hospital from every program year and every dataset where data exists', function(done){
            var options = {'id':'644','type': 'hospital'};
            this.timeout(15000)
            cr.summary(options, function(err, data){
                expect(data[0].data[0]).to.have.a.property('count','45')
                done()
            });
        });
	});
});
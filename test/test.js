
var expect = require("chai").expect;
var cr = require('../lib/sum.js');

describe('open-payments',function(){
	describe('information()',function(){
		it('It should return identifying information about a physician', function(done){
			var options = {'id':'268527','type': 'physician'};
			var physician = cr.information(options);
			expect(physician).to.have.a.property('physician_profile_id', options.id);
			done();
		});
		it('It should return identifying information about a company', function(done){
			var options = {'id':'100000000286','type': 'company'};
			var company = cr.information(options);
			expect(company).to.have.a.property('amgpo_making_payment_id', options.id);
			done();
		});
	});
	describe('summary()',function(){
        it('It should return open payments summary stats about a physician', function(done){
            this.timeout(3000);
            var options = {'id':'268527','type': 'physician'};
            var physician =  cr.summary(options);
            expect(physician['2013'].general).to.have.a.property('count',81);
            done();
        });
	});
	describe('records()',function(){
        it('It should return open payments records about a physician', function(done){
            this.timeout(3000);
            var options = {'id':'268527','type': 'physician'};
            var physician =  cr.records(options);
            expect(physician['2013'].general.records).to.have.a.property('length',81);
            done();
        });
	});
	describe('details()',function(){
        it('It should return all available information about a physician', function(done){
            this.timeout(5000);
            var options = {'id':'268527','type': 'physician'};
            var physician =  cr.details(options);
            expect(physician).to.have.a.property('physician_profile_id', options.id);
            expect(physician['2013'].general).to.have.a.property('count',81);
            expect(physician['2013'].general.records).to.have.a.property('length',81);
            done();
        });
	});
});
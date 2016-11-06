/**
 * http://usejsdoc.org/
 */
var request 	= require('request')
    ,express 	= require('express')
    ,assert 	= require('chai').assert
    ,http 		= require("http");

describe('http tests', function() {

	it('LOGIN SHOULD BE CORRECT WITH INPUT CREDENTIALS', function(done) {
		request.post('http://localhost:3000/afterSignIn', {
			form : {
				username : 'nachiket@gmail.com',password:'1234'
			}
		}, function(error, response, body) {
			assert.equal(200, response.statusCode);
			done();
		});
	});

	it('CHECK ADD BID CORRECT', function(done) {
		request.post('http://localhost:3000/afterSignIn', {
			form : {
				product_name : 'test',product_id:'65',
				product_price : '20',product_desc:'product_desc',
				tot_product: '2'
			}
		}, function(error, response, body) {
			assert.equal(200, response.statusCode);
			done();
		});
	});
	
	it('CHECK CART ADDITION IS CORRECT', function(done) {
		request.post('http://localhost:3000/cart', {
			form : {
				pid : '90'
			}
		}, function(error, response, body) {
			assert.equal(200, response.statusCode);
			done();
		});
	});
	
    it('CHECK IF PRODUCTS ARE RENDERED CORRECT', function(done) {
        request.post(
            'http://localhost:3000/submitAd',
            { form: { } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    
    it('CHECK IF PROFILE INFO IS CORRECT', function(done) {
        request.post(
            'http://localhost:3000/profile',
            { form: { } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    
    it('CHECK IF CART IS RENDERED CORRECT', function(done) {
        request.post(
            'http://localhost:3000/yourCart',
            { form: { } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});
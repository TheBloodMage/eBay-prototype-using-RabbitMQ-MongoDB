/**
 * http://usejsdoc.org/
 */
var request 	= require('request')
    ,express 	= require('express')
    ,assert 	= require('chai').assert
    ,http 		= require("http");

describe('http tests', function() {

	it('login should be with correct credentials', function(done) {
		request.post('http://localhost:3000/afterSignIn', {
			form : {
				inputUsername : 'nachiket@gmail.com',inputPassword:'12345'
			}
		}, function(error, response, body) {
			assert.equal(200, response.statusCode);
			done();
		});
	});

	it('check ad additions', function(done) {
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
	
	it('check cart additions is correct', function(done) {
		request.post('http://localhost:3000/cart', {
			form : {
				pid : '90'
			}
		}, function(error, response, body) {
			assert.equal(200, response.statusCode);
			done();
		});
	});
	
    it('Checks if get All products is correct', function(done) {
        request.post(
            'http://localhost:3000/submitAd',
            { form: { } },
            function (error, response, body) {
                assert.equal(200, 200);
                done();
            }
        );
    });
    
    it('Checks if profile is correct', function(done) {
        request.post(
            'http://localhost:3000/profile',
            { form: { } },
            function (error, response, body) {
                assert.equal(200, 200);
                done();
            }
        );
    });
    
    it('Checks if your cart is correct', function(done) {
        request.post(
            'http://localhost:3000/yourCart',
            { form: { } },
            function (error, response, body) {
                assert.equal(200, 200);
                done();
            }
        );
    });
});
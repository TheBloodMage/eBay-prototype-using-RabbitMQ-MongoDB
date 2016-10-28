/**
 * http://usejsdoc.org/
 */

// create the module and name it ebay
var app = angular.module('ebay', [ 'ngRoute' ]);

console.log("I am in ANGULAR file home.js");

// configure our routes
app.config(function($routeProvider) {
	console.log("I am in $routeProvider");
	$routeProvider

	.when("/register", {
		templateUrl : "templates/register.html"
	})

	.when("/login", {
		templateUrl : "templates/login.html"
	})

	.when("/profile", {
		templateUrl	: "templates/profile.html",
		controller	: "profileController"
	})

	.when("/update", {
		templateUrl : "templates/update.html"
	})

	.when("/sell", {
		templateUrl : "templates/sell.html"
	})
	
	.when("/bid", {
		templateUrl : "templates/bid.html"
	})

	.when("/managesellitems", {
		templateUrl	: "templates/managesellitems.html",
		controller	: "managesellitemsController"
	})
	
	.when("/managebiditems", {
		templateUrl	: "templates/managebiditems.html",
		controller	: "managebiditemsController"
	})
	
	.when("/buyproducts", {
		templateUrl	: "templates/buy.html",
		controller	: "buyproductsController"
	})
	
	.when("/boughthistory", {
		templateUrl	: "templates/boughthistory.html",
		controller	: "boughthistoryController"
	})
	
	.when("/soldhistory", {
		templateUrl	: "templates/soldhistory.html",
		controller	: "soldhistoryController"
	})
	
	.when("/bidproducts", {
		templateUrl	: "templates/bidpage.html",
		controller	: "bidproductsController"
	})

	.when("/cart", {
		templateUrl	: "templates/cart.html",
		controller	: "cartController"
	});
});

// login
app.controller('ebay', function($scope, $http) {

	console.log("I am in ebay controller");
	$scope.invalid_login = true;

	$scope.signin = function() {

		console.log("Sign in button clicked");

		var credentials = {
			"inputUsername" : $scope.inputUsername,
			"inputPassword" : $scope.inputPassword
		}

		console.log(credentials);

		$http({
			method : "POST",
			url : '/afterSignIn',
			data : credentials
		}).success(function(data) {

			if (data.statusCode == 200) {
				console.log("render the successful login page here");
				window.location.assign("/successLogin");
			} else {
				console.log("render the Invalid LogIn Message here");
				$scope.invalid_login = false;
			}

		})
	}

	$scope.getAllProducts = function() {
		console.log("hey call is here");
		$http({
			method : "get",
			url : '/getAllProducts',
		}).success(function(data) {
			window.location.assign("/getAllProducts");
		}).error(function(error) {

		});
	};

});

// register
app
		.controller(
				'register',
				function($scope, $http) {

					console.log("I am in register controller");
					$scope.invalid_login = true;
					$scope.valid_login = true;
					$scope.already_exists = true;

					$scope.register = function() {

						console.log("Register button clicked");

						var RegisterCredentials = {
							"first_name" : $scope.first_name,
							"last_name" : $scope.last_name,
							"inputUsername" : $scope.inputUsername,
							"inputPassword" : $scope.inputPassword,
							"confirmPassword" : $scope.confirmPassword
						}

						if (RegisterCredentials.inputPassword == RegisterCredentials.confirmPassword) {
							console.log(RegisterCredentials.inputPassword);
							console.log(RegisterCredentials.confirmPassword);
							console.log("if both inserted passwords are equal");
							$http({
								method : "POST",
								url : '/registerNewUser',
								data : RegisterCredentials
							}).success(function(data) {

								if (data.statusCode == 200) {
									console.log("record inserted");
									$scope.invalid_login = true;
									$scope.already_exists = true;
									$scope.valid_login = false;
								} else if (data.statusCode == 401) {
									console.log("invalid entry received");
									$scope.valid_login = true;
									$scope.already_exists = true;
									$scope.invalid_login = false;
								} else {
									console.log("user already exists");
									$scope.already_exists = false;
									$scope.invalid_login = true;
									$scope.valid_login = true;
								}
							})
						} else {
							$scope.invalid_login = false;
						}
					}

					$scope.updateProfile = function() {
						var ProfileDetails = {
							"first_name" : $scope.first_name,
							"last_name" : $scope.last_name,
							"bday" : $scope.bday,
							"ehandle" : $scope.euname,
							"cinfo" : $scope.cinfo,
							"location" : $scope.location
						}
						console.log(ProfileDetails);
						$http({
							method : "POST",
							url : '/updateProfile',
							data : ProfileDetails
						}).success(function(data) {

							if (data.statusCode == 200) {
								console.log("invalid entry received");
							} else {
								console.log("profile updated");
							}
						})
					}

					$scope.submitAd = function() {
						var ProductDetails = {
							"product_name"	: $scope.product_name,
							"product_desc"	: $scope.product_desc,
							"product_price" : $scope.product_price,
							"tot_product"	: $scope.tot_product
						}
						console.log(ProductDetails);
						$http({
							method : "POST",
							url : '/submitAd',
							data : ProductDetails
						}).success(function(data) {

							if (data.statusCode == 200) {
								console.log("invalid entry received");
							} else {
								console.log("record inserted");
							}
						})
					}
					
					
					$scope.submitBid = function() {
						var BidProductDetails = {
							"product_name"	: $scope.product_name,
							"product_desc"	: $scope.product_desc,
							"product_price" : $scope.product_price
						}
						console.log(BidProductDetails);
						$http({
							method : "POST",
							url : '/submitBid',
							data : BidProductDetails
						}).success(function(data) {

							if (data.statusCode == 200) {
								console.log("invalid entry received");
							} else {
								console.log("record inserted");
							}
						})
					}

				});

app.controller("profileController", function($scope, $http) {
	console.log("I am in profileController");

	$http({
		method : "get",
		url : '/profile'
	}).success(function(data) {
		console.log(data);
		$scope.results = data.users;
	}).error(function(error) {

	});

});

app.controller("buyproductsController", function($scope, $http) {
	console.log("I am in buyproductsController");

	$http({
		method : "get",
		url : '/getAllProducts',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.products = data.products;
	}).error(function(error) {

	});
});


app.controller("bidproductsController", function($scope, $http) {
	console.log("I am in bidproductsController");

	$http({
		method : "get",
		url : '/getAllBids',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.products = data.products;
	}).error(function(error) {

	});
});

app.controller("managesellitemsController", function($scope, $http) {
	console.log("I am in managesellitemsController");

	$http({
		method : "get",
		url : '/managesellitems',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.ads = data.ads;
	}).error(function(error) {

	});
});

app.controller("managebiditemsController", function($scope, $http) {
	console.log("I am in managebiditemscontroller");

	$http({
		method : "get",
		url : '/managebiditems',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.ads = data.ads;
	}).error(function(error) {

	});
});


app.controller("boughthistoryController", function($scope, $http) {
	console.log("I am in boughthistoryController");

	$http({
		method : "get",
		url : '/boughthistory',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.ads = data.ads;
	}).error(function(error) {

	});
});

app.controller("soldhistoryController", function($scope, $http) {
	console.log("I am in soldhistoryController");

	$http({
		method : "get",
		url : '/soldhistory',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.ads = data.ads;
	}).error(function(error) {

	});
});


app.controller("cartController", function($scope, $http) {
	console.log("I am in cartController");

	$http({
		method : "get",
		url : '/yourCart',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.carts = data.carts;
	}).error(function(error) {

	});
});

app.controller('cart', function($scope, $http) {

	$scope.addToCart = function(data) {
		var credentials = {
			"pid" : data
		}
		console.log(credentials);
		$http({
			method : "POST",
			url : '/cart',
			data : credentials
		}).success(function(data) {

			if (data.statusCode == 200) {
				console.log("Added TO CArt");
				// console.log(data);
			} else {
				console.log("SOMETHING WENT WRONG");
			}
		})
	}

	$scope.money = function(data) {
		var BoughtDetails = {
			"pid" : data,
			"card_number" : $scope.card_number
		}
		console.log("hi123 inside bought details" + BoughtDetails);
		$http({
			method : "POST",
			url : '/money',
			data : BoughtDetails
		}).success(function(data) {

			if (data.statusCode == 200) {
				console.log("invalid entry received");
			} else {
				console.log("record inserted");
			}
		})
	}

	$scope.removeFromCart = function(data) {
		var credentials = {
			"pid" : data
		}
		console.log("removeFromCart" + credentials);
		$http({
			method : "POST",
			url : '/removeCart',
			data : credentials
		}).success(function(data) {

			if (data.statusCode == 200) {
				console.log("REMOVED FROM CART");
				// console.log(data);
			} else {
				console.log("SOMETHING WENT WRONG");
			}
		})
	}

	$scope.removeYourBidAD = function(data) {
		var credentials = {
			"pid" : data
		}
		console.log(credentials);
		$http({
			method : "POST",
			url : '/removeYourBidAD',
			data : credentials
		}).success(function(data) {

			if (data.statusCode == 200) {
				console.log("REMOVED FROM BID ITEMS");
			} else {
				console.log("SOMETHING WENT WRONG");
			}
		})
	}
	
	$scope.placeYourBid = function(id, bid) {
		var bid_credentials = {
			"pid" : bid,
			"product_bid" : id
		}
		console.log(bid_credentials);
		$http({
			method : "POST",
			url : '/bid',
			data : bid_credentials
		}).success(function(data) {

			if (data.statusCode == 200) {
				console.log("Added TO BID");
				// console.log(data);
			} else {
				console.log("SOMETHING WENT WRONG");
			}
		})
	}
	
	
});

app.controller("BroughtProductsController", function($scope, $http) {
	console.log("I am in BroughtProductsController");

	$http({
		method : "get",
		url : '/getAllBoughtProducts',
		data : {}
	}).success(function(data) {
		console.log(data);
		$scope.BoughtProducts = data.BoughtProducts;
	}).error(function(error) {

	});
});

app.controller("aboutController", function($scope) {
	console.log("I am in aboutController");
	$scope.message = 'My TEST is successful';
});

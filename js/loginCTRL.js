angular.module("chat").controller("loginCTRL", ["$scope", "$http", "$location", function($scope, $http, $location){
	var socket = io.connect("http://localhost:8080");

	$scope.nick = "";
	$scope.onLogin = function(){
		socket.emit("adduser", $scope.nick, function(available){
			if(available){
				$scope.$apply(function(){
					$location.path('/roomlist');
				})
			}
			else{
				$scope.$apply(function(){
					$scope.errorMessage = "This nick name is already in use!";
				})
			}
		});

	};

}]);
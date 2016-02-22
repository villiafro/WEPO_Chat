angular.module("chat").controller("roomlistCTRL", ["$scope", "$http", "$location", function($scope, $http, $location){
	var socket = io.connect("http://localhost:8080");
	$scope.rooms = "";

	socket.on("roomlist", function(data){
		$scope.$apply(function(){
			$scope.rooms = Object.getOwnPropertyNames(data);
		})
	});

	socket.emit("rooms");

	$scope.users = "";

	socket.on("userlist", function(data){
		$scope.$apply(function(){
			$scope.users = data;
		})
	});

	socket.emit("users");


	$scope.newroom = "";

	$scope.disc = function(){
		socket.emit("disconnects");
		socket.emit("users");
		$location.path("/index");	
	}

	$scope.joinRoom = function(){
		socket.emit("joinroom", {room: $scope.newroom}, function(available){
			$scope.$apply(function(){
				$location.path('/room/' + $scope.newroom);
			})
		});
	}
	$scope.joinRoomEx = function(thisroom){
		var roomy = new Object();
		roomy.room = thisroom;
		socket.emit("joinroom", {room: thisroom}, function(available){
			$scope.$apply(function(){
				$location.path('/room/' + thisroom);
			})
		});
	}

}]);
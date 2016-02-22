angular.module("chat").controller("chatroomCTRL", ["$scope", "$http", "$location", function($scope, $http, $location){
	var socket = io.connect("http://localhost:8080");
	var theroom = $location.path().split("/")[2];

	socket.on("roomlist", function(data){
		$scope.$apply(function(){
			$scope.texters = data[$location.path().split("/")[2]].messageHistory;
			$scope.users = data[$location.path().split("/")[2]].users;
		})
	});

	socket.emit("rooms");

	$scope.roomname = theroom;

	socket.on("updateusers", function(room, roomusers, ops){
		$scope.$apply(function(){
			$scope.users = roomusers;
		})
	});

	socket.on("updatechat", function(room, messages){
		$scope.$apply(function(){
			$scope.texters = messages;
			$scope.message = "";

		})
	});


	$scope.sendMessage = function(){
		socket.emit("sendmsg", {roomName: $location.path().split("/")[2],msg: $scope.message});
		$scope.message = "";
	}

	$scope.leaveRoom = function(){
		socket.emit("partroom", theroom); 
		$location.path('/roomlist');		
	}

}]);
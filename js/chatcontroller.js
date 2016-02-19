
angular.module("chat", ["ng", "ngRoute"]).config(function($routeProvider){
	$routeProvider.when("/index", {
		templateUrl: "view/home.html",
		controller: "loginCTRL"
	}).when("/roomlist", {
		templateUrl: "view/roomlist.html",
		controller: "roomlistCTRL"
	}).when("/room/:roomID", {
		templateUrl: "view/room.html",
		controller: "chatroomCTRL"
	}).otherwise({redirectTo: "/index"});
});

/*angular.module("chat").factory("ChatResource", function ChatResource($rootScope){
	var socket = io.connect("http://localhost:8080");
	return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});*/

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


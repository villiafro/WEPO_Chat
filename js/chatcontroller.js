
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
					$scope.errorMessage = "FAILED!";
				})
			}
		});

	};

}]);

angular.module("chat").controller("chatroomCTRL", ["$scope", "$http", "$location", function($scope, $http, $location){
	var socket = io.connect("http://localhost:8080");
	var theroom = $location.path().split("/")[2];

	socket.on("roomlist", function(data){
			var i = 0;
			for(i = 0; i < 10; i++){
				console.log(Object.getOwnPropertyNames(data[Object.getOwnPropertyNames(data)[0]]));
				if(Object.getOwnPropertyNames(data) === theroom){
					console.log("YOUR IN");
				}
			}
	});

	socket.emit("rooms");
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

	$scope.joinRoom = function(){
		var roomy = new Object();
		roomy.room = $scope.newroom;
		socket.emit("joinroom", roomy, function(available){
			$scope.$apply(function(){
				$location.path('/room/' + roomy.room);
			})
		});
	}
	$scope.joinRoomEx = function(thisroom){
		var roomy = new Object();
		roomy.room = thisroom;

		socket.emit("joinroom", roomy, function(available){
			if(available){
				$scope.$apply(function(){
				})
			}
			else{
				$scope.$apply(function(){
					$scope.errorMessage = "FAILED!";
				})
			}

		});
	}

}]);


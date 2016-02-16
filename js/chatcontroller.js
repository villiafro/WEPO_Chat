
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

angular.module("chat").factory("ChatResource", function ChatResource(){
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
});

angular.module("chat").controller("loginCTRL", ["$scope", "$http", "$location", function($scope, $http, $location){
	var socket = io.connect("http://localhost:8080");

	socket.on("roomlist", function(data){
		console.log(data);
	});

	$scope.nick = "";
	$scope.onLogin = function(view){
		socket.emit("adduser", $scope.nick, function(available){
			if(available){
				$location.path('/roomlist');
				/*socket.emit("rooms");*/
			}
			else{
				$scope.errorMessage = "FAILED!";
			}
		});

	};
}]);

angular.module("chat").controller("chatroomCTRL", ["$scope", "$http", "ChatResource", "$location", function($scope, $http, ChatResource, $location){

}]);

angular.module("chat").controller("roomlistCTRL", ["$scope", "$http", "ChatResource", "$location", function($scope, $http, ChatResource, $location){
	var socket = io.connect("http://localhost:8080");
	$scope.rooms = "";
	socket.emit("rooms", $scope.rooms, function(data){
		$scope.rooms = data.name;
	});
}]);


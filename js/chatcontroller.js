
angular.module("chat", ["ng", "ngRoute"]).config(function($routeProvider){
	$routeProvider.when("/index", {
		templateUrl: "view/home.html",
		controller: "loginCTRL"
	}).when("/rooms/:roomID", {
		templateUrl: "view/room.html",
		controller: "chatroomCTRL"
	}).otherwise({redirectTo: "/index"});
});

angular.module("chat").controller("loginCTRL", ["$scope", "$http", function($scope, $http){

	var socket = io.connect("http://localhost:8080");

	socket.on("roomlist", function(data){
		console.log(data);
	});

	$scope.nick = "";
	$scope.login = function(){
		socket.emit("adduser", $scope.nick, function(available){
			if(available){
				//  username is not taken!
				socket.emit("rooms");
			}
			else{
				$scope.faillog = "Not available"
			}
		});

	};
}]);

angular.module("chat").controller("chatroomCTRL", ["$scope", "$http", function($scope, $http){

}]);
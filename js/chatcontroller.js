
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

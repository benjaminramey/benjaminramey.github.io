var searchModule = angular.module("search", [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

searchModule.controller("SearchController", [
	"$scope", "$http",
	function($scope, $http) {
		$scope.searchData = [];		
		$scope.query = "";
		$scope.results = [];
		$scope.showResults = false;
		
		$http.get("/search.json").then(
			function(response) {
				$scope.searchData = response.data;
			},
			function() {
				$scope.searchData = [];
			}
		);
		
		$scope.search = function() {
			var lowerQuery = $scope.query.toLowerCase();
			
			$scope.results = [];
			for(var idx in $scope.searchData) {
				var item = $scope.searchData[idx];
				console.log(item);
				if (item.search_omit != "true"
					&& item.content
					&& item.title
					&& (item.content.toLowerCase().indexOf(lowerQuery) >= 0
						|| item.title.toLowerCase().indexOf(lowerQuery) >= 0))
				{
					$scope.results.push(item);
				}
			}
		};
	}
]);
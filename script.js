var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var clientId = '8ae6b7dda3b340b588c0734820a6ed11';
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
	$scope.hasToken = true;
	var token = window.location.hash;
	// console.log(token);
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];
  // define empty picArray

  $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $scope.picArray = [];
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
        	// you need to add your access token here, as per the documentation
        	 access_token:"948755799.8ae6b7d.332bf15bb2014b7b908257b26f23484e"
	    }
	  }).then(function(response) {
      $scope.picArray = response.data.data;
      //console.log(response.data.data);
      // Ego Score
      $scope.userLikes = 0;

      for(i in $scope.picArray){
      	// console.log($scope.picArray);
      	if($scope.picArray[i].user_has_liked){
      		$scope.userLikes += 1;
      	}
      }
      //console.log("likes"+ $scope.userLikes);
      $scope.egoScore = ($scope.userLikes/$scope.picArray.length)*100;

      //Popularity
      var picLikes = 0.0;
      for(j in $scope.picArray){
        picLikes += $scope.picArray[j].likes.count;
      }
      $scope.avgLikes = (picLikes/$scope.picArray.length);

      //Active days
      var weekDays = [0, 0, 0, 0, 0, 0, 0]
      var timeStamp; 

      for(k in $scope.picArray){
        timeStamp = new Date($scope.picArray[k].created_time * 1000);
        var day = timeStamp.getDay();

        switch(day){
          case 0:
            weekDays[0] += 1;
            break;

          case 1:
            weekDays[1] += 1; 
            break;

          case 2:
            weekDays[2] += 1; 
            break;

          case 3: 
            weekDays[3] += 1;
            break;

          case 4: 
            weekDays[4] += 1;
            break;

          case 5:
            weekDays[5] += 1; 
            break;

          case 6:
            weekDays[6] += 1; 
            break;
        }
      }  

      //console.log(weekDays);
      $scope.activDay= "";

      var largest = Math.max.apply(Math, weekDays);
      var dayNum = weekDays.indexOf(largest);

      switch(dayNum){
          case 0:
             $scope.activeDay = "Sunday";
            break;

          case 1:
             $scope.activeDay= "Monday";
            break;

          case 2:
             $scope.activeDay= "Tuesday";
            break;

          case 3: 
             $scope.activeDay= "Wednesday";
            break;

          case 4: 
             $scope.activeDay= "Thursday"
            break;

          case 5:
             $scope.activeDay= "Friday"
            break;

          case 6:
             $scope.activeDay= "Saturday"
            break;
        }

        //Brevity average caption length
        var sum = 0;
        for(y in $scope.picArray){
          if($scope.picArray[y].caption !== null){
            sum += $scope.picArray[y].caption.text.length;            
          }
        }
        $scope.brevity = (sum/$scope.picArray.length);

        //Visibility Thirst
        var numTags = 0;
        var numCaptions = 0;
        for(z in $scope.picArray){
          if($scope.picArray[z].caption !== null){
            numTags += $scope.picArray[z].tags.length; 
            numCaptions += 1;        
          }
        }
        $scope.visible = (numTags/numCaptions).toFixed(1);;
	  })
	};

	// run to load inta pics on page load
	$scope.getInstaPics();

	var analyzeSentiments = function() {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
	}


});

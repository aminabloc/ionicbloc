angular.module('your_app_name.auth.controllers', [])


.controller('WelcomeCtrl', function($scope, $state, $ionicModal){
	$scope.bgs = ["img/welcome-bg.jpg"];

	$scope.facebookSignIn = function(){
		console.log("doing facebook sign in");
		$state.go('app.feed');
	};

	$ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

	$ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

	$scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };
})

.controller('CreateAccountCtrl', function($scope, $state, Auth){
   $scope.user = {
   //name: '',
   //userName: '',
   //email: '',
   //password: ''
 };
 
 user= $scope.user;
  

	$scope.doSignUp = function(){
		console.log($scope.user);		
		
		//posting code
   // $http.post('https://blocapp.firebaseio.com/users.json', $scope.user);
    
    //link to firebase, generate uid
     Auth.register(user);

  //take to newsfeed
		$state.go('app.feed');
	};
})

.controller('WelcomeBackCtrl', function($scope, $state, $ionicModal){
	$scope.doLogIn = function(){
		console.log("doing log in");
		
		//login user w firebase
		Auth.login(user);
		
		//take to newsfeed
		$state.go('app.feed');
	};

	$ionicModal.fromTemplateUrl('views/auth/forgot-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.forgot_password_modal = modal;
  });

  $scope.showForgotPassword = function() {
    $scope.forgot_password_modal.show();
  };

	$scope.requestNewPassword = function() {
    console.log("requesting new password");
  };

  // //Cleanup the modal when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // // Execute action on hide modal
  // $scope.$on('modal.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove modal
  // $scope.$on('modal.removed', function() {
  //   // Execute action
  // });
})

.controller('ForgotPasswordCtrl', function($scope){

})

;

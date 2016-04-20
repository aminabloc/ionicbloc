angular.module('your_app_name.app.services', [])

.service('AuthService', function ($http, $q){
  //Just for example purposes user with id=0 will represent our logged user
  this.getLoggedUser = function(){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var user = _.find(database.users, function(user){ return user.id == 0 });
      dfd.resolve(user);
    });
    return dfd.promise;
  };

})

.service('ProfileService', function ($http, $q){

  this.getUserData = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var user = _.find(database.users, function(user){ return user.id == userId });
      dfd.resolve(user);
    });
    return dfd.promise;
  };

  this.getUserFollowers = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var followers_data = _.filter(database.following, function(follow){ return follow.followsId == userId });

      //remove possible duplicates
      var followers_userId = _.uniq(_.pluck(followers_data, 'userId'));

      var followers = _.map(followers_userId, function(followerId){
        return {
          userId: followerId,
          userData: _.find(database.users, function(user){ return user.id == followerId }),
          follow_back: !_.isUndefined(_.find(database.following, function(user){ return (user.userId === userId && user.followsId === followerId) }))
        }
      });

      dfd.resolve(followers);
    });
    return dfd.promise;
  };

  this.getUserFollowing = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var following_data = _.filter(database.following, function(follow){ return follow.userId == userId });
      //remove possible duplicates
      var following_userId = _.uniq(_.pluck(following_data, 'followsId'));

      var following = _.map(following_userId, function(followingId){
        return {
          userId: followingId,
          userData: _.find(database.users, function(user){ return user.id == followingId })
        }
      });
      dfd.resolve(following);
    });

    return dfd.promise;
  };

  this.getUserPictures = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //get user related pictures
      var user_pictures = _.filter(database.users_pictures, function(picture){
        return picture.userId == userId;
      });

      dfd.resolve(user_pictures);
    });

    return dfd.promise;
  };

  this.getUserPosts = function(userId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      //get user related pictures
      var user_post = _.filter(database.posts, function(post){
        return post.userId == userId;
      });

      dfd.resolve(user_post);
    });

    return dfd.promise;
  };



})



.service('FeedService', function ($scope, Posts){
  $scope.posts = Posts.all()
  
})

.service('PeopleService', function ($http, $q){

  this.getPeopleSuggestions = function(){

    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      var people_suggestions = _.each(database.people_suggestions, function(suggestion){
        suggestion.user = _.find(database.users, function(user){ return user.id == suggestion.userId; });

        //get user related pictures
        var user_pictures = _.filter(database.users_pictures, function(picture){
          return picture.userId == suggestion.userId;
        });

        suggestion.user.pictures = _.last(user_pictures, 3);

        return suggestion;
      });

      dfd.resolve(people_suggestions);
    });

    return dfd.promise;
  };

  this.getPeopleYouMayKnow = function(){

    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {

      var people_you_may_know = _.each(database.people_you_may_know, function(person){
        person.user = _.find(database.users, function(user){ return user.id == person.userId; });
        return person;
      });

      dfd.resolve(people_you_may_know);
    });

    return dfd.promise;
  };
})


.service('TrendsService', function ($http, $q){
  this.getTrends = function(){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      dfd.resolve(database.trends);
    });

    return dfd.promise;
  };

  this.getTrend = function(trendId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var trend = _.find(database.trends, function(trend){ return trend.id == trendId; });
      dfd.resolve(trend);
    });

    return dfd.promise;
  };
})

.service('CategoryService', function ($http, $q){
  this.getCategories = function(){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      dfd.resolve(database.categories);
    });

    return dfd.promise;
  };

  this.getCategory = function(categoryId){
    var dfd = $q.defer();

    $http.get('database.json').success(function(database) {
      var category = _.find(database.categories, function(category){ return category.id == categoryId; });
      dfd.resolve(category);
    });

    return dfd.promise;
  };
})

.service('GooglePlacesService', function($q){
  this.getPlacePredictions = function(query)
  {
    var dfd = $q.defer();
    var service = new google.maps.places.AutocompleteService();

    service.getPlacePredictions({ input: query },
      function(predictions, status){
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          dfd.resolve([]);
        }
        else
        {
          dfd.resolve(predictions);
        }
      });
    return dfd.promise;
  }
})


.service('Auth', function (FURL, $firebaseAuth, $state, $firebaseObject){
      var ref= new Firebase(FURL);
      var auth= $firebaseAuth(ref);
      
      var Auth = { 
      user:{},
      
      createProfile: function(uid,user){
        var profile= {
          name: user.name,
          email: user.email,
          image: 'tbd'
        }
        return ref.child('profile').child(uid).set(profile);
      },
      
      login: function(user){
        console.log('we got to login function');
        return auth.$authWithPassword({
          email: user.email,
          password : user.password,
        });
      },
      
        
      register: function(user){
        console.log('register func')
        return auth.$createUser({
          email: user.email,
          password : user.password
        }).then(function (){
          console.log('user is saving');
          return Auth.login(user);
        }).then(function(data){
          console.log ('the user is', data);
          return Auth.createProfile(data.uid,user);
          
        })
        $state.go('app.feed');
      },
      
      logout: function(){
        auth.$unauth();
      }
    }
    
    auth.$onAuth(function(authData){
      if (authData){
        Auth.user = authData;
        Auth.user.profile= $firebaseObject(ref.child('profile').child(authData.uid));
        console.log('the user has already logged in');
        $state.go('app.feed');
      }else {
        $state.go('login');
      }
      
    })
    
    return Auth;
  
})

.service('Posts',function (FURL, $firebaseArray, Auth){
  var ref= new Firebase(FURL);
  var posts= $firebaseArray(ref.child('posts'));
  
  var Posts= {
    all: function(){
      return posts
    },
    savePost: function (status_post){
      console.log('the user profile is', Auth.user.profile);
      var newPost = {
          user: Auth.user.profile.name,
          uid: Auth.user.uid,
          body: status_post.text,
          audience: status_post.audience,
          images: status_post.images
      };
      return posts.$add(newPost).then(function(){
        console.log ('new post added to databse')
      })
    }
  };
  return Posts;
});


;

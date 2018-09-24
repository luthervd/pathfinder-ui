app.directive("auth",["$http","RequestFactory",function($http,rf){
    return{
        restrict: "E",
        scope: true,
        templateUrl: 'js/directives/auth.html',
        link: function(scope){
            scope.authOptions = ["Basic", "OpenId"];
            scope.basicAuth = { userName : "", password: ""};
            scope.requestTemplate = {client_id:"",
            client_secret: "",
            audience:"",
            grant_type:"client_credentials"}
            scope.visible = false;
            scope.show = function(){
                scope.visible = true;
            };
            scope.oauthOptions = {
                tokenUrl: "",
                clientId : "",
                clientSecret: "",
                audience: ""
            }
            scope.setMessage = function(message){
                scope.message = message;
                window.setTimeout(function(){
                    scope.message = "";
                    scope.$apply();
                },5000);
            };
            scope.setBasic = function(){
                var basicArgs = scope.basicAuth.userName + ":" + scope.basicAuth.password;
                rf.setAuthToken(basicArgs,"Basic");
                scope.setMessage("Basic has been set")
            };
            scope.getToken = function(){
               
                    scope.requestTemplate.client_id = scope.oauthOptions.clientId;
                    scope.requestTemplate.client_secret = scope.oauthOptions.clientSecret;
                    scope.requestTemplate.audience = scope.oauthOptions.audience;
                    scope.loading = true;
                    $http.post(scope.oauthOptions.tokenUrl,scope.requestTemplate,{ headers: {"content-type" : "application/json"}})
                    .then(function(response){
                        scope.loading = false;
                        if(response.status === 200 && response.data.access_token){
                            var token = response.data.access_token;
                            rf.setAuthToken(token, "Bearer");
                            scope.setMessage("The auth token has been set")
                        }
                        else{
                           scope.setMessage("Error gettting token make sure your values are correct and you have configured your token service");
                        }   
                    })
                
            };
            scope.authType = scope.authOptions[1];
        }
    }
}])
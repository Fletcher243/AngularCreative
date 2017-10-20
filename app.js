angular.module('News', ['ui.router'])
  .factory('characterFactory', [function(){
    var o = {
      characters: [{
        name: 'The Champion!',
        level: 100,
        points: 150,
        exp: 1000,
        power: 150,
        stats: [{name:"Strength", level:50},{name:"Speed", level:50}, {name:"Magic", level:50}]
      }]
    };
    return o;
  }
])
.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl'
        })
       .state('characters', {
          url: '/characters/{id}',
          templateUrl: '/characters.html',
          controller: 'characterCtrl'
    });
      $urlRouterProvider.otherwise('home');
  }
])
.controller('MainCtrl', [
  '$scope',
  'characterFactory',

  function($scope, characterFactory){
    $scope.formContent = '';
    $scope.characters = characterFactory.characters;
    $scope.statingOn = '';
    $scope.addcharacter = function(){
    if($scope.formContent === '') { return; }

      characterFactory.characters.push({
        name: $scope.formContent,
        level: 0,
        points: 3,
        exp: 0,
        power: 3,
        stats: [{name:"Strength", level:1},{name:"Speed", level:1}, {name:"Magic", level:1}]
      });
      $scope.name = '';
      $scope.formContent = '';
    };    
    $scope.incrementLevels = function(character) {
      character.level += 1;
    };
  }
])
.controller('characterCtrl', [
  '$scope',
  '$stateParams',
  'characterFactory', 
  function($scope, $stateParams, characterFactory){
    $scope.character = characterFactory.characters[$stateParams.id];
    $scope.levelUp = function(character,increase){
      character.exp += increase;
      if(character.level * 10 < character.exp){
        old = character.level;
        character.level = Math.floor(character.exp / 10);
        character.points += (3 * character.level - old);
      }
    }
    $scope.Battle = function(){
      if(characterFactory.characters.length < 2) { return; }
        var opponent = Math.floor(Math.random()*characterFactory.characters.length);

        while(opponent == $stateParams.id){
          opponent = Math.floor(Math.random()*characterFactory.characters.length);
        }

        var oAtt = characterFactory.characters[opponent].stats[0].level;
        var oSpd = characterFactory.characters[opponent].stats[1].level;
        var oMag = characterFactory.characters[opponent].stats[2].level;
        var oStats = oAtt + oSpd + oMag;
                
        var oPower = characterFactory.characters[opponent].power;
        var power = $scope.character.power; 
        var attack = Math.floor(Math.random()*power) + Math.floor(power / 20);
        var defense = Math.floor(Math.random()*oPower) + Math.floor(oPower / 20);
        if(attack > defense) {
          if(characterFactory.characters[opponent].name === "The Champion"){
             alert("You beat the Champion!! You're good. You gained " + defense + " experience!");
          }
          else {
            alert("You won! You gained " + defense + " experience!");
          }
          $scope.levelUp($scope.character,defense);
        }
        else {
          alert("You lost... " + characterFactory.characters[opponent].name + " gained " + attack + " experience!");
          $scope.levelUp(characterFactory.characters[opponent],attack);
      }
    };
    $scope.incrementStat = function(stat){
      if($scope.character.points < 1){return;}
      stat.level += 1;
      $scope.character.power += 1;
      $scope.character.points -= 1;
    };
  }
]);
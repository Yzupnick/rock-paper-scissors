Games = new Mongo.Collection("games");

var winner = function(game){
    var win = choiceWins(game.player1choice, game.player2choice);
    if (win ===1) {
        return 'Player 1';
    }
    else if (win === -1){
        return 'Player 2';
    }
    else {
        return 'Tie';
    }
};

var choiceWins = function(choice1, choice2){
    if (choice1 == 'rock' && choice2 == 'scissors'){
        return 1;
    }
    else if (choice1 == 'rock' && choice2 == 'paper'){
        return -1;
    }
    else if (choice1 == 'paper' && choice2 == 'rock'){
        return 1;
    }
    else if (choice1 == 'paper' && choice2 == 'scissors'){
        return -1;
    }
    else if (choice1 == 'scissors' && choice2 == 'paper'){
        return 1;
    }
    else if (choice1 == 'scissors' && choice2 == 'rock'){
        return -1;
    }
    else{
        return 0;
    }
};

var makeChoiceFunction = function(player, choice){
    return function(event){
      var game = currentGame();
      console.log(game);
      if (game === undefined ||  (game.player1choice && game.player2choice)){
          console.log("I'm here");
          var newGame = {
            started: new Date() // current time
          };
          newGame[player] = choice;
          Games.insert(newGame);
      }
      else{
          var updateObj = {};
          updateObj[player] = choice;
          Games.update(game._id, {
            $set: updateObj 
          });
      }
    };
};

var currentGame = function(){
    var games = Games.find({}, {sort:{started: -1}}).fetch();
    if (games.length > 0){
        return games[0];
    }
    return undefined;
};

if (Meteor.isClient) {

  Template.choose.helpers({
      current_choice: function(){
          var game = currentGame();
          if (game && game.player1choice){
              return game.player1choice;
          }
          else{
              return 'You have not chosen';
          }
      }
  });

  Template.body.events({
    "click .rock": makeChoiceFunction('player1choice', 'rock'),
    "click .paper": makeChoiceFunction('player1choice', 'paper'),
    "click .scissors": makeChoiceFunction('player1choice', 'scissors')
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });

}

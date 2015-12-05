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

var makeChoiceFunction = function(choice){
    return function(event){
      var game = currentGame();
      if (game === undefined ||  (game.player1choice && game.player2choice)){
          var newGame = {
            started: new Date() // current time
          };
          newGame[currentPlayer() + 'choice'] = choice;
          Games.insert(newGame);
      }
      else{
          var updateObj = {};
          updateObj[currentPlayer() + 'choice'] = choice;
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

var currentPlayer = function(){
  var player = Iron.Location.get().path.replace('/','');
  return player;
};

Router.route('/', function () {
  this.render('home');
});

Router.route('/player1', function () {
  this.render('player');
});

Router.route('/player2', function () {
  this.render('player');
});

if (Meteor.isClient) {
  Template.choose.helpers({
      current_choice: function(){
          var game = currentGame();
          if (game && game[currentPlayer() + 'choice']){
              return game[currentPlayer() + 'choice'];
          }
          else{
              return 'You have not chosen';
          }
      }
  });

  Template.history.helpers({
      winner: function(){
          return winner(this);
      },
      games: function(){
          return Games.find({}, {sort:{started: -1}});
      }
  });

  Template.player.events({
    "click .rock": makeChoiceFunction( 'rock'),
    "click .paper": makeChoiceFunction('paper'),
    "click .scissors": makeChoiceFunction('scissors')
  });

}


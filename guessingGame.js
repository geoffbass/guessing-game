
(function guessingGame() {
	var playersGuess,
		guessesLeft = 5,
		pastGuesses = [],
    	winningNumber = generateWinningNumber();
    	gameOver = false;

/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateWinningNumber() {
	return oneThroughOneHundred();
}

function oneThroughOneHundred() {
	return Math.floor(Math.random() * 100 + 1);
}

// Fetch the Players Guess

function playersGuessSubmission() {
	playersGuess = +$('#player-guess').val();
	$('#player-guess').val('');
	checkGuess();
}

// Determine if the next guess should be a lower or higher number

function lowerOrHigher() {
	return playersGuess - winningNumber;
}

function guessMessage() {
	var difference = lowerOrHigher();
	var distance = Math.abs(difference);
	var message;
	var withinRange;
	if (difference > 0) {
		message = "Too high.";
	} else {
		message = "Too low.";
	}

	if (distance <= 5) {
		withinRange = 5;
	} else if (distance <= 10) {
		withinRange = 10;
	} else if (distance <= 20) {
		withinRange = 20;
	}

	if (withinRange) {
		message += " Within " + withinRange + " digits of the winning number.";
	} else {
		message += " More than 20 digits from the winning number.";
	}
	
	return message;
}

// Check if the Player's Guess is the winning number 

function checkGuess() {
	var feedback, 
		prevGuessesMessage = "";
		validGuess = false;
	if (gameOver) {
		//Don't do anything until the 'Start New Game' button is pressed
	}
	else if (guessesLeft == 0) {
		feedback = "No more guesses! Click 'Start New Game' to play again.";
	} else if (isNaN(playersGuess)) {
		feedback = "Oops! Be sure to enter a number using the number keys.";
	} else if (!Number.isInteger(playersGuess) || playersGuess < 1 || playersGuess > 100) {
		feedback = "Oops! Be sure to enter an integer between 1 and 100.";
	} else if (playersGuess == winningNumber) {
		feedback = "Good guess! You win!";
		gameOver = true;
		$('#new-game').after("<h2 class='status' id='prize-announcement'>Here's your prize!</h2>");
		$('#prize-announcement').after("<img src='images/box_of_kittens.jpg' id='prize'>");
		$('#guesses-left').text('');
	} else if (pastGuesses.indexOf(playersGuess) != -1) {
		feedback = "You already guessed that number! Pick a different number this time.";
	} else if(guessesLeft == 1) {
		feedback = "Nope. The winning number was " + winningNumber + ".";
		guessesLeft--;
		gameOver = true;
		$('#new-game').after("<h2 class='status' id='prize-announcement'>You lost? How could you?</h2>");
		$('#prize-announcement').after("<img src='images/sad_kitten.jpg' id='prize'>");
		$('#guesses-left').text('');
	} else {
		validGuess = true;
		feedback = guessMessage();
		pastGuesses.push(playersGuess);
		guessesLeft--;
		for (var i = 0; i < pastGuesses.length; i++) {
			prevGuessesMessage = pastGuesses[i] + ", " + prevGuessesMessage;
		}
		prevGuessesMessage = "Guessed " + prevGuessesMessage + "just " + guessesLeft + " guess(es) left.";
	}
	$('#feedback').text(feedback);
	if (validGuess) {
		$('#guesses-left').text(prevGuessesMessage);
	}
}

// Create a provide hint button that provides additional clues to the "Player"

function provideHint(){
	if (!gameOver) {
		var output = "The winning number is ";
		var possibleNumbers = [winningNumber];
		var possibleNumber = oneThroughOneHundred();
		for (var i = 1; i < 2 * guessesLeft; i++) {
			while (possibleNumbers.indexOf(possibleNumber) != -1 || pastGuesses.indexOf(possibleNumber) != -1) {
				possibleNumber = oneThroughOneHundred();
			}
			possibleNumbers.push(possibleNumber);
		}

		possibleNumbers.sort(function(a, b) {
			return a - b;
		});

		for (var j = 0; j < 2 * guessesLeft - 1; j++) {
			output += possibleNumbers[j] + ", ";
		}

		output += "or " + possibleNumbers.pop();

		$('#feedback').text(output);
	}
}

// Allow the "Player" to Play Again

function playAgain(){
	$('#guesses-left').text("5 guesses left");
	$('#feedback').text("");
	$('#prize-announcement').remove();
	$('#prize').remove();
	winningNumber = generateWinningNumber();
	pastGuesses = [];
	guessesLeft = 5;
	gameOver = false;
}


/* **** Event Listeners/Handlers ****  */
$(document).ready(function() {
	$(document).keyup(function(event) {
		if (event.which == 13) {
			playersGuessSubmission();
		}
	});

	document.getElementById("hint").addEventListener("click", provideHint);

	document.getElementById("submit-guess").addEventListener("click", checkGuess);

	document.getElementById("new-game").addEventListener("click", playAgain);

});


}());







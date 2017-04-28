// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

var allGuesses = [];

$(function() {
  console.log('hello world :o');
  
  var Letters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'
  ];
  var randomArray = [];
  
  //var allGuesses = [];
  var currentGuessRow = [];
  var guessSize = 10;

  var currentRowIdx = 0;
  var currentRow;
  var currentRowLetters;
  var currentCol = 0;
  var isPlaying = true;
  
  $('#match-selector').change( function(event) {
    if (!isPlaying) { return; }
    var val = event.target.value;
    currentGuessRow.push(val);
    currentRow.append('<td>' + val + '</td>');
    currentRowLetters.push(val);
    currentCol++;
    $('#' + val).remove();
    $('#match-selector').val('');
    if (currentCol === 10) {
      allGuesses.push(currentGuessRow);
      currentRow.append('<td>' + sumCorrect()+ '</td>');
      addLetters();
      addRow();
      $('#numSolutions').text('Solutions: (re-calculating)');
      setTimeout( () => {
        console.log('triggered calc fn');
        var calc = calculation();  
        console.log(calc);
        $('#numSolutions').text('Solutions: '+ calc);  
      }, 10);
    }
  });

  $(document).ready(function(){
    console.log('document ready');
    randomizer();
    addLetters();
    addRow();
  });

  function addRow() { 
    $('.reset').on('click', restartGame);
    if (currentRowIdx >= 9 && isPlaying) { 
      //window.alert('You\'re out of tries, LOSER!');
      isPlaying = false;
      console.log('You\'re out of tries, LOSER!');
      $('main').append('<div class="message">You\'re out of tries, LOSER!</div>');
    } else {
      currentRowIdx++;
      $('#match-table').append("<tr id='row-" + currentRowIdx + "' class='guess-row'></tr>");
      currentGuessRow = [];
      currentRow = $('#row-' + currentRowIdx);
      currentRowLetters = [];
      currentCol = 0;
      addLetters();
    }
  }
  function restartGame() {
    allGuesses = [];
    
    $('.message').remove();
    randomArray = [];
    randomizer();           // make a new set of correct answers
    
    $('.guess-row').remove();
    currentRowIdx = 0;      // reset to first row of guesses      
    isPlaying = true;
    addRow();               // start a new guessing row
  }
  function sumCorrect() {
    let numCorrect = 0;
    console.log('guesses', currentRowLetters);
    console.log('real answer', randomArray);
    
    randomArray.forEach(function(currentVal, i, randomArray) {
      if (currentVal === currentRowLetters[i]) {
        numCorrect++;
        //console.log(numCorrect);
      }
    })
    if (numCorrect === 10) {
      isPlaying = false;
      console.log('You\'re a big winner!!');
      $('main').append('<div class="message">You\'re a big winner!!</div>');
    }
    allGuesses[allGuesses.length-1].push(numCorrect);
    return numCorrect;
  }
  function addLetters() {
    var matchSelector = $('#match-selector');
    let clearSelectors = $('#match-selector > option').remove();
    Letters.forEach( (val) => {
      matchSelector.append("<option value=" + val + " id=" + val + ">" + val + "</option>");
      //console.log('numSelectors', $('#match-selector > option').length);
    });
    matchSelector.val('');
  }
    
  function randomizer() {
    // assigns random ordering of letters to randomArray
    var letters = Letters.slice();
    while (letters.length > 0) {
      randomArray.push(letters.splice(Math.floor(Math.random()*letters.length), 1)[0]);
    };
    console.log(randomArray);
    //randomArray = Letters.slice();  // Set the randomArray to realorder for bugtesting
  }
  
  function calculation(currentSetup, lettersLeft) {
    if (!currentSetup) {
      var lettersLeft = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
      currentSetup = [];
    }
    if (currentSetup.length >= guessSize) {
      return 1;
    }
    var possibleCount = 0;
    var letter, nextSetup;
    for (var i=0; i<lettersLeft.length; i++) {
      letter = lettersLeft[i];
      nextSetup = currentSetup.concat(letter)
      if (isViolation(nextSetup)) { continue; }
      possibleCount += calculation(nextSetup, lettersLeft.slice(0, i).concat(lettersLeft.slice(i+1)));
    }
    return possibleCount;
  }

  function isViolation(currSetup) {
    for (var guessResult of allGuesses) {
      if (isViolationRow(currSetup, guessResult)) { return true; }
    }
    return false;
  }

  // returns true if this guess is not possible with this result row
  function isViolationRow(currSetup, guessResult) {
    var countCorrect = 0;
    var actualCount = guessResult[guessSize];
    for (var i=0; i < currSetup.length; i++) {
      if (currSetup[i] === guessResult[i]) {
        countCorrect++;
      }
    }
    if (countCorrect > actualCount) {
      return true;
    }
    if (countCorrect < actualCount && currSetup.length === guessSize) {
      return true;
    }
    return false;
  }
});
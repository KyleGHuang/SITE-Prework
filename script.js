// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var rand = Math.random() / 2; //prints a random number from 0.0 to 0.5
var mistakes = 3; //amount of tries you get

function startGame() {
  // initialize game variables
  progress = 0;
  gamePlaying = true;
  clueHoldTime = 1000;
  mistakes = 3;
  
  // create a random pattern
  randPattern();
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  //stop game variables
  gamePlaying = false;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  clueHoldTime -= 100;
  
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  //////////////
  //game logic//
  //////////////
  
  if(btn != pattern[guessCounter]) { // if guess is not right
    if(mistakes == 0) loseGame(); // if you are out of tries, you lose
    else {
      mistakes--;
      guessCounter = 0; //restart turn
      if(mistakes == 1) alert("You have " + mistakes + " more chance.");
      else alert("You have " + mistakes + " chances left.");
    }
  } 
  //if you don't make a mistake
  else if(guessCounter != progress) guessCounter++; // if turn is not over, proceed with turn
  else if(progress != pattern.length - 1) { // if its not the last turn, progress turn and play clue sequence
    progress++;
    playClueSequence();
  }
  else winGame();
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function randPattern() {
  // if a pattern array exists, clear it
  while(pattern[0] != undefined) {
    pattern.pop();
  }
  
  // fill pattern array with integers 1-5, eight times
  for(let i = 0; i < 8; i++) {
    rand = Math.random() / 2 * 10;
    pattern.push(Math.ceil(rand));
  }
}





//////////////////////////////
// Sound Synthesis Functions//
//////////////////////////////
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 567
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
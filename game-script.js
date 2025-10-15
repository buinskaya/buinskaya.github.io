const nballs = 55;
const ntrials = 9;
let flipResult = null;
let opposite = null;
let colors = null;
let guess = null;
let P2guess = null;
let trialsDone = 0;
let countH = 0;
let countT = 0;

// CREATE EMPTY BALLS
function createBalls() {
    const ballsContainer = document.getElementById("ball-container");
    for (let i = 0; i < 100; i++) {
        const ball = document.createElement('div');
        ball.classList.add('ball','active');
        ball.id = `${i}`;
        ball.onclick = sampleBalls;
        ballsContainer.appendChild(ball);
    }
}

// FLIP THE COIN
// nballs: number of majority color balls; integer between 51 and 100
function flipCoin() {
    // Get button and message elements:
    const flipButton = document.getElementById('flipButton');
    const flipMessage = document.getElementById('flipMessage');
    const boxMessage = document.getElementById('boxMessage');
    const boxFill = document.getElementById("boxFill");
    const filledBar = document.getElementById('filledBar');
    // animate the button
    flipButton.disabled=true;
    flipButton.classList.add("animate");
    flipButton.textContent = '';
    // Indicate the coin is flipping
    flipMessage.textContent = 'Flipping the coin...';
    // Flip the coin
    flipResult = Math.random() < 0.5 ? 'H' : 'T'; // H for heads, T for tails
    // value for the result opposite of the coin flip
    opposite = flipResult === 'H' ? 'T' : 'H';
    // Set up color array
    colors = Array(nballs).fill(flipResult).concat(Array(100-nballs).fill(opposite));
    // Shuffle the colors array
    colors.sort(() => Math.random() - 0.5);
    // Simulate delay
    setTimeout(() => {
    // Indicate the coin has been flipped
        flipMessage.textContent = 'The outcome has been recorded.';
        boxMessage.textContent = 'Filling up the box...';
        boxFill.style.display="flex";
        move(filledBar);
    }, 1500); // 1500ms for the flip delay
    setTimeout(() => {
        // Disable the button on click
        flipButton.classList.add("hidden");
        document.getElementById('signalSection').classList.remove('hidden');
        boxMessage.textContent = 'The box is ready.';
    }, 3000); // 1500ms more for the box delay
}


//Factorial
function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Probability the outcome is H given the current sample
function probabilityH(nballs, trialsDone, countH) {
    x=factorial(nballs-trialsDone+countH)*factorial(100-nballs-countH)/(factorial(nballs-trialsDone+countH)*factorial(100-nballs-countH)+factorial(nballs-countH)*factorial(100-nballs-trialsDone+countH));
    return x;
}

// SAMPLE BALLS
function sampleBalls() {   
    if (!this.classList.contains("active")) return;
    const colorID = +this.id;
    const color = `${colors[colorID]}`;
    const probH = document.getElementById("probH");
    const probT = document.getElementById("probT");
    this.classList.remove("active");
    this.classList.add("selected",color);
    trialsDone++;// update number of trials
    if (color === "H") {
        countH++;
        document.getElementById('countH').textContent=`${countH}`;
    } else {
        countT++;
        document.getElementById('countT').textContent=`${countT}`;
    };
    pH = 100*probabilityH(nballs, trialsDone, countH);
    pT = 100-pH;
    probH.textContent=pH.toFixed(1);
    probT.textContent=pT.toFixed(1);
    // Update Remaining trials count
    document.getElementById('trialsRemain').textContent=ntrials-trialsDone;
    // End if the trials ran out
    if (trialsDone === ntrials) {
        const balls = document.querySelectorAll('.ball');
        balls.forEach(ball => {
            ball.onclick = null;
            ball.classList.remove('active'); // Remove the 'active' class
            // Reveal the guess section
            document.getElementById('guessSection').classList.remove('hidden');
        });
    };
}

// RECORD GUESS
function recordGuess(guess) {
    // Retrieve elements
    const buttons = document.querySelectorAll('.guessButton');  
    const choiceSection = document.getElementById('choiceSection');
    const guessMessage = document.getElementById('guessMessage');
    // Loop through the NodeList and disable both guess buttons
    buttons.forEach(button => {
        button.disabled = true;
    });
    if (guess === 'H') {
        guessMessage.textContent = "BLUE";
        guessMessage.style.color = "#008CBA";
        document.querySelector('.guessButton.T').classList.remove('T');
    } else {
        guessMessage.textContent = "RED";
        guessMessage.style.color = "#f44336";
        document.querySelector('.guessButton.H').classList.remove('H');
    };
    choiceSection.classList.remove('hidden');
    return guess;
}

// SIMULATE PLAYER 2'S CHOICE
function p2action(action, a) {
    const choiceButtons = document.querySelectorAll('.choiceButton');
    const P2message = document.getElementById('P2message');
    const P2guessMessage = document.getElementById('P2guessMessage');
    const choiceMessage = document.getElementById('choiceMessage');
    const P2seenMessage = document.getElementById('P2seenMessage');
    // Disable buttons
    choiceButtons.forEach(button => {
        button.disabled = true;
        if (button.id===action) {button.classList.add("selected")};
    });
    P2message.textContent = 'Player 2 is making a choice...';
    // If P1 shared her signal, follow it whenever p>a/(1+a);
    // otherwise, choose the opposite to force a draw
    const threshold = a/(1+a);
    // P1's signal
    const maj = countH > (ntrials-1)/2 ? 'H' : 'T';
    const pH = probabilityH(nballs, ntrials, countH);
    const pT = 1-pH;
    // If P1 shared, follow their signal for p>threshold;
    // Otherwise, choose the opposite action
    if (action === 'share') {
        choiceMessage.textContent = 'SHOW';
        P2seenMessage.textContent = 'your ball selection and your guess';
        // if pH>threshold, choose H;
        // otherwise, choose T
        if (maj=== 'H') {
            P2guess=pH >= threshold ? 'H' : 'T';
        } else {
        // if pT>threshold, choose T;
        // otherwise, choose H;
            P2guess=pT >= threshold ? 'T' : 'H';
        };
    } else {
    // If P1 did not share, pick one ball from the "informative box" and follow it
        choiceMessage.textContent = 'KEEP';
    P2guess=Math.random() < nballs/100 ? flipResult : opposite;
    };
    // Record P2's choice
    if (P2guess === 'H') {
            P2guessMessage.textContent = "BLUE";
            P2seenMessage.textContent='one BLUE ball';
            P2guessMessage.style.color = "#008CBA";
    } else {
            P2guessMessage.textContent = "RED";
            P2guessMessage.style.color = "#f44336";
            P2seenMessage.textContent='one RED ball';
    };
}

// reveal colors
function revealColors(balls) {
    // Assign colors to the balls
    balls.forEach(ball => {
        const color = `${colors[+ball.id]}`;
        ball.classList.add(color);
    });
}
    
// REVEAL RESULTS
function revealResult(action, a) {
    const coinFlipMessage = document.getElementById('coinFlipMessage');
    const gameMessage = document.getElementById('gameMessage');
    const balls = document.querySelectorAll('.ball:not(.selected)');
    const P2message = document.getElementById('P2message');
    const resultSection = document.getElementById('resultSection');
    // simulate P2's choice
    p2action(action);
    // reveal flip Result
    if (flipResult === 'H') {
        coinFlipMessage.textContent = "BLUE";
        coinFlipMessage.style.color = "#008CBA";
    } else {
        coinFlipMessage.textContent = "RED";
        coinFlipMessage.style.color = "#f44336";
    };
    // Game 2 result:
    if (guess === P2guess) {
        if (guess === flipResult) {
            gameMessage.textContent = "Yay! YOU GUESSES MATCHED AND ARE CORRECT. You will receive a bonus if this round is selected for payment.";
            } else {
            gameMessage.textContent = "Oh no! YOUR GUESSES MATCHED BUT ARE INCORRECT. You will pay a penalty if this round is selected for payment.";
            };
        } else {
            gameMessage.textContent = "Your guesses mismatched. Your final payment will not change if this round is selected.";        
    };
    setTimeout(() => {
        P2message.textContent = 'All choices have been recorded.';
        // Reveal the result section
        resultSection.classList.remove('hidden');
        revealColors(balls);
    }, 1500);
}


// RESET THE GAME
function resetGame() {
    // Reset the flip button section
    const flipButton=document.getElementById('flipButton');
    const boxFill=document.getElementById('boxFill');
    const filledBar = document.getElementById('filledBar');
    flipButton.disabled = false;
    flipButton.classList.remove("animate", "hidden");
    flipButton.textContent = 'Click!';
    boxFill.style.display='none';
    filledBar.style.width="0";
    document.getElementById('flipMessage').textContent = '';
    flipResult = null;// Clear the coin flip
    
    // Reset the signal section
    const balls = document.querySelectorAll('.ball:not(.count)');
    balls.forEach(ball => {
        ball.onclick = sampleBalls; // Reattach the event handler
        ball.className = 'ball'; // Reset the classes
        ball.classList.add('active'); // Make balls appear clickable again
    });
    document.getElementById('probH').textContent = '50.0';
    document.getElementById('probT').textContent = '50.0';
    document.getElementById('countH').textContent = '0';
    document.getElementById('countT').textContent = '0';
    document.getElementById('trialsRemain').textContent = ntrials;
    document.getElementById('signalSection').classList.add('hidden');
    colors = null;
    trialsDone = 0;
    countH = 0;
    countT = 0;
    
    // Reset the guess section
    const guessButtons = document.querySelectorAll('.guessButton');
    const notGuess = guess === 'H' ? 'T' : 'H';
    guessButtons.forEach(button => {
        button.disabled = false;// Reset the guess buttons
        if (!button.classList.contains(guess)) {button.classList.add(notGuess)}; 
    });
    document.getElementById('guessSection').classList.add('hidden');
    guess = null;
    opposite = null;
    
    // Reset choice section
    const choiceButtons = document.querySelectorAll('.choiceButton');
    choiceButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove("selected");
    });
    document.getElementById("P2message").textContent = '';
    document.getElementById('choiceSection').classList.add('hidden');
    P2guess = null;
    
    // Reset the result section
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('gameMessage').textContent = '';
    document.getElementById("P2guessMessage").textContent = '';
    document.getElementById('P2seenMessage').textContent = '';
    document.getElementById('choiceMessage').textContent = '';
}


// LAYOUT
// Acknowledge rules 
function acknowledge(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById("rulesSection").classList.add("panel");
    document.getElementById("rules-accordion").classList.remove("hidden");
}

//Rules accordion
function accordion(x) {
    x.classList.toggle("active");
    var panel = x.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
}

// Information buttons
function openIBtn(x) {
        const modal = document.getElementById(`explanationModal${x}`);
        modal.style.display = 'block';
    }        
function closeIBtn(x) {
    const modal = document.getElementById(`explanationModal${x}`);
    modal.style.display = 'none';
}    
function closeByOutClick(event) {
    const modals=document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {modal.style.display = 'none'};
    });
}

// Box fill progress bar
function move(x) {
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++; 
      x.style.width = width + '%'; 
      x.innerHTML = width * 1  + '%';
    }
  }
}


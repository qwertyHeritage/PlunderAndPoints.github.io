const MAX_DIE_SIDES = 6;
const WINNING_SCORE = 100;

class Dice {
    #sides;
    #currentValue;

    constructor() {
        this.#sides = MAX_DIE_SIDES;
        this.#currentValue = 0;
    }

    get currentValue() {
        return this.#currentValue;
    }
    // Roll a random number between 1 and 6 
    roll() {
        this.#currentValue = Math.floor(Math.random() * this.#sides) + 1;
        return this.#currentValue;
    }
}

class Player {
    #firstName; 
    #lastName;  
    #score;

    constructor(firstName, lastName, userName, phoneNumber, city, emailAddress) {
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.city = city;
        this.emailAddress = emailAddress;
        this.#score = 0;

    }

    get score() { 
        return this.#score;
    }
    set score(s) {
        this.#score = s;
    }

    getFullName() {
        return (`${this.#firstName} ${this.#lastName}`)
    }
}

class Game {
    #players; 
    #maxRounds; 
    #currentRound; 
    #turnScore;

    constructor(p1, p2, rounds) {
        // Using an array to hold the two players
        this.#players = [p1, p2]; 
        this.#maxRounds = rounds;
        this.#currentRound = 1;
        this.activePlayerIndex = 0;
        this.#turnScore = 0;
    }

    get turnScore() {
        return this.#turnScore;
    }
    get currentRound() {
        return this.#currentRound;

    }
    get players() {
        return this.#players;
    }

    // Logic for a single roll
    processRoll(rollValue) {
        if (rollValue === 1) {
            this.#turnScore = 0;
            this.switchTurn();
            return false;
        } else {
            this.#turnScore += rollValue;
            return true;
        }
    }

    // Logic for holding points
    hold() {
        const currentPlayer = this.players[this.activePlayerIndex];
        currentPlayer.score += this.turnScore;
        this.#turnScore = 0;
        this.switchTurn();
    }

    switchTurn() {
        if (this.activePlayerIndex === 1) {
            this.#currentRound++;
        }
        this.activePlayerIndex = (this.activePlayerIndex === 0) ? 1 : 0;
    }

    determineWinner() {
        const player1 = this.#players[0];
        const player2 = this.#players[1];

        if (player1.score >= WINNING_SCORE) {
            return player1.userName;
        } 
        if (player2.score >= WINNING_SCORE) {
            return player2.userName;
        }

        if (this.#currentRound > this.#maxRounds) {
            if (player1.score > player2.score) {
                return player1.userName;
            } else if (player2.score > player1.score) {
                return player2.userName;
            }
        }
        return `No winner yet`;
    }
}

function validateRounds() {
    const field = document.getElementById("numRounds");
    const error = document.getElementById("roundError");
    const val = field.value.trim();

    // Validate input to ensure number is between 1 and 11
    if (val === "" || isNaN(val) || val < 1 || val > 11) {
        error.textContent = "Please enter a number between 1 and 11.";
        return false;
    }

    error.textContent = "";
    return true;
}

const roundInput = document.getElementById("numRounds");
if (roundInput) {
    roundInput.addEventListener("change", validateRounds);
}

const p1 = new Player(localStorage.getItem('firstName'), 
    localStorage.getItem('lastName'), 
    localStorage.getItem('username'),
    localStorage.getItem('phone'),
    localStorage.getItem('city'),
    localStorage.getItem('email'));
const p2 = new Player("Computer", "AI", "BlackbeardBot", "000-000-0000", "The Pirate Cove", "bot@pirate.com");
const gameDice = new Dice()

let myGame = null;

const roundForm = document.getElementById("roundForm");
if (roundForm) {
    roundForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (validateRounds()) {
            const totalRounds = document.getElementById("numRounds").value;
        
            myGame = new Game(p1, p2, parseInt(totalRounds));

            document.getElementById("game-setup").style.display = "none";
            document.getElementById("game-arena").style.display = "block";

            playTurn();
        }
    });
}

function playTurn() {
const roll = gameDice.roll();
    document.getElementById("die-img").src = "./images/die" + roll + ".png";

    const stillTurn = myGame.processRoll(roll);
    
    if (!stillTurn) {
        updateDisplay("Ouch! A 1! Passing turn to the computer...");
        const winnerStatus = myGame.determineWinner();
        if (winnerStatus.includes("No winner")) {
            setTimeout(computerTurn, 1500);
        }
    } else {
        updateDisplay("You rolled a " + roll + "! Keep rolling or secure your gold!");
    }
}

function updateDisplay(message) {
    document.getElementById("p1-score").textContent = p1.score;
    document.getElementById("p2-score").textContent = p2.score;
    document.getElementById("round-tracker").textContent = "Round: " + myGame.currentRound;
    document.getElementById("game-messages").textContent = message;

    const winnerStatus = myGame.determineWinner();
    if (!winnerStatus.includes("No winner")) {
        document.getElementById("game-messages").innerHTML = "<h2> Winner: " + winnerStatus + "</h2>";
        document.getElementById("btnRoll").disabled = true;
        document.getElementById("btnHold").disabled = true;
    }
}

function computerTurn() {
    document.getElementById("btnRoll").disabled = true;
    document.getElementById("btnHold").disabled = true;

    let compTurnScore = 0;
    const rollDelay = 1000;

    const executeRoll = () => {
        const roll = gameDice.roll();
        document.getElementById("die-img").src = "./images/die" + roll + ".png";

        if (roll === 1) {
            updateDisplay("The Computer rolled a 1! Turn over.");
            endComputerTurn();
        } else {
            compTurnScore += roll;
            myGame.processRoll(roll);

            if (compTurnScore >= 10) {
                myGame.hold();
                updateDisplay("The Computer secured " + compTurnScore + " gold!");
                endComputerTurn();
            } else {
                updateDisplay("The Computer is rolling again...");
                setTimeout(executeRoll, rollDelay);
            }
        }
    };

    setTimeout(executeRoll, rollDelay);
}

function endComputerTurn() {
    const winnerStatus = myGame.determineWinner();
    if (winnerStatus.includes("No winner")) {
        document.getElementById("btnRoll").disabled = false;
        document.getElementById("btnHold").disabled = false;
    }
}

document.getElementById("btnLeave").addEventListener("click", function() {
    localStorage.setItem("lastScore", p1.score);
    const finalMessage = "Thanks for playing! Final Score - You: " + p1.score + " | Computer: " + p2.score;

    const finalDiv = document.createElement("div");
    finalDiv.className = "final-screen";
    
    const heading = document.createElement("h1");
    heading.textContent = finalMessage;
    
    const reloadBtn = document.createElement("button");
    reloadBtn.id = "btnNewVoyage";
    reloadBtn.textContent = "New Voyage?";
    
    finalDiv.appendChild(heading);
    finalDiv.appendChild(reloadBtn);
    
    document.body.innerHTML = "";
    document.body.appendChild(finalDiv);

    document.getElementById("btnNewVoyage").addEventListener("click", function() {
        location.reload();
    });
});

document.getElementById("btnRoll").addEventListener("click", function() {
    playTurn();
});

document.getElementById("btnHold").addEventListener("click", function() {
    myGame.hold();
    updateDisplay("You secured your gold! Computer's turn...");
    const winnerStatus = myGame.determineWinner();
    if (winnerStatus.includes("No winner")) {
        setTimeout(computerTurn, 1000);
    }
});

$(function() {
    const fName = localStorage.getItem("firstName");
    const lName = localStorage.getItem("lastName");
    const phone = localStorage.getItem("phone");
    const city = localStorage.getItem("city");
    const lastVisit = localStorage.getItem("lastVisit");
    
    const prevScore = localStorage.getItem("lastScore") || "0";

    if (fName && lName) {
        const welcomeHtml = `
            <div class="welcome-box">
                <p>Ahoy, ${fName} ${lName}.</p>
                <p>Your carrier pigeon number is: ${phone} and your home port is ${city}.</p>
                <p>Your score from previous game was ${prevScore}.</p>
                <p>Your last visit was ${lastVisit ? lastVisit : "First Voyage"}.</p>
                <p>Not ${fName} ${lName}? <a href="#" id="changeCredentials">Change your credentials</a></p>
            </div>
        `;
        
        $("#crew-info").html(welcomeHtml);
    }

    $(document).on("click", "#changeCredentials", function(e) {
        e.preventDefault(); 
    
        const playerFinalGold = $("#p1-score").text() || "0";
        const computerFinalGold = $("#p2-score").text() || "0";
    
        alert(
         "☠️ Thank you for playing Plunder & Points! ☠️\n\n" +
         "Final Voyage Standings:\n" +
         "• Your Crew: " + playerFinalGold + " Gold Pieces\n" +
         "• Enemy Fleet: " + computerFinalGold + " Gold Pieces\n\n" +
         "Safe travels back to port, matey!"
        );

        localStorage.clear(); 
        window.location.href = "intro.html"; 
    });

    const now = new Date().toLocaleString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
    localStorage.setItem("lastVisit", now);
});
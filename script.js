let xp=0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

//js interacts html using document object model or DOM
//Dom is tree of objects that represent the html elements
//Access html using document object
//The querySelector() method takes a CSS selector as an argument and returns the first element that matches that selector.

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

//In your role playing game, you will be able to visit different locations like the store, the cave, and the town square. You will need to create a data structure that will hold the different locations.
const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You are in the store. What would you like to do?"
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold."
    },
    {
        name: "lose",
        "button text": ["Restart", "Restart", "Restart"],
        "button functions": [restart, restart, restart],
        text: "You die. &#x2620;"
    },
    {
        name: "win",
        "button text": ["Restart", "Restart", "Restart"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
    },
    {
        name: "easter egg",
        "button text": ["Pick 2", "Pick 8", "Go to town square"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
]; //store, cave, town square and each location will be represented by an object

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

function buyHealth() {
    if (gold >= 10) {
        gold = gold - 10;
        health = health + 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else {
        text.innerText = "You do not have enough gold to buy health.";
    }
}

function sellWeapon() {
    if(inventory.length > 1) {
        gold+=15;
        goldText.innerText = gold;
        let currentWeapon;
        //The shift() method on an array removes the first element in the array and returns it and assigns it to the variable as above.
        currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + " for 15 gold.";
        text.innerText += " In your inventory you have: " + inventory.join(", ");
    }
    else
    {
        text.innerText = "Don't sell your only weapon!";
    }
}
function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            inventory.push(newWeapon);
            text.innerText = "You bought a " + newWeapon + "." + " In your inventory you have: " + inventory.join(", ");//plus inventory would also work;

        }
        else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    }
    else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}


function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function fightSlime() {
    fighting = 0;//index of slime in monsters array
    goFight(locations[3]);
}
function fightBeast() { 
    fighting = 1;
    goFight(locations[3]);
}

function fightDragon() {
    fighting = 2;
    goFight(locations[3]);
}

function goFight(location){
    update(location);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack(){
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " +  weapons[currentWeapon].name + ".";
    //dynamic attack value
    health -= getMonsterAttackValue(monsters[fighting].level);
    if(isMonsterHit()){
        monsterHealth -= weapons[currentWeapon].power + ( Math.floor(Math.random()*xp) + 1);
    }
    else
    {
        text.innerText += " You miss.";
    }
    
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if(health<=0)
    {
        lose();
    }
    else if(monsterHealth<=0)
    {
        if(fighting === 2)
        {
            winGame();
        }
        else{
        defeatMonster();
        }
    }
    //is the weapon breaks
    if(Math.random()<=.1 && inventory.length !==1)
    {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon --;
    }
}

function getMonsterAttackValue(level){
    //The attack of the monster will be based on the monster's level and the player's xp
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);//debugging purpose
    return hit>0?hit:0;

}
function isMonsterHit(){
    return Math.random() > 0.2 || health < 20;
}
function dodge(){
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
    
}

function lose(){
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
}
function defeatMonster(){
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp; 
    update(locations[4]);
}

function restart()
{
    xp=0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function easterEgg()
{
    update(locations[7]);
}
function pick(guess)
{
    const numbers = [];
    while(numbers.length<10)
    {
        numbers.push(Math.floor(Math.random()*11));
    }
    text.innerText = "You picked "+ guess + ". Here are the random numbers:\n";
    for(let i=0; i<numbers.length; i++)
    {
        text.innerText += numbers[i] + "\n";
    }
    // The .includes() method determines if an array contains an element and will return either true or false.
    if(numbers.includes(guess))
    {
        text.innerText += "You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    }
    else
    {
        text.innerText += "You lose 10 health!";
        health-=10;
        healthText.innerText = health;
        if(health<=0)
        {
            lose();
        }
    }
}
function pickTwo()
{
    pick(2);
}
function pickEight()
{
    pick(8);
}
//initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;


//The innerText property controls the text that appears in an HTML element.

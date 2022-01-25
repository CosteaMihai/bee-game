import {
    computeSwarnHP,
    restartGame,
    computeHPBeeSwarm,
    manageBeeIcon,
} from "./helpers.js";
import {
    BeesTypeDamageEnum,
    BeesTypeEnum,
    beeSwarms,
    container,
    modal,
    modalContent,
    gameDataFromCookie,
    userDataFromCookie,
} from "./contants.js";

let aliveBees = [];
let username = userDataFromCookie || "";

const init = () => {
    if (gameDataFromCookie) {
        aliveBees = gameDataFromCookie;
    }

    if (!username) {
        displayUserModal();
        return;
    }

    displayUserInfo();
    displayBeeContainer();
    displayHitButton();
};

const displayBeeContainer = () => {
    container.innerHTML +=
        '<div id="bee-container" class="flex flex-spaced"> </div>';

    let id = 1;

    beeSwarms.forEach((swarn) => {
        if (!gameDataFromCookie) {
            Array(swarn.noOfBees)
                .fill("")
                .forEach(() => {
                    aliveBees.push({
                        id: id++,
                        swarnId: swarn.id,
                        hp: swarn.hpOfOneBee,
                        maxHp: swarn.hpOfOneBee,
                    });
                });
        }

        displayBeeSection(swarn);
    });
};

const displayBeeSection = (beeSwarm) => {
    const beeContainer = document.getElementById("bee-container");

    const beesOfSwarn = aliveBees.filter((bee) => bee.swarnId === beeSwarm.id);

    let output = `
    <div id='${beeSwarm.name}' class="bee-swarm text-center">
        <div class="bee-swarm-title"> ${beeSwarm.displayName} </div>
        <div id='${
          beeSwarm.name
        }-hp' class="bee-swarm-hp"> HP: ${computeSwarnHP(beesOfSwarn)} </div>
        <div id='${beeSwarm.name}-bees' class="bee-swarm-bees"></div>
    </div>
    `;
    beeContainer.innerHTML += output;

    const beeIcons = document.getElementById(`${beeSwarm.name}-bees`);

    beesOfSwarn.forEach((bee) => {
        output = `<img id="bee-${bee.id}" class='bee-icon' src='./assets/${beeSwarm.icon}.png'>`;
        beeIcons.innerHTML += output;

        if (gameDataFromCookie) {
            manageBeeIcon(aliveBees, bee, null);
        }
    });
};

const displayUserInfo = () => {
    let output = `
    <div class="text-center user-info">
       Hello, ${username}!
    </div>
`;
    container.innerHTML += output;
};

const displayHitButton = () => {
    let output = `
        <div class="hit-button-container flex flex-column flex-al-center">
            <div id="hit-message" class="text-center hit-message"></div>
            <button id="hit-button" class="hit-button"> Hit </button>
        </div>
    `;

    container.innerHTML += output;

    const button = document.getElementById("hit-button");
    button.addEventListener("click", handleHit);
};

const handleHit = () => {
    const random = Math.floor(Math.random() * aliveBees.length);
    const selectedBee = aliveBees[random];

    if (selectedBee.swarnId === BeesTypeEnum.queen) {
        selectedBee.hp -= BeesTypeDamageEnum.queen;
    }

    if (selectedBee.swarnId === BeesTypeEnum.worker) {
        selectedBee.hp -= BeesTypeDamageEnum.worker;
    }

    if (selectedBee.swarnId === BeesTypeEnum.drone) {
        selectedBee.hp -= BeesTypeDamageEnum.drone;
    }

    displayHitMessage(selectedBee);
    computeHPBeeSwarm(aliveBees, beeSwarms, selectedBee);
    manageBeeIcon(aliveBees, selectedBee, random);

    if (aliveBees.length) {
        localStorage.setItem("aliveBees", JSON.stringify(aliveBees));
    }

    checkGameEnd();
};

const displayHitMessage = (bee) => {
    const message = document.getElementById("hit-message");

    let beeTypeAsText = "";
    let beeDamage = 0;

    if (bee.swarnId === BeesTypeEnum.queen) {
        beeTypeAsText = "QUEEN";
        beeDamage = BeesTypeDamageEnum.queen;
    }

    if (bee.swarnId === BeesTypeEnum.worker) {
        beeTypeAsText = "WORKER";
        beeDamage = BeesTypeDamageEnum.worker;
    }

    if (bee.swarnId === BeesTypeEnum.drone) {
        beeTypeAsText = "DRONE";
        beeDamage = BeesTypeDamageEnum.drone;
    }

    if (message) {
        message.innerHTML = `You hit the ${beeTypeAsText} and produce the damage of ${beeDamage} HP`;

        setTimeout(() => {
            message.innerHTML = "";
        }, 1500);
    }
};

const displayUserModal = () => {
    if (modalContent) {
        modalContent.innerHTML += `
                <h3 class="text-center">Rules</h3>
                <ul>
                    <li>The game consits of 3 bee swarns: Queen, Workers and Drones</li>
                    <li>The goal is to kill all the swarns by clicking the 'Hit' button</li>
                    <li>The HP is distributed as follow: 100 HP for the Queen, 75 HP for the Worker and 50 HP for the Drone</li>
                    <li>When the hit button is clicked a random bee is chosen and receives damage</li>
                    <li>The damage is distributed as follow: 8 HP for the Queen, 10 HP for the Worker and 12 HP for the Drone</li>
                    <li>The game ends when all the bees died or the queen is killed</li>
                </ul>

                <div class="modal-username flex flex-column flex-al-center"> 
                    <p>In order to proceed you need to insert a username</p>
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="King2712">
                    <button id="continue-button" class="hit-button disabled"> Continue </button>
                </div>
        `;
    }

    const input = document.getElementById("username");
    const button = document.getElementById("continue-button");
    input.addEventListener("input", usernameChange);
    button.addEventListener("click", confirmModal);

    modal.style.display = "block";
};

const usernameChange = () => {
    const input = document.getElementById("username");

    if (input) {
        username = input.value;
        const confirmModal = document.getElementById("continue-button");

        if (username) {
            confirmModal.classList.remove("disabled");
        }

        if (!username) {
            confirmModal.classList.add("disabled");
        }
    }
};

const confirmModal = () => {
    if (!username) {
        return;
    }

    modal.style.display = "none";

    localStorage.setItem("username", username);
    init();
};

const checkGameEnd = () => {
    const queen = aliveBees.find((bee) => bee.swarnId === BeesTypeEnum.queen);

    if (aliveBees.length && queen) {
        return;
    }

    modalContent.innerHTML = `
        <h3 class="text-center">Game over</h3>
        <p class="text-center">The game is over, if you want to play more click the restart button</p>
        <button id="restart-button" class="hit-button"> Restart </button>
    `;

    const button = document.getElementById("restart-button");
    button.addEventListener("click", restartGame);

    localStorage.removeItem("aliveBees");
    modal.style.display = "block";
};

init();
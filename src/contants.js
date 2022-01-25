export const BeesHPEnum = {
    queen: 100,
    worker: 75,
    drone: 50,
};

export const BeesTypeDamageEnum = {
    queen: 8,
    worker: 10,
    drone: 12,
};

export const BeesTypeEnum = {
    queen: 1,
    worker: 2,
    drone: 3,
};

export const beeSwarms = [{
        id: BeesTypeEnum.queen,
        name: "queen",
        displayName: "Queen",
        noOfBees: 1,
        hpOfOneBee: BeesHPEnum.queen,
        icon: "bee",
    },
    {
        id: BeesTypeEnum.worker,
        name: "worker",
        displayName: "Worker",
        noOfBees: 5,
        hpOfOneBee: BeesHPEnum.worker,
        icon: "bee",
    },
    {
        id: BeesTypeEnum.drone,
        name: "drone",
        displayName: "Drone",
        noOfBees: 8,
        hpOfOneBee: BeesHPEnum.drone,
        icon: "bee",
    },
];

export const container = document.getElementById("app");
export const modal = document.getElementById("modal");
export const modalContent = document.getElementById("modal-content");

export const gameDataFromCookie = JSON.parse(localStorage.getItem("aliveBees"));
export const userDataFromCookie = localStorage.getItem("username");
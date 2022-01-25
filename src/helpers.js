export const calculateRemainingHPPercentage = (bee) => {
    return (bee.hp * 100) / bee.maxHp / 100;
};

export const computeSwarnHP = (bees) => {
    let sum = 0;

    bees.forEach((bee) => {
        if (bee.hp > 0) {
            sum += bee.hp;
        }
    });

    return sum;
};

export const restartGame = () => {
    location.reload();
};

export const computeHPBeeSwarm = (aliveBees, beeSwarms, selectedBee) => {
    const swarnHP = document.getElementById(
        `${beeSwarms.find((swarm) => swarm.id === selectedBee.swarnId).name}-hp`
    );

    swarnHP.innerHTML = `HP: ${computeSwarnHP(
    aliveBees.filter((bee) => bee.swarnId === selectedBee.swarnId)
  )}`;
};

export const manageBeeIcon = (aliveBees, bee, random) => {
    const beeImage = document.getElementById(`bee-${bee.id}`);
    const percentage = calculateRemainingHPPercentage(bee);

    if (bee.hp > 0) {
        beeImage.setAttribute(
            "style",
            `opacity:${percentage}; -moz-opacity:${percentage}; filter:alpha(opacity=${percentage})`
        );
    }

    if (bee.hp < 1) {
        beeImage.remove();
        aliveBees.splice(random, 1);
    }
};
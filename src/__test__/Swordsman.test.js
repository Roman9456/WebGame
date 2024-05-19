import Swordsman from "../js/characters/Swordsman";

test('check create Swordsman && travel && attack', () => {
    const swordsman = new Swordsman(4);
    expect(swordsman).toEqual({
        level: 4,
        attack: 232,
        defence: 57,
        health: 100,
        type: 'swordsman',
        travelRadius: 4,
        attackRadius: 1
        });

    const travelRadiusIndex = swordsman.travelRadiusIndex(54, 8);
    expect(travelRadiusIndex).toEqual([53, 52, 51, 50, 55, 46, 38, 30, 22, 62, 45, 36, 27, 18, 47, 61, 63]);    

    const attackRadiusIndex = swordsman.attackRadiusIndex(32, 8);
    expect(attackRadiusIndex).toEqual([24, 25, 33, 40, 41]);

    swordsman.health -= 90;
    swordsman.levelUp();
    expect(swordsman).toEqual({
        level: 5,
        attack: 394,
        defence: 96,
        health: 90,
        type: 'swordsman',
        travelRadius: 4,
        attackRadius: 1
        });
})

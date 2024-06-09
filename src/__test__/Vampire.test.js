import Vampire from "../js/characters/Vampire";

test('check create Vampire && travel && attack', () => {
    const vampire1 = new Vampire(1);
    expect(vampire1).toEqual({
        level: 1,
        attack: 25,
        defence: 25,
        health: 50,
        type: 'vampire',
        travelRadius: 2,
        attackRadius: 2
        });
    
    const vampire = new Vampire(3);
    expect(vampire).toEqual({
        level: 3,
        attack: 81,
        defence: 81,
        health: 100,
        type: 'vampire',
        travelRadius: 2,
        attackRadius: 2
        });
    const travelRadiusIndex = vampire.travelRadiusIndex(9, 8);
    expect(travelRadiusIndex).toEqual([8, 10, 11, 1, 17, 25, 0, 2, 16, 18, 27]);
    
    const attackRadiusIndex = vampire.attackRadiusIndex(10, 8);
    expect(attackRadiusIndex).toEqual([0, 1, 2, 3, 4, 8, 9, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28]);
})
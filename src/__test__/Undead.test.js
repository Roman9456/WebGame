import Undead from "../js/characters/Undead";

test('check create Undead && travel && attack', () => {
    const undead1 = new Undead(1);
    expect(undead1).toEqual({
        level: 1,
        attack: 40,
        defence: 10,
        health: 50,
        type: 'undead',
        travelRadius: 4,
        attackRadius: 1
        });

    const undead = new Undead(4);
    expect(undead).toEqual({
        level: 4,
        attack: 232,
        defence: 57,
        health: 100,
        type: 'undead',
        travelRadius: 4,
        attackRadius: 1
        });

    const travelRadiusIndex = undead.travelRadiusIndex(49, 8);
    expect(travelRadiusIndex).toEqual([48, 50, 51, 52, 53, 41, 33, 25, 17, 57, 40, 42, 35, 28, 21, 56, 58]);    
    
    const attackRadiusIndex = undead.attackRadiusIndex(60, 8);
    expect(attackRadiusIndex).toEqual([51, 52, 53, 59, 61]);
})
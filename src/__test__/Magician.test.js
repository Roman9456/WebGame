import Magician from "../js/characters/Magician";

test('check create Magician && travel && attack', () => {
    const magician = new Magician(3);
    expect(magician).toEqual({
        level: 3,
        attack: 32,
        defence: 129,
        health: 100,
        type: 'magician',
        travelRadius: 1,
        attackRadius: 4
        });

    const travelRadiusIndex = magician.travelRadiusIndex(28, 8);
    expect(travelRadiusIndex).toEqual([27, 29, 20, 36, 19, 21, 35, 37]);
        
    const attackRadiusIndex = magician.attackRadiusIndex(0, 8);
    expect(attackRadiusIndex).toEqual([1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36]);
})
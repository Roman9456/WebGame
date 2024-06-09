import Daemon from "../js/characters/Daemon";

test('check create Daemon && travel && attack', () => {
    const daemon1 = new Daemon(1);
    expect(daemon1).toEqual({
        level: 1,
        attack: 10,
        defence: 10,
        health: 50,
        type: 'daemon',
        travelRadius: 1,
        attackRadius: 4
        });

    const daemon = new Daemon(2);
    expect(daemon).toEqual({
        level: 2,
        attack: 18,
        defence: 18,
        health: 100,
        type: 'daemon',
        travelRadius: 1,
        attackRadius: 4
        });

    const travelRadiusIndex = daemon.travelRadiusIndex(14, 8);
    expect(travelRadiusIndex).toEqual([13, 15, 6, 22, 5, 7, 21, 23]);    

    const attackRadiusIndex = daemon.attackRadiusIndex(7, 8);
    expect(attackRadiusIndex).toEqual([3, 4, 5, 6, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 27, 28, 29, 30, 31, 35, 36, 37, 38, 39]);
})

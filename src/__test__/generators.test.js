import { characterGenerator, generateTeam } from "../js/generators";
import Bowman from "../js/characters/Bowman";
import Swordsman from "../js/characters/Swordsman";
import Magician from "../js/characters/Magician";

test('check characterGenerator', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 1;
    const received = [];
    for (let i = 0; i < 10; i += 1) {
        received.push(characterGenerator(allowedTypes, maxLevel));
    }
    expect(received.length).toBe(10);
})

test('check generateTeam', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 3;
    const characterCount = 10;
    const team = generateTeam(allowedTypes, maxLevel, characterCount)
    expect(team.characters.length).toBe(10);
    for (let i = 0; i < team.characters.length; i += 1) {
        expect(team.characters[i].level < maxLevel + 1 && team.characters[i].level > 0).toBeTruthy();
    }
})
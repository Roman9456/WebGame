import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export default class GameState {
  constructor() {
    this.level = 1;
    this.turn = 'player';
    this.teamPlayer = null;
    this.teamEnemy = null;
    this.positions = [];
    this.maxScore = 0;
  }

  static from(data) {
    const types = {
        bowman: Bowman,
        daemon: Daemon,
        magician: Magician,
        swordsman: Swordsman,
        undead: Undead,
        vampire: Vampire,
    };

    const createCharacter = (characterData) => {
        const characterClass = types[characterData.type.toLowerCase()];
        if (!characterClass) {
            throw new Error('Неизвестный тип персонажа');
        }
        const character = new characterClass(characterData.level, characterData.attack, characterData.defence, characterData.health);
        return character;
    };

    const userTeam = new Team();
    const positionsUser = [];
    for (const positionCharacter of data.positionsUser) {
        const character = createCharacter(positionCharacter.character);
        positionsUser.push(new PositionedCharacter(positionCharacter.index, character));
        userTeam.add(character);
    }

    const botTeam = new Team();
    const positionsBot = [];
    for (const positionCharacter of data.positionsBot) {
        const character = createCharacter(positionCharacter.character);
        positionsBot.push(new PositionedCharacter(positionCharacter.index, character));
        botTeam.add(character);
    }

    const gameState = new GameState();

    gameState.teamPlayer = userTeam;
    gameState.teamEnemy = botTeam;
    gameState.positions = [...positionsUser, ...positionsBot];
    gameState.level = data.level;
    gameState.turn = data.turn;
    gameState.maxScore = data.maxScore;

    return gameState;
  }
}

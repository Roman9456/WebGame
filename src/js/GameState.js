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

  static from(object) {
    // TODO: create object

    this.level = object.level;
    this.turn = object.turn;
    this.positions = [];
    this.teamPlayer = null;
    this.teamEnemy = null;
    this.maxScore = object.maxScore;

    const players = [];
    const enemies = [];
    const playerCharacters = object.positions;

    for (let i = 0; i < playerCharacters.length; i += 1) {
      let item = null;
      if (playerCharacters[i].character.type === 'swordsman') {
        item = new Swordsman(1);
        Object.assign(item, playerCharacters[i].character);
        players.push(item);
      }
      if (playerCharacters[i].character.type === 'bowman') {
        item = new Bowman(1);
        Object.assign(item, playerCharacters[i].character);
        players.push(item);
      }
      if (playerCharacters[i].character.type === 'magician') {
        item = new Magician(1);
        Object.assign(item, playerCharacters[i].character);
        players.push(item);
      }
      if (playerCharacters[i].character.type === 'undead') {
        item = new Undead(1);
        Object.assign(item, playerCharacters[i].character);
        enemies.push(item);
      }
      if (playerCharacters[i].character.type === 'vampire') {
        item = new Vampire(1);
        Object.assign(item, playerCharacters[i].character);
        enemies.push(item);
      }
      if (playerCharacters[i].character.type === 'daemon') {
        item = new Daemon(1);
        Object.assign(item, playerCharacters[i].character);
        enemies.push(item);
      }
      this.positions.push(new PositionedCharacter(item, playerCharacters[i].position));
    }

    if (players.length !== 0) this.teamPlayer = new Team(players);
    if (enemies.length !== 0) this.teamEnemy = new Team(enemies);

    return null;
  }
}

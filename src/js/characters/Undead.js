import Character from '../Character';

export default class Undead extends Character {
  constructor(level, attack, defence, health, type, travelRadius, attackRadius) {
    super(level, attack, defence, health, type, travelRadius, attackRadius);
    this.level = 1;
    this.attack = 40;
    this.defence = 10;
    this.health = 50;
    this.type = 'undead';
    this.travelRadius = 4;
    this.attackRadius = 1;
    if (level > 1) {
      for (let i = 1; i < level; i += 1) {
        this.levelUp();
      }
    }
  }
}

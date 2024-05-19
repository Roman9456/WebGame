import Character from '../Character';

export default class Bowman extends Character {
  constructor(level, attack, defence, health, type, travelRadius, attackRadius) {
    super(level, attack, defence, health, type, travelRadius, attackRadius);
    this.level = 1;
    this.attack = 25;
    this.defence = 25;
    this.health = 50;
    this.type = 'bowman';
    this.travelRadius = 2;
    this.attackRadius = 2;
    if (level > 1) {
      for (let i = 1; i < level; i += 1) {
        this.levelUp();
      }
    }
  }
}

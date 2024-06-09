import Character from '../Character';

export default class Daemon extends Character {
  constructor(level, attack, defence, health, type, travelRadius, attackRadius) {
    super(level, attack, defence, health, type, travelRadius, attackRadius);
    this.level = 1;
    this.attack = 10;
    this.defence = 10;
    this.health = 50;
    this.type = 'daemon';
    this.travelRadius = 1;
    this.attackRadius = 4;
    if (level > 1) {
      for (let i = 1; i < level; i += 1) {
        this.levelUp();
      }
    }
  }
}

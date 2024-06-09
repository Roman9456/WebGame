export default class Enemy {
  static from(object, boardSize) {
    this.positions = object.positions;

    this.boardSize = boardSize;
    this.plaerCharacters = object.teamPlayer.characters;
    this.players = this.positions
      .filter((el) => this.plaerCharacters.includes(el.character));

    this.playerIndexes = [];
    for (let i = 0; i < this.players.length; i += 1) {
      this.playerIndexes.push(this.players[i].position);
    }

    this.enemyCharacters = object.teamEnemy.characters;
    this.enemies = this.positions
      .filter((el) => this.enemyCharacters.includes(el.character));
    return null;
  }

  static possibleTargets() {
    const attackIndexes = [];
    for (let i = 0; i < this.enemies.length; i += 1) {
      attackIndexes
        .push(...this.enemies[i].character
          .attackRadiusIndex(this.enemies[i].position, this.boardSize));
    }

    return this.players.filter((el) => attackIndexes.includes(el.position));
  }

  static damage(attacker, target) {
    return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
  }

  static getMaxDamager(target) {
    let damage = 0;
    let damager = null;
    for (let i = 0; i < this.enemies.length; i += 1) {
      const box = this.enemies[i].character
        .attackRadiusIndex(this.enemies[i].position, this.boardSize);
      if (box.includes(target.position)) {
        const result = this.damage(this.enemies[i].character, target.character);
        if (result > damage) {
          damage = result;
          damager = this.enemies[i];
        }
      }
    }
    return { damager, damage };
  }

  static maxAttacker() {
    let result = 0;
    for (let i = 0; i < this.enemies.length; i += 1) {
      if (this.enemies[i].character.attack > result) result = this.enemies[i].character.attack;
    }
    return this.enemies.find((el) => el.character.attack === result);
  }

  static minDefender() {
    let result = 0;
    for (let i = 0; i < this.players.length; i += 1) {
      if (this.players[i].character.defence > result) result = this.players[i].character.defence;
    }
    return this.players.find((el) => el.character.defence === result);
  }

  static attackIndex(enemy, indexes) {
    for (let i = 0; i < indexes.length; i += 1) {
      const box = enemy.attackRadiusIndex(indexes[i], this.boardSize)
        .filter((el) => this.playerIndexes.includes(el));
      if (box.length !== 0) {
        return indexes[i];
      }
    }
    return null;
  }

  static move() {
    const posBusy = [];
    for (let i = 0; i < this.positions.length; i += 1) {
      posBusy.push(this.positions[i].position);
    }

    for (let i = 0; i < this.enemies.length; i += 1) {
      const indexesTravel = this.enemies[i].character
        .travelRadiusIndex(this.enemies[i].position, this.boardSize)
        .filter((el) => !posBusy.includes(el));
      const attackIndex = this.attackIndex(this.enemies[i].character, indexesTravel);

      if (attackIndex !== null) {
        return { enemy: this.enemies[i], newPosition: attackIndex };
      }
    }

    const maxAttacker = this.maxAttacker();
    const box = maxAttacker.character
      .travelRadiusIndex(maxAttacker.position, this.boardSize)
      .filter((el) => !posBusy.includes(el));

    const minDefender = this.minDefender();
    const difference = maxAttacker.position - minDefender.position;
    let newPosition = null;
    if (difference > 0) newPosition = Math.min(...box);
    if (difference < 0) newPosition = Math.max(...box);

    return { enemy: maxAttacker, newPosition };
  }
}

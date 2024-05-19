import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { generateTeam } from './generators';
import GamePlay from './GamePlay';
import cursors from './cursors';
import themes from './themes';
import GameState from './GameState';
import Enemy from './Enemy';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = this.stateService.load();
    this.allowedTypesPlayer = [Bowman, Swordsman, Magician];
    this.allowedTypesEnemy = [Vampire, Undead, Daemon];
    this.addListenersBoard();
    this.addListenersGame();
  }

  init() {
    if (this.state === null) {
      this.state = new GameState();
    } else {
      Object.assign(GameState, this.state);
    }

    if (this.state.level === 5) {
      const score = this.calculationScore();
      this.updateScore(score);
      GamePlay.showMessage(`Победа!!! \n Текущий результат ${score} \n Рекорд ${this.state.maxScore}`);
      this.removeListenerBoard();
      return;
    }

    switch (this.state.level) {
      case 1:
        this.gamePlay.drawUi(themes.prairie);
        break;

      case 2:
        this.gamePlay.drawUi(themes.desert);
        break;

      case 3:
        this.gamePlay.drawUi(themes.arctic);
        break;

      case 4:
        this.gamePlay.drawUi(themes.mountain);
        break;

      default:
        this.gamePlay.drawUi(themes.prairie);
        break;
    }

    const posPlayerBusy = [];
    const maxLevel = this.state.level;
    const characterCount = this.state.level + 1;

    const validposPlayer = [];
    for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
      validposPlayer.push(this.gamePlay.boardSize * i);
      validposPlayer.push(this.gamePlay.boardSize * i + 1);
    }

    if (this.state.teamPlayer === null) {
      this.state.teamPlayer = generateTeam(this.allowedTypesPlayer, maxLevel, characterCount);
    } else if (this.state.teamPlayer.characters.length < characterCount) {
      const count = characterCount - this.state.teamPlayer.characters.length;
      const result = generateTeam(this.allowedTypesPlayer, maxLevel, count);

      for (let i = 0; i < result.characters.length; i += 1) {
        this.state.teamPlayer.characters.push(result.characters[i]);
      }
    }

    if (this.state.positions.length <= characterCount) {
      this.state.positions = [];
    }

    if (this.state.positions.length === 0) {
      for (let i = 0; i < this.state.teamPlayer.characters.length; i += 1) {
        const posPlayer = validposPlayer[Math.ceil(Math.random() * validposPlayer.length)];
        if (!posPlayerBusy.includes(posPlayer) && posPlayer !== undefined) {
          posPlayerBusy.push(posPlayer);
          this.state.positions
            .push(new PositionedCharacter(this.state.teamPlayer.characters[i], posPlayer));
        } else {
          i -= 1;
        }
      }
    }

    const validposEnemy = [];
    for (let i = 1; i < this.gamePlay.boardSize + 1; i += 1) {
      validposEnemy.push(this.gamePlay.boardSize * i - 2);
      validposEnemy.push(this.gamePlay.boardSize * i - 1);
    }

    if (this.state.teamEnemy === null) {
      this.state.teamEnemy = generateTeam(this.allowedTypesEnemy, maxLevel, characterCount);
      for (let i = 0; i < characterCount; i += 1) {
        const posEnemy = validposEnemy[Math.ceil(Math.random() * validposEnemy.length)];
        if (!posPlayerBusy.includes(posEnemy) && posEnemy !== undefined) {
          posPlayerBusy.push(posEnemy);
          this.state.positions
            .push(new PositionedCharacter(this.state.teamEnemy.characters[i], posEnemy));
        } else {
          i -= 1;
        }
      }
    }

    this.gamePlay.redrawPositions(this.state.positions);
  }

  onCellClick(index) {
    // TODO: react to click

    const teamPlayer = ['bowman', 'swordsman', 'magician'];
    if (this.state.turn === 'enemy') return;

    if (this.gamePlay.cells[index].querySelector('.character')
    && teamPlayer.includes(this.state.positions
      .find((el) => el.position === index).character.type)) { // Ошибка
      const lastClick = document.querySelector('.selected-yellow');
      if (lastClick !== null) {
        const indexLastClick = this.gamePlay.cells.findIndex((el) => el === lastClick);
        this.gamePlay.deselectCell(indexLastClick);
      }
      this.gamePlay.selectCell(index);
    } else if (document.querySelector('.selected-yellow')
              && document.querySelector('.selected-green')) {
      this.state.turn = 'enemy';

      const lastClick = document.querySelector('.selected-yellow');
      const indexLastClick = this.gamePlay.cells.findIndex((el) => el === lastClick);

      const newClick = document.querySelector('.selected-green');
      const indexNewClick = this.gamePlay.cells.findIndex((el) => el === newClick);

      const positionedCharacter = this.state.positions.find((el) => el.position === indexLastClick);

      positionedCharacter.position = indexNewClick;

      this.gamePlay.deselectCell(indexLastClick);
      this.onCellLeave(indexNewClick);

      this.gamePlay.redrawPositions(this.state.positions);

      this.turnEnemy();
    } else if (document.querySelector('.selected-red')) {
      this.state.turn = 'enemy';

      const indexAttacker = this.gamePlay.cells.findIndex((el) => el === document.querySelector('.selected-yellow'));
      const attacker = this.state.positions.find((el) => el.position === indexAttacker).character;

      const indexTarget = this.gamePlay.cells.findIndex((el) => el === document.querySelector('.selected-red'));
      const targetPosition = this.state.positions.find((el) => el.position === indexTarget);
      const target = targetPosition.character;

      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      target.health -= damage;

      if (target.health <= 0) {
        this.state.positions = this.state.positions.filter((el) => el !== targetPosition);
        this.state.teamEnemy.characters = this.state.teamEnemy.characters
          .filter((el) => el !== target);
      }

      this.gamePlay.deselectCell(indexAttacker);
      this.onCellLeave(indexTarget);

      this.gamePlay.showDamage(indexTarget, damage)
        .then(() => {
          if (this.state.teamEnemy.characters.length === 0) {
            for (let i = 0; i < this.state.positions.length; i += 1) {
              this.state.positions[i].character.levelUp();
            }
            this.state.level += 1;
            this.state.teamEnemy = null;
            this.state.turn = 'player';
            this.init();
          } else {
            this.gamePlay.redrawPositions(this.state.positions);
            this.turnEnemy();
          }
        });
    } else {
      GamePlay.showError('Недоступное действие');
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.gamePlay.setCursor(cursors.notallowed);
    if (this.state.turn === 'enemy') return;

    const { boardSize } = this.gamePlay;
    const playerTeam = ['bowman', 'swordsman', 'magician'];
    const enemyTeam = ['vampire', 'undead', 'daemon'];

    if (this.state.positions.find((el) => el.position === index)) {
      const { character } = this.state.positions.find((el) => el.position === index);
      const message = character.showInformation();
      this.gamePlay.showCellTooltip(message, index);

      if (playerTeam
        .includes(this.state.positions.find((el) => el.position === index).character.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (document.querySelector('.selected-yellow') !== null
      && enemyTeam
        .includes(this.state.positions.find((el) => el.position === index).character.type)) {
        const lastClick = document.querySelector('.selected-yellow');
        const indexLastClick = this.gamePlay.cells.findIndex((el) => el === lastClick);
        const lastCharacter = this.state.positions
          .find((el) => el.position === indexLastClick).character;

        if (lastCharacter.attackRadiusIndex(indexLastClick, boardSize).some((e) => e === index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        }
      }
    }

    if (document.querySelector('.selected-yellow') !== null
    && !this.gamePlay.cells[index].querySelector('.character')) {
      const lastClick = document.querySelector('.selected-yellow');
      const indexLastClick = this.gamePlay.cells.findIndex((el) => el === lastClick);
      const { character } = this.state.positions.find((el) => el.position === indexLastClick);

      if (character.travelRadiusIndex(indexLastClick, boardSize).some((e) => e === index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    if (!this.gamePlay.cells[index].classList.contains('selected-yellow')) this.gamePlay.deselectCell(index);
  }

  onNewGame() {
    this.removeListenerBoard();
    this.addListenersBoard();
    this.state = new GameState();

    if (this.stateService.load() !== null) {
      this.state.maxScore = this.stateService.load().maxScore;
    }

    this.init();
    return GamePlay.showMessage('Новая игра');
  }

  onSaveGame() {
    this.stateService.save(this.state);
    return GamePlay.showMessage('Игра сохранена');
  }

  onLoadGame() {
    if (!this.stateService.load()) {
      return GamePlay.showMessage('Нет сохраненной игры');
    }

    GameState.from(this.stateService.load());
    Object.assign(this.state, GameState);
    this.init();

    this.removeListenerBoard();
    this.addListenersBoard();
    return GamePlay.showMessage('Игра загружена');
  }

  turnEnemy() {
    Enemy.from(this.state, this.gamePlay.boardSize);

    const possibleTargets = Enemy.possibleTargets();

    if (possibleTargets.length !== 0) {
      let target = null;
      let damage = 0;

      for (let i = 0; i < possibleTargets.length; i += 1) {
        const maxDamager = Enemy.getMaxDamager(possibleTargets[i]);
        if (maxDamager.damage > damage) {
          target = possibleTargets[i];
          damage = maxDamager.damage;
        }
      }

      target.character.health -= damage;

      if (target.character.health <= 0) {
        this.state.positions = this.state.positions.filter((el) => el !== target);
        this.state.teamPlayer.characters = this.state.teamPlayer.characters
          .filter((el) => el !== target.character);
      }

      this.gamePlay.showDamage(target.position, damage)
        .then(() => {
          if (this.state.teamPlayer.characters.length === 0) {
            const score = this.calculationScore();
            this.updateScore(score);
            GamePlay.showMessage(`Игра окончена \n Текущий результат ${score} \n Рекорд ${this.state.maxScore}`);
            this.removeListenerBoard();
          } else {
            this.gamePlay.redrawPositions(this.state.positions);
          }

          this.state.turn = 'player';
        });
    } else {
      const moveItem = Enemy.move();
      this.state.positions.find((el) => el === moveItem.enemy).position = moveItem.newPosition;
      this.gamePlay.redrawPositions(this.state.positions);

      this.state.turn = 'player';
    }
  }

  addListenersBoard() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  addListenersGame() {
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
  }

  removeListenerBoard() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }

  calculationScore() {
    let result = 0;
    result += (this.state.level - 1) * 1000;
    result += this.state.teamPlayer.characters.length * 100;
    return result;
  }

  updateScore(score) {
    const state = this.stateService.load();
    if (state !== null) {
      if (state.maxScore < score) {
        state.maxScore = score;
        this.stateService.save(state);
      }
    } else {
      const element = new GameState();
      element.maxScore = score;
      this.stateService.save(element);
    }
  }
}

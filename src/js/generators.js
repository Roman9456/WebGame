import Team from './Team';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const characterRandom = Math.round(Math.random() * (allowedTypes.length - 1));
  const levelRandom = Math.ceil(Math.random() * maxLevel);
  yield new allowedTypes[characterRandom](levelRandom);
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 *  Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];
  for (let i = 0; i < characterCount; i += 1) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return new Team(characters);
}

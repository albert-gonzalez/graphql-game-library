import { Game, GameRepository } from '../../../../src/domain/game/game';

export const exampleGame: Game = {
  id: 1,
  name: 'Game 1',
  description: 'Description 1',
  url: 'url 1',
  platform_id: 2,
};

export const anotherExampleGame: Game = {
  id: 2,
  name: 'Game 2',
  description: 'Description 2',
  url: 'url 2',
  platform_id: 1,
};

let gameList: Game[];

let currentId: number;

export function initGameRepository() {
  gameList = [
    exampleGame,
    anotherExampleGame,
  ];

  currentId = 2;
}

export const gameRepository: GameRepository = {
  async find (id: number) {
    return gameList.find(game => game.id === id) as Game;
  },
  async findAll () {
    return gameList;
  },
  async findByName (name: string) {
    return gameList.filter(game => game.name.includes(name));
  },
  async findByPlatformId (platformId) {
    return gameList.filter(game => game.platform_id === platformId);
  },
  async insert (game: Game) {
    const id = ++currentId;
    gameList.push({ ...game, id });

    return id;
  },
  async remove (id: number) {
    gameList = gameList.filter(game => game.id !== id);
  },
  async update (updatedGame: Game) {
    const index = gameList.findIndex(game => updatedGame.id === game.id);

    if (index >= 0) {
      gameList[index] = updatedGame;
    }
  },
};

initGameRepository();

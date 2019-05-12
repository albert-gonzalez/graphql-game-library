import {Platform, PlatformRepository} from "../../../../src/domain/platform/platform";
import {anotherExampleGame, exampleGame} from "../../game/inMemory/inMemoryGameRepository";

export const examplePlatform: Platform = {
  id: 1,
  name: 'Platform 1',
  description: 'Description 1',
  games: [anotherExampleGame]
};

export const anotherExamplePlatform: Platform = {
  id: 2,
  name: 'Platform 2',
  description: 'Description 2',
  games: [exampleGame]
};

let platformList: Platform[];

let currentId: number;

export function initPlatformRepository() {
  platformList = [
    examplePlatform,
    anotherExamplePlatform
  ];

  currentId = 2;
}

export const platformRepository: PlatformRepository = {
  find: async function (id: number) {
    return platformList.find(platform => platform.id === id) as Platform;
  },
  findAll: async function () {
    return platformList;
  },
  insert: async function (platform: Platform) {
    const id = ++currentId;
    platformList.push({...platform, id});

    return id;
  },
  remove: async function (id: number) {
    platformList = platformList.filter(platform => platform.id !== id)
  },
  update: async function (updatedPlatform: Platform) {
    const index = platformList.findIndex(platform => updatedPlatform.id === platform.id);

    if (index >= 0) {
      platformList[index] = updatedPlatform;
    }
  }
};

initPlatformRepository();

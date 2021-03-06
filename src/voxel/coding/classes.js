import scripts from './scripts';
import types from '../blockTypes';
import voxelClient from '../voxelClient';
import instances from './instances';
import coding from '../../coding';
import inventory from '../../inventory';

async function processNew(position, blockType) {
  types.add(blockType);

  await scripts.loadClass(blockType);

  if(position) {
    instances.storeCode(position, blockType.id);
    voxelClient.setBlock(position, blockType.id);
  }

  return blockType;
}

export default {
  async modify(position, blockType, code) {
    let codeId = blockType.code.id;

    let codeObj = await coding.update(codeId, code);
    let updatedBlockType = await inventory.updateBlockCode(blockType.id, codeObj);

    return processNew(position, updatedBlockType);
  },
  async fork(position, blockType, code, name) {
    let material = blockType.material;
    let codeId = blockType.code.id;

    let codeObj = await coding.fork(codeId, code);
    let updatedBlockType = await inventory.addBlockType(name, material, codeObj);

    return processNew(position, updatedBlockType);
  },
  async create(position, material, code, name) {
    let codeObj = await coding.create(code);
    let blockType = await inventory.addBlockType(name, material, codeObj);

    return processNew(position, blockType);
  }
};

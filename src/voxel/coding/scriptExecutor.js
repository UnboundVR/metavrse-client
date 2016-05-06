import events from '../../events';
import consts from '../../constants';
import map from '../../map';
import Block from '../block';
import scriptExecutor from 'script-executor';

var prototypes = {};
var supportedEvents = [
  consts.events.HOVER,
  consts.events.LEAVE,
  consts.events.INTERACT,
  consts.events.PLACE_ADJACENT,
  consts.events.REMOVE_ADJACENT
];

function getId(pos) {
  return pos.join('|');
}

scriptExecutor.wireEvents(events, supportedEvents);

async function loadPrototype(blockType) {
  let code = blockType.code.code;
  let name = blockType.name;
  console.log(`Loading code for ${name}`);

  try {
    let $class = await System.module(code);
    prototypes[blockType.id] = {$class: $class.default, blockType};
    console.log(`Code for ${name} loaded`);
  } catch(e) {
    console.log(`Error loading code for ${name}`, e);
  }
}

function create(position, prototypeId) {
  remove(position);

  let prototype = prototypes[prototypeId];

  let $class = prototype.$class;
  let blockType = prototype.blockType;
  let block = new Block(position, blockType);

  let id = getId(position);
  scriptExecutor.createInstance(id, $class, {metadata: block, api: map});
}

function remove(position) {
  let id = getId(position);

  let instance = scriptExecutor.getInstance(id);
  if(instance && instance.onDestroy) {
    instance.onDestroy();
  }

  scriptExecutor.removeInstance(id);
}

export default {
  create,
  remove,
  loadPrototype
};

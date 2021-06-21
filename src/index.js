import sample from "lodash/sample";
import capitalize from "lodash/capitalize";
import etherealEffects from "../data/maze-rats/ethereal-effects.json";
import etherealElements from "../data/maze-rats/ethereal-elements.json";
import etherealForms from "../data/maze-rats/ethereal-forms.json";
import physicalEffects from "../data/maze-rats/physical-effects.json";
import physicalElements from "../data/maze-rats/physical-elements.json";
import physicalForms from "../data/maze-rats/physical-forms.json";
import colors from "../data/colors.json";
import firstNames from "../data/first-names.json";
import emotions from "../data/emotions.json";
import adjectives from "../data/adjectives.json";
import aoes from "../data/spell-aoe.json";
import ranges from "../data/spell-ranges.json";
import catastrophes from "../data/arcane-catastrophes.json";
import rituals from "../data/spell-rituals.json";
import recharges from "../data/spell-recharges.json";
import damages from "../data/spell-damages.json";
import durations from "../data/spell-durations.json";
import { render } from "mustache";

document.addEventListener("DOMContentLoaded", (event) => {
  const spell = rollSpell();
  renderSpell(spell);

  const btnRoll = document.getElementById("btn-roll-spell");
  btnRoll.addEventListener("click", () => renderSpell(rollSpell()));
});

function renderSpell(spell) {
  const spellNameNode = document.getElementById("spell-name");
  spellNameNode.innerText = spell.name;
  const spellEffectNode = document.getElementById("spell-effect");
  spellEffectNode.innerText = spell.effect;
  const spellAoeNode = document.getElementById("spell-aoe");
  spellAoeNode.innerText = spell.aoe;
  const spellRangeNode = document.getElementById("spell-range");
  spellRangeNode.innerText = spell.range;
  const rollSpellCatastropheNode = document.getElementById("spell-catastrophe");
  rollSpellCatastropheNode.innerText = spell.catastrophe;
  const spellSpeedNode = document.getElementById("spell-speed");
  spellSpeedNode.innerText = spell.speed;
  const spellRitualNode = document.getElementById("spell-ritual");
  spellRitualNode.innerText = spell.ritual;
  const spellRechargeNode = document.getElementById("spell-recharge");
  spellRechargeNode.innerText = spell.recharge;
  const spellDamageNode = document.getElementById("spell-damage");
  spellDamageNode.innerText = spell.damage;
  const spellDurationNode = document.getElementById("spell-duration");
  spellDurationNode.innerText = spell.duration;
}

function rollSpell() {
  const noun = rollSpellSuffix();
  const speed = rollSpellSpeed();
  return {
    name: rollSpellName({ noun }),
    effect: rollSpellEffect({ suffix: noun }),
    aoe: rollSpellAoe(),
    range: rollSpellRange(),
    speed: speed,
    ritual: rollSpellRitual(speed),
    recharge: rollSpellRecharge(speed),
    damage: rollSpellDamage(speed),
    duration: rollSpellDuration(speed),
    catastrophe: rollSpellCatastrophe(),
  };
}

function rollSpellDamage(speed) {
  const damage = sample(damages[speed]);
  return `The damage this spell wreaks is ${damage}.`;
}

function rollSpellDuration(speed) {
  const view = { d6: d6 };
  const duration = render(sample(durations[speed]), view);

  return `The effects last ${duration}.`;
}

function rollSpellSpeed() {
  return sample(["fast", "medium", "slow"]);
}

function rollSpellRitual(speed) {
  const view = {
    d6: d6,
  };
  const ritual = render(sample(rituals[speed]), view);

  return `To cast this spell, you mut ${ritual}.`;
}

function rollSpellRecharge(speed) {
  const view = {
    d6: d6,
    monster: rollMonster,
  };
  const recharge = render(sample(recharges[speed]), view);

  return `To prepare this spell for casting, you must ${recharge}.`;
}

function rollSpellCatastrophe() {
  const view = {
    d6: d6,
    animal: rollAnimal,
    bodyPart: rollBodyPart,
    color: rollColor,
    monster: rollMonster,
  };

  return render(sample(catastrophes), view);
}

function rollBodyPart() {
  const parts = [
    "head",
    "leg",
    "arm",
    "penis",
    "foot",
    "hand",
    "finger",
    "toe",
    "ear",
    "nose",
    "eye",
    "butt",
  ];

  return sample(parts);
}

function rollMonster() {
  const monsters = [
    "wendigo",
    "vampire bat",
    "giant spider",
    "wyvern",
    "troll",
    "zombie",
    "ghoul",
    "ogre",
    "basilisk",
    "wraith",
    "skeleton",
    "goblin",
    "berserker",
    "lich",
  ];

  return sample(monsters);
}

function rollAnimal() {
  const animals = ["dog", "cat", "monkey", "cow", "pig", "chicken", "rooster"];
  return sample(animals);
}

function rollSpellRange() {
  const view = {
    d6: d6,
  };
  const range = render(sample(ranges), view);
  return `Can hit a target ${range}.`;
}

function rollSpellAoe() {
  const view = {
    d6: d6,
  };
  const aoe = render(sample(aoes), view);
  return `This spell can affect ${aoe}.`;
}

// Need some crazy names
function rollSpellName(options = {}) {
  const variants = [
    "Daemon of the {{color}} {{noun}}",
    "{{firstName}}'s {{adjective}} Grace",
    "{{noun}} of {{firstName}}",
    "{{noun}} of {{emotion}}",
    "{{firstName}}'s {{noun}}",
    "{{adjective}} Hands Trace the {{noun}}",
    "The {{adjective}} Geometries of {{firstName}}",
    "The {{adjective}} Wish",
    "The {{adjective}} Embrace",
    "Forgotten {{noun}} of {{firstName}}",
    "Curse of {{firstName}}",
    "Foul {{noun}}",
  ];

  const view = {
    color: () => capitalize(rollColor()),
    noun: () => capitalize(options.noun ?? rollSpellSuffix()),
    firstName: () => rollFirstName(),
    adjective: () => capitalize(rollAdjective()),
    emotion: () => capitalize(rollEmotion()),
  };

  return render(sample(variants), view);
}

function rollAdjective() {
  const collection = adjectives.concat(physicalEffects).concat(etherealEffects);
  return sample(collection);
}

function rollEmotion() {
  return sample(emotions);
}

function rollFirstName() {
  if (d6() == 1) {
    return `St. ${sample(firstNames)}`;
  } else {
    return sample(firstNames);
  }
}

function d6() {
  return sample([1, 2, 3, 4, 5, 6]);
}

function rollColor() {
  return sample(colors);
}

const VOWELS = ["a", "e", "i", "o", "u"];

function rollSpellEffect(options = {}) {
  const actions = [
    "summon",
    "project",
    "bring forth",
    "conjure",
    "cast",
    "emanate",
    "hurl",
    "invoke",
  ];
  const action = sample(actions);
  const prefix = rollSpellPrefix();
  const suffix = options.suffix ?? rollSpellSuffix();
  const joiningWord = VOWELS.includes(prefix[0]) ? "an" : "a";
  return `${capitalize(action)} ${joiningWord} ${prefix} ${suffix}.`;
}

function rollSpellPrefix() {
  const prefixes = [physicalEffects, etherealEffects, physicalElements];
  return sample(sample(prefixes));
}

function rollSpellSuffix() {
  const suffixes = [
    physicalForms,
    etherealForms,
    physicalElements,
    etherealElements,
  ];
  return sample(sample(suffixes));
}

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
  const IDS = [
    "data-spell-name",
    "data-spell-effect",
    "data-spell-aoe",
    "data-spell-range",
    "data-spell-catastrophe",
    "data-spell-power",
    "data-spell-ritual",
    "data-spell-recharge",
    "data-spell-damage",
    "data-spell-duration",
  ];

  IDS.forEach((id) => {
    const nodes = document.querySelectorAll(`.${id}`);
    const [_data, _spell, prop] = id.split("-");
    nodes.forEach((node) => (node.innerText = spell[prop]));
  });

  const spellTitleNode = document.querySelector(".data-spell-title");
  spellTitleNode.innerHTML = `<span class="spell-name-drop-cap">${spell.name.slice(
    0,
    1
  )}</span>${spell.name.substring(1)}`;
}

function rollSpell() {
  const noun = d100() <= 8 ? "fireball" : rollSpellSuffix(); // gotta have a chance of fireballs ;)
  const power = rollSpellPower();
  return {
    name: rollSpellName({ noun }),
    effect: rollSpellEffect({ suffix: noun }),
    aoe: rollSpellAoe(),
    range: rollSpellRange(),
    power: power,
    ritual: rollSpellRitual(power),
    recharge: rollSpellRecharge(power),
    damage: rollSpellDamage(power),
    duration: rollSpellDuration(power),
    catastrophe: rollSpellCatastrophe(),
  };
}

function rollSpellDamage(power) {
  const damage = sample(damages[power]);
  return damage;
}

function rollSpellDuration(power) {
  const view = { d6: d6 };
  const duration = render(sample(durations[power]), view);

  return duration;
}

function rollSpellPower() {
  return sample(["minor", "moderate", "major"]);
}

function rollSpellRitual(power) {
  const view = {
    d6: d6,
    color: rollColor,
    monster: rollMonster,
  };
  const ritual = render(sample(rituals[power]), view);

  return ritual;
}

function rollSpellRecharge(power) {
  const view = {
    d6: d6,
    d100: d100,
    monster: rollMonster,
  };
  const recharge = render(sample(recharges[power]), view);

  return recharge;
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
    "hair",
  ];

  return sample(parts);
}

function rollMonster() {
  const monsters = [
    "wendigo",
    "vampire bat",
    "giant spider",
    "giant ant",
    "cave bear",
    "zombie bear",
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
    "bugbear",
    "giant centipede",
    "giant crab",
    "djinn",
    "demon boar",
    "hellhound",
    "doppelganger",
    "ettin",
    "giant fly",
    "gnoll",
    "frost golem",
    "gorgon",
    "black slime",
    "hobgoblin",
    "giant mantis",
    "manticore",
    "morlock",
    "minotaur",
    "mummy",
    "orc",
    "owlbear",
    "purple worm",
    "flame salamander",
    "spectre",
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
  return range;
}

function rollSpellAoe() {
  const view = {
    d6: d6,
  };
  const aoe = render(sample(aoes), view);
  return aoe;
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

function d100() {
  return Math.round(Math.random() * 100);
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
  return `${action} ${joiningWord} ${prefix} ${suffix}`;
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

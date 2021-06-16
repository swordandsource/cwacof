import sample from "lodash/sample";
import capitalize from "lodash/capitalize";
import etherealEffects from "../data/maze-rats-ethereal-effects.json";
import etherealElements from "../data/maze-rats-ethereal-elements.json";
import etherealForms from "../data/maze-rats-ethereal-forms.json";
import physicalEffects from "../data/maze-rats-physical-effects.json";
import physicalElements from "../data/maze-rats-physical-elements.json";
import physicalForms from "../data/maze-rats-physical-forms.json";
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
}

function rollSpell() {
  const noun = rollSpellSuffix();
  return {
    name: rollSpellName({ noun }),
    effect: rollSpellEffect({ suffix: noun }),
  };
}

// Need some crazy names
function rollSpellName(options = {}) {
  const variants = [
    "Daemon of the {{color}} {{noun}}",
    "{{firstName}}'s {{adjective} Grace",
    "{{noun}} of {{firstName}}",
    "{{noun}} of {{emotion}}",
    "{{firstName}}'s {{noun}}",
    "{{adjective}} Hands Trace the {{noun}}",
    "Forgotten {{noun}} of {{firstName}}",
    "Curse of {{firstName}}",
    "Foul {{noun}}",
  ];

  const view = {
    color: () => "Red",
    noun: () => options.noun ?? rollSpellSuffix(),
    firstName: () => "St. Mary",
    adjective: () => "Testing",
    emotion: () => "Sorrow",
  };

  return render(sample(variants), view);
}

function rollSpellEffect(options = {}) {
  const prefix = rollSpellPrefix();
  const suffix = options.suffix ?? rollSpellSuffix();
  return `${capitalize(prefix)} ${capitalize(suffix)}`;
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

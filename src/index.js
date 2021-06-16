import { sample } from "lodash";
import etherealEffects from "../data/maze-rats-ethereal-effects.json";
import etherealElements from "../data/maze-rats-ethereal-elements.json";
import etherealForms from "../data/maze-rats-ethereal-forms.json";
import physicalEffects from "../data/maze-rats-physical-effects.json";
import physicalElements from "../data/maze-rats-physical-elements.json";
import physicalForms from "../data/maze-rats-physical-forms.json";

document.addEventListener("DOMContentLoaded", (event) => {
  const spell = rollSpell();
  renderSpell(spell);
});

function renderSpell(spell) {
  const spellEffectNode = document.getElementById("spell-effect");
  spellEffectNode.innerText = spell.effect;
}

function rollSpell() {
  return {
    effect: rollSpellEffect(),
  };
}

function rollSpellEffect() {
  return `${sample(physicalEffects)} ${sample(etherealForms)}`;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Units_1 = require("@civ-clone/civ1-unit/Units");
const MilitaryStrength_1 = require("@civ-clone/core-power/Rules/MilitaryStrength");
// v474.05's military power: every unit's attack and defence, except Nuclear units (OpenCivOne `AIEngine.cs`
//  L44-81, `MilitaryPower` and the per-continent sums the meeting with a king reads).
const getRules = () => [
    new MilitaryStrength_1.default('civ1-power:unit/strength/attack-and-defence', new Criterion_1.default((unit) => !(unit instanceof Units_1.Nuclear)), new Effect_1.default((unit) => ({
        attack: unit.attack().value(),
        defence: unit.defence().value(),
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=strength.js.map
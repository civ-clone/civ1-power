"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Detonates_1 = require("@civ-clone/base-unit-trait-detonates/Detonates");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const MilitaryStrength_1 = require("@civ-clone/core-power/Rules/MilitaryStrength");
const strength_1 = require("@civ-clone/base-power/lib/strength");
// v474.05's military power: every unit's attack and defence, except Nuclear units (OpenCivOne `AIEngine.cs`
//  L44-81, `MilitaryPower` and the per-continent sums the meeting with a king reads): those that `Detonates`.
const getRules = () => [
    new MilitaryStrength_1.default('civ1-power:unit/strength/attack-and-defence', new Criterion_1.default((unit) => !unit.hasTrait(Detonates_1.default)), new Effect_1.default(strength_1.default)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=strength.js.map
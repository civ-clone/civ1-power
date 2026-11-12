"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const rank_1 = require("@civ-clone/base-power/lib/rank");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Gold_1 = require("@civ-clone/base-city-yield-gold/Gold");
const Rank_1 = require("@civ-clone/core-power/Rules/Rank");
// v474.05's ranking score, worked out for every civilization each turn (OpenCivOne `Segment_1238.cs`
//  `F0_1238_0da1`; book p337):
//
//    gold / 32 + 8 × citizens + advances known + Σ over units of the unit type's cost in tens of shields
//
// Every unit counts, Settlers, ships and Nuclear included. v474.05 counts the advances gained since the game began
//  (plus 1); this counts every advance known, which needs nothing saved and moves the score by the same few points
//  for every civilization.
const getRules = (cityRegistry = CityRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new Rank_1.default('civ1-power:player/rank/gold', new Effect_1.default((0, rank_1.treasuryTerm)(Gold_1.default, 32, playerTreasuryRegistry))),
    new Rank_1.default('civ1-power:player/rank/citizens', new Effect_1.default((0, rank_1.citizensTerm)(8, cityRegistry, cityGrowthRegistry))),
    new Rank_1.default('civ1-power:player/rank/advances', new Effect_1.default((0, rank_1.advancesTerm)(playerResearchRegistry))),
    new Rank_1.default('civ1-power:player/rank/units', new Effect_1.default((0, rank_1.unitCostTerm)(10, unitRegistry, ruleRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=rank.js.map
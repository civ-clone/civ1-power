"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const BuildCost_1 = require("@civ-clone/core-city-build/Rules/BuildCost");
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
const getRules = (cityRegistry = CityRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => {
    // A unit type's cost, asked of the `BuildCost` rules once per type: they only read a `BuildItem`'s `item()`.
    const unitValues = new Map(), unitValue = (UnitType) => {
        var _a;
        if (!unitValues.has(UnitType)) {
            const standIn = { item: () => UnitType }, [cost] = ruleRegistry.process(BuildCost_1.default, standIn, null);
            unitValues.set(UnitType, Math.floor(((_a = cost === null || cost === void 0 ? void 0 : cost.value()) !== null && _a !== void 0 ? _a : 0) / 10));
        }
        return unitValues.get(UnitType);
    };
    return [
        new Rank_1.default('civ1-power:player/rank/gold', new Effect_1.default((player) => {
            try {
                return Math.trunc(playerTreasuryRegistry.getByPlayerAndType(player, Gold_1.default).value() / 32);
            }
            catch (e) {
                // A player with no treasury (yet) has no gold.
                return 0;
            }
        })),
        new Rank_1.default('civ1-power:player/rank/citizens', new Effect_1.default((player) => 8 *
            cityRegistry
                .getByPlayer(player)
                .reduce((total, city) => total + cityGrowthRegistry.getByCity(city).size(), 0))),
        new Rank_1.default('civ1-power:player/rank/advances', new Effect_1.default((player) => {
            try {
                return playerResearchRegistry.getByPlayer(player).complete().length;
            }
            catch (e) {
                return 0;
            }
        })),
        new Rank_1.default('civ1-power:player/rank/units', new Effect_1.default((player) => unitRegistry
            .getByPlayer(player)
            .reduce((total, unit) => total + unitValue(unit.constructor), 0))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=rank.js.map
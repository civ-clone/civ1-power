import {
  advancesTerm,
  citizensTerm,
  treasuryTerm,
  unitCostTerm,
} from '@civ-clone/base-power/lib/rank';
import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Rank from '@civ-clone/core-power/Rules/Rank';

// v474.05's ranking score, worked out for every civilization each turn (OpenCivOne `Segment_1238.cs`
//  `F0_1238_0da1`; book p337):
//
//    gold / 32 + 8 × citizens + advances known + Σ over units of the unit type's cost in tens of shields
//
// Every unit counts, Settlers, ships and Nuclear included. v474.05 counts the advances gained since the game began
//  (plus 1); this counts every advance known, which needs nothing saved and moves the score by the same few points
//  for every civilization.
export const getRules: (
  cityRegistry?: CityRegistry,
  cityGrowthRegistry?: CityGrowthRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  unitRegistry?: UnitRegistry,
  ruleRegistry?: RuleRegistry
) => Rank[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Rank[] => [
  new Rank(
    'civ1-power:player/rank/gold',
    new Effect(treasuryTerm(Gold, 32, playerTreasuryRegistry))
  ),
  new Rank(
    'civ1-power:player/rank/citizens',
    new Effect(citizensTerm(8, cityRegistry, cityGrowthRegistry))
  ),
  new Rank(
    'civ1-power:player/rank/advances',
    new Effect(advancesTerm(playerResearchRegistry))
  ),
  new Rank(
    'civ1-power:player/rank/units',
    new Effect(unitCostTerm(10, unitRegistry, ruleRegistry))
  ),
];

export default getRules;

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
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Player from '@civ-clone/core-player/Player';
import Rank from '@civ-clone/core-power/Rules/Rank';
import Unit from '@civ-clone/core-unit/Unit';

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
): Rank[] => {
  // A unit type's cost, asked of the `BuildCost` rules once per type: they only read a `BuildItem`'s `item()`.
  const unitValues = new Map<typeof Unit, number>(),
    unitValue = (UnitType: typeof Unit): number => {
      if (!unitValues.has(UnitType)) {
        const standIn = { item: () => UnitType } as unknown as BuildItem,
          [cost] = ruleRegistry.process(BuildCost, standIn, null);

        unitValues.set(UnitType, Math.floor((cost?.value() ?? 0) / 10));
      }

      return unitValues.get(UnitType)!;
    };

  return [
    new Rank(
      'civ1-power:player/rank/gold',
      new Effect((player: Player): number => {
        try {
          return Math.trunc(
            playerTreasuryRegistry.getByPlayerAndType(player, Gold).value() / 32
          );
        } catch (e) {
          // A player with no treasury (yet) has no gold.
          return 0;
        }
      })
    ),
    new Rank(
      'civ1-power:player/rank/citizens',
      new Effect(
        (player: Player): number =>
          8 *
          cityRegistry
            .getByPlayer(player)
            .reduce(
              (total: number, city: City): number =>
                total + cityGrowthRegistry.getByCity(city).size(),
              0
            )
      )
    ),
    new Rank(
      'civ1-power:player/rank/advances',
      new Effect((player: Player): number => {
        try {
          return playerResearchRegistry.getByPlayer(player).complete().length;
        } catch (e) {
          return 0;
        }
      })
    ),
    new Rank(
      'civ1-power:player/rank/units',
      new Effect((player: Player): number =>
        unitRegistry
          .getByPlayer(player)
          .reduce(
            (total: number, unit: Unit): number =>
              total + unitValue(unit.constructor as typeof Unit),
            0
          )
      )
    ),
  ];
};

export default getRules;

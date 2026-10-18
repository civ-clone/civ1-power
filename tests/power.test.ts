import { Nuclear, Settlers, Warrior } from '@civ-clone/civ1-unit/Units';
import {
  militaryPower,
  militaryStrength,
} from '@civ-clone/core-power/lib/strength';
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import { expect } from 'chai';
import playerRank from '../Rules/Player/rank';
import { rank } from '@civ-clone/core-power/lib/rank';
import unitStrength from '../Rules/Unit/strength';

// Stand-ins for the registries: each rule only asks them for one player's entries.
const setUp = () => {
  const ruleRegistry = new RuleRegistry(),
    player = new Player(ruleRegistry),
    costs = new Map<typeof Unit, number>([
      [Warrior, 10],
      [Settlers, 40],
      [Nuclear, 160],
    ]),
    standInUnit = (UnitType: typeof Unit, attack: number, defence: number) =>
      Object.assign(Object.create(UnitType.prototype), {
        attack: () => ({ value: () => attack }),
        defence: () => ({ value: () => defence }),
      }) as Unit,
    units = [
      standInUnit(Warrior, 1, 1),
      standInUnit(Warrior, 1, 1),
      standInUnit(Settlers, 0, 1),
      standInUnit(Nuclear, 99, 0),
    ],
    cities = [{ size: 3 }, { size: 5 }];

  ruleRegistry.register(
    new BuildCost(
      new Effect((item: BuildItem) => ({
        value: () => costs.get(item.item() as typeof Unit) ?? 0,
      }))
    ) as any,
    ...playerRank(
      { getByPlayer: () => cities } as any,
      {
        getByCity: (city: { size: number }) => ({ size: () => city.size }),
      } as any,
      { getByPlayer: () => ({ complete: () => new Array(7) }) } as any,
      { getByPlayerAndType: () => ({ value: () => 100 }) } as any,
      { getByPlayer: () => units } as any,
      ruleRegistry
    ),
    ...unitStrength()
  );

  return { player, ruleRegistry, units };
};

describe('civ1-power', () => {
  it("ranks a player by v474.05's terms: gold / 32 + 8 × citizens + advances + unit costs / 10", () => {
    const { player, ruleRegistry } = setUp();

    // 100 / 32 = 3, 8 × 8 = 64, 7 advances, units 1 + 1 + 4 + 16 = 22
    expect(rank(player, ruleRegistry)).equal(3 + 64 + 7 + 22);
  });

  it('counts every unit but Nuclear ones in military strength', () => {
    const { ruleRegistry, units } = setUp();

    expect(militaryStrength(units, ruleRegistry)).eql({
      attack: 2,
      defence: 3,
    });
    expect(militaryPower(units, ruleRegistry)).equal(5);
  });
});

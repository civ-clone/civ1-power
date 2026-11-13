import Criterion from '@civ-clone/core-rule/Criterion';
import Detonates from '@civ-clone/base-unit-trait-detonates/Detonates';
import Effect from '@civ-clone/core-rule/Effect';
import MilitaryStrength from '@civ-clone/core-power/Rules/MilitaryStrength';
import Unit from '@civ-clone/core-unit/Unit';
import attackAndDefence from '@civ-clone/base-power/lib/strength';

// v474.05's military power: every unit's attack and defence, except Nuclear units (OpenCivOne `AIEngine.cs`
//  L44-81, `MilitaryPower` and the per-continent sums the meeting with a king reads): those that `Detonates`.
export const getRules: () => MilitaryStrength[] = (): MilitaryStrength[] => [
  new MilitaryStrength(
    'civ1-power:unit/strength/attack-and-defence',
    new Criterion((unit: Unit): boolean => !unit.hasTrait(Detonates)),
    new Effect(attackAndDefence)
  ),
];

export default getRules;

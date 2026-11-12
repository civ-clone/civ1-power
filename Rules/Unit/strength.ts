import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import MilitaryStrength from '@civ-clone/core-power/Rules/MilitaryStrength';
import { Nuclear } from '@civ-clone/civ1-unit/Units';
import Unit from '@civ-clone/core-unit/Unit';
import attackAndDefence from '@civ-clone/base-power/lib/strength';

// v474.05's military power: every unit's attack and defence, except Nuclear units (OpenCivOne `AIEngine.cs`
//  L44-81, `MilitaryPower` and the per-continent sums the meeting with a king reads).
export const getRules: () => MilitaryStrength[] = (): MilitaryStrength[] => [
  new MilitaryStrength(
    'civ1-power:unit/strength/attack-and-defence',
    new Criterion((unit: Unit): boolean => !(unit instanceof Nuclear)),
    new Effect(attackAndDefence)
  ),
];

export default getRules;

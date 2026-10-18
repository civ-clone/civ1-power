import { Game, defaultGame } from '@civ-clone/core-game';
import playerRank from './Rules/Player/rank';
import unitStrength from './Rules/Unit/strength';

export const register = (game: Game): void =>
  game.rules.register(
    ...playerRank(
      game.cities,
      game.cityGrowth,
      game.playerResearch,
      game.playerTreasuries,
      game.units,
      game.rules
    ),
    ...unitStrength()
  );

// The plugin loader imports each package for this side effect.
register(defaultGame);

export default register;

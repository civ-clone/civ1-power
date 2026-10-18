"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const core_game_1 = require("@civ-clone/core-game");
const rank_1 = require("./Rules/Player/rank");
const strength_1 = require("./Rules/Unit/strength");
const register = (game) => game.rules.register(...(0, rank_1.default)(game.cities, game.cityGrowth, game.playerResearch, game.playerTreasuries, game.units, game.rules), ...(0, strength_1.default)());
exports.register = register;
// The plugin loader imports each package for this side effect.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map
import {loadFont as loadSpaceGrotesk} from "@remotion/google-fonts/SpaceGrotesk";
import {loadFont as loadInter} from "@remotion/google-fonts/Inter";

export const {fontFamily: DISPLAY} = loadSpaceGrotesk("normal", {weights: ["700"], subsets: ["latin"]});
export const {fontFamily: UI} = loadInter("normal", {weights: ["500", "600"], subsets: ["latin"]});

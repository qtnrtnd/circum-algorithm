import { params } from "./modules/parameters";
import { generateUI } from "./modules/generate_ui";
import { draw } from "./modules/draw";

generateUI(params);

requestAnimationFrame(() => {
    draw(params);
});


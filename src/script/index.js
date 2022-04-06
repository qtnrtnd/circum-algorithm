import { params } from "./modules/parameters";
import { generateUI } from "./modules/generate_ui";
import { draw } from "./modules/draw";


let input = document.createElement('input');
input.type = "number";
input.style.fontSize = "1.9vh";
document.documentElement.append(input);
const numberInputHeight = input.offsetHeight;
input.remove();

document.body.style.setProperty('--number-input-height', numberInputHeight + "px");

input.type = "range";
input.style.removeProperty('font-size');
document.documentElement.append(input);
const rangeInputHeight = input.offsetHeight;
input.remove();

document.body.style.setProperty('--range-input-height', rangeInputHeight + "px");

generateUI(params);

requestAnimationFrame(() => {
    draw(params);
});


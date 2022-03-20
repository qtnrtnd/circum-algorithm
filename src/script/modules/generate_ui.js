import { _ } from "./global_var";
import { camelCaseToSpan } from "./utils";
import { params } from "./parameters";
import { draw } from "./draw";

const inputHandler = function (e) {

    let param = e.target.getAttribute("data-var");
    let newValue = e.target.value;

    params[param].value = newValue;

    requestAnimationFrame(() => {

        let seedParam;

        if (param === "pointsPerCircle") {
            seedParam = { pointsInterval: true, pointsHeight: true };
        } else if (param === "iterations") {
            seedParam = { pointsInterval: true, pointsHeight: true, circlesRotation: true };
        }

        draw(params, seedParam);
    });
};

const generateUI = function (params) {
    for (let param in params) {

        let current = params[param];
    
        if (current.hasOwnProperty('initial')) current.value = current.initial;
    
        let fieldset, elt;
    
        if (current.hasOwnProperty('group')) {
            
            let group = document.querySelector("." + current.group);
    
            if (group) fieldset = group;
            else {
    
                fieldset = document.createElement('fieldset');
                fieldset.classList.add(current.group);
                let legend = document.createElement('legend');
                legend.innerHTML = camelCaseToSpan(current.group);
                fieldset.append(legend);
    
            }
        } else {
            fieldset = document.createElement('fieldset');
            let legend = document.createElement('legend');
            legend.innerHTML = camelCaseToSpan(param);
            fieldset.append(legend);
        }
    
        if (current.type === "button") {
    
            elt = document.createElement('button');
            elt.innerHTML = current.text;
            elt.addEventListener('click', current.onClick);
            
        } else if (current.type === "select") {
    
            elt = document.createElement("select");
    
            current.listOfValues.forEach(value => {
                elt.innerHTML += `<option ${value.hasOwnProperty("selected") && value.selected ? "selected" : ""} value="${value.value}">${value.text}</option>`
            });
    
            elt.addEventListener('input', inputHandler);
            elt.setAttribute('data-var', param);
    
        } else {
    
            elt = document.createElement("input");
    
            elt.type = current.type;

            if (current.hasOwnProperty('step')) elt.step = current.step;
    
            if (current.hasOwnProperty('min')) elt.min = current.min;
            if (current.hasOwnProperty('max')) elt.max = current.max;
    
            elt.value = current.inputValue;
    
            elt.addEventListener('input', inputHandler);
            elt.setAttribute('data-var', param);
        }
    
        if (current.hasOwnProperty("label")) {
            let fieldsetLabel = document.createElement("fieldset");
            let label = document.createElement('legend');
            label.innerHTML = camelCaseToSpan(current.label);
            fieldsetLabel.append(label);
            fieldsetLabel.append(elt);
            elt = fieldsetLabel;
        }
    
        fieldset.append(elt);
    
        _.paramsWindow.append(fieldset);
    }
};

export { generateUI };
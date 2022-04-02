import { _ } from "./global_var";
import { camelCaseToSpan } from "./utils";
import { params } from "./parameters";
import { draw } from "./draw";

const disableInputsAccordingToSelectedValues = function (params, inputParamName) {

    const inputParam = params[inputParamName];
    const groupName = inputParam.group;

    if (inputParam.hasOwnProperty('group')) {

        const selects = document.querySelectorAll('.' + groupName + " select");
        const finalInputsState = {};

        selects.forEach(select => {

            const param = params[select.getAttribute("data-var")];

            if (param.hasOwnProperty('disableInputsForValue')) {

                const value = param.value.toString();

                document.querySelectorAll("." + groupName + " [data-var]:not([data-var='" + param.paramName + "'])").forEach(input => {

                    let name = input.getAttribute("data-var");
                    let newState = true;

                    if (param.disableInputsForValue.hasOwnProperty(value) && (param.disableInputsForValue[value].includes(name) || param.disableInputsForValue[value] === "*")) {
                        newState = false;
                    }
                        
                    finalInputsState[name] = finalInputsState.hasOwnProperty(name) ? finalInputsState[name] && newState : newState;

                });
                
            }
            
        });

        for (let name in finalInputsState) {

            const input = document.querySelector("[data-var='" + name + "']");

            input.disabled = !finalInputsState[name];
        
            if (!input.parentElement.classList.contains(groupName)) {

                const label = input.parentElement.querySelector('legend');
                
                if (label) {
                    finalInputsState[name] ? label.classList.remove('disabled') : label.classList.add('disabled');
                }

            }
        }
        
    }

    
}

const inputHandler = function (e) {

    let paramName = e.target.getAttribute("data-var");
    let param = params[paramName];
    let newValue = e.target.value;

    param.value = newValue;

    disableInputsAccordingToSelectedValues(params, paramName);

    let seedParam;

    if (paramName === "pointsPerCircle"
        || paramName === "adaptativePointsPerCircle"
        || ((paramName === "tension" || paramName === "smallestCircleScale") && params.adaptativePointsPerCircle.value))
    {
        seedParam = { pointsInterval: true, pointsHeight: true };
    } else if (paramName === "iterations") {
        seedParam = { pointsInterval: true, pointsHeight: true, circlesRotation: true };
    }

    requestAnimationFrame(() => {
        draw(params, seedParam);
    });
};

const generateUI = function (params) {
    for (let param in params) {

        let current = params[param];

        current.paramName = param;
    
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
    
        } else {
    
            elt = document.createElement("input");
    
            elt.type = current.type;

            if (current.hasOwnProperty('step')) elt.step = current.step;
    
            if (current.hasOwnProperty('min')) elt.min = current.min;
            if (current.hasOwnProperty('max')) elt.max = current.max;
    
            elt.value = current.inputValue;
    
            elt.addEventListener('input', inputHandler);
        }

        elt.setAttribute('data-var', param);
    
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

    for (let param in params) {

        disableInputsAccordingToSelectedValues(params, param);

    }
};

export { generateUI };
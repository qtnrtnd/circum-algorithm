import { _ } from "./global_var";
import { camelCaseToSpan } from "./utils";
import { params } from "./parameters";
import { draw } from "./draw";

let currentKey = null;
let fired = false;

document.addEventListener('keydown', (e) => {

    if (!fired) {
        currentKey = e.key;
        fired = true;
    }
    
});

document.addEventListener('keyup', () => {
    currentKey = null;
    fired = false;
});

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

    const target = e.target;
    let paramName = target.getAttribute("data-var");
    let param = params[paramName];
    let newValue = target.value;

    if (target.type === "range" && param.hasOwnProperty('stepValues') && currentKey !== "Control") {

        let value = (newValue + Math.abs(target.min)) * 10 / (target.max + Math.abs(target.min));
        
        let found = false;
        let i = 0;

        while (i < param.stepValues.length && !found) {

            let stepValue = (param.stepValues[i] + Math.abs(target.min)) * 10 / (target.max + Math.abs(target.min));

            if (value > stepValue - 0.022 && value < stepValue + 0.022) {
                target.value = param.stepValues[i];
                param.setValue(param.stepValues[i]);
                found = true;
            }

            i++;

        }

        if(!found) param.setValue(newValue);

    } else {
        param.setValue(newValue);
    }

    disableInputsAccordingToSelectedValues(params, paramName);

    let seedParam;

    if (paramName === "pointsPerCircle"
        || paramName === "adaptativePointsPerCircle"
        || ((paramName === "circleSpacingEase" || paramName === "smallestCircleScale") && params.adaptativePointsPerCircle.value))
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

        // On ajoute une méthode setter pour valider les données des inputs à chaque changement de valeur et faire les modifications nécessaires si la méthode "onUpdate" est spécifiée:

        Object.assign(current, {
            setValue: function(v) {

                const that = current;

                if (that.hasOwnProperty('type') && that.type === "number" || that.type === "range") {

                    if (isNaN(v)) v = that.initial;
                    else {
                        if (that.hasOwnProperty('max')) v = Math.min(v, (that.max));
                        if (that.hasOwnProperty('min')) v = Math.max(v, (that.min));
                    }
                    
                } else if (that.hasOwnProperty('type') && that.type === "select" && that.hasOwnProperty('listOfValues')) {

                    try {
                        v = JSON.parse(v);
                    } catch { }

                    let found = false;
                    let defaultIndex = 0;
                    let i = 0;

                    while (!found && i < that.listOfValues.length) {
                        if (that.listOfValues[i].value === v) {
                            found = true;
                        } else {
                            if (that.listOfValues[i].hasOwnProperty('selected') && that.listOfValues[i].selected === true) defaultIndex = i;
                            i++;
                        }
                    }

                    if (!found) {
                        v = that.listOfValues[defaultIndex].value;
                    }
                }

                that.inputValue = v;

                if (that.hasOwnProperty('onUpdate')) {

                    let res = that.onUpdate(v);
                    if (res) that.value = res;
                    else that.value = v;

                } else that.value = v;

                if (that.hasOwnProperty('influences')) {
                    that.influences.forEach(influence => {

                        let param = params[influence];
                        if (param.inputValue) param.setValue(param.inputValue);

                    });
                }
                
            }
        });

        // Génération du code HTML du formulaire :

        current.paramName = param;
    
        if (current.hasOwnProperty('initial')) current.setValue(current.initial);
    
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
            elt.setAttribute('data-var', param);
            
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

            let container = document.createElement('div');
            container.classList.add('input-container');

            if (elt.type === "range") container.classList.add('range');
            else if (elt.type === "number") container.classList.add('number');

            container.append(elt);
            elt = container;
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

    for (let param in params) {

        disableInputsAccordingToSelectedValues(params, param);

    }
};

export { generateUI };
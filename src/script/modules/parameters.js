import { _ } from "./global_var";
import { draw } from "./draw";

let params;
const MAX_EASE_POWER = 10;

const forceRecompute = function (paramName) {

    let param = params[paramName];

    if (param.inputValue) param.value = param.inputValue;

}

params = {
    resolution: {
        group: "downloadImage",
        label: "resolution",
        type: "number",
        initial: window.innerHeight,
        min: 1,
        max: 6000,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            let value = Math.max(Math.min(v, this.max), this.min);
            this.computedValue = this.inputValue = _.canvas.width = _.canvas.height = value;

            forceRecompute("biggestCircleScale");
            forceRecompute("strokeWidth");
        }
    },
    biggestCircleScale: {
        type: "range",
        initial: 0.75,
        min: 0,
        max: 2,
        step: 0.001,
        stepValues: [0.25, 1/3, 0.5, 2/3, 0.75, 1],
        get value() {
            return this.computedValue;
        },
        set value(v) {
            let value = this.inputValue = Math.max(Math.min(v, this.max), this.min);
            this.computedValue = value * params.resolution.value;

            forceRecompute("smallestCircleScale");
        }
    },
    smallestCircleScale: {
        type: "range",
        initial: 0.4,
        min: 0,
        max: 1,
        step: 0.001,
        stepValues: [0.25, 1/3, 0.5, 2/3, 0.75],
        get value() {
            return this.computedValue;
        },
        set value(v) {
            let value = this.inputValue = Math.max(Math.min(v, this.max), this.min);
            this.computedValue = value * params.biggestCircleScale.value;
        }
    },
    originRotate: {
        group: "origin",
        type: "range",
        label: "rotate",
        initial: 60,
        min: 0,
        max: 360,
        step: 0.001,
        stepValues: [45, 90, 135, 180, 225, 270, 315],
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    distanceFromCenter: {
        group: "origin",
        type: "range",
        label: "distanceFromCenter",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    iterations: {
        type: "number",
        initial: 20,
        min: 1,
        step: 1,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(v, this.min);
        }
    },
    circleSpacingEase: {
        group: "circleSpacing",
        label: "ease",
        type: "range",
        initial: 0.5,
        min: 0,
        max: 1,
        step: 0.001,
        stepValues: [0.5],
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value = Math.max(Math.min(v, this.max), this.min);
            this.inputValue = value;

            if (value < 0.5) {
                value = (1 + ((0.5 - value) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                value = 1 + ((value-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            this.computedValue = value;
        }
    },
    pointsPerCircle: {
        group: "pointsPerCircle",
        type: "number",
        initial: 20,
        min: 4,
        step: 1,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(v, this.min);
        }
    },
    adaptativePointsPerCircle: {
        group: "pointsPerCircle",
        label: "adaptative",
        type: "select",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    smoothness: {
        type: "range",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    randomizePointsInterval: {
        group: "randomizePointsInterval",
        type: "select",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        disableInputsForValue: {
            "false": "*"
            
        },
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    pointsIntervalRandomizationFactor: {
        group: "randomizePointsInterval",
        type: "range",
        label: "randomizationFactor",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    pointsIntervalRandomizationSeed: {
        group: "randomizePointsInterval",
        type: "button",
        text: "seed",
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = v;
        },
        onClick: function () {
     
            requestAnimationFrame(() => {
                draw(params, {pointsInterval: true});
            });
        }
    },
    linkPointsIntervalRandomizationFactorToEase: {
        group: "randomizePointsInterval",
        type: "select",
        label: "linkToEase",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        disableInputsForValue: {
            "false": [
                "pointsIntervalRandomizationEase",
                "pointsIntervalRandomizationMinFactor",
                "pointsIntervalRandomizationMaxFactor"
            ]
            
        },
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    pointsIntervalRandomizationEase: {
        group: "randomizePointsInterval",
        label: "ease",
        type: "range",
        initial: 0.5,
        min: 0,
        max: 1,
        step: 0.001,
        stepValues: [0.5],
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value = Math.max(Math.min(v, this.max), this.min);
            this.inputValue = value;

            if (value < 0.5) {
                value = (1 + ((0.5 - value) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                value = 1 + ((value-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            this.computedValue = value;
        }
    },
    pointsIntervalRandomizationMinFactor: {
        group: "randomizePointsInterval",
        type: "range",
        label: "from",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    pointsIntervalRandomizationMaxFactor: {
        group: "randomizePointsInterval",
        type: "range",
        label: "to",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    randomizePointsHeight: {
        group: "randomizePointsHeight",
        type: "select",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        disableInputsForValue: {
            "false": "*"
        },
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    pointsHeightRandomizationFactor: {
        group: "randomizePointsHeight",
        type: "range",
        label: "randomizationFactor",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    pointsHeightRandomizationSeed: {
        group: "randomizePointsHeight",
        type: "button",
        text: "seed",
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = v;
        },
        onClick: function () {
     
            requestAnimationFrame(() => {
                draw(params, {pointsHeight: true});
            });
        }
    },
    linkPointsHeightRandomizationFactorToEase: {
        group: "randomizePointsHeight",
        type: "select",
        label: "linkToEase",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        disableInputsForValue: {
            "false": [
                "pointsHeightRandomizationEase",
                "pointsHeightRandomizationMinFactor",
                "pointsHeightRandomizationMaxFactor"
            ]
            
        },
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    pointsHeightRandomizationEase: {
        group: "randomizePointsHeight",
        label: "ease",
        type: "range",
        initial: 0.5,
        min: 0,
        max: 1,
        step: 0.001,
        stepValues: [0.5],
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value = Math.max(Math.min(v, this.max), this.min);
            this.inputValue = value;

            if (value < 0.5) {
                value = (1 + ((0.5 - value) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                value = 1 + ((value-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            this.computedValue = value;
        }
    },
    pointsHeightRandomizationMinFactor: {
        group: "randomizePointsHeight",
        type: "range",
        label: "from",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    pointsHeightRandomizationMaxFactor: {
        group: "randomizePointsHeight",
        type: "range",
        label: "to",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    circlesRotationVariationType: {
        group: "circlesRotationVariation",
        label: "type",
        type: "select",
        listOfValues: [
            {value: false, text: "none", selected: true},
            {value: "randomization", text: "randomization"},
            {value: "progression", text: "progression"},
        ],
        disableInputsForValue: {
            "false": "*",
            "progression": [
                "circlesRotationRandomizationSeed"
            ]
        },
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;

            if (value) {
                requestAnimationFrame(() => {
                    draw(params, {circlesRotation: true});
                });
            }
        }
    },
    circlesRotationVariationFactor: {
        group: "circlesRotationVariation",
        type: "range",
        label: "variationFactor",
        initial: 0.5,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    circlesRotationRandomizationSeed: {
        group: "circlesRotationVariation",
        type: "button",
        text: "seed",
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = v;
        },
        onClick: function () {
     
            requestAnimationFrame(() => {
                draw(params, {circlesRotation: true});
            });
        }
    },
    strokeWidth: {
        group: "strokeWidth",
        type: "number",
        initial: 2,
        max: 100,
        min: 0,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            let value = this.inputValue = Math.max(Math.min(v, this.max), this.min);
            this.computedValue = (params.resolution.value * value) / 2048;
        }
    },
    linkStrokeWidthToEase: {
        group: "strokeWidth",
        type: "select",
        label: "linkToEase",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        disableInputsForValue: {
            "false": [
                "strokeWidthEase",
                "strokeWidthMinFactor",
                "strokeWidthMaxFactor"
            ]
            
        },
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    strokeWidthEase: {
        group: "strokeWidth",
        label: "ease",
        type: "range",
        initial: 0.5,
        min: 0,
        max: 1,
        step: 0.001,
        stepValues: [0.5],
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value = Math.max(Math.min(v, this.max), this.min);
            this.inputValue = value;

            if (value < 0.5) {
                value = (1 + ((0.5 - value) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                value = 1 + ((value-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            this.computedValue = value;
        }
    },
    strokeWidthMinFactor: {
        group: "strokeWidth",
        type: "range",
        label: "from",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    strokeWidthMaxFactor: {
        group: "strokeWidth",
        type: "range",
        label: "to",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001,
        get value() {
            return this.computedValue;
        },
        set value(v) {
            this.computedValue = this.inputValue = Math.max(Math.min(v, this.max), this.min);
        }
    },
    clipCircles: {
        type: "select",
        label: "type",
        listOfValues: [
            {value: "in", text: "in"},
            {value: "out", text: "out"},
            {value: false, text: "none", selected: true},
        ],
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    alphaBackground: {
        type: "select",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        initial: false,
        get value() {
            return this.computedValue;
        },
        set value(v) {

            let value;

            try {
                value = JSON.parse(v);
            } catch {
                value = v;
            }

            this.computedValue = this.inputValue = value;
        }
    },
    downloadImage: {
        group: "downloadImage",
        type: "button",
        text: "download",
        onClick: function () {
            _.canvas.toBlob(blob => {

                let a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.setAttribute('download', '');
                a.click();
                URL.revokeObjectURL(a.href);

            }, "image/png")
        }
    }
};

export { params };
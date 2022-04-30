import { _ } from "./global_var";
import { draw } from "./draw";

let params;
const MAX_EASE_POWER = 10;

params = {
    resolution: {
        group: "downloadImage",
        label: "resolution",
        type: "number",
        initial: window.innerHeight,
        min: 1,
        max: 6000,
        influences: ["biggestCircleScale", "strokeWidth"],
        onUpdate: function (inputValue) {
            _.canvas.width = _.canvas.height = inputValue;
        }
    },
    biggestCircleScale: {
        type: "range",
        initial: 0.75,
        min: 0,
        max: 2,
        step: 0.001,
        stepValues: [0.25, 1 / 3, 0.5, 2 / 3, 0.75, 1],
        influences: ["smallestCircleScale"],
        onUpdate: function (inputValue) {
            return inputValue * params.resolution.value;
        }
    },
    smallestCircleScale: {
        type: "range",
        initial: 0.4,
        min: 0,
        max: 1,
        step: 0.001,
        stepValues: [0.25, 1 / 3, 0.5, 2 / 3, 0.75],
        onUpdate: function (inputValue) {
            return inputValue * params.biggestCircleScale.value;
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
        stepValues: [45, 90, 135, 180, 225, 270, 315]
    },
    distanceFromCenter: {
        group: "origin",
        type: "range",
        label: "distanceFromCenter",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001
    },
    iterations: {
        type: "number",
        initial: 20,
        min: 1,
        step: 1
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
        onUpdate: function (inputValue) {
            let computedValue;

            if (inputValue < 0.5) {
                computedValue = inputValue = (1 + ((0.5 - inputValue) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                computedValue = inputValue = 1 + ((inputValue-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            return computedValue;
        }
    },
    pointsPerCircle: {
        group: "pointsPerCircle",
        type: "number",
        initial: 20,
        min: 4,
        step: 1
    },
    adaptativePointsPerCircle: {
        group: "pointsPerCircle",
        label: "adaptative",
        type: "select",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        initial: false
    },
    smoothness: {
        type: "range",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001
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
        initial: false
    },
    pointsIntervalRandomizationFactor: {
        group: "randomizePointsInterval",
        type: "range",
        label: "randomizationFactor",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001
    },
    pointsIntervalRandomizationSeed: {
        group: "randomizePointsInterval",
        type: "button",
        text: "seed",
        initial: false,
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
        initial: false
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
        onUpdate: function (inputValue) {
            let computedValue;

            if (inputValue < 0.5) {
                computedValue = inputValue = (1 + ((0.5 - inputValue) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                computedValue = inputValue = 1 + ((inputValue-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            return computedValue;
        }
    },
    pointsIntervalRandomizationMinFactor: {
        group: "randomizePointsInterval",
        type: "range",
        label: "from",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001
    },
    pointsIntervalRandomizationMaxFactor: {
        group: "randomizePointsInterval",
        type: "range",
        label: "to",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001
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
        initial: false
    },
    pointsHeightRandomizationFactor: {
        group: "randomizePointsHeight",
        type: "range",
        label: "randomizationFactor",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001
    },
    pointsHeightRandomizationSeed: {
        group: "randomizePointsHeight",
        type: "button",
        text: "seed",
        initial: false,
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
        initial: false
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
        onUpdate: function (inputValue) {
            let computedValue;

            if (inputValue < 0.5) {
                computedValue = inputValue = (1 + ((0.5 - inputValue) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                computedValue = inputValue = 1 + ((inputValue-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            return computedValue;
        }
    },
    pointsHeightRandomizationMinFactor: {
        group: "randomizePointsHeight",
        type: "range",
        label: "from",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001
    },
    pointsHeightRandomizationMaxFactor: {
        group: "randomizePointsHeight",
        type: "range",
        label: "to",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001
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
        onUpdate: function (inputValue) {
            if (inputValue) {
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
        step: 0.001
    },
    circlesRotationRandomizationSeed: {
        group: "circlesRotationVariation",
        type: "button",
        text: "seed",
        initial: false,
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
        onUpdate: function (inputValue) {
            return (params.resolution.value * inputValue) / 2048
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
        initial: false
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
        onUpdate: function (inputValue) {
            let computedValue;

            if (inputValue < 0.5) {
                computedValue = inputValue = (1 + ((0.5 - inputValue) / 0.5) * (MAX_EASE_POWER - 1)) * -1;
            } else {
                computedValue = inputValue = 1 + ((inputValue-0.5) / 0.5) * (MAX_EASE_POWER - 1)
            }

            return computedValue;
        }
    },
    strokeWidthMinFactor: {
        group: "strokeWidth",
        type: "range",
        label: "from",
        initial: 0,
        min: 0,
        max: 1,
        step: 0.001
    },
    strokeWidthMaxFactor: {
        group: "strokeWidth",
        type: "range",
        label: "to",
        initial: 1,
        min: 0,
        max: 1,
        step: 0.001
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
        onUpdate: function (inputValue, oldValue) {
            if ((inputValue === "out" && oldValue !== "out") || (inputValue !== "out" && oldValue === "out")) {
                if (params.pointsIntervalRandomizationSeed.value) {
                    params.pointsIntervalRandomizationSeed.setValue(params.pointsIntervalRandomizationSeed.value.reverse());
                }
                if (params.pointsHeightRandomizationSeed.value) {
                    params.pointsHeightRandomizationSeed.setValue(params.pointsHeightRandomizationSeed.value.reverse());
                }
                if (params.circlesRotationRandomizationSeed.value) {
                    params.circlesRotationRandomizationSeed.setValue(params.circlesRotationRandomizationSeed.value.reverse());
                }
            }
        }
    },
    alphaBackground: {
        type: "select",
        listOfValues: [
            {value: true, text: "true"},
            {value: false, text: "false", selected: true},
        ],
        initial: false
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
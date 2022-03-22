import { _ } from "./global_var";
import { getCirclesRadius, getPointsNumber, getPoints } from "./geometry_functions";

const draw = function (params, generateNewSeed = { pointsInterval: false, pointsHeight: false, circlesRotation: false }) {

    _.ctx.clearRect(0, 0, params.resolution.value, params.resolution.value);

    _.ctx.lineWidth = params.strokeWidth.value;

    if (!params.alphaBackground.value) {
        _.ctx.fillStyle = "white";
        _.ctx.fillRect(0, 0, _.canvas.width, _.canvas.height);
    }

    const pointsPerCircle = getPointsNumber(params);

    const circlesRadius = getCirclesRadius(params, pointsPerCircle);

    let newRandomPointsInterval = params.randomizePointsInterval.value && (generateNewSeed.pointsInterval || !params.pointsIntervalRandomizationSeed.value);

    if (newRandomPointsInterval) {
        
        let arr = [];

        for (let i = 0; i < params.iterations.value; i++) {
            arr.push(Array.apply(null, Array(pointsPerCircle[i])).map(() => -0.5 + Math.random()))
        }

        params.pointsIntervalRandomizationSeed.value = arr;
    }

    let newCirclesRotation = params.circlesRotationVariationType.value && (generateNewSeed.circlesRotation || !params.circlesRotationVariationSeed.value);

    if (newCirclesRotation) {

        let arr = [];

        if (params.circlesRotationVariationType.value === "randomization") {
            
            for (let i = 0; i < params.iterations.value; i++) {
                arr.push(Math.random());
            }

        } else if (params.circlesRotationVariationType.value === "progression") {

            for (let i = 0; i < params.iterations.value; i++) {
                arr.push(Math.round(i / (params.iterations.value - 1) * 1000) / 1000);
            }

        }

        params.circlesRotationVariationSeed.value = arr;

    }

    circlesRadius.forEach((circleRadius, i) => {

        let randomPointsInterval = params.pointsIntervalRandomizationSeed.value;

        if (Array.isArray(randomPointsInterval)) randomPointsInterval = randomPointsInterval[i];

        let circlesRotationVariation = params.circlesRotationVariationSeed.value;

        if (Array.isArray(circlesRotationVariation)) circlesRotationVariation = circlesRotationVariation[i];

        let points = getPoints(circleRadius, pointsPerCircle[i], randomPointsInterval, circlesRotationVariation, params);

        _.ctx.beginPath();
        
        points.forEach((point, i) => {

            if (i === 0) _.ctx.moveTo(point.x, point.y);

            if (params.smoothness.value === 0) {
                
                _.ctx.lineTo(point.x, point.y);
                
            } else if (i > 0) {

                let cpStart = points[i - 1].cpr;
                let cpEnd = point.cpl;

                _.ctx.bezierCurveTo(cpStart.x, cpStart.y, cpEnd.x, cpEnd.y, point.x, point.y);
            }
        });

        if (params.smoothness.value > 0) {
            _.ctx.bezierCurveTo(points[points.length - 1].cpr.x, points[points.length - 1].cpr.y, points[0].cpl.x, points[0].cpl.y, points[0].x, points[0].y);
        } else {
            _.ctx.closePath();
        }
        _.ctx.stroke();

        /*points.forEach((point, i) => {

            _.ctx.beginPath();
            _.ctx.fillStyle = "green"
            _.ctx.arc(point.x, point.y, 2, 0, 180);
            _.ctx.fill();

            _.ctx.beginPath();
            _.ctx.fillStyle = "blue"
            _.ctx.arc(point.cpl.x, point.cpl.y, 2, 0, 180);
            _.ctx.fill();

            _.ctx.beginPath();
            _.ctx.fillStyle = "blue"
            _.ctx.arc(point.cpr.x, point.cpr.y, 2, 0, 180);
            _.ctx.fill();
            
            _.ctx.beginPath();
            _.ctx.moveTo(point.cpl.x, point.cpl.y);
            _.ctx.lineTo(point.cpr.x, point.cpr.y);
            _.ctx.stroke()
        })*/
    })
    
};

export { draw };
import { _ } from "./global_var";
import { getCirclesRadius, getPointsNumber, getPoints } from "./geometry_functions";

const draw = function (params, generateNewSeed = { pointsInterval: false, pointsHeight: false, circlesRotation: false }) {

    _.ctx.clearRect(0, 0, params.resolution.value, params.resolution.value);

    _.ctx.lineWidth = params.strokeWidth.value;

    if (!params.alphaBackground.value) {
        _.ctx.fillStyle = "white";
        _.ctx.fillRect(0, 0, _.canvas.width, _.canvas.height);
    }

    const circlesRadius = getCirclesRadius(params);

    const pointsPerCircle = getPointsNumber(params, circlesRadius);

    let newRandomPointsInterval = generateNewSeed.pointsInterval || (params.randomizePointsInterval.value && !params.pointsIntervalRandomizationSeed.value);

    if (newRandomPointsInterval) {
        
        let arr = [];

        for (let i = 0; i < params.iterations.value; i++) {
            arr.push(Array.apply(null, Array(pointsPerCircle[i])).map(() => -1 + 2 * Math.random()))
        }

        params.pointsIntervalRandomizationSeed.value = arr;
    }

    let newRandomPointsHeight = generateNewSeed.pointsHeight || (params.randomizePointsHeight.value && !params.pointsHeightRandomizationSeed.value);

    if (newRandomPointsHeight) {
        
        let arr = [];

        for (let i = 0; i < params.iterations.value; i++) {
            arr.push(Array.apply(null, Array(pointsPerCircle[i])).map(() => -1 + 2 * Math.random()))
        }

        params.pointsHeightRandomizationSeed.value = arr;
    }

    let newCirclesRotation = generateNewSeed.circlesRotation || (params.circlesRotationVariationType.value && !params.circlesRotationVariationSeed.value);

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

        let points = getPoints(circleRadius, pointsPerCircle[i], params.pointsIntervalRandomizationSeed.value[i], params.pointsHeightRandomizationSeed.value[i], params.circlesRotationVariationSeed.value[i], params);

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

        points.forEach((point, i) => {

            if (point.color === "red") {
                _.ctx.beginPath();
                _.ctx.fillStyle = point.color;
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
            }
            
        })
    })
    
};

export { draw };
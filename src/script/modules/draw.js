import { _ } from "./global_var";
import { getCirclesRadius, getPointsNumber, getPoints, getValueFromEase } from "./geometry_functions";

const draw = function (params, generateNewSeed = { pointsInterval: false, pointsHeight: false, circlesRotation: false }) {

    _.ctx.clearRect(0, 0, params.resolution.value, params.resolution.value);

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

    let newRandomCirclesRotation = generateNewSeed.circlesRotation || (params.circlesRotationVariationType.value === "randomization" && !params.circlesRotationRandomizationSeed.value);

    if (newRandomCirclesRotation) {

        let arr = [];

        for (let i = 0; i < params.iterations.value; i++) {
            arr.push(Math.random());
        }

        params.circlesRotationRandomizationSeed.value = arr;

    }

    circlesRadius.forEach((circleRadius, i) => {

        let lineWidth = params.strokeWidth.value;

        let ease = Math.max(getValueFromEase(i, params.strokeWidthEase.value, 1 / (params.iterations.value - 1), params.strokeWidthMinFactor.value, params.strokeWidthMaxFactor.value), 10e-4);

        if (params.linkStrokeWidthToEase.value) lineWidth *= ease;

        _.ctx.lineWidth = lineWidth;

        let points = getPoints(circleRadius, pointsPerCircle[i], params.pointsIntervalRandomizationSeed.value[i], params.pointsHeightRandomizationSeed.value[i], params.circlesRotationRandomizationSeed.value[i], i, params);

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
        //_.ctx.fillStyle = "white";
        //_.ctx.fill();
        _.ctx.stroke();

        //if (params.clipCircles.value === "in") _.ctx.globalCompositeOperation = "destination-atop";

        /*points.forEach((point, i) => {

           
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
            
            
        })*/
    })
    
};

export { draw };
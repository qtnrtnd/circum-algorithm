import { _ } from "./global_var";

const dist = function (p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

const getValueFromEase = function (i, power, step, min, max) {

    let ease;

    if (power < 0) {
        ease = 1 - Math.pow(1 - (i * step), power * -1)
    } else {
        ease = Math.pow(i * step, power);
    }

    return Math.round((min + (ease * (max - min))) * 1000) / 1000;
}

const offsetPointOnAxis = function (pRef1, pRef2, pTarget, offset = 0, useYasInput = false) {
    
    let na = Math.max(pRef1.x > pRef2.x ? pRef1.x - pRef2.x : pRef2.x - pRef1.x, 1);
    let c = pRef1.x > pRef2.x ? pRef1.y - pRef2.y : pRef2.y - pRef1.y;
    let a = c / na;
    let b = pRef1.y - a * pRef1.x;

    let x, y;


    if (!useYasInput) {

        x = pTarget.x + offset;
        y = a * x + b

    } else {

        y = pTarget.y + offset;
        x = (y - b) / a
    }

    return { x: x, y: y };

}

const getControlPoints = function (pBefore, pCurrent, pAfter, distFromCurrentFactor = params.smoothness.initial) {

    let beforeToCurrentMid = { x: (pBefore.x + pCurrent.x) / 2, y: (pBefore.y + pCurrent.y) / 2 };

    let currentToAfterMid = { x: (pCurrent.x + pAfter.x) / 2, y: (pCurrent.y + pAfter.y) / 2 };

    let newCurrent = { x: (beforeToCurrentMid.x + currentToAfterMid.x) / 2, y: (beforeToCurrentMid.y + currentToAfterMid.y) / 2 };
    
    let beforeToCurrentDist = dist(beforeToCurrentMid, newCurrent);
    let currentToAfterDist = dist(newCurrent, currentToAfterMid);

    let DXgreaterThanDYBefore = Math.max(beforeToCurrentMid.x, newCurrent.x) - Math.min(beforeToCurrentMid.x, newCurrent.x) >= Math.max(beforeToCurrentMid.y, newCurrent.y) - Math.min(beforeToCurrentMid.y, newCurrent.y);

    let DXgreaterThanDYAfter = Math.max(currentToAfterMid.x, newCurrent.x) - Math.min(currentToAfterMid.x, newCurrent.x) >= Math.max(currentToAfterMid.y, newCurrent.y) - Math.min(currentToAfterMid.y, newCurrent.y);

    let dirBefore, dirAfter;

    if (DXgreaterThanDYBefore) {
        dirBefore = beforeToCurrentMid.x < newCurrent.x ? 1 : -1;
    } else {
        dirBefore = beforeToCurrentMid.y < newCurrent.y ? 1 : -1;
    }

    if (DXgreaterThanDYAfter) {
        dirAfter = currentToAfterMid.x > newCurrent.x ? 1 : -1;
    } else {
        dirAfter = currentToAfterMid.y > newCurrent.y ? 1 : -1;
    }

    let cpl = offsetPointOnAxis(beforeToCurrentMid, currentToAfterMid, newCurrent, -dirBefore * beforeToCurrentDist * 0.552 * distFromCurrentFactor, !DXgreaterThanDYBefore);

    let cpr = offsetPointOnAxis(beforeToCurrentMid, currentToAfterMid, newCurrent, dirAfter * currentToAfterDist * 0.552 * distFromCurrentFactor, !DXgreaterThanDYAfter);

    return { cpl, cpr, x: newCurrent.x , y: newCurrent.y};

}

const getPoints = function (radius, pointsNumber, randomPointsInterval, randomPointsHeight, randomCirclesRotation, currentCircleIteration, params) {

    if (params.adaptativePointsPerCircle.value && pointsNumber !== randomPointsInterval.length) {
        pointsNumber = randomPointsInterval.length;
    }
    
    let pointStep = 360 / pointsNumber;
    let circleStep = 1 / params.iterations.value;

    let originFromCenter = (params.biggestCircleScale.value / 2 - radius) * params.distanceFromCenter.value;
    let originX = _.canvas.width / 2 + (originFromCenter * Math.cos(params.originRotate.value * Math.PI / 180));
    let originY = _.canvas.height / 2 + (originFromCenter * Math.sin(params.originRotate.value * Math.PI / 180));

    let points = [], pointsWithCp = [], linkPointsIntervalRandomizationFactorToEaseFactor = 1, linkPointsHeightRandomizationFactorToEaseFactor = 1;

    let rotationVariation = randomCirclesRotation ? randomCirclesRotation : 0;

    if (params.circlesRotationVariationType.value === "progression") {
        
        if (params.clipCircles.value === "out") currentCircleIteration = (params.iterations.value - 1) - currentCircleIteration;

        rotationVariation = Math.round(currentCircleIteration / (params.iterations.value - 1) * 100) / 100;
    }

    if (params.linkPointsIntervalRandomizationFactorToEase.value) {

        linkPointsIntervalRandomizationFactorToEaseFactor = getValueFromEase(currentCircleIteration, params.pointsIntervalRandomizationEase.value, circleStep, params.pointsIntervalRandomizationMinFactor.value, params.pointsIntervalRandomizationMaxFactor.value);
    }

    if (params.linkPointsHeightRandomizationFactorToEase.value) {

        linkPointsHeightRandomizationFactorToEaseFactor = getValueFromEase(currentCircleIteration, params.pointsHeightRandomizationEase.value, circleStep, params.pointsHeightRandomizationMinFactor.value, params.pointsHeightRandomizationMaxFactor.value);
    }

    for (let i = 0; i < pointsNumber; i++){

        let rotateOffset = (params.randomizePointsInterval.value ? pointStep / 2 * (randomPointsInterval ? randomPointsInterval[i] : 0) * params.pointsIntervalRandomizationFactor.value * linkPointsIntervalRandomizationFactorToEaseFactor : 0) + (params.circlesRotationVariationType.value ? 360 * rotationVariation * params.circlesRotationVariationFactor.value : 0);
        
        let distOffset = params.randomizePointsHeight.value ? (randomPointsHeight ? randomPointsHeight[i] : 0) * radius * params.pointsHeightRandomizationFactor.value * linkPointsHeightRandomizationFactorToEaseFactor : 0;

        let x = originX + (radius + distOffset) * Math.cos((i * pointStep + rotateOffset) * Math.PI / 180);
        let y = originY + (radius + distOffset) * Math.sin((i * pointStep + rotateOffset) * Math.PI / 180);

        points.push({ x: x, y: y, angle: i * pointStep });
        
    }

    points.forEach((point, i) => {
        
        let pointBefore = i > 0 ? points[i - 1] : points[points.length - 1];

        let pointAfter = i < points.length - 1 ? points[i + 1] : points[0];

        pointsWithCp.push(getControlPoints(pointBefore, point, pointAfter, params.smoothness.value));
    });

    return pointsWithCp;
}

const getCirclesRadius = function (params) {

    let number = params.iterations.value;

    let step = 1 / Math.max(number - 1, 1);

    let radius = [];

    for (let i = 0; i < number; i++){

        let value = getValueFromEase(i, params.circleSpacingEase.value, step, params.smallestCircleScale.value / 2, params.biggestCircleScale.value / 2);

        if (params.clipCircles.value === "out") {
            radius.unshift(value);
        } else {
            radius.push(value);
        }
    }

    return radius;
}

const getPointsNumber = function (params, circleRadius) {

    let arr = [];
    const biggestCircleScale = params.biggestCircleScale.value / 2;
    const maxPointsPerCircle = params.pointsPerCircle.value;

    for (let i = 0; i < circleRadius.length; i++){

        let value;

        if (params.adaptativePointsPerCircle.value) {
           
            value = Math.floor(params.pointsPerCircle.min + (circleRadius[i] / biggestCircleScale) * (maxPointsPerCircle - params.pointsPerCircle.min));

        } else {
            value = maxPointsPerCircle;
        }

        arr.push(value);
    }

    return arr;
}

export { dist, offsetPointOnAxis, getControlPoints, getPoints, getCirclesRadius, getPointsNumber, getValueFromEase };
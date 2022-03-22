import { _ } from "./global_var";

const dist = function (p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

const offsetPointOnAxis = function (pRef1, pRef2, pTarget, circleOrigin, offset = 0, dir = "right") {
    
    let na = pRef1.x > pRef2.x ? pRef1.x - pRef2.x : pRef2.x - pRef1.x;
    na = na === 0 ? 1 : na;
    let c = pRef1.x > pRef2.x ? pRef1.y - pRef2.y : pRef2.y - pRef1.y;
    let a = c / na;
    let b = pRef1.y - a * pRef1.x;

    let x, y;

    let DXgreaterThanDY = Math.max(pRef1.x, pRef2.x) - Math.min(pRef1.x, pRef2.x) > Math.max(pRef1.y, pRef2.y) - Math.min(pRef1.y, pRef2.y);

    if (DXgreaterThanDY) {

        if (pTarget.y > circleOrigin.y) {
            dir = dir === "right" ? -1 : (dir === "left" ? 1 : 0);
        } else {
            dir = dir === "right" ? 1 : (dir === "left" ? -1 : 0);
        }

        x = pTarget.x + dir * offset;
        y = a * x + b

    } else {

        if (pTarget.x > circleOrigin.x) {
            dir = dir === "right" ? 1 : (dir === "left" ? -1 : 0);
        } else {
            dir = dir === "right" ? -1 : (dir === "left" ? 1 : 0);
        }

        y = pTarget.y + dir * offset;
        x = (y - b) / a
    }

    return { x: x, y: y };

}

const getControlPoints = function (pBefore, pCurrent, pAfter, circleOrigin, distFromCurrentFactor = params.smoothness.initial) {

    distFromCurrentFactor = Math.max(0, Math.min(distFromCurrentFactor, 1));

    let beforeToCurrentMid = { x: (pBefore.x + pCurrent.x) / 2, y: (pBefore.y + pCurrent.y) / 2 };

    let currentToAfterMid = { x: (pCurrent.x + pAfter.x) / 2, y: (pCurrent.y + pAfter.y) / 2 };

    let newCurrent = { x: (beforeToCurrentMid.x + currentToAfterMid.x) / 2, y: (beforeToCurrentMid.y + currentToAfterMid.y) / 2 };
    
    let beforeToCurrentDist = dist(beforeToCurrentMid, newCurrent);
    let currentToAfterDist = dist(newCurrent, currentToAfterMid);

    let cpl = offsetPointOnAxis(beforeToCurrentMid, currentToAfterMid, newCurrent, circleOrigin, beforeToCurrentDist * 0.552 * distFromCurrentFactor, "left");

    let cpr = offsetPointOnAxis(beforeToCurrentMid, currentToAfterMid, newCurrent, circleOrigin, currentToAfterDist * 0.552 * distFromCurrentFactor, "right");

    return { cpl, cpr, x: newCurrent.x , y: newCurrent.y };

}

const getPoints = function (rayon, pointsNumber, randomPointsInterval, circlesRotationVariation, params) {

    let step = 360 / pointsNumber;

    let originFromCenter = (params.biggestCircleScale.value / 2 - rayon) * params.distanceFromCenter.value;
    let originX = _.canvas.width / 2 + (originFromCenter * Math.cos(params.originRotate.value * Math.PI / 180));
    let originY = _.canvas.height / 2 + (originFromCenter * Math.sin(params.originRotate.value * Math.PI / 180));

    let points = [], pointsWithCp = [];

    for (let i = 0; i < pointsNumber; i++){

        let offset = (params.randomizePointsInterval.value ? step * (randomPointsInterval ? randomPointsInterval[i] : 0) * params.pointsIntervalRandomizationFactor.value : 0) + (params.circlesRotationVariationType.value ? (params.circlesRotationVariationType.value === "randomization" ? step : 360) * (circlesRotationVariation ? circlesRotationVariation : 0) * params.circlesRotationVariationFactor.value : 0);

        let x = originX + rayon * Math.cos((i * step + offset) * Math.PI / 180);
        let y = originY + rayon * Math.sin((i * step + offset) * Math.PI / 180);

        points.push({ x: x, y: y });
        
    }

    points.forEach((point, i) => {
        
        let pointBefore = i > 0 ? points[i - 1] : points[points.length - 1];

        let pointAfter = i < points.length - 1 ? points[i + 1] : points[0];

        pointsWithCp.push(getControlPoints(pointBefore, point, pointAfter, {x: originX, y: originY}, params.smoothness.value));
    });

    return pointsWithCp;
}

const getCirclesRadius = function (params) {

    let number = params.iterations.value;

    let step = 1 / Math.max((number - 1), 1);

    let radius = [];

    for (let i = 0; i < number; i++){

        let ease;

        if (params.tension.value < 0) {
            ease = 1 - Math.pow(1 - (i * step), params.tension.value * -1)
        } else {
            ease = Math.pow(i * step, params.tension.value);
        }

        radius.push(Math.round((params.smallestCircleScale.value + (ease * (params.biggestCircleScale.value - params.smallestCircleScale.value))) * 1000) / 2000);
    }

    return radius;
}

const getPointsNumber = function (params) {

    let arr = []

    for (let i = 0; i < params.iterations.value; i++){
        arr.push(params.pointsPerCircle.value);
    }

    return arr;
}

export { dist, offsetPointOnAxis, getControlPoints, getPoints, getCirclesRadius, getPointsNumber };
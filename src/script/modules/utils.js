const camelCaseToSpan = function (str) {
    
    let uppers = [0], span = "";

    Array.from(str).forEach((char, i) => {
        if (char.toUpperCase() === char) uppers.push(i);
    });

    uppers.forEach((upIndex, i) => {
        span += "<span>" + str.slice(upIndex, uppers[i + 1]) + "</span>";
    })

    return span;

};

export { camelCaseToSpan };
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const _ = {
    canvas : canvas,
    ctx: ctx,
    paramsWindow: document.getElementById('params')
}

export { _ };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function seq(...parsers) {
    return (target, position) => {
        const result = [];
        for (let parser of parsers) {
            const parsed = parser(target, position);
            if (parsed[0]) {
                result.push(parsed[1]);
                position = parsed[2];
            }
            else {
                return [false, null, position, `seq@${position}: ${parsed[3]}`];
            }
        }
        return [true, result, position];
    };
}
exports.seq = seq;
function or(...parsers) {
    return (target, position) => {
        const errors = [];
        for (let parser of parsers) {
            const parsed = parser(target, position);
            if (parsed[0]) {
                return parsed;
            }
            else {
                errors.push(parser[2]);
            }
        }
        return [
            false,
            null,
            position,
            `or@${position}: expected ${errors.join(" or ")}`
        ];
    };
}
exports.or = or;
exports.lazy = (generator) => {
    let parser;
    return (target, position) => {
        if (parser === undefined) {
            parser = generator();
        }
        return parser(target, position);
    };
};
exports.opt = (parser) => (target, position) => {
    const result = parser(target, position);
    if (result[0]) {
        return result;
    }
    return [true, null, position, `opt@${position}: ${result[3]}`];
};
exports.many = (parser) => (target, position) => {
    const result = [];
    while (true) {
        const parsed = parser(target, position);
        if (parsed[0]) {
            result.push(parsed[1]);
            position = parsed[2];
        }
        else {
            break;
        }
    }
    if (result.length === 0) {
        return [false, null, position, `many@${position}: cannot parse`];
    }
    return [true, result, position];
};
exports.map = (parser, transform) => (target, position) => {
    const result = parser(target, position);
    if (result[0]) {
        return [result[0], transform(result[1]), result[2]];
    }
    else {
        return [false, null, result[2], `map@${position}: ${result[3]}`];
    }
};
exports.transform = (transformParser, parser) => (target, position) => {
    const result = transformParser(target, position);
    if (!result[0]) {
        return [false, null, position, `transform@${position}: ${result[2]}`];
    }
    return parser(result[1], 0);
};
exports.fail = (_, position) => [
    false,
    null,
    position,
    `fail@${position}`
];
exports.pass = (target, position) => [true, target[position], position + 1];
exports.seqMap = (parser, next) => (target, position) => {
    const result = parser(target, position);
    if (!result[0]) {
        return [false, null, position, result[3]];
    }
    return next(result[1])(target, result[2]);
};
exports.vec = (parser, size) => (target, position) => {
    const result = [];
    for (let i = 0; i < size; i++) {
        const parsed = parser(target, position);
        if (parsed[0]) {
            result.push(parsed[1]);
            position = parsed[2];
        }
        else {
            return [false, null, position, `vec@${position}: ${parsed[3]}`];
        }
    }
    return [true, result, position];
};
// this does not advance the position, but succeeds to parse and returns result
exports.terminate = (result) => (_, position) => [
    true,
    result,
    position
];
//# sourceMappingURL=core.js.map
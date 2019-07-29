"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const num = value => (target, position) => [target[position] === value, value, position + 1];
describe("core", () => {
    it("or", () => {
        const p = core_1.or(num(0), num(2));
        expect(p([0], 0)[0]).toBeTruthy();
        expect(p([1], 0)[0]).toBeFalsy();
        expect(p([2], 0)[0]).toBeTruthy();
    });
    it("seq", () => {
        const p = core_1.seq(num(1), num(5));
        expect(p([0, 1], 0)[0]).toBeFalsy();
        expect(p([1, 5], 0)[0]).toBeTruthy();
        expect(p([1, 3], 0)[0]).toBeFalsy();
    });
    it("many", () => {
        const p = core_1.many(num(3));
        expect(p([5], 0)[0]).toBeFalsy();
        expect(p([3], 0)[1]).toStrictEqual([3]);
        expect(p([3, 3], 0)[1]).toStrictEqual([3, 3]);
        expect(p([3, 3, 4], 0)[1]).toStrictEqual([3, 3]);
    });
    it("opt", () => {
        const p = core_1.opt(num(3));
        expect(p([5], 0)[0]).toBeTruthy();
        expect(p([5], 0)[1]).toBe(null);
        expect(p([3], 0)[0]).toBeTruthy();
    });
});
//# sourceMappingURL=core.test.js.map
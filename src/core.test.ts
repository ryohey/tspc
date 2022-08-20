import { many, opt, or, Parser, seq } from "./core"

const num: (value: number) => Parser<number[], number> =
  (value) => (target, position) =>
    target[position] === value
      ? {
          success: true,
          value,
          position: position + 1,
        }
      : { success: false, position, error: "error" }

describe("core", () => {
  it("or", () => {
    const p = or(num(0), num(2))
    expect(p([0], 0).success).toBeTruthy()
    expect(p([1], 0).success).toBeFalsy()
    expect(p([2], 0).success).toBeTruthy()
  })
  it("seq", () => {
    const p = seq(num(1), num(5))
    expect(p([0, 1], 0).success).toBeFalsy()
    expect(p([1, 5], 0).success).toBeTruthy()
    expect(p([1, 3], 0).success).toBeFalsy()
  })
  it("many", () => {
    const p = many(num(3))
    expect(p([5], 0).success).toBeFalsy()
    expect(p([3], 0)["value"]).toStrictEqual([3])
    expect(p([3, 3], 0)["value"]).toStrictEqual([3, 3])
    expect(p([3, 3, 4], 0)["value"]).toStrictEqual([3, 3])
  })
  it("opt", () => {
    const p = opt(num(3))
    expect(p([5], 0).success).toBeTruthy()
    expect(p([5], 0)["value"]).toBe(null)
    expect(p([3], 0).success).toBeTruthy()
  })
})

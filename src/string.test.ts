import { int, num, regexp, token, uint } from "./string"

describe("string", () => {
  it("token", () => {
    const p = token("foo")
    expect(p("bar", 0).success).toBeFalsy()
    expect(p("foo", 0).success).toBeTruthy()
    expect(p("foo", 0).position).toBe(3)
  })
  it("regexp", () => {
    const p = regexp(/https?:\/\//)
    expect(p("bar", 0).success).toBeFalsy()
    expect(p("http://", 0).success).toBeTruthy()
    expect(p("http://", 0).position).toBe(7)
    expect(p("https://", 0).success).toBeTruthy()
    expect(p("https://", 0).position).toBe(8)
  })
  it("num", () => {
    expect(num("123", 0).success).toBeTruthy()
    expect(num("x", 0).success).toBeFalsy()
  })
  it("uint", () => {
    expect(uint("123", 0).success).toBeTruthy()
    expect(uint("123", 0).position).toBe(3)
    expect(uint("123", 0)["value"]).toBe(123)
    expect(uint("-09", 0).success).toBeFalsy()
  })
  it("int", () => {
    expect(int("123", 0).success).toBeTruthy()
    expect(int("123", 0).position).toBe(3)
    expect(int("123", 0)["value"]).toBe(123)
    expect(int("-09", 0).success).toBeTruthy()
    expect(int("-09", 0)["value"]).toBe(-9)
  })
})

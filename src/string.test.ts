import { int, num, regexp, token, uint } from "./string"

describe("string", () => {
  it("token", () => {
    const p = token("foo")
    expect(p("bar", 0)[0]).toBeFalsy()
    expect(p("foo", 0)[0]).toBeTruthy()
    expect(p("foo", 0)[2]).toBe(3)
  })
  it("regexp", () => {
    const p = regexp(/https?:\/\//)
    expect(p("bar", 0)[0]).toBeFalsy()
    expect(p("http://", 0)[0]).toBeTruthy()
    expect(p("http://", 0)[2]).toEqual(7)
    expect(p("https://", 0)[0]).toBeTruthy()
    expect(p("https://", 0)[2]).toEqual(8)
  })
  it("num", () => {
    expect(num("123", 0)[0]).toBeTruthy()
    expect(num("x", 0)[0]).toBeFalsy()
  })
  it("uint", () => {
    expect(uint("123", 0)[0]).toBeTruthy()
    expect(uint("123", 0)[2]).toEqual(3)
    expect(uint("123", 0)[1]).toEqual(123)
    expect(uint("-09", 0)[0]).toBeFalsy()
  })
  it("int", () => {
    expect(int("123", 0)[0]).toBeTruthy()
    expect(int("123", 0)[2]).toEqual(3)
    expect(int("123", 0)[1]).toEqual(123)
    expect(int("-09", 0)[0]).toBeTruthy()
    expect(int("-09", 0)[1]).toEqual(-9)
  })
})

import { regexp, token } from "./string"

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
})

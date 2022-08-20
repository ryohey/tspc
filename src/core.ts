export type Result<T> =
  | {
      success: true
      position: number
      value: T
    }
  | {
      success: false
      position: number
      error: string
    }

export type Parser<T, S> = (target: T, position: number) => Result<S>

export function seq<T, P0, P1>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>]
): Parser<T, [P0, P1]>
export function seq<T, P0, P1, P2>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>]
): Parser<T, [P0, P1, P2]>
export function seq<T, P0, P1, P2, P3>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>, Parser<T, P3>]
): Parser<T, [P0, P1, P2, P3]>
export function seq<T, P0, P1, P2, P3, P4>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>
  ]
): Parser<T, [P0, P1, P2, P3, P4]>
export function seq<T, P0, P1, P2, P3, P4, P5>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>,
    Parser<T, P5>
  ]
): Parser<T, [P0, P1, P2, P3, P4, P5]>
export function seq<T, P0, P1, P2, P3, P4, P5, P6>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>,
    Parser<T, P5>,
    Parser<T, P6>
  ]
): Parser<T, [P0, P1, P2, P3, P4, P5, P6]>
export function seq<T, P0>(...parsers: Parser<T, P0>[]): Parser<T, P0[]>
export function seq<T, S>(...parsers: Parser<T, S>[]): Parser<T, S[]> {
  return (target, position) => {
    const result: S[] = []
    for (let parser of parsers) {
      const parsed = parser(target, position)
      if (parsed.success === true) {
        result.push(parsed.value)
        position = parsed.position
      } else {
        return {
          success: false,
          position,
          error: `seq@${position}: ${parsed.error}`,
        }
      }
    }
    return {
      success: true,
      value: result,
      position,
    }
  }
}

export function or<T, S>(...parsers: Parser<T, S>[]): Parser<T, S>
export function or<T, P0, P1>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>]
): Parser<T, P0 | P1>
export function or<T, P0, P1, P2>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>]
): Parser<T, P0 | P1 | P2>
export function or<T, P0, P1, P2, P3>(
  ...parsers: [Parser<T, P0>, Parser<T, P1>, Parser<T, P2>, Parser<T, P3>]
): Parser<T, P0 | P1 | P2 | P3>
export function or<T, P0, P1, P2, P3, P4>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>
  ]
): Parser<T, P0 | P1 | P2 | P3 | P4>
export function or<T, P0, P1, P2, P3, P4, P5>(
  ...parsers: [
    Parser<T, P0>,
    Parser<T, P1>,
    Parser<T, P2>,
    Parser<T, P3>,
    Parser<T, P4>,
    Parser<T, P5>
  ]
): Parser<T, P0 | P1 | P2 | P3 | P4 | P5>
export function or<T>(...parsers: Parser<T, any>[]): Parser<T, any> {
  return (target, position) => {
    const errors: string[] = []
    for (let parser of parsers) {
      const parsed = parser(target, position)
      if (parsed.success === true) {
        return parsed
      } else {
        errors.push(parsed.error)
      }
    }
    return {
      success: false,
      position,
      error: `or@${position}: expected ${errors.join(" or ")}`,
    }
  }
}

export const lazy = <T, S>(generator: () => Parser<T, S>): Parser<T, S> => {
  let parser: Parser<T, S>
  return (target, position) => {
    if (parser === undefined) {
      parser = generator()
    }
    return parser(target, position)
  }
}

export const opt =
  <T, S>(parser: Parser<T, S>, defaultValue: S = null): Parser<T, S | null> =>
  (target, position) => {
    const result = parser(target, position)
    if (result.success === true) {
      return result
    }
    return {
      success: true,
      value: defaultValue,
      position: position,
    }
  }

export const many =
  <T, S>(parser: Parser<T, S>): Parser<T, S[]> =>
  (target, position) => {
    const result = []
    while (true) {
      const parsed = parser(target, position)
      if (parsed.success) {
        result.push(parsed.value)
        position = parsed.position
      } else {
        break
      }
    }
    if (result.length === 0) {
      return {
        success: false,
        position,
        error: `many@${position}: cannot parse`,
      }
    }
    return {
      success: true,
      value: result,
      position,
    }
  }

export const map =
  <T, S, U>(parser: Parser<T, S>, transform: (value: S) => U): Parser<T, U> =>
  (target, position) => {
    const result = parser(target, position)
    if (result.success === true) {
      return {
        success: true,
        value: transform(result.value),
        position: result.position,
      }
    } else {
      return {
        success: false,
        position,
        error: `map@${position}: ${result.error}`,
      }
    }
  }

export const transform =
  <T, S, U>(
    transformParser: Parser<T, S>,
    parser: Parser<S, U>
  ): Parser<T, U> =>
  (target, position) => {
    const result = transformParser(target, position)
    if (!result.success) {
      return {
        success: false,
        position,
        error: `transform@${position}: ${result.position}`,
      }
    }
    return parser(result.value, 0)
  }

export const fail: Parser<any, null> = (_: any, position: number) => ({
  success: false,
  position,
  error: `fail@${position}`,
})

export const pass = <T>(target: T[], position: number) => ({
  success: true,
  value: target[position],
  position: position + 1,
})

export const seqMap =
  <T, S, R>(
    parser: Parser<T, S>,
    next: (value: S) => Parser<T, R>
  ): Parser<T, R> =>
  (target, position) => {
    const result = parser(target, position)
    if (result.success === false) {
      return {
        success: false,
        position,
        error: result.error,
      }
    }
    return next(result.value)(target, result.position)
  }

export const vec =
  <T, S>(parser: Parser<T, S>, size: number): Parser<T, S[]> =>
  (target, position) => {
    const result = []
    for (let i = 0; i < size; i++) {
      const parsed = parser(target, position)
      if (parsed.success === true) {
        result.push(parsed.value)
        position = parsed.position
      } else {
        return {
          success: false,
          position,
          error: `vec@${position}: ${parsed.error}`,
        }
      }
    }
    return { success: true, value: result, position }
  }

// this does not advance the position, but succeeds to parse and returns result
export const terminate =
  <S, T>(result: T): Parser<S, T> =>
  (_, position) => ({ success: true, value: result, position })

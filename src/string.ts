import { many, map, opt, Parser, seq } from "./core"

export const token =
  <T extends string>(word: T): Parser<string, T> =>
  (target, position) =>
    target.substring(position, position + word.length) === word
      ? { success: true, value: word, position: position + word.length }
      : {
          success: false,
          position,
          error: `token@${position}: ${target.substr(
            position,
            word.length
          )} is not ${word}`,
        }

export const regexp =
  (reg: RegExp): Parser<string, string> =>
  (target, position) => {
    reg.lastIndex = 0
    const result = reg.exec(target.slice(position))
    return result
      ? {
          success: true,
          value: result[0],
          position: position + result[0].length,
        }
      : {
          success: false,
          position,
          error: `regexp@${position}: ${target.slice(
            position
          )} does not match ${reg.source}`,
        }
  }

const numCharTable = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
export const num: Parser<string, string> = (target, position) =>
  numCharTable.includes(target[position])
    ? { success: true, value: target[position], position: position + 1 }
    : {
        success: false,
        position,
        error: `${target[position]} is not number character`,
      }

export const uint: Parser<string, number> = map(many(num), (arr) =>
  parseInt(arr.join(""))
)

export const int: Parser<string, number> = map(
  seq(opt(token("-"), ""), many(num)),
  (arr) => parseInt(arr[0] + arr[1].join(""))
)

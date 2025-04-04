// https://deno.land/std@0.196.0/datetime/_common.ts
var Tokenizer = class {
  rules;
  constructor(rules = []) {
    this.rules = rules;
  }
  addRule(test, fn) {
    this.rules.push({ test, fn });
    return this;
  }
  tokenize(string, receiver = (token) => token) {
    function* generator(rules) {
      let index = 0;
      for (const rule of rules) {
        const result = rule.test(string);
        if (result) {
          const { value, length } = result;
          index += length;
          string = string.slice(length);
          const token = { ...rule.fn(value), index };
          yield receiver(token);
          yield* generator(rules);
        }
      }
    }
    const tokenGenerator = generator(this.rules);
    const tokens = [];
    for (const token of tokenGenerator) {
      tokens.push(token);
    }
    if (string.length) {
      throw new Error(
        `parser error: string not fully parsed! ${string.slice(0, 25)}`
      );
    }
    return tokens;
  }
};
function digits(value, count = 2) {
  return String(value).padStart(count, "0");
}
function createLiteralTestFunction(value) {
  return (string) => {
    return string.startsWith(value) ? { value, length: value.length } : void 0;
  };
}
function createMatchTestFunction(match) {
  return (string) => {
    const result = match.exec(string);
    if (result) return { value: result, length: result[0].length };
  };
}
var defaultRules = [
  {
    test: createLiteralTestFunction("yyyy"),
    fn: () => ({ type: "year", value: "numeric" })
  },
  {
    test: createLiteralTestFunction("yy"),
    fn: () => ({ type: "year", value: "2-digit" })
  },
  {
    test: createLiteralTestFunction("MM"),
    fn: () => ({ type: "month", value: "2-digit" })
  },
  {
    test: createLiteralTestFunction("M"),
    fn: () => ({ type: "month", value: "numeric" })
  },
  {
    test: createLiteralTestFunction("dd"),
    fn: () => ({ type: "day", value: "2-digit" })
  },
  {
    test: createLiteralTestFunction("d"),
    fn: () => ({ type: "day", value: "numeric" })
  },
  {
    test: createLiteralTestFunction("HH"),
    fn: () => ({ type: "hour", value: "2-digit" })
  },
  {
    test: createLiteralTestFunction("H"),
    fn: () => ({ type: "hour", value: "numeric" })
  },
  {
    test: createLiteralTestFunction("hh"),
    fn: () => ({
      type: "hour",
      value: "2-digit",
      hour12: true
    })
  },
  {
    test: createLiteralTestFunction("h"),
    fn: () => ({
      type: "hour",
      value: "numeric",
      hour12: true
    })
  },
  {
    test: createLiteralTestFunction("mm"),
    fn: () => ({ type: "minute", value: "2-digit" })
  },
  {
    test: createLiteralTestFunction("m"),
    fn: () => ({ type: "minute", value: "numeric" })
  },
  {
    test: createLiteralTestFunction("ss"),
    fn: () => ({ type: "second", value: "2-digit" })
  },
  {
    test: createLiteralTestFunction("s"),
    fn: () => ({ type: "second", value: "numeric" })
  },
  {
    test: createLiteralTestFunction("SSS"),
    fn: () => ({ type: "fractionalSecond", value: 3 })
  },
  {
    test: createLiteralTestFunction("SS"),
    fn: () => ({ type: "fractionalSecond", value: 2 })
  },
  {
    test: createLiteralTestFunction("S"),
    fn: () => ({ type: "fractionalSecond", value: 1 })
  },
  {
    test: createLiteralTestFunction("a"),
    fn: (value) => ({
      type: "dayPeriod",
      value
    })
  },
  // quoted literal
  {
    test: createMatchTestFunction(/^(')(?<value>\\.|[^\']*)\1/),
    fn: (match) => ({
      type: "literal",
      value: match.groups.value
    })
  },
  // literal
  {
    test: createMatchTestFunction(/^.+?\s*/),
    fn: (match) => ({
      type: "literal",
      value: match[0]
    })
  }
];
var DateTimeFormatter = class {
  #format;
  constructor(formatString, rules = defaultRules) {
    const tokenizer = new Tokenizer(rules);
    this.#format = tokenizer.tokenize(
      formatString,
      ({ type, value, hour12 }) => {
        const result = {
          type,
          value
        };
        if (hour12) result.hour12 = hour12;
        return result;
      }
    );
  }
  format(date, options = {}) {
    let string = "";
    const utc = options.timeZone === "UTC";
    for (const token of this.#format) {
      const type = token.type;
      switch (type) {
        case "year": {
          const value = utc ? date.getUTCFullYear() : date.getFullYear();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2).slice(-2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "month": {
          const value = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "day": {
          const value = utc ? date.getUTCDate() : date.getDate();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "hour": {
          let value = utc ? date.getUTCHours() : date.getHours();
          value -= token.hour12 && date.getHours() > 12 ? 12 : 0;
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "minute": {
          const value = utc ? date.getUTCMinutes() : date.getMinutes();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "second": {
          const value = utc ? date.getUTCSeconds() : date.getSeconds();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "fractionalSecond": {
          const value = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
          string += digits(value, Number(token.value));
          break;
        }
        // FIXME(bartlomieju)
        case "timeZoneName": {
          break;
        }
        case "dayPeriod": {
          string += token.value ? date.getHours() >= 12 ? "PM" : "AM" : "";
          break;
        }
        case "literal": {
          string += token.value;
          break;
        }
        default:
          throw Error(`FormatterError: { ${token.type} ${token.value} }`);
      }
    }
    return string;
  }
  parseToParts(string) {
    const parts = [];
    for (const token of this.#format) {
      const type = token.type;
      let value = "";
      switch (token.type) {
        case "year": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,4}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
          }
          break;
        }
        case "month": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            case "narrow": {
              value = /^[a-zA-Z]+/.exec(string)?.[0];
              break;
            }
            case "short": {
              value = /^[a-zA-Z]+/.exec(string)?.[0];
              break;
            }
            case "long": {
              value = /^[a-zA-Z]+/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "day": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "hour": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              if (token.hour12 && parseInt(value) > 12) {
                console.error(
                  `Trying to parse hour greater than 12. Use 'H' instead of 'h'.`
                );
              }
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              if (token.hour12 && parseInt(value) > 12) {
                console.error(
                  `Trying to parse hour greater than 12. Use 'HH' instead of 'hh'.`
                );
              }
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "minute": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "second": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`
              );
          }
          break;
        }
        case "fractionalSecond": {
          value = new RegExp(`^\\d{${token.value}}`).exec(string)?.[0];
          break;
        }
        case "timeZoneName": {
          value = token.value;
          break;
        }
        case "dayPeriod": {
          value = /^(A|P)M/.exec(string)?.[0];
          break;
        }
        case "literal": {
          if (!string.startsWith(token.value)) {
            throw Error(
              `Literal "${token.value}" not found "${string.slice(0, 25)}"`
            );
          }
          value = token.value;
          break;
        }
        default:
          throw Error(`${token.type} ${token.value}`);
      }
      if (!value) {
        throw Error(
          `value not valid for token { ${type} ${value} } ${string.slice(
            0,
            25
          )}`
        );
      }
      parts.push({ type, value });
      string = string.slice(value.length);
    }
    if (string.length) {
      throw Error(
        `datetime string was not fully parsed! ${string.slice(0, 25)}`
      );
    }
    return parts;
  }
  /** sort & filter dateTimeFormatPart */
  sortDateTimeFormatPart(parts) {
    let result = [];
    const typeArray = [
      "year",
      "month",
      "day",
      "hour",
      "minute",
      "second",
      "fractionalSecond"
    ];
    for (const type of typeArray) {
      const current = parts.findIndex((el) => el.type === type);
      if (current !== -1) {
        result = result.concat(parts.splice(current, 1));
      }
    }
    result = result.concat(parts);
    return result;
  }
  partsToDate(parts) {
    const date = /* @__PURE__ */ new Date();
    const utc = parts.find(
      (part) => part.type === "timeZoneName" && part.value === "UTC"
    );
    const dayPart = parts.find((part) => part.type === "day");
    utc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0);
    for (const part of parts) {
      switch (part.type) {
        case "year": {
          const value = Number(part.value.padStart(4, "20"));
          utc ? date.setUTCFullYear(value) : date.setFullYear(value);
          break;
        }
        case "month": {
          const value = Number(part.value) - 1;
          if (dayPart) {
            utc ? date.setUTCMonth(value, Number(dayPart.value)) : date.setMonth(value, Number(dayPart.value));
          } else {
            utc ? date.setUTCMonth(value) : date.setMonth(value);
          }
          break;
        }
        case "day": {
          const value = Number(part.value);
          utc ? date.setUTCDate(value) : date.setDate(value);
          break;
        }
        case "hour": {
          let value = Number(part.value);
          const dayPeriod = parts.find(
            (part2) => part2.type === "dayPeriod"
          );
          if (dayPeriod?.value === "PM") value += 12;
          utc ? date.setUTCHours(value) : date.setHours(value);
          break;
        }
        case "minute": {
          const value = Number(part.value);
          utc ? date.setUTCMinutes(value) : date.setMinutes(value);
          break;
        }
        case "second": {
          const value = Number(part.value);
          utc ? date.setUTCSeconds(value) : date.setSeconds(value);
          break;
        }
        case "fractionalSecond": {
          const value = Number(part.value);
          utc ? date.setUTCMilliseconds(value) : date.setMilliseconds(value);
          break;
        }
      }
    }
    return date;
  }
  parse(string) {
    const parts = this.parseToParts(string);
    const sortParts = this.sortDateTimeFormatPart(parts);
    return this.partsToDate(sortParts);
  }
};

// https://deno.land/std@0.196.0/datetime/format.ts
function format(date, formatString) {
  const formatter = new DateTimeFormatter(formatString);
  return formatter.format(date);
}
export {
  format
};

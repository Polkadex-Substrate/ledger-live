import {
  constructTypeDescByteString,
  destructTypeFromString,
} from "../src/utils";

describe("EIP721 Utils", () => {
  describe("destructTypeFromString", () => {
    test("'uint8[2][][4]' should return ['uint8', [2, null, 4]]", () => {
      expect(destructTypeFromString("uint8[2][][4]")).toEqual([
        { name: "uint", bits: 8 },
        [2, null, 4],
      ]);
    });

    test("'bool' should return ['bool', []]", () => {
      expect(destructTypeFromString("bool")).toEqual([
        { name: "bool", bits: undefined },
        [],
      ]);
    });

    test("'bool[any]' should not throw and return ['bool', []]", () => {
      expect(destructTypeFromString("bool[any]")).toEqual([
        { name: "bool", bits: undefined },
        [],
      ]);
    });

    test("should not throw with undefined", () => {
      expect(destructTypeFromString(undefined)).toEqual([null, []]);
    });
  });

  describe("constructTypeDescByteString", () => {
    const bitwiseImplem = (
      isArray: boolean,
      typeSize: number | null,
      typeKey
    ) => (Number(isArray) << 7) | (Number(typeSize !== null) << 6) | typeKey;

    test("should return 1", () => {
      expect(parseInt(constructTypeDescByteString(false, null, 1), 16)).toEqual(
        1
      );
    });

    test("should return 129", () => {
      expect(parseInt(constructTypeDescByteString(true, null, 1), 16)).toEqual(
        129
      );
    });

    test("should return 193", () => {
      expect(parseInt(constructTypeDescByteString(true, 64, 1), 16)).toEqual(
        193
      );
    });

    test("should return 207", () => {
      expect(parseInt(constructTypeDescByteString(true, 64, 15), 16)).toEqual(
        207
      );
    });

    test("should return 143", () => {
      expect(parseInt(constructTypeDescByteString(true, null, 15), 16)).toEqual(
        143
      );
    });

    test("should return 15", () => {
      expect(
        parseInt(constructTypeDescByteString(false, null, 15), 16)
      ).toEqual(15);
    });

    test("should throw if typeKey >= 16", () => {
      expect(() =>
        parseInt(constructTypeDescByteString(false, null, 16), 16)
      ).toThrow();
    });

    test("should return the same as the bitewise implementation", () => {
      expect(parseInt(constructTypeDescByteString(false, null, 1), 16)).toEqual(
        bitwiseImplem(false, null, 1)
      );

      expect(parseInt(constructTypeDescByteString(true, null, 1), 16)).toEqual(
        bitwiseImplem(true, null, 1)
      );

      expect(parseInt(constructTypeDescByteString(true, 64, 1), 16)).toEqual(
        bitwiseImplem(true, 64, 1)
      );

      expect(parseInt(constructTypeDescByteString(true, 64, 15), 16)).toEqual(
        bitwiseImplem(true, 64, 15)
      );

      expect(parseInt(constructTypeDescByteString(true, null, 15), 16)).toEqual(
        bitwiseImplem(true, null, 15)
      );

      expect(
        parseInt(constructTypeDescByteString(false, null, 15), 16)
      ).toEqual(bitwiseImplem(false, null, 15));
    });
  });
});

// describe("wtf", () => {
//   test("", () => {
//     const eth = new Eth();
//   });
// });

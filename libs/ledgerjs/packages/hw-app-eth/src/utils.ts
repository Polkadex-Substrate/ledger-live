import { encode, decode } from "@ethersproject/rlp";
import { BigNumber } from "bignumber.js";

export const decodeTxInfo = (rawTx: Buffer) => {
  const VALID_TYPES = [1, 2];
  const txType = VALID_TYPES.includes(rawTx[0]) ? rawTx[0] : null;
  const rlpData = txType === null ? rawTx : rawTx.slice(1);
  const rlpTx = decode(rlpData).map((hex) => Buffer.from(hex.slice(2), "hex"));
  let chainIdTruncated = 0;
  const rlpDecoded = decode(rlpData);

  let decodedTx;
  if (txType === 2) {
    // EIP1559
    decodedTx = {
      data: rlpDecoded[7],
      to: rlpDecoded[5],
      chainId: rlpTx[0],
    };
  } else if (txType === 1) {
    // EIP2930
    decodedTx = {
      data: rlpDecoded[6],
      to: rlpDecoded[4],
      chainId: rlpTx[0],
    };
  } else {
    // Legacy tx
    decodedTx = {
      data: rlpDecoded[5],
      to: rlpDecoded[3],
      // Default to 1 for non EIP 155 txs
      chainId: rlpTx.length > 6 ? rlpTx[6] : Buffer.from("0x01", "hex"),
    };
  }

  const chainIdSrc = decodedTx.chainId;
  let chainId = new BigNumber(0);
  if (chainIdSrc) {
    // Using BigNumber because chainID could be any uint256.
    chainId = new BigNumber(chainIdSrc.toString("hex"), 16);
    const chainIdTruncatedBuf = Buffer.alloc(4);
    if (chainIdSrc.length > 4) {
      chainIdSrc.copy(chainIdTruncatedBuf);
    } else {
      chainIdSrc.copy(chainIdTruncatedBuf, 4 - chainIdSrc.length);
    }
    chainIdTruncated = chainIdTruncatedBuf.readUInt32BE(0);
  }

  let vrsOffset = 0;
  if (txType === null && rlpTx.length > 6) {
    const rlpVrs = Buffer.from(encode(rlpTx.slice(-3)).slice(2), "hex");

    vrsOffset = rawTx.length - (rlpVrs.length - 1);

    // First byte > 0xf7 means the length of the list length doesn't fit in a single byte.
    if (rlpVrs[0] > 0xf7) {
      // Increment vrsOffset to account for that extra byte.
      vrsOffset++;

      // Compute size of the list length.
      const sizeOfListLen = rlpVrs[0] - 0xf7;

      // Increase rlpOffset by the size of the list length.
      vrsOffset += sizeOfListLen - 1;
    }
  }

  return {
    decodedTx,
    txType,
    chainId,
    chainIdTruncated,
    vrsOffset,
  };
};

/**
 * Helper parsing an EIP721 Type name to return its type and size(s)
 * if it's an array or nested arrays
 *
 * @see EIP712MessageTypes
 *
 * @example "uint8[2][][4]" => [{name: "uint", bits: 8}, [2, null, 4]]
 * @example "bool" => [{name: "bool", bits: null}, []]
 *
 * @param {String} typeName
 * @returns {[{ name: string; bits: Number | null }, Array<Number | null | undefined>]}
 */
export const destructTypeFromString = (
  typeName?: string
): [
  { name: string; bits: number | undefined } | null,
  Array<number | null>
] => {
  // Will split "any[][1][10]" in "any", "[][1][10]"
  const splitNameAndArraysRegex = new RegExp(/^([^[\]]*)(\[.*\])*/g);
  // Will match all numbers (or null) inside each array. [0][10][] => [0,10,null]
  const splitArraysRegex = new RegExp(/\[(\d*)\]/g);
  // Will separate the the name from the potential bits allocation. uint8 => [uint,8]
  const splitNameAndNumberRegex = new RegExp(/(\D*)(\d*)/);

  const [, type, maybeArrays] =
    splitNameAndArraysRegex.exec(typeName || "") || [];
  const [, name, bits] = splitNameAndNumberRegex.exec(type || "") || [];
  const typeDescription = name
    ? { name, bits: bits ? Number(bits) : undefined }
    : null;

  const arrays = maybeArrays ? [...maybeArrays.matchAll(splitArraysRegex)] : [];
  // Parse each size to either a Number or null
  const arraySizes = arrays.map(([, size]) => (size ? Number(size) : null));

  return [typeDescription, arraySizes];
};

/**
 * A Map of helpers to get the id and size to return for each
 * type that can be used in EIP712
 *
 */
export const EIP712_TYPE_PROPERTIES: Record<
  string,
  {
    key: (size?: number) => number;
    sizeInBits: (size?: number) => number | null;
  }
> = {
  CUSTOM: {
    key: () => 0,
    sizeInBits: () => null,
  },
  INT: {
    key: () => 1,
    sizeInBits: (size) => Number(size) / 8,
  },
  UINT: {
    key: () => 2,
    sizeInBits: (size) => Number(size) / 8,
  },
  ADDRESS: {
    key: () => 3,
    sizeInBits: () => null,
  },
  BOOL: {
    key: () => 4,
    sizeInBits: () => null,
  },
  STRING: {
    key: () => 5,
    sizeInBits: () => null,
  },
  BYTES: {
    key: (size) => (typeof size !== "undefined" ? 6 : 7),
    sizeInBits: (size) => (typeof size !== "undefined" ? Number(size) : null),
  },
};

/**
 * Helper to convert an integer as a hexadecimal string with the right amount of digits
 * to respect the number of bytes given as parameter
 *
 * @param int Integer
 * @param bytes Number of bytes it should be represented as (1 byte = 2 caraters)
 * @returns The given integer as an hexa string padded with the right number of 0
 */
export const intAsHexBytes = (int: number, bytes: number): string =>
  int.toString(16).padStart(2 * bytes, "0");

/**
 * Helper to construct the hexadecimal ByteString for the description
 * of a field in an EIP712 Message
 *
 * @param isArray
 * @param typeSize
 * @param typeKey
 * @returns HexByteString
 */
export const constructTypeDescByteString = (
  isArray: boolean,
  typeSize: number | null | undefined,
  typeKey: number
): string => {
  if (typeKey >= 16) {
    throw new Error(
      "Eth utils - constructTypeDescByteString - Cannot accept a typeKey >= 16 because the typeKey can only be 4 bits in binary" +
        { isArray, typeSize, typeKey }
    );
  }
  // 1 is array, 0 is not array
  const isArrayBit = isArray ? "1" : "0";
  // 1 has type size, 0 has no type size
  const hasTypeSize = typeof typeSize === "number" ? "1" : "0";
  // 2 unused bits
  const unusedBits = "00";
  // type key as 4 bits
  const typeKeyBits = typeKey.toString(2).padStart(4, "0");

  return intAsHexBytes(
    parseInt(isArrayBit + hasTypeSize + unusedBits + typeKeyBits, 2),
    1
  );
};

export enum EIP712_ARRAY_TYPE_VALUE {
  DYNAMIC = 0,
  FIXED = 1,
}

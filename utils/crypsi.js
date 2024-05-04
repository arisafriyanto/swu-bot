require("dotenv").config();
const { aesEncryption } = require("crypsi");

const encyptDataAES256Cbc = (stringData) => {
  try {
    const key = process.env.ENCRYPT_KEY;
    if (key) {
      const encryptData = aesEncryption.encryptWithAes256Cbc(key, stringData).toString("hex");
      return encryptData;
    }
    return stringData;
  } catch (error) {
    return stringData;
  }
};

const decryptDataAES256Cbc = (encryptData) => {
  try {
    const key = process.env.ENCRYPT_KEY;
    if (key) {
      const decrypt = aesEncryption
        .decryptWithAes256Cbc(key, Buffer.from(encryptData, "hex"))
        .toString("utf-8");
      return decrypt;
    }
    return encryptData;
  } catch (error) {
    return encryptData;
  }
};

module.exports = {
  encyptDataAES256Cbc,
  decryptDataAES256Cbc,
};

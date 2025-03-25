import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto"

const algorithm = "aes-256-ctr"
const secretKey = process.env.SECRET_KEY || "your-secret-key"
const iv = randomBytes(16)

export function encrypt(text: string) {
  const key = scryptSync(secretKey, "salt", 32)
  const cipher = createCipheriv(algorithm, key, iv)
  const encryptedText = Buffer.concat([cipher.update(text), cipher.final()])
  return `${iv.toString("hex")}:${encryptedText.toString("hex")}`
}

export function decrypt(hash: string) {
  const [ivHex, encryptedText] = hash.split(":")
  const key = scryptSync(secretKey, "salt", 32)
  const decipher = createDecipheriv(algorithm, key, Buffer.from(ivHex, "hex"))
  const decryptedText = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "hex")),
    decipher.final(),
  ])
  return decryptedText.toString()
}

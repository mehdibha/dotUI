import { W_OK } from 'constants'
import { access } from "fs/promises"

export async function isWriteable(directory: string): Promise<boolean> {
  try {
    await access(directory, W_OK)
    return true
  } catch (err) {
    return false
  }
}

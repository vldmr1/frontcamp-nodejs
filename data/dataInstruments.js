import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

export const readData = async (filePath) => {
  return await fs.readFile(filePath, 'utf8')
    .catch(() => {
      throw new Error(`UNABLE TO READ FILE: ${__filename}`)
    });
};

export const writeData = async (filePath, data) => {
  return await fs.writeFile(filePath, data).
    catch(() => {
      throw new Error(`UNABLE TO WRITE FILE: ${__filename}`)
    })
}

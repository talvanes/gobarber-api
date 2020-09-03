import fs from 'fs';
import path from 'path';

import configPath from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    const source = path.resolve(configPath.tmpFolder, file);
    const destination = path.resolve(configPath.uploadsFolder, file);

    await fs.promises.rename(source, destination);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(configPath.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;

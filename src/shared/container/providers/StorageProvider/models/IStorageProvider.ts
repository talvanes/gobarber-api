export default interface IStorageProvider {
  saveFile(files: string): Promise<string>;
  deleteFile(files: string): Promise<void>;
}

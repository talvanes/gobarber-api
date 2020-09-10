import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

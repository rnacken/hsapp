import { HsappPage } from './app.po';

describe('hsapp App', () => {
  let page: HsappPage;

  beforeEach(() => {
    page = new HsappPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});

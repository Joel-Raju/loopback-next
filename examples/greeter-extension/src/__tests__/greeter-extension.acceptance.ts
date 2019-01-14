// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application} from '@loopback/core';
import {expect} from '@loopback/testlab';
import chalk from 'chalk';
import {asGreeter, Greeter, GreeterComponent, GreeterExtensionPoint} from '..';

describe('greeter-extension-pont', () => {
  let app: Application;

  beforeEach(createApp);

  it('greets by language', async () => {
    const greeter = await app.get<GreeterExtensionPoint>(
      'greeter-extension-point',
    );
    let msg = await greeter.greet('en', 'Raymond');
    expect(msg).to.eql('Hello, Raymond');
    msg = await greeter.greet('zh', 'Raymond');
    expect(msg).to.eql('Raymond，你好！');
  });

  it('supports options for the extension point', async () => {
    // Configure the extension point
    app.bind('greeter-extension-point.options').to({color: 'blue'});
    const greeter = await app.get<GreeterExtensionPoint>(
      'greeter-extension-point',
    );
    const msg = await greeter.greet('en', 'Raymond');
    expect(msg).to.eql(chalk.keyword('blue')('Hello, Raymond'));
  });

  it('supports options for extensions', async () => {
    const greeter = await app.get<GreeterExtensionPoint>(
      'greeter-extension-point',
    );
    // Configure the ChineseGreeter
    app.bind('greeters.ChineseGreeter.options').to({nameFirst: false});
    const msg = await greeter.greet('zh', 'Raymond');
    expect(msg).to.eql('你好，Raymond！');
  });

  it('honors a newly added/removed greeter binding', async () => {
    const greeter = await app.get<GreeterExtensionPoint>(
      'greeter-extension-point',
    );

    // Add a new greeter for French
    app
      .bind('greeters.FrenchGreeter')
      .toClass(FrenchGreeter)
      .apply(asGreeter);

    let msg = await greeter.greet('fr', 'Raymond');
    expect(msg).to.eql('Bonjour, Raymond');

    // Remove the French greeter
    app.unbind('greeters.FrenchGreeter');
    msg = await greeter.greet('fr', 'Raymond');
    // It falls back to English
    expect(msg).to.eql('Hello, Raymond');
  });

  /**
   * A greeter implementation for French
   */
  class FrenchGreeter implements Greeter {
    language = 'fr';

    greet(name: string) {
      return `Bonjour, ${name}`;
    }
  }

  function createApp() {
    app = new Application();
    app.component(GreeterComponent);
  }
});

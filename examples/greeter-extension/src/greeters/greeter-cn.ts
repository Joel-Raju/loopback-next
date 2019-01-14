// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Greeter, asGreeter} from '../types';
import {bind, inject} from '@loopback/context';

/**
 * Options for the Chinese greeter
 */
export interface ChineseGreeterOptions {
  // Name first, default to `true`
  nameFirst: boolean;
}

/**
 * A greeter implementation for Chinese
 */
@bind(asGreeter)
export class ChineseGreeter implements Greeter {
  language = 'zh';

  @inject('greeters.ChineseGreeter.options', {optional: true})
  private options?: ChineseGreeterOptions;

  greet(name: string) {
    if (this.options && this.options.nameFirst === false) {
      return `你好，${name}！`;
    }
    return `${name}，你好！`;
  }
}

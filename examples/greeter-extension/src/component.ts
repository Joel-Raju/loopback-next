// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createBindingFromClass} from '@loopback/context';
import {Component} from '@loopback/core';
import {ChineseGreeter} from './greeters/greeter-cn';
import {EnglishGreeter} from './greeters/greeter-en';
import {GreeterExtensionPoint} from './greeter-extension-point';

export class GreeterComponent implements Component {
  bindings = [
    createBindingFromClass(GreeterExtensionPoint, {
      key: 'greeter-extension-point',
    }),
    createBindingFromClass(EnglishGreeter, {namespace: 'greeters'}),
    createBindingFromClass(ChineseGreeter, {namespace: 'greeters'}),
  ];
}

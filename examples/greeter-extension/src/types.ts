// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  BindingScope,
  BindingTemplate,
  filterByTag,
  inject,
} from '@loopback/context';

/**
 * Typically an extension point defines an interface as the contract for
 * extensions to implement
 */
export interface Greeter {
  language: string;
  greet(name: string): string;
}

/**
 * A factory function to create binding template for extensions of the given
 * extension point
 * @param extensionPoint Name/id of the extension point
 */
export function extensionFor(extensionPoint: string): BindingTemplate {
  return binding =>
    binding.inScope(BindingScope.SINGLETON).tag({extensionPoint});
}

/**
 * A binding template for greeter extensions
 */
export const asGreeter: BindingTemplate = extensionFor('greeter');

/**
 * Shortcut to inject extensions for the given extension point. To be promoted
 * as `@extensions` in `@loopback/core` module.
 *
 * @param extensionPoint Name/id of the extension point
 */
export function extensions(extensionPoint: string) {
  return inject.getter(filterByTag({extensionPoint}));
}

/**
 * Shortcut to inject configuration for the target binding. To be promoted
 * as `@inject.config` in `@loopback/context` module.
 */
export function configuration() {
  return inject(
    '',
    {decorator: '@inject.config', optional: true},
    (ctx, injection, session?) => {
      if (!session) return undefined;
      // Find the key of the target binding
      if (!session.currentBinding) return undefined;
      const key = session.currentBinding!.key;
      return ctx.get(`${key}.options`, {
        session,
        optional: injection.metadata && injection.metadata.optional,
      });
    },
  );
}

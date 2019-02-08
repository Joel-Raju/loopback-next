// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/rest-explorer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/context';
import {
  OpenApiSpecForm,
  Request,
  Response,
  RestBindings,
  RestServerConfig,
} from '@loopback/rest';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import {RestExplorerBindings} from './rest-explorer.keys';
import {RestExplorerConfig} from './rest-explorer.types';

// TODO(bajtos) Allow users to customize the template
const indexHtml = path.resolve(__dirname, '../templates/index.html.ejs');
const template = fs.readFileSync(indexHtml, 'utf-8');
const templateFn = ejs.compile(template);

export class ExplorerController {
  private explorerPath: string;
  private openApiSpecUrl: string;

  constructor(
    @inject(RestBindings.CONFIG, {optional: true})
    restConfig: RestServerConfig = {},
    @inject(RestExplorerBindings.CONFIG, {optional: true})
    config: RestExplorerConfig = {},
    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {
    this.openApiSpecUrl = this.getOpenApiSpecUrl(restConfig);
    this.explorerPath = config.path || '/explorer';
  }

  index() {
    const data = {
      openApiSpecUrl: this.openApiSpecUrl,
      explorerPath: this.explorerPath,
    };

    const homePage = templateFn(data);
    this.response
      .status(200)
      .contentType('text/html')
      .send(homePage);
  }

  private getOpenApiSpecUrl(restConfig: RestServerConfig): string {
    const openApiConfig = restConfig.openApiSpec || {};
    const endpointMapping = openApiConfig.endpointMapping || {};
    const endpoint = Object.keys(endpointMapping).find(k =>
      isOpenApiV3Json(endpointMapping[k]),
    );
    return endpoint || '/openapi.json';
  }
}

function isOpenApiV3Json(mapping: OpenApiSpecForm) {
  return mapping.version === '3.0.0' && mapping.format === 'json';
}

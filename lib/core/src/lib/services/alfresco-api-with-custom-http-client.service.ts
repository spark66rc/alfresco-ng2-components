/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { AlfrescoApiHttpClient } from '@alfresco/adf-core/api';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { AppConfigService } from '../app-config';
import { StorageService } from './storage.service';
import { AlfrescoApiService } from './alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiWithCustomHttpClientService extends AlfrescoApiService {

    constructor(
        appConfig: AppConfigService,
        storageService: StorageService,
        private alfrescoApiHttpClient: AlfrescoApiHttpClient
    ) {
        super(appConfig, storageService);
    }

    createAlfrescoApi(config: AlfrescoApiConfig): AlfrescoApi {
        return new AlfrescoApi(config, this.alfrescoApiHttpClient);
    }
}

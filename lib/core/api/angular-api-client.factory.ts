import { Injectable } from '@angular/core';
import { Constructor } from '../interface';
import { AlfrescoApiV2 } from './alfresco-api-v2';
import { ApiClientFactory } from './api-client.factory';

@Injectable()
export class AngularClientFactory implements ApiClientFactory {
    constructor(private alfrescoApiService: AlfrescoApiV2) { }

    create<T>(apiClass: Constructor<T>): T {
        return new apiClass(this.alfrescoApiService);
    }
}

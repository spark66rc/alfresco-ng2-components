import { InjectionToken } from '@angular/core';

export interface CoreModuleConfig {
    readonly useAngularBasedHttpClientInAlfrescoJs: boolean;
};

export const CORE_MODULE_CONFIG = new InjectionToken<CoreModuleConfig>('CORE_MODULE_CONFIG');

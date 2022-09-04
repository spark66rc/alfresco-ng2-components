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

import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { AboutModule } from './about/about.module';
import { AppConfigModule } from './app-config/app-config.module';
import { BlankPageModule } from './blank-page/blank-page.module';
import { ButtonsMenuModule } from './buttons-menu/buttons-menu.module';
import { CardViewModule } from './card-view/card-view.module';
import { ClipboardModule } from './clipboard/clipboard.module';
import { CommentsModule } from './comments/comments.module';
import { ContextMenuModule } from './context-menu/context-menu.module';
import { DataColumnModule } from './data-column/data-column.module';
import { DataTableModule } from './datatable/datatable.module';
import { FormBaseModule } from './form/form-base.module';
import { InfoDrawerModule } from './info-drawer/info-drawer.module';
import { LanguageMenuModule } from './language-menu/language-menu.module';
import { SidenavLayoutModule } from './layout/layout.module';
import { LoginModule } from './login/login.module';
import { MaterialModule } from './material.module';
import { NotificationHistoryModule } from './notifications/notification-history.module';
import { PaginationModule } from './pagination/pagination.module';
import { HostSettingsModule } from './settings/host-settings.module';
import { TemplateModule } from './templates/template.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { UserInfoModule } from './userinfo/userinfo.module';
import { ViewerModule } from './viewer/viewer.module';

import { DialogModule } from './dialogs/dialog.module';
import { DirectiveModule } from './directives/directive.module';
import { PipeModule } from './pipes/pipe.module';

import { AlfrescoJsClientsModule } from '@alfresco/adf-core/api';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlfrescoApiServiceWithAngularBasedHttpClient } from './api-factories/alfresco-api-service-with-angular-based-http-client';
import { AlfrescoApiLoaderService, createAlfrescoApiV2Service } from './api-factories/alfresco-api-v2-loader.service';
import { LegacyApiClientModule } from './api-factories/legacy-api-client.module';
import { CoreModuleConfig } from './core.module.token';
import { IconModule } from './icon/icon.module';
import { RichTextEditorModule } from './rich-text-editor/rich-text-editor.module';
import { SearchTextModule } from './search-text/search-text-input.module';
import { AlfrescoApiService } from './services/alfresco-api.service';
import { AuthBearerInterceptor } from './services/auth-bearer.interceptor';
import { directionalityConfigFactory } from './services/directionality-config-factory';
import { DirectionalityConfigService } from './services/directionality-config.service';
import { TranslateLoaderService } from './services/translate-loader.service';
import { TranslationService } from './services/translation.service';
import { versionCompatibilityFactory } from './services/version-compatibility-factory';
import { VersionCompatibilityService } from './services/version-compatibility.service';
import { SortingPickerModule } from './sorting-picker/sorting-picker.module';

const defaultConfig: CoreModuleConfig = { useAngularBasedHttpClientInAlfrescoJs: true };

@NgModule({
    imports: [
        TranslateModule,
        ExtensionsModule,
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        HostSettingsModule,
        UserInfoModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        FormBaseModule,
        CommentsModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        ButtonsMenuModule,
        TemplateModule,
        IconModule,
        SortingPickerModule,
        NotificationHistoryModule,
        SearchTextModule,
        BlankPageModule,
        LegacyApiClientModule,
        AlfrescoJsClientsModule,
        RichTextEditorModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'CSRF-TOKEN',
            headerName: 'X-CSRF-TOKEN'
        })
    ],
    exports: [
        AboutModule,
        ViewerModule,
        SidenavLayoutModule,
        PipeModule,
        CommonModule,
        DirectiveModule,
        DialogModule,
        ClipboardModule,
        FormsModule,
        ReactiveFormsModule,
        HostSettingsModule,
        UserInfoModule,
        MaterialModule,
        AppConfigModule,
        PaginationModule,
        ToolbarModule,
        ContextMenuModule,
        CardViewModule,
        FormBaseModule,
        CommentsModule,
        LoginModule,
        LanguageMenuModule,
        InfoDrawerModule,
        DataColumnModule,
        DataTableModule,
        TranslateModule,
        ButtonsMenuModule,
        TemplateModule,
        SortingPickerModule,
        IconModule,
        NotificationHistoryModule,
        SearchTextModule,
        BlankPageModule,
        RichTextEditorModule
    ]
})
export class CoreModule {
    static forRoot(config: CoreModuleConfig = defaultConfig): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                TranslateStore,
                TranslateService,
                { provide: TranslateLoader, useClass: TranslateLoaderService },
                {
                    provide: APP_INITIALIZER,
                    useFactory: directionalityConfigFactory,
                    deps: [DirectionalityConfigService],
                    multi: true
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: versionCompatibilityFactory,
                    deps: [VersionCompatibilityService],
                    multi: true
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: createAlfrescoApiV2Service,
                    deps: [ AlfrescoApiLoaderService ],
                    multi: true
                },
                { provide: HTTP_INTERCEPTORS, useClass: AuthBearerInterceptor, multi: true },
                ...(config.useAngularBasedHttpClientInAlfrescoJs && [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceWithAngularBasedHttpClient }])
            ]
        };
    }

    static forChild(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule
        };
    }

    constructor(translation: TranslationService) {
        translation.addTranslationFolder('adf-core', 'assets/adf-core');
    }
}

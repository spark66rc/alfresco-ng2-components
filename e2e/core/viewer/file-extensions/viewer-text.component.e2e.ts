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

import { browser } from 'protractor';
import { createApiService,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../../core/pages/content-services.page';
import { FolderModel } from '../../../models/ACS/folder.model';
import CONSTANTS = require('../../../util/constants');
import { SitesApi } from '@alfresco/js-api';

describe('Viewer', () => {

    const viewerPage = new ViewerPage();
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const uploadActions = new UploadActions(apiService);
    let site;
    const acsUser = new UserModel();

    const textFolderInfo = new FolderModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_path
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);

        const sitesApi = new SitesApi(apiService.getInstance());

        site = await sitesApi.createSite({
            title: StringUtil.generateRandomString(8),
            visibility: 'PUBLIC'
        });

        await sitesApi.createSiteMembership(site.entry.id, {
            id: acsUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await apiService.login(acsUser.username, acsUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');

        const sitesApi = new SitesApi(apiService.getInstance());
        await sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    describe('Text Folder Uploaded', () => {
        let uploadedTexts;
        let textFolderUploaded;

        beforeAll(async () => {
            textFolderUploaded = await uploadActions.createFolder(textFolderInfo.name, '-my-');

            uploadedTexts = await uploadActions.uploadFolder(textFolderInfo.location, textFolderUploaded.entry.id);

            await loginPage.login(acsUser.username, acsUser.password);
            await contentServicesPage.goToDocumentList();
        });

        it('[C280010] Should be possible to open any Text file', async () => {
            await contentServicesPage.doubleClickRow('text');
            for (const currentFile of uploadedTexts) {
                if (currentFile.entry.name !== '.DS_Store') {
                    await contentServicesPage.doubleClickRow(currentFile.entry.name);
                    await viewerPage.waitTillContentLoaded();
                    await viewerPage.clickCloseButton();
                }
            }
        });
    });
});

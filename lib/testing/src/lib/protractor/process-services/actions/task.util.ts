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

import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../../shared/api/api.service';
import { TaskFormsApi, TaskRepresentation, TasksApi } from '@alfresco/js-api';
import { StringUtil } from '../../../shared/utils/string.util';
import { ApiClientsService } from '../../../../../../core';

export class TaskUtil {

    api: ApiService;
    tasksApi: TasksApi = this.apiClientsService.get('ActivitiClient.tasks');
    taskFormsApi: TaskFormsApi = this.apiClientsService.get('ActivitiClient.task-forms');

    constructor(apiService: ApiService, private apiClientsService: ApiClientsService) {
        this.api = apiService;
    }

    async createStandaloneTask(taskName: string = StringUtil.generateRandomString()): Promise<any> {
        try {
            return this.tasksApi.createNewTask(new TaskRepresentation({ name: taskName }));
        } catch (error) {
            Logger.error('Create Standalone Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async completeTaskForm(taskInstance: string): Promise<any> {
        try {
            return this.taskFormsApi.completeTaskForm(taskInstance, { values: { label: null } });
        } catch (error) {
            Logger.error('Complete Task Form - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async deleteTask(taskInstance: string): Promise<any> {
        try {
            return this.tasksApi.deleteTask(taskInstance);
        } catch (error) {
            Logger.error('Delete Task - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }
}

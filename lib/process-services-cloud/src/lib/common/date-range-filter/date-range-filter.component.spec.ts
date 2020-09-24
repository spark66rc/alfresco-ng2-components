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

import { DateRangeFilterComponent } from './date-range-filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { By } from '@angular/platform-browser';
import { MatSelectChange } from '@angular/material/select';
import { DateCloudFilterType } from '../../models/date-cloud-filter.model';
import { DateRangeFilterService } from './date-range-filter.service';
import moment from 'moment-es6';

describe('DateRangeFilterComponent', () => {
    let component: DateRangeFilterComponent;
    let fixture: ComponentFixture<DateRangeFilterComponent>;
    let service: DateRangeFilterService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DateRangeFilterComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(DateRangeFilterService);

        component.processFilterProperty = {
            key: 'createdDate',
            label: 'mock-filter',
            value: null,
            type: 'dateRange',
            options: null
        };
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should get on option change', async () => {
        spyOn(service, 'getDateRange');
        spyOn(component.dateTypeChange, 'emit');
        const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-createdDate"] .mat-select-trigger');
        stateElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        options[2].nativeElement.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(service.getDateRange).not.toHaveBeenCalled();
        expect(component.dateTypeChange.emit).toHaveBeenCalled();
    });

    it('should reset date range when no_date type is selected', () => {
        const expectedDate = {
            startDate: null,
            endDate: null
        };
        expect(service.getDateRange(DateCloudFilterType.NO_DATE)).toEqual(expectedDate);
    });

    it('should return correct date when any type is selected', () => {
        const expectedDate = {
            startDate: moment().endOf('day').toDate(),
            endDate: moment().add(1, 'days').startOf('day').toDate()
        };
        expect(service.getDateRange(DateCloudFilterType.TOMORROW)).toEqual(expectedDate);
    });

    it('should not emit any date change events when any type is selected', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.RANGE };
        component.onSelectionChange(value);
        expect(component.dateChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit custom date range on date picker closed', () => {
        spyOn(component.dateChanged, 'emit');
        component.onDateRangeClosed();
        expect(component.dateChanged.emit).toHaveBeenCalled();
    });

    it('should show date-range picker when type is range', async () => {
        const value = <MatSelectChange> { value: DateCloudFilterType.RANGE };
        component.onSelectionChange(value);
        fixture.detectChanges();
        await fixture.whenStable();
        const rangePickerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-date-range-picker');
        expect(rangePickerElement).not.toBeNull();
    });

    it('should preselect values if filterProperty has attribute', () => {
        const mockFilterProperty = {
            key: 'createdDate',
            label: 'mock-filter',
            value: {
                createdDateType: DateCloudFilterType.RANGE,
                _startFrom: new Date().toISOString(),
                _startTo: new Date().toISOString()
            },
            type: 'dateRange',
            options: null,
            attributes: {
                dateType: 'createdDateType',
                from: '_startFrom',
                to: '_startTo'
            }
        };
        component.processFilterProperty = mockFilterProperty;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.dateRangeForm.get('from').value).toEqual(moment(mockFilterProperty.value._startFrom));
        expect(component.dateRangeForm.get('to').value).toEqual(moment(mockFilterProperty.value._startTo));
    });
});

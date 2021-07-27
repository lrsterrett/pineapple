import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DeviceTable } from 'src/app/models/device-table.model';
import { Device } from 'src/app/models/device.model';
import { DemoMaterialModule } from 'src/app/modules/material.module';
import { DeviceService } from 'src/app/services/device.service';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let searchInput: HTMLInputElement;
  let mockDeviceService;

  const devicesFixture: Device[] = [
    {
      device_category: 'Wand',
      group: 'Unicorn Hair',
      model: 'Ash',
      person: 'Cedric Diggory'
    },
    {
      device_category: 'Wand',
      group: 'Pheonix Feather',
      model: 'Holly',
      person: 'Harry Potter'
    },
    {
      device_category: 'Wand',
      group: 'Thestral Hair',
      model: 'Elder wood',
      person: 'Albus Dumbledore'
    }
  ];

  const devicesTableFixture: DeviceTable = {
    collection_entries: devicesFixture.length,
    headers: [
      'model',
      'group',
      'device_category',
      'person'
    ],
    id: 'devices',
    rows: devicesFixture,
    title: 'Devices'
  };

  beforeEach(async(() => {
    mockDeviceService = jasmine.createSpyObj(['getAll', 'searchAll']);
    mockDeviceService.getAll.and.returnValue(of(devicesTableFixture));
    mockDeviceService.searchAll.and.returnValue(of({
      ...devicesTableFixture,
      collection_entries: 0,
      rows: []
    }));

    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      providers: [ { provide: DeviceService, useValue: mockDeviceService } ],
      imports: [
        DemoMaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    searchInput = fixture.nativeElement.querySelector('.search-input input');
    fixture.detectChanges();
    spyOn<any>(component, 'unsubscribe');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set deviceTable to response from service', () => {
      component.deviceTable = null;

      component.ngOnInit();

      expect(component.deviceTable).toEqual(devicesTableFixture);
    });

    it('should set search form control and subscribe for value changes', () => {
      component.search = null;

      expect(component.search).toBeDefined;

      expect(component.subscriptions.length).toBe(1);
    });
  });

  describe('search input', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
    
    it('should call `deviceService.searchAll` when text input changes', () => {
      searchInput.value = 'app';
      searchInput.dispatchEvent(new Event('input'));

      expect(component.deviceTable.rows.length).toBe(3);

      jasmine.clock().tick(201);

      expect(component.deviceTable.rows.length).toBe(0);
    });
  });

  describe('ngOnDestroy', () => {
    it("should call component's unsubscribe method", () => {
      component.ngOnDestroy();

      expect(component['unsubscribe']).toHaveBeenCalled();
    });
  });
});

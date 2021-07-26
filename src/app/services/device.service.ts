import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceTable } from '../models/device-table.model';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<DeviceTable> {
    return this.http.get<DeviceTable>('../../assets/devices.json');
  }

  public searchAll(searchString: string): Observable<DeviceTable> {
    return this.getAll().pipe(
      map((deviceTable: DeviceTable) => {
        return searchString ? this.filterDeviceTable(deviceTable, searchString) : deviceTable;
      })
    );
  }

  private filterDeviceTable(deviceTable: DeviceTable, searchString: string): DeviceTable {
    const filteredDevices: Device[] = deviceTable.rows.filter((device: Device) => {
       const doesMeetSearchCriterica: boolean = Object.values(device).some((value: unknown) => {
        return typeof value === 'string' && value.toLowerCase().includes(searchString.toLowerCase());
      });

      return doesMeetSearchCriterica;
    });

    return {
      ...deviceTable,
      rows: filteredDevices,
      collection_entries: filteredDevices.length
    };
  }
}

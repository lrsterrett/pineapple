import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { DeviceTable } from 'src/app/models/device-table.model';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  deviceTable: DeviceTable;
  search: FormControl;
  subscriptions: Subscription[] = [];

  constructor(
    private deviceService: DeviceService
  ) { }

  ngOnInit(): void {
    this.setupSearch();
    this.setupTable();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  public clearSearchText(): void {
    this.search.setValue('');
  }

  private setupSearch(): void {
    this.search = new FormControl('');

    const searchSubscription: Subscription = this.search.valueChanges.pipe(
      debounceTime(200),
      map((input: string) => input.toLowerCase().trim()),
      distinctUntilChanged(),
      switchMap((searchString: string) => this.deviceService.searchAll(searchString))
    ).subscribe((deviceTable: DeviceTable) => {
      this.deviceTable = deviceTable;
    });

    this.subscriptions.push(searchSubscription);
  }

  private setupTable(): void {
    this.deviceService.getAll().subscribe((deviceTable: DeviceTable) => {
      this.deviceTable = deviceTable;
    });
  }

  private unsubscribe(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}

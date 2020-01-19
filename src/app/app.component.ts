import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from './api.service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public broadChannel = new BroadcastChannel('test_channel');
  foodItems: any;
  loading: boolean;
  // config for export type
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementId: 'kitchenData',
  }
  constructor(
    public apiService: ApiService,
    private changeDetect: ChangeDetectorRef,
    private exportAsService: ExportAsService,
    private toastr: ToastrService) { }
  ngOnInit() {
    this.getFoodItems();
    // boradcast message for cross tab communication
    this.broadChannel.onmessage = (ev) => {
      this.foodItems = ev.data;
      // detect changes and reflect them in markup using changeDetector
      this.changeDetect.detectChanges();
    };
  }

  // get all food items by calling API endpoint
  getFoodItems() {
    this.apiService.getFoodItems().subscribe(res => {
      this.foodItems = res['foods'];
      this.loading = false;
      this.broadChannel.postMessage(this.foodItems);
      this.changeDetect.detectChanges();
    }, (err) => {
      console.log(err);
    });
  }

  // update createdTillNow food item by calling API endpoint
  updateQuantity(data) {
    this.loading = true;
    const updatedFoodItem = { ...data, createTillNow: parseInt(data.createTillNow, 10) + (1 * data.quantity) };
    this.apiService.updateFoodItems(data._id, updatedFoodItem).subscribe(res => {
      this.getFoodItems();
    }, (err) => {
      console.log(err);
    });
  }
  // delete food item by calling API endpoint
  delete(data) {
    this.apiService.deleteFoodItem(data._id).subscribe(res => {
      this.getFoodItems();
      this.toastr.error('Item Deleted Successfully');
    }, (err) => {
      console.log(err);
    }); 
  }

  //download pdf copy of report
  export() {
    this.exportAsService.get(this.exportAsConfig).subscribe(content => {
      const link = document.createElement('a');
      const fileName = 'kitchenReport.pdf';
      link.href = content;
      link.download = fileName;
      link.click();
    });
  }
}

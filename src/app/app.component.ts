import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  foodItems: any;
  loading: boolean;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'kitchenData', // the id of html/table element
  }
  constructor(public apiService: ApiService, private exportAsService: ExportAsService, private toastr: ToastrService) { }
  ngOnInit() {
    this.getFoodItems();
  }

  getFoodItems() {
    this.apiService.getFoodItems().subscribe(res => {
      console.log({ res });
      this.foodItems = res['foods'];
      this.loading = false;
    }, (err) => {
      console.log(err);
    });
  }

  updateQuantity(data) {
    this.loading = true;
    console.log(data);
    const updatedFoodItem = { ...data, createTillNow: parseInt(data.createTillNow, 10) + (1 * data.quantity) };
    this.apiService.updateFoodItems(data._id, updatedFoodItem).subscribe(res => {
      console.log(res);
      this.getFoodItems();
    }, (err) => {
      console.log(err);
    });
  }
  delete(data) {
    this.apiService.deleteFoodItem(data._id).subscribe(res => {
      console.log(res);
      this.getFoodItems();
      this.toastr.error('Item Deleted Successfully');
    }, (err) => {
      console.log(err);
    });
  }

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

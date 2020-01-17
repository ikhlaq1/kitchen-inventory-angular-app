import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public API_URL = 'https://react-mentor-admin.herokuapp.com/api'
  constructor(public http: HttpClient) { }

  getFoodItems(){
    return this.http.get(
      `${this.API_URL}/food`,
    );
  }

  updateFoodItems(id,value){
      return this.http.put(
        `${this.API_URL}/food/${id}`,value,
      );
  }
}

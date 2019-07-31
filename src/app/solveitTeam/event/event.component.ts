import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../Auth/services/auth.service';
import { EventListComponent } from './eventList/eventList.component';
import { timeInterval } from 'rxjs/operators';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventsComponent implements  OnInit {
  public selected = 'events-list';
  public isEdit = false;
  public event = {
    title: '',
    description: '',
    city: '',
    place: '',
    venue: '',
    startDate: '',
    endDate: ''
  };
  public cities = [];
  @ViewChild('list')
  private list: EventListComponent;
  public selectedCity = '';

  constructor(public authService: AuthService, public cityService: CommonService) {}

  ngOnInit(): void {
    this.getCities();
  }

  toggleView(view) {
    this.selected = view;
    if (this.selected == 'events-list') {
      setTimeout(() => {
        this.filterByCity(this.selectedCity);
      }, 500);
    }
  }

  editEvent($event) {
    this.event = $event.event;
    this.isEdit = true;
    this.toggleView('create-event');
    this.filterByCity(this.selectedCity);
  }
  showList() {
    this.toggleView('events-list');
    this.event = {
      title: '',
      description: '',
      city: '',
      place: '',
      venue: '',
      startDate: '',
      endDate: ''
    };
    this.isEdit = false;
  }

  filterByCity(city) {
    this.list.filterByCity(city);
  }

  getCities() {
    this.cityService.getCities()
      .subscribe(res => {
        this.cities = res;
        this.filterByCity(this.selectedCity);
      });
  }
}

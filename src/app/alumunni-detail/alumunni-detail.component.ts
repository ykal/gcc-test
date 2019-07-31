import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alumunni-detail',
  templateUrl: './alumunni-detail.component.html',
  styleUrls: ['./alumunni-detail.component.css']
})
export class AlumunniDetailComponent implements OnInit {

  @Input() project = null;

  constructor() { }

  ngOnInit() {
  }

}

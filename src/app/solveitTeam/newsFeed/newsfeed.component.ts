import { Component } from '@angular/core';
import { SolveitTeamService } from '../solveitTeam.service';

@Component({
    selector: 'app-newsfeed',
    templateUrl: './newsfeed.component.html',
    styleUrls: ['./newsfeed.component.css']
})

export class Newsfeed {

    private news = [];

    constructor(private service: SolveitTeamService) {

    }

    fetchNews() {
        this.service.fetchNews();
    }

}

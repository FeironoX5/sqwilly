import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Project} from "../utils/models";
import {ProjectService} from "../utils/services/project.service";
import {FormsModule} from "@angular/forms";
import {ProjectFilterPipe} from "../utils/pipes";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        RouterLink,
        NgClass,
        FormsModule,
        ProjectFilterPipe,
        NgIf,
        DatePipe,
        NgForOf,
        MatIconModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    projects: Project[] = [];
    projectSearchValue: string = '';
    protected pashalkaCounter: number = 0;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.updateProjects();
    }

    createProject() {
        ProjectService.addProject(new Project('New Project'));
        this.updateProjects();
    }

    updateProjects() {
        this.projects = ProjectService.getProjects();
        this.changeDetectorRef.detectChanges();
    }

    protected iWantPashalka() {
        this.pashalkaCounter++;
        if (this.pashalkaCounter > 3) {
            this.pashalkaCounter = 0;
        }
    }
}

import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {DatePipe, NgClass, NgIf} from "@angular/common";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {
    MatCard,
    MatCardActions,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Project} from "../utils/models";
import {ProjectService} from "../utils/services/project.service";
import {FormsModule} from "@angular/forms";
import {ProjectFilterPipe} from "../utils/pipes";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        RouterLink,
        MatIcon,
        MatTooltip,
        NgClass,
        MatMenuTrigger,
        MatCardTitle,
        MatCardSubtitle,
        MatMenu,
        MatMenuItem,
        MatCard,
        MatCardHeader,
        MatCardActions,
        MatButton,
        MatCardImage,
        FormsModule,
        ProjectFilterPipe,
        NgIf,
        DatePipe
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
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
        if (this.pashalkaCounter > 6) {
            this.pashalkaCounter = 0;
        }
    }
}

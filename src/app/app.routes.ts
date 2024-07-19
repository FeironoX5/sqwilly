import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectViewComponent} from "./project-view/project-view.component";

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'project/:id', component: ProjectViewComponent},
];

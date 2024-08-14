import {Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProjectViewComponent} from "./project-view/project-view.component";

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'projects/:id', component: ProjectViewComponent},
    {path: '**', redirectTo: '/dashboard'},
];

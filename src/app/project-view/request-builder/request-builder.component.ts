import {Component} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-request-builder',
    standalone: true,
    imports: [
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './request-builder.component.html',
    styleUrls: ['./request-builder.component.css']
})
export class RequestBuilderComponent {
}

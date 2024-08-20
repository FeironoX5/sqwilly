import {Component, EventEmitter, Output} from "@angular/core";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {Node, Edge} from "ngx-vflow";

export enum ParsingDataTypes {
    SQWILLY,
    SQL,
    JSON
}

@Component({
    selector: 'app-parsing-tool',
    standalone: true,
    imports: [
        MatButtonToggleModule,
        FormsModule,
    ],
    templateUrl: './parsing-tool.component.html',
    styleUrls: ['./parsing-tool.component.css']
})
export class ParsingToolComponent {
    @Output() graphUpdated = new EventEmitter<{ nodes: Node[], edges: Edge[] }>();
    dataType: ParsingDataTypes = 0;
    sqwillyData: string = '';
}

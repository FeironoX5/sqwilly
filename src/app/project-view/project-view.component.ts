import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {
    MatDrawer,
    MatDrawerContainer, MatDrawerContent,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent
} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from "@angular/material/tooltip";
import {NgClass, NgIf} from "@angular/common";
import {Node, VflowComponent, VflowModule} from "ngx-vflow";
import {SqlTableNodeComponent} from "../sql-table-node/sql-table-node.component";
import {SQLTable} from "../utils/models";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-project-view',
    standalone: true,
    imports: [
        RouterOutlet,
        VflowModule,
        MatSidenavContainer,
        MatSidenav,
        MatButton,
        MatSidenavContent,
        MatToolbar,
        MatIcon,
        MatIconButton,
        NgClass,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        FormsModule,
        MatTooltip,
        MatDrawerContainer,
        MatDrawer,
        MatDrawerContent,
        MatProgressSpinner,
        NgIf,
        RouterLink,
    ],
    templateUrl: './project-view.component.html',
    styleUrl: './project-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewComponent {
    @ViewChild(VflowComponent)
    public vflow!: VflowComponent

    nodes: Node[] = [
        {
            id: '1',
            point: {x: 10, y: 200},
            type: SqlTableNodeComponent,
            data: {
                name: 'rockets',
                fields: [
                    {name: 'id', isPrimary: false},
                    {name: 'name', isPrimary: true},
                    {name: 'stages', isPrimary: false},
                ]
            } satisfies SQLTable
        },
        {
            id: '2',
            point: {x: 250, y: 200},
            type: SqlTableNodeComponent,
            data: {
                name: 'nose cones',
                fields: [
                    {name: 'id', isPrimary: false},
                    {name: 'name', isPrimary: true},
                    {name: 'model', isPrimary: false},
                    {name: 'rocket_id', isPrimary: false},
                ]
            } satisfies SQLTable
        },
    ];
    textView: string = JSON.stringify(this.nodes);
    savingInProgress: boolean = false;
    window = window;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    addNode(contentContainer: HTMLDivElement) {
        this.nodes = [...this.nodes, {
            id: (this.nodes.length + 1).toString(),
            point: this.vflow.documentPointToFlowPoint({
                x: contentContainer.clientWidth / 2 - 96,
                y: contentContainer.clientHeight / 2
            }),
            type: SqlTableNodeComponent,
            data: {
                name: '',
                fields: []
            } satisfies SQLTable
        }];
    }

    textViewChanged() {
        this.nodes = JSON.parse(this.textView);
        this.textView = JSON.stringify(this.nodes);
    }

    save() {
        if (!this.savingInProgress) {
            this.savingInProgress = true;
            setTimeout(() => {
                console.log("true", this.savingInProgress);
                this.savingInProgress = false;
                this.changeDetectorRef.detectChanges();
                console.log("true", this.savingInProgress);
            }, 700);
        }
    }
}

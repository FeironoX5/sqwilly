import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Connection, ConnectionSettings, Node, NodePositionChange, VflowComponent, VflowModule} from "ngx-vflow";
import {RouterLink, RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import html2canvas from "html2canvas";
import {ProjectManager} from "../utils/services/project.manager";
import {ProjectService} from "../utils/services/project.service";
import {DecoderService} from "../utils/services/decoder.service";
import {DirectedGraph, RankDir, VertexRef} from '@vizdom/vizdom-ts-esm';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {SQLField} from "../utils/models";
import {RequestBuilderComponent} from "./request-builder/request-builder.component";
import {ParsingToolComponent} from "./parsing-tool/parsing-tool.component";


@Component({
    selector: 'app-project-view',
    standalone: true,
    imports: [
        RouterOutlet,
        VflowModule,
        NgClass,
        FormsModule,
        NgIf,
        RouterLink,
        NgForOf,
        MatProgressSpinnerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatSidenavModule,
        MatInputModule,
        MatButtonModule,
        RequestBuilderComponent,
        ParsingToolComponent,
    ],
    templateUrl: './project-view.component.html',
    styleUrls: ['./project-view.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewComponent implements OnInit {
    // INPUTS
    @Input()
    set id(projectId: string) {
        this.projectId = projectId;
        this.changeDetectorRef.detectChanges();
    }

    // ELEMENTS
    @ViewChild(VflowComponent) public flow!: VflowComponent;
    @ViewChild('projectNameInput') private projectName: any;
    @ViewChild('parsingSidenav') private parsingSidenav: any;
    @ViewChild('requestBuilderSidenav') private requestBuilderSidenav: any;
    @ViewChild('contentContainer') private contentContainer: any;

    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (event.key == 't') this.newNode();
        if (event.ctrlKey) {
            switch (event.key) {
                case 'f':
                    event.preventDefault();
                    this.parsingSidenav.toggle();
                    break;
                case 'l':
                    if (event.altKey) {
                        event.preventDefault();
                        this.fixLayout();
                    }
                    break;
                case '0':
                    event.preventDefault();
                    this.zoomToFit();
                    break;
                case 'k':
                    event.preventDefault();
                    this.parsingSidenav.toggle();
                    break;
                case 'p':
                    event.preventDefault();
                    this.requestBuilderSidenav.toggle();
                    break;
            }
        }
    }

    // VARS
    projectId: string = '';
    textView: string = '';
    parsedData: any[] = [];
    projectManager: ProjectManager = new ProjectManager();
    savingInProgress: boolean = false;
    // READONLY VARS
    protected readonly window = window;
    protected readonly flowConnection: ConnectionSettings = {
        mode: 'strict',
        curve: 'bezier'
    };

    // INITS
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        protected decoderService: DecoderService
    ) {
    }

    ngOnInit() {
        this.projectManager.initialize(this.projectId);
        this.updateTablesDataFromNodes();
    }

    // FUNCTIONS
    save() {
        if (!this.savingInProgress && this.projectManager.$project) {
            this.savingInProgress = true;
            this.captureCanvas().then(result => {
                this.projectManager.$project!.imagePreviewData = result;
                this.projectManager.$project!.name = this.projectName.nativeElement.outerText;
                ProjectService.updateProject(this.projectManager.$project!);
                this.savingInProgress = false;
                this.changeDetectorRef.detectChanges();
            });
        }
    }

    async captureCanvas(): Promise<string> {
        const canvas = document.getElementById('flow')!;
        const icons = canvas.querySelectorAll('mat-icon');
        icons.forEach((icon: any) => icon.style.display = 'none');
        const textareas = canvas.querySelectorAll('textarea');
        textareas.forEach((textarea: HTMLTextAreaElement) => textarea.innerHTML = textarea.value)
        const canvasElement = await html2canvas(canvas, {
            useCORS: true,
            foreignObjectRendering: true,
        });
        icons.forEach((icon: any) => icon.style.display = 'block');
        return canvasElement.toDataURL('image/png');
    }


    updateNodePosition(changes: NodePositionChange[]) {
        changes.forEach(change => this.projectManager.$project!.nodes.filter((node: Node) => node.id == change.id)[0].point = change.point);
    }


    zoomToFit() {
        this.flow.fitView({duration: 750});
    }

    decodeTextView() {
        this.projectManager.$project!.nodes = this.decoderService.decode(this.textView);
        this.fixLayout();
        setTimeout(() => this.zoomToFit(), 500);
    }

    fixLayout() {
        const graph = new DirectedGraph({
            layout: {
                margin_x: 75,
                rank_dir: RankDir.LR
            }
        })
        const vertices = new Map<string, VertexRef>()
        const nodes = new Map<string, Node>()
        this.projectManager.$project!.nodes.forEach((n: any) => {
            const v = graph.new_vertex({
                layout: {
                    shape_w: 200,
                    shape_h: 28 * (n.data.fields.length + 1)
                },
                render: {
                    id: n.id
                },
            }, {
                compute_bounding_box: false
            });
            vertices.set(n.id, v)
            nodes.set(n.id, n)
        });

        this.projectManager.$project!.edges.forEach(e => {
            graph.new_edge(
                vertices.get(e.source)!,
                vertices.get(e.target)!,
            )
        })

        const layout = graph.layout().to_json().to_obj()

        this.projectManager.$project!.nodes = layout.nodes.map(n => {
            return {
                ...nodes.get(n.id)!,
                id: n.id,
                point: {
                    x: n.x,
                    y: n.y
                },
            }
        });
    }

    updateTablesDataFromNodes() {
        this.textView = this.projectManager.$project!.nodes.map((node: any) => {
            return `${node.data.name}:\n${node.data.fields.map((field: SQLField) => (field.isPrimary ? 'PK ' : '') + field.name).join('\n')}\n`;
        }).join('\n');
    }

    debug() {
        console.log(this.projectManager.$project!.nodes.map((node: any) => {
            return node.data.fields.map((field: SQLField) => field.name).join('\n');
        }).join('\n'));
    }

    newNode() {
        this.updateTablesDataFromNodes();
        this.projectManager.addNode(this.flow, this.contentContainer);
    }

    newEdge({ source, target, sourceHandle, targetHandle }: Connection) {
        console.log(source, target, sourceHandle, targetHandle)
        this.projectManager.addEdge(source, target, sourceHandle, targetHandle);
    }
}


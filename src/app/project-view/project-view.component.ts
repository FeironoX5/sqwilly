import {
    AfterContentChecked,
    AfterContentInit, AfterRenderRef,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
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
import {Node, NodeChange, NodePositionChange, VflowModule} from "ngx-vflow";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {FormsModule} from "@angular/forms";
import html2canvas from "html2canvas";
import {ProjectManager} from "../utils/services/project.manager";
import {ProjectService} from "../utils/services/project.service";

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
export class ProjectViewComponent implements OnInit {
    // INPUTS
    @Input()
    set id(projectId: string) {
        this.projectId = projectId;
        this.changeDetectorRef.detectChanges();
    }

    // ELEMENTS
    @ViewChild('flow', {static: true}) public flow: any;
    @ViewChild('projectNameInput') private projectName: any;
    // VARS
    projectId: string = '';
    projectManager: ProjectManager = new ProjectManager();
    savingInProgress: boolean = false;
    // READONLY VARS
    protected readonly window = window;

    // INITS
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.projectManager.initialize(this.projectId);
    }

    // FUNCTIONS
    textViewChanged() {
        // this.nodes = JSON.parse(this.textView);
        // this.textView = JSON.stringify(this.nodes);
    }

    save() {
        console.log(this.flow);
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

    debug() {
        console.log(this.flow);
    }

    updateNodePosition(changes: NodePositionChange[]) {
        changes.forEach(change => this.projectManager.$project!.nodes.filter((node: Node) => node.id == change.id)[0].point = change.point);
    }
}

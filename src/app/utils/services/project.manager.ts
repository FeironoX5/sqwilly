import {ChangeDetectorRef, Injectable} from "@angular/core";
import {Project, SQLTable} from "../models";
import {TableNodeComponent} from "../../project-view/table-node/table-node.component";
import {ProjectService} from "./project.service";
import {Point} from "ngx-vflow";

@Injectable({
    providedIn: 'root'
})
export class ProjectManager {
    $project: Project | undefined;

    initialize(projectId: string) {
        this.$project = ProjectService.getProject(projectId);
        return this;
    }

    addNode(point: Point) {
        this.$project!.nodes = [...this.$project!.nodes, {
            id: crypto.randomUUID(),
            point: point,
            type: TableNodeComponent,
            data: {
                name: '',
                fields: []
            } satisfies SQLTable
        }];
    }

    addEdge(source: string,
            target: string,
            sourceHandle: string | undefined,
            targetHandle: string | undefined) {
        this.$project!.edges = [...this.$project!.edges, {
            id: `${source} -> ${target}${sourceHandle ?? ''}${targetHandle ?? ''}`,
            source,
            target,
            sourceHandle,
            targetHandle,
            markers: {
                end: {
                    type: 'arrow-closed'
                }
            }
        }]
    }
}
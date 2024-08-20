import {Edge, Node} from "ngx-vflow";
import {TableNodeComponent} from "../project-view/table-node/table-node.component";

export class Project {
    name: string;
    readonly id: string;
    imagePreviewData: string;
    nodes: Node[];
    edges: Edge[];
    readonly createdAt: Date;

    constructor(name: string,
                id: string = crypto.randomUUID(),
                imagePreviewData: string = '',
                nodes: Node[] = [],
                edges: Edge[] = [],
                createdAt: Date = new Date()) {
        this.name = name;
        this.id = id;
        this.imagePreviewData = imagePreviewData;
        this.nodes = nodes;
        this.edges = edges;
        this.createdAt = createdAt;
    }

    public static fromObject(objectProject: any): Project {
        let nodes: Node[] = [];
        objectProject.nodes.forEach((objectNode: any) => {
            nodes = [...nodes, {
                id: objectNode.id,
                point: {x: objectNode.point.x, y: objectNode.point.y},
                type: TableNodeComponent,
                data: objectNode.data
            }];
        });
        return new Project(objectProject.name, objectProject.id, objectProject.imagePreviewData, nodes, objectProject.edges, objectProject.createdAt)
    }
}

export interface SQLTable {
    name: string,
    fields: SQLField[]
}

export interface SQLField {
    name: string,
    isPrimary: boolean,
    references: SQLFieldReference | null
}

export interface SQLFieldReference {
    tableName: string,
    fieldName: string
}

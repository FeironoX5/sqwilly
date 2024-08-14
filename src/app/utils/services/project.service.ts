import {Injectable} from "@angular/core";
import {Project} from "../models";
import {TableNodeComponent} from "../../table-node/table-node.component";
import {LSProjectLoader, ProjectsLoader} from "../loaders";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    public static getProjects(dataLoader: ProjectsLoader = new LSProjectLoader()): Project[] {
        return dataLoader.loadProjects();
    }

    public static saveProjects(projects: Project[], dataLoader: ProjectsLoader = new LSProjectLoader()): void {
        dataLoader.saveProjects(projects);
    }

    public static getProject(id: string, dataLoader?: ProjectsLoader): Project | undefined {
        return this.getProjects(dataLoader).find((project: any) => project.id === id);
    }

    public static updateProject(updatedProject: Project, dataLoader: ProjectsLoader = new LSProjectLoader()) {
        const projects = this.getProjects(dataLoader);
        const index = projects.findIndex((project: any) => project.id === updatedProject.id);
        if (index !== -1) {
            projects[index] = this.fixProjectProps(updatedProject);
            dataLoader.saveProjects(projects);
        }
    }

    public static addProject(project: Project, dataLoader: ProjectsLoader = new LSProjectLoader()) {
        const projects = this.getProjects(dataLoader);
        projects.push(this.fixProjectProps(project));
        this.saveProjects(projects, dataLoader);
    }

    private static fixProjectProps(project: Project): Project {
        project.nodes.forEach(node => {
            Object.defineProperties(node.point, {
                x: {value: node.point.x, enumerable: true},
                y: {value: node.point.y, enumerable: true}
            });
            Object.defineProperties(node, {
                type: {value: TableNodeComponent, enumerable: true}
            });
        });
        return project;
    }
}
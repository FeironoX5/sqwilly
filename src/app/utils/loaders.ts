import {Project} from "./models";
import {LS_PROJECTS_KEY} from "./consts";

export abstract class ProjectsLoader {
    abstract loadProjects(): Project[];

    abstract saveProjects(projects: Project[]): void;
}

export class LSProjectLoader extends ProjectsLoader {
    loadProjects(): Project[] {
        const encodedProjects = localStorage.getItem(LS_PROJECTS_KEY);
        let projects: Project[] = [];
        if (encodedProjects) {
            const objectProjects = JSON.parse(encodedProjects);
            objectProjects.forEach(
                (objectProject: any) =>
                    projects.push(Project.fromObject(objectProject))
            );
        }
        return projects;
    }

    saveProjects(projects: Project[]): void {
        const encodedProjects: string = JSON.stringify(projects);
        localStorage.setItem(LS_PROJECTS_KEY, encodedProjects);
    }

}
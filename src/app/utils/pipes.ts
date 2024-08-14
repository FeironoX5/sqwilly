import {Pipe, PipeTransform} from "@angular/core";
import {Project, SQLField} from "./models";

@Pipe({
    standalone: true,
    name: "orderFields",
    pure: false,
})
export class OrderFields implements PipeTransform {
    transform(array: SQLField[]): SQLField[] {
        return array.sort((a: SQLField, b: SQLField) => {
            return (+b.isPrimary) - (+a.isPrimary);
        });
    }
}

@Pipe({
    standalone: true,
    name: 'projectFilter'
})
export class ProjectFilterPipe implements PipeTransform {
    transform(projects: Project[], searchText: string): Project[] {
        if (!projects) return [];
        if (!searchText) return projects;
        return projects.filter(project => {
            return project.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
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
            console.log(0);
            return project.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
        }).sort((a, b) => {
            console.log(1); // todo wtf doesnt work
            console.log((a.createdAt.getTime() - b.createdAt.getTime()));
            return (a.createdAt.getTime() - b.createdAt.getTime());
        });
    }
}
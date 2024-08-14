import {Injectable} from '@angular/core';

interface Comment {
    message: string;
    isValid: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CommentsHandler {
    public static generate(conditions: Comment[]): string {
        let result: string[] = [];
        let conditionsActive = 0;
        conditions.forEach(c => {
            if (c.isValid) {
                result.push(conditionsActive > 0 ? c.message.toLowerCase() : c.message);
                conditionsActive++;
            }
        });
        return result.join(', ');
    }

}

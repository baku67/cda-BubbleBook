import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

    public timeAgo(dateString: string): string {
        const past = new Date(dateString).getTime();
        const now  = Date.now();
        const diff = Math.floor((now - past) / 1000); // en secondes

        const years   = Math.floor(diff / (3600 * 24 * 365));
        if (years > 0) {
            return `il y a ${years}ans`;
        }

        const months  = Math.floor(diff / (3600 * 24 * 30));
        if (months > 0) {
            return `il y a ${months}mois`;
        }

        const hours   = Math.floor(diff / 3600);
        if (hours > 0) {
            return `il y a ${hours}h`;
        }

        const minutes = Math.floor(diff / 60);
        if (minutes > 0) {
            return `il y a ${minutes}min`;
        }

        return `il y a quelques secondes`;
    }
}
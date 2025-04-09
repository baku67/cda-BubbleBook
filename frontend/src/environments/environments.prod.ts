export const environment = {
    production: true,
    // Comme reverse proxy (traefik) écoute sur port 443, pas de :8000
    apiUrl: 'https://bubblebook.fun', // URL de production
};
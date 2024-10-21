Sur PC: 
chrome URL: "chrome://inspect/#devices"
-> inspect le navigateur de la derniere requete

Activer mode dev en tapant 8 fois sur N° de version android
Activer Debogage USB


Pas oublier de faire les appels API depuis Anfular avec la VAR ${environment.apiUrl} pour switch facilement entre mobile et PC: 
      this.http.post<{ token: string }>(`http://${environment.apiUrl}:8000/api/login`, this.loginForm.value)


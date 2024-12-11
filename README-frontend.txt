File Structure Angular: https://albertobasalo.medium.com/file-and-folder-structure-for-angular-applications-3130efc582e3


ng generate <sementic> (component, service, directive, pipe, module, guard, interceptor, interface, enum, ...)


Dans les services: 
    import { environment } from '../environments/environment';
    private apiUrl = environment.apiUrl;


proxy.conf.json pour debugger sur mobile:
      //"target": "http://192.168.x.x:8000", // Remplace par l'IP locale de ton PC (ipconfig, puis sur chrome pc: chrome://inspect/#devices)



Liste des containers docker (git bash):
docker ps

Bash container angular:
-> docker exec -it angular bash

npm run test -- --watch=false --browsers=ChromeHeadlessNoSandbox
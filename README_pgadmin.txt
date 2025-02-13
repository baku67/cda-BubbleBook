connection portail:
    postgres@postgres.com
    postgres

General:
    postgres
    postgres (hostname: nom du service Docker)
    postgres
    postgres


Si pb: cmd admin:
netstat -ano | findstr :5432
taskkill /PID <pid_number> /F
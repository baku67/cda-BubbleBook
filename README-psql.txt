Depuis cmd (n'importe ou):

Attention il faut ajouter le path vers psql/bin au var d'envrironnement systeme (parfois le psql/bin est dans Laragon)


Tester acces au PATH:
~ echo $env:Path

~ psql -U postgres -d bubblebook
// postgres/postgres


Liste des tables: \dt 
Sinon requete SQL normals: SELECT * FROM ma_table;

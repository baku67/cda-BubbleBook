Solutions pour éviter les soucis

Faire le build Angular en local, et envoyer le dossier dist/ sur l’EC2 (plus rapide, aucun coût CPU sur l’instance).

Passer à une t3.small pendant une ou deux heures si tu veux builder proprement sur EC2, puis redescendre sur t3.micro.

Construire l’image Docker sur ton PC (avec docker build) puis la pousser sur Docker Hub ou ECR, et la pull depuis EC2.

Monitorer les CPU credits pour voir quand tu es limité.

Limiter le nombre de services lancés simultanément dans ton docker-compose.




AWS Changer de plan le temps du build:

Si tu es OK pour sortir du Free Tier pendant quelques heures (~0.02 €/h),
Tu peux redimensionner l’instance depuis la console : “Actions > Instance settings > Change instance type”.
Ensuite tu fais ton build, tu déploies, puis tu redescends à t2.micro quand tout est prêt.
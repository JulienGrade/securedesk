# SecureDesk

SecureDesk est une API interne de déclaration et de suivi d'incidents. Le projet sert de support à la mise en place progressive d'une démarche DevSecOps avec Node.js, GitLab CI/CD, SonarCloud, Docker, Gitleaks et Trivy.

## Prérequis

Node.js 22 ou une version LTS plus récente, npm, Git et Docker.

## Progression

Chaque étape du projet correspond à un commit Git. Utilisez `git log --oneline --reverse` pour afficher la progression, puis `git show <commit>` pour observer les changements introduits.

## État final attendu

L'API expose un point de santé et permet de créer, consulter et mettre à jour des incidents. Le dépôt contient des tests, une image Docker non-root et une pipeline GitLab intégrant des contrôles de qualité et de sécurité.

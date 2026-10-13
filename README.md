# SecureDesk

SecureDesk est une API interne de déclaration et de suivi d'incidents. Le projet sert de support à la mise en place progressive d'une démarche DevSecOps avec Node.js, GitLab CI/CD, SonarCloud, Docker, Gitleaks et Trivy.

## Prérequis

Node.js 22 ou une version LTS plus récente, npm, Git et Docker.

## Progression

Chaque étape du projet correspond à un commit Git. Utilisez `git log --oneline --reverse` pour afficher la progression, puis `git show <commit>` pour observer les changements introduits.

## Installation

```bash
npm ci
npm run check
npm start
```

L'API écoute par défaut sur `http://localhost:3000`. La variable `PORT` permet de choisir un autre port.

## Vérification manuelle

```bash
curl -i http://localhost:3000/health

curl -i -X POST http://localhost:3000/incidents \
  -H "Content-Type: application/json" \
  -d '{"title":"Compte utilisateur verrouillé","severity":"HIGH"}'

curl -i http://localhost:3000/incidents
```

La création retourne un identifiant. Utilisez-le pour modifier le statut :

```bash
curl -i -X PATCH http://localhost:3000/incidents/IDENTIFIANT \
  -H "Content-Type: application/json" \
  -d '{"status":"INVESTIGATING"}'
```

## Contrat HTTP

| Méthode | Route | Résultat |
| --- | --- | --- |
| GET | `/health` | État du service |
| GET | `/incidents` | Liste et nombre d'incidents |
| POST | `/incidents` | Création d'un incident |
| PATCH | `/incidents/:id` | Modification du statut |

Les sévérités autorisées sont `LOW`, `MEDIUM`, `HIGH` et `CRITICAL`. Les statuts autorisés sont `OPEN`, `INVESTIGATING` et `CLOSED`. Le passage direct de `CLOSED` vers `OPEN` est interdit.

## Docker

```bash
docker build --pull --tag securedesk:local .
docker run --rm --name securedesk -p 3000:3000 securedesk:local
docker inspect securedesk:local --format '{{.Config.User}}'
```

La dernière commande doit afficher `node`. L'image utilise une construction multi-stage et ne contient que les dépendances nécessaires à l'exécution.

## Pipeline GitLab

| Stage | Jobs | Rôle |
| --- | --- | --- |
| quality | lint, tests | Qualité statique, tests et couverture |
| security | sonarcloud, dependency_audit, secret_detection | Qualité continue, dépendances et secrets |
| build | container_build | Construction de l'image liée au commit |
| container_security | container_scan | Analyse Trivy et blocage des critiques corrigibles |

Avant la première pipeline SonarCloud, remplacez les valeurs d'exemple dans `sonar-project.properties`, puis créez la variable GitLab masquée `SONAR_TOKEN`. Aucun secret réel ne doit être ajouté au dépôt.

Le job Docker-in-Docker nécessite un runner compatible. Si les runners partagés disponibles ne l'autorisent pas, utilisez un runner adapté ou remplacez le builder selon les possibilités de votre environnement.

## Commandes utiles

```bash
npm run lint
npm test
npm run test:coverage
npm audit --audit-level=high
git log --oneline --reverse
```

## Documentation

| Fichier | Contenu |
| --- | --- |
| `docs/diagnostic-initial.md` | Risques et contrôles retenus |
| `docs/sonarcloud.md` | Paramétrage de SonarCloud |
| `docs/dependances-et-secrets.md` | Traitement des vulnérabilités et secrets |
| `docs/images-et-trivy.md` | Versionnement des images et analyse Trivy |
| `docs/adr/0001-security-gates.md` | Décision sur les barrières de sécurité |
| `docs/exploitation.md` | Exploitation, responsabilités et amélioration |
| `SECURITY.md` | Signalement et dérogations |

## État final

L'API expose un point de santé et permet de créer, consulter et mettre à jour des incidents. Le dépôt contient huit tests, une image Docker non-root et une pipeline GitLab intégrant des contrôles de qualité et de sécurité.

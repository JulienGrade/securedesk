# ADR 0001 - Security Gates de SecureDesk

ADR signifie Architecture Decision Record, c'est-à-dire un enregistrement de décision d'architecture.

## Contexte

La pipeline produit plusieurs signaux de qualité et de sécurité. Sans règle partagée, les alertes risquent d'être ignorées ou de bloquer arbitrairement les livraisons.

## Décision

Le lint, les tests et le Quality Gate SonarCloud sont bloquants. Un secret confirmé entraîne un blocage et sa révocation immédiate. Une vulnérabilité critique corrigible de l'image bloque la livraison.

Une vulnérabilité sans correctif ou sans exposition démontrée peut faire l'objet d'une dérogation temporaire conforme à `SECURITY.md`.

## Conséquences

Les merge requests disposent de preuves homogènes. L'équipe doit toutefois maintenir les règles, attribuer les alertes et réexaminer les dérogations pour éviter une sécurité uniquement déclarative.

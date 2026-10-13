# Dépendances et secrets

## Interpréter npm audit

`npm audit` compare l'arbre du `package-lock.json` à une base d'avis de sécurité. Une alerte ne doit pas être corrigée aveuglément. Identifiez la dépendance concernée, vérifiez si elle est directe ou transitive, recherchez une version corrigée, évaluez si le code vulnérable est atteignable, puis relancez les tests.

`npm audit fix --force` n'est pas utilisé dans ce projet : il peut imposer une mise à jour majeure incompatible. Une correction qui casse l'application ne constitue pas une amélioration.

## Réagir à un secret exposé

La première action est de révoquer ou renouveler le secret. Il faut ensuite examiner ses journaux d'utilisation, le retirer du code, le remplacer par une variable sécurisée et déterminer si l'historique Git doit être nettoyé avec l'équipe.

Supprimer uniquement la ligne du dernier commit ne suffit pas. Le secret peut rester dans les anciens commits, les clones, les journaux de pipeline ou des archives.

Gitleaks utilise `--redact` afin que la preuve produite ne recopie pas la valeur détectée. Les exemples de test doivent toujours employer des valeurs fictives.

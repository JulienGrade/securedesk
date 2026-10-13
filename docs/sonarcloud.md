# Configurer SonarCloud

Créez une organisation SonarCloud ou SonarQube Cloud, puis importez le dépôt GitLab. Relevez la clé du projet et celle de l'organisation avant de remplacer les deux valeurs d'exemple dans `sonar-project.properties`.

Dans GitLab, ouvrez **Settings > CI/CD > Variables** et créez `SONAR_TOKEN`. La valeur doit être masquée. Le caractère « protégé » doit correspondre à la stratégie de branches : une variable protégée n'est transmise qu'aux branches et tags protégés.

L'analyse automatique SonarCloud doit être désactivée si l'analyse est exécutée par la pipeline. Cela évite deux analyses concurrentes pour le même commit.

Le job récupère le rapport LCOV produit par les tests. Il attend ensuite la décision du Quality Gate : un résultat rouge fait échouer la pipeline au lieu de devenir une simple information.

Ne placez jamais le token dans un fichier versionné ou dans une commande qui l'affiche. Un token exposé doit être révoqué immédiatement.

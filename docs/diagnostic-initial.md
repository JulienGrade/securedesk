# Diagnostic DevSecOps initial

| Risque observé | Conséquence métier | Contrôle retenu |
| --- | --- | --- |
| Aucun test automatisé | Une régression peut interrompre la déclaration d'incidents | Tests unitaires et d'API dans la pipeline |
| Version d'exécution non définie | Le comportement peut varier entre les postes et la CI | Version Node.js explicite et image Docker |
| Dépendances non contrôlées | Une vulnérabilité connue peut être livrée | npm audit et lockfile versionné |
| Secret ajouté dans Git | Un tiers peut accéder à un service interne | Variables GitLab et détection Gitleaks |
| Conteneur exécuté avec root | Une compromission dispose de privilèges excessifs | Utilisateur non-root et contrôle Trivy |

Les outils sont introduits uniquement lorsqu'ils répondent à un risque identifié. Une alerte doit être comprise, attribuée et traitée ; l'accumulation de scanners sans processus de décision n'améliore pas la sécurité.

# Images Docker et Trivy

L'image SecureDesk porte le SHA court du commit. Cette convention relie un résultat de build à une version précise du code. Le tag `latest` n'est pas utilisé : il est mutable et peut désigner des contenus différents au fil du temps.

Les images des outils de pipeline utilisent des tags complets. Pour une reproductibilité stricte en production, ces références peuvent être complétées par leur digest SHA-256. Les mises à jour doivent alors être proposées automatiquement, testées, puis validées.

Le job Trivy effectue deux passages. Le premier génère un rapport JSON conservé comme preuve. Le second transforme les vulnérabilités critiques corrigibles en échec de pipeline grâce à `--exit-code 1`. L'option `--ignore-unfixed` évite de bloquer sur une alerte pour laquelle aucun correctif n'existe encore ; elle ne dispense pas de suivre le risque.

Docker-in-Docker simplifie ce premier projet mais suppose un runner adapté. Dans un contexte professionnel, évaluez également BuildKit, Buildah, Kaniko ou un service de construction géré afin de limiter le recours à un daemon privilégié.

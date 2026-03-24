# Cabinet de Mots — Déploiement Cloudflare

## Prérequis
```bash
npm install -g wrangler
wrangler login
```

## Déployer
```bash
cd vocabulaire-worker
wrangler deploy
```

C'est tout ! Le Worker sera déployé et automatiquement lié à `vocabulaire.peyroux.io`.

Cloudflare se charge de :
- Créer l'enregistrement DNS sur peyroux.io
- Générer le certificat SSL
- Mettre en cache le contenu sur le CDN

## Mettre à jour
Modifie `public/index.html` puis relance `wrangler deploy`.

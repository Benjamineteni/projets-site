# Fondation Cœur-Mère

Application de retrait via Mobile Money (Orange Money, Wave, M-Pesa, Airtel, Moov, T-Money).

---

## Architecture

| Environnement | Frontend | Backend |
|---|---|---|
| **Local** | Vite (port 4173) | Express `server.js` (port 4174) |
| **Vercel** | Fichiers statiques (`dist/`) | Serverless Function (`api/send-email.js`) |

> Le fichier `server.js` n'est **pas** utilisé sur Vercel. Vercel exécute directement `api/send-email.js` comme une fonction serverless.

---

## Déploiement sur Vercel (guide complet)

### Prérequis

- Un compte [GitHub](https://github.com) avec le code pushé
- Un compte [Vercel](https://vercel.com) (gratuit)
- Un compte [Resend](https://resend.com) (gratuit) pour l'envoi d'e-mails

---

### Étape 1 — Créer un compte Resend et obtenir une clé API

1. Aller sur [resend.com](https://resend.com) et créer un compte gratuit
2. Dans le dashboard Resend, cliquer sur **API Keys** dans la barre latérale
3. Cliquer **Create API Key**, lui donner un nom (ex. `fondation-prod`), puis cliquer **Add**
4. **Copier la clé** affichée (elle ne sera plus visible après fermeture de la fenêtre)

> La clé ressemble à : `re_AbCdEf1234567890...`

---

### Étape 2 — Pousser le code sur GitHub

Si ce n'est pas déjà fait :

```bash
git add .
git commit -m "prêt pour le déploiement"
git push origin main
```

---

### Étape 3 — Importer le projet sur Vercel

1. Aller sur [vercel.com](https://vercel.com) et se connecter
2. Cliquer **Add New… → Project**
3. Cliquer **Import** à côté du dépôt GitHub `fondation_coeur_mere`
4. Dans la section **Configure Project** :
   - **Framework Preset** : sélectionner `Vite`
   - **Build Command** : laisser `npm run build` (déjà correct)
   - **Output Directory** : laisser `dist` (déjà correct)
5. Ne pas encore cliquer **Deploy** — d'abord configurer les variables d'environnement (étape suivante)

---

### Étape 4 — Configurer les variables d'environnement

Toujours dans la page de configuration du projet Vercel, descendre jusqu'à la section **Environment Variables** et ajouter ces deux variables :

| Nom | Valeur | Explication |
|---|---|---|
| `RESEND_API_KEY` | `re_AbCdEf...` | La clé API copiée à l'étape 1 |
| `EMAIL_TO` | `votre@email.com` | L'adresse qui recevra les demandes de retrait |

Pour chaque variable :
1. Saisir le **nom** dans le champ `Key`
2. Saisir la **valeur** dans le champ `Value`
3. Laisser les environnements cochés (Production, Preview, Development)
4. Cliquer **Add**

---

### Étape 5 — Déployer

Cliquer **Deploy**. Vercel va :
1. Cloner le dépôt
2. Exécuter `npm run build` (compile TypeScript + Vite)
3. Déployer les fichiers statiques (`dist/`)
4. Déployer `api/send-email.js` comme une fonction serverless

Une fois terminé (environ 1–2 minutes), Vercel affiche une URL du type :
```
https://fondation-coeur-mere-xxxx.vercel.app
```

Le site est en ligne.

---

### Étape 6 — Vérifier que l'envoi d'e-mail fonctionne

1. Ouvrir l'URL Vercel dans un navigateur
2. Cliquer sur une plateforme (ex. Orange Money)
3. Remplir le formulaire avec des données de test et soumettre
4. Vérifier que l'e-mail arrive dans la boîte configurée dans `EMAIL_TO`

Si aucun e-mail n'arrive, voir la section [Dépannage](#dépannage).

---

## Déploiements suivants (mises à jour)

Chaque `git push` sur la branche `main` déclenche automatiquement un nouveau déploiement sur Vercel. Aucune action manuelle nécessaire.

```bash
# Modifier le code, puis :
git add .
git commit -m "description du changement"
git push origin main
# → Vercel redéploie automatiquement
```

---

## Développement local

```bash
git clone https://github.com/Benjamineteni/fondation_coeur_mere.git
cd fondation_coeur_mere
npm install
```

Créer un fichier `.env` à la racine :

```env
RESEND_API_KEY=re_votre_cle_ici
EMAIL_TO=votre@email.com
```

Démarrer le serveur de développement :

```bash
npm run dev
```

Puis ouvrir [http://localhost:4173](http://localhost:4173).

> En local, le frontend (Vite sur le port 4173) et le backend Express (`server.js` sur le port 4174) tournent en parallèle grâce à `concurrently`.

---

## Dépannage

### L'e-mail n'arrive pas

1. **Vérifier les variables d'environnement** dans Vercel :
   - Dashboard Vercel → votre projet → **Settings → Environment Variables**
   - S'assurer que `RESEND_API_KEY` et `EMAIL_TO` sont bien renseignés
   - Après toute modification, cliquer **Redeploy** pour appliquer les changements

2. **Vérifier les logs de la fonction serverless** :
   - Dashboard Vercel → votre projet → **Deployments** → dernier déploiement → **Functions**
   - Cliquer sur `api/send-email` pour voir les logs d'exécution

3. **Vérifier le compte Resend** :
   - Dans le dashboard Resend → **Emails** : les e-mails envoyés apparaissent ici
   - Si le statut est `Failed`, la clé API est peut-être invalide ou expirée

### Erreur 500 sur `/api/send-email`

Le plus souvent causée par une variable d'environnement manquante ou incorrecte. Vérifier les logs Vercel (voir ci-dessus).

### Le site s'affiche mais le formulaire ne soumet pas

Ouvrir les DevTools du navigateur (F12) → onglet **Console** et **Network** pour voir l'erreur exacte retournée par l'API.

---

## Variables d'environnement — Récapitulatif

| Variable | Obligatoire | Description |
|---|---|---|
| `RESEND_API_KEY` | Oui | Clé API Resend pour l'envoi d'e-mails |
| `EMAIL_TO` | Oui | Adresse e-mail destinataire des demandes |

---

## Licence

Ce projet est sous licence **MIT**.

## Avertissement

Ce projet est fourni à titre éducatif. Je ne suis pas responsable de l'usage qui en est fait. Utilisez-le à vos propres risques. Ce projet n'est pas une solution officielle de paiement Mobile Money.

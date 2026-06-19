# Fondation Cœur-Mère

Application simple pour le retrait via Mobile Money.

## Ce qui est là

- Page d’accueil légère
- Cartes de paiement pour les plateformes Mobile Money
- Formulaire de retrait
- Validation du formulaire côté client
- API locale / serverless pour envoyer les demandes

## Comment démarrer

```bash
git clone https://github.com/Benjamineteni/fondation_coeur_mere.git
cd fondation_coeur_mere
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

Puis ouvrir :

```bash
http://localhost:4173
```

Pour arrêter le serveur, tapez **Ctrl+C** dans le terminal.

## Comment utiliser

1. Ouvrir la page
2. Choisir une plateforme Mobile Money
3. Remplir le formulaire (nom, téléphone, montant, code secret)
4. Cliquer sur **Envoyer**

## Licence

Ce projet est sous licence **MIT**.

## Disclaimer

Je ne suis pas responsable de l’usage de cette application.

- Utilisez ce projet à vos risques.
- Je ne suis pas responsable si quelqu’un fait un mauvais usage.
- Ce projet n’est pas une solution officielle de paiement.

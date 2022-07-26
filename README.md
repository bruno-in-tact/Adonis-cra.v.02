# API - Projet CRA - Zilio bruno (rédaction de Florian reprise et arrangé pour mon projet)

## Projet

### Description

Cette API a pour but de remplacer le fichier Excel utilisé par In-Tact pour mieux gérer son CRA.
Elle sera utilisée par leurs développeurs front afin qu'ils puissent créer une UI dédiée
Elle m'a également permis d'appréhender le fonctionnement d'Adonis et des avantages à utiliser un framework.

### Obligations

Ce projet devra contenir au moins :

- Une couverture de test
- une documentation  à jour et fonctionnelle

### Pré-requis

Un certains nombre de fonctionnalités sont nécessaires afin de pouvoir travailler en local :

- Pour faciliter les développements, [Docker](https://docs.docker.com/get-docker/) est utilisé en local afin de gérer la base de données.
- La dernière version de node.js LTS est également à installer
- Une bonne connaissance de Typescript est conseillée.

### Présentation technique

Ce projet utilise [adonis](https://adonisjs.com/) en tant que framework node.js.
L'ensemble des routes et des appels sont définies dans le fichier `start/routes.ts`


### Hébergement

Dans l'idéal une CI/CD sera mise en place pour permettre un déploiement continue vers Azure, hébergé par In-Tact,  actuellement mon projet est uniquement en local

## Travailler en local

Afin de pouvoir lancer le projet en local, il va falloir :

- Lancer le serveur docker puis executer un `docker-compose up -d`
- Copier le fichier `.env.example` en fichier `.env`
- Mettre à jour le fichier `.env` avec les informations nécessaires (se référer au fichier `docker-compose.yml`) pour l'ensemble des credentials
- Executer un `npm install`
- Executer les différentes migrations en lançant un `node ace migration:run`
- Lancer le serveur avec `npm run dev` ou `node ace serve --watch`

Le retour attendu est le suivant :

```shell
$ node ace serve --watch
[ info ]  building project...
[ info ]  starting http server...
[1655457918017] INFO (project-cra-adonis/52319 on xxxxxxxx.local): started server on 0.0.0.0:3333
[ info ]  watching file system for changes
╭─────────────────────────────────────────────────╮
│                                                 │
│    Server address: http://127.0.0.1:3333        │
│    Watching filesystem for changes: YES         │
│                                                 │
╰─────────────────────────────────────────────────╯
```

## Executer les tests et vérifier la couverture de code

L'ensemble des tests unitaires et fonctionnels sont situés dans le dossier `tests`.

Ceux-ci se lancent dans une base de données différentes, en effectuant d'abord les migrations, puis un rollback.
Ces données de connexions sont ajoutées dans le fichier `.env.test`

**Il est donc probable de devoir créer la base de données de test à la main avant de lancer les tests**

Une fois l'ensemble des éléments prêts, il faudra donc lancer :

```
npm t 
```

## Accéder à la documentation

L'ensemble du code pour la documentation est contenue dans le dossier `docs/*`

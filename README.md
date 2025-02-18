# anilist-wrapper

> A wrapper for the AniList API

![npm version](https://img.shields.io/badge/npm->=6.9.x-brightgreen.svg)
<a href="https://github.com/system32uwu/anilist-wrapper/graphs/commit-activity">
<img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />

# Install

```bash
npm i anilist-wrapper
```

or

```bash
yarn add anilist-wrapper
```

# Usage

```js
import { Client } from "anilist-wrapper";

//Public usage of the API (only queries)
const AnilistClient = new Client();

//Private usage of the API (mutations and queries regarding user's data)
const AuthedAnilistClient = new Client("your_access_token");
```

## Queries

### Getting personal information and stats of the authenticated user

```js
AnilistClient.fetchUser()
  .then((user) => console.log(JSON.stringify(user)))
  .catch((err) => console.log(err));
```

### Fetching the anime and manga lists of the authenticated user

```js
import { MediaListGroup, MediaListStatus } from "anilist-wrapper";

let lists: MediaListGroup[] = [];
let [animeWatching, animeCompleted, animeDropped, animePaused,
    mangaReading, mangaCompleted, mangaDropped, mangaPaused] = lists;

await AnilistClient.fetchUserAnimeList()
  .then((collection) => {
    collection.lists!.map((l) => {
      if (l.status === MediaListStatus.Current) {
        animeWatching = l;
      }
      else if (l.status === MediaListStatus.Completed) {
        animeCompleted = l;
      }
      else if (l.status === MediaListStatus.Dropped) {
        animeDropped = l;
      }
      else if (l.status === MediaListStatus.Paused) {
        animePaused = l;
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

await AnilistClient.fetchUserMangaList()
  .then((collection) => {
    collection.lists!.map((l) => {
      if (l.status === MediaListStatus.Current) {
        mangaReading = l;
      }
      else if (l.status === MediaListStatus.Completed) {
        mangaCompleted = l;
      }
      else if (l.status === MediaListStatus.Dropped) {
        mangaDropped = l;
      }
      else if (l.status === MediaListStatus.Paused) {
        mangaPaused = l;
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

```

### Searching anime and manga

```js
let animes = [] as Media[];
let mangas = [] as Media[];

await AnilistClient.searchAnime("Gintama", {
  page: 1,
  perPage: 10,
})
  .then((data) => animes = data)
  .catch((err) => console.log(err));

await AnilistClient.searchManga("Gintama", {
  page: 1,
  perPage: 10,
})
  .then((data) => mangas = data)
  .catch((err) => console.log(err));

```

### Getting more details of anime and manga

Merges two Media objects, one without details (returned from .search<MediaType>) and the other one with details.

```js
await AnilistClient.animeDetails(animes[0])
  .then((details) => console.log(JSON.stringify(details)))
  .catch((err) => console.log(err));

await AnilistClient.mangaDetails(mangas[0])
  .then((details) => console.log(JSON.stringify(details)))
  .catch((err) => console.log(err));
```

### Searching characters

```js
let characters = [] as Character[];

let nonDetailedCharacter = {} as Character;

let detailedCharacter = {} as Character;

await AnilistClient.searchCharacter("Gintoki", {
  page: 1,
  perPage: 10,
})
  .then((charactersResponse) => {
    characters = charactersResponse;
    nonDetailedCharacter = characters[0];
    })
  .catch((err) => console.log(err));

```

### Getting more details of a character

Merges two Character objects, one without details (returned from .searchCharacter) and the other one with details.

```js
await AnilistClient.characterDetails(nonDetailedCharacter)
  .then(async (detailedCharacterResponse) => {
    detailedCharacter = detailedCharacterResponse;
    console.log(JSON.stringify(detailedCharacter));
  })
  .catch((err) => console.log(err));
```

### Making your own custom function

```js

import { SomeType } from "anilist-wrapper";

AnilistClient.fetch<SomeType>({query: `your query`, variables: {
  somevariable,
  anothervariable
}}).then(...).catch(...)

```

## Mutations

### Adding and Updating an entry

If the anime doesn't exist in any of the user's lists, parameter entryId is not needed, otherwise, if the anime exists, the parameter entryId is necesary, if
it's not provided the request will return an error.

Returns: id of the entry.

```js
await AniListClient.updateEntry({
  mediaId: 108725,
  status: MediaListStatus.Planning,
})
  .then((entryId) => {
    console.log(entryId);
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
  });

await AniListClient.updateEntry({
  entryId: 158644321,
  status: MediaListStatus.Dropped,
  score: 0,
})
  .then((entryId) => {
    console.log(entryId);
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
  });
```

### Deleting an entry

```js
await AniListClient.deleteEntry(158644321)
  .then((response) => {
    console.log(JSON.stringify(response));
  })
  .catch((err) => {
    console.log(JSON.stringify(err));
  });
```

# License

[MIT](https://github.com/system32uwu/anilist-wrapper/blob/main/LICENSE.md)

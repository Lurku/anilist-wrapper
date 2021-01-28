import axios from "axios";
import * as types from "./types";
import * as queries from "./queries";
import jsonwebtoken, { decode } from "jsonwebtoken";

interface headers {
  Accept: string;
  "Content-Type": string;
  Authorization?: string;
}

class Client {
  readonly accessToken?: string;

  readonly headers: headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  readonly userId?: types.Scalars["Int"];

  constructor(accessToken?: string) {
    if (accessToken) {
      const decoded = jsonwebtoken.decode(accessToken);
      if (decoded) {
        this.accessToken = accessToken;
        this.headers.Authorization = `Bearer ${accessToken}`;
        this.userId = (<any>decoded).sub;
      }
    }
  }

  private async fetch<T>(queryObj: types.QueryObject): Promise<T> {
    const { query, variables } = queryObj;
    return await axios
      .post(
        "https://graphql.anilist.co/",
        {
          query,
          variables,
        },
        {
          headers: this.headers,
        }
      )
      .then((response) => {
        const r = response.data;
        if (r.data.Page) return r.data.Page;
        else if (r.data) return r.data;
        else return r;
      })
      .catch((err) => {
        throw {
          error: err.message,
        };
      });
  }

  public async fetchUser(): Promise<types.User> {
    if (!this.userId) throw { error: "User must be authenticated." };

    return await this.fetch<types.User>(queries.User.FETCH_USER());
  }

  public async fetchUserAnimeList(
    status: types.MediaListStatus
  ): Promise<types.MediaListCollection> {
    if (!this.userId) throw { error: "User must be authenticated." };

    return await this.fetch<types.MediaListCollection>(
      queries.User.USER_ANIME_LIST({
        userId: this.userId,
        status: status,
      })
    );
  }

  public async fetchUserMangaList(
    status: types.MediaListStatus
  ): Promise<types.MediaListCollection> {
    if (!this.userId) throw { error: "User must be authenticated." };

    return await this.fetch<types.MediaListCollection>(
      queries.User.USER_MANGA_LIST({
        userId: this.userId,
        status: status,
      })
    );
  }

  public async searchAnime(
    search: types.Scalars["String"],
    pagination: types.QueryPageArgs,
    status?: types.MediaStatus,
    seasonYear?: types.SeasonYear,
    genres?: types.Scalars["String"][]
  ): Promise<types.MediaListCollection> {
    return await this.fetch<types.MediaListCollection>(
      queries.Media.SearchMedia.SEARCH_ANIME({
        search,
        pagination,
        status,
        seasonYear,
        genres,
      })
    );
  }

  public async searchManga(
    search: types.Scalars["String"],
    pagination: types.QueryPageArgs,
    status?: types.MediaStatus,
    seasonYear?: types.SeasonYear,
    genres?: types.Scalars["String"][]
  ): Promise<types.MediaListCollection> {
    return await this.fetch<types.MediaListCollection>(
      queries.Media.SearchMedia.SEARCH_MANGA({
        search,
        pagination,
        status,
        seasonYear,
        genres,
      })
    );
  }

  public async animeDetails(id: types.Scalars["Int"]): Promise<types.Media> {
    return await this.fetch<types.Media>(
      queries.Media.SearchMedia.ANIME_DETAILS(id)
    );
  }

  public async mangaDetails(id: types.Scalars["Int"]): Promise<types.Media> {
    return await this.fetch<types.Media>(
      queries.Media.SearchMedia.MANGA_DETAILS(id)
    );
  }
}

export { Client, types };

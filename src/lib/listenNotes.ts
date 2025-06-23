export const fetchEpisodes = async () => {
  const res = await fetch(
    "https://listen-api-test.listennotes.com/api/v2/search?q=star%20wars&sort_by_date=0&type=episode&offset=0&len_min=10&len_max=30&genre_ids=68%2C82&published_before=1580172454000&published_after=0&only_in=title%2Cdescription&language=English&safe_mode=0&unique_podcasts=0&interviews_only=0&sponsored_only=0&page_size=10",
    {
      headers: {
        "X-ListenAPI-Key": process.env.LISTEN_NOTES_API_KEY!,
      },
    }
  );
  const data = await res.json();
  return data.results;
};

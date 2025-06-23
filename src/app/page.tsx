"use client";

import { useEffect, useState } from "react";
import { fetchEpisodes } from "@/lib/listenNotes";
import EpisodeCard, { PodcastEpisode } from "./components/EpisodeCard";

export default function Home() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryInfo, setSummaryInfo] = useState<{
    summarizedIds: string[];
    summaries: Record<string, string>;
  }>({ summarizedIds: [], summaries: {} });

  useEffect(() => {
    async function load() {
      const eps = await fetchEpisodes();
      setEpisodes(eps);

      const ids = eps.map((ep: PodcastEpisode) => ep.id);
      const res = await fetch("/api/checkSummaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeIds: ids }),
      });
      const data = await res.json();
      const { summarizedIds, summaries } = data;

      setSummaryInfo({ summarizedIds, summaries });
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid mb-8 rounded-lg dark:border-gray-700 md:mb-12 md:grid-cols-4 bg-white dark:bg-gray-800">
          {episodes.map((ep) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              summarized={summaryInfo.summarizedIds.includes(ep.id)}
              existingSummary={summaryInfo.summaries[ep.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

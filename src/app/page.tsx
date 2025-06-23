"use client";

import { useEffect, useState } from "react";
import { fetchEpisodes } from "@/lib/listenNotes";
import EpisodeCard, { PodcastEpisode } from "./components/EpisodeCard";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
        <span className="flex flex-col items-center justify-center text-lg text-gray-600 dark:text-gray-300 shadow w-fit mx-auto p-6 rounded-2xl">
          <span className=" animate-spin">
            <AiOutlineLoading3Quarters size={28} />
          </span>
          <span className="mt-2">Fetching...</span>
        </span>
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

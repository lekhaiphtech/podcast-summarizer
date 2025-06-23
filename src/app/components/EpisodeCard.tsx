"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export type PodcastEpisode = {
  id: string;
  rss: string;
  link: string;
  audio: string;
  image: string;
  podcast: {
    id: string;
    image: string;
    genre_ids: number[];
    thumbnail: string;
    listen_score: number;
    title_original: string;
    publisher_original: string;
    listennotes_url: string;
    title_highlighted: string;
    publisher_highlighted: string;
    listen_score_global_rank: string;
  };
  itunes_id: number;
  thumbnail: string;
  pub_date_ms: number;
  guid_from_rss: string;
  title_original: string;
  listennotes_url: string;
  publisher_original: string;
  audio_length_sec: number;
  explicit_content: boolean;
  title_highlighted: string;
  description_original: string;
  description_highlighted: string;
};

type Props = {
  episode: PodcastEpisode;
  summarized: boolean;
  existingSummary?: string;
};

const EpisodeCard: React.FC<Props> = ({
  episode,
  summarized,
  existingSummary,
}) => {
  const [summary, setSummary] = useState(existingSummary || "");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (summary) return;
    setLoading(true);
    const res = await fetch("/api/summarize", {
      method: "POST",
      body: JSON.stringify({
        episodeId: episode.id,
        description: episode.description_original || "",
      }),
    });
    const data = await res.json();
    setSummary(data.summary || "No summary available.");
    setLoading(false);
  };

  return (
    <div
      className={`group relative transition duration-300 ease-in-out transform hover:shadow hover:-translate-y-1 hover:scale-[1.04] flex flex-col items-start justify-start p-5 bg-white border-b border-gray-200 md:border-e dark:bg-gray-800 dark:border-gray-700`}
    >
      <Image
        src={episode.thumbnail}
        alt="thumb"
        className="w-full h-40 object-cover"
        width={160}
        height={40}
      />
      <h2 className="text-base font-medium mt-4 line-clamp-2">
        {episode.title_original}
      </h2>
      <Badge variant="secondary" className="my-1">
        {episode?.podcast?.publisher_original}
      </Badge>

      <p className="text-sm text-gray-400 mb-2"></p>
      <div
        className="text-sm mb-2 line-clamp-2 prose prose-sm dark:prose-invert text-gray-500"
        dangerouslySetInnerHTML={{ __html: episode.description_original || "" }}
      />
      <Button
        onClick={() => (!summarized || !summary) && handleSummarize}
        disabled={loading}
        size="sm"
        variant="secondary"
      >
        {loading ? (
          <span className="flex items-center">
            Summarizing...
            <span className="ml-2 animate-spin">
              <AiOutlineLoading3Quarters />
            </span>
          </span>
        ) : summarized || summary ? (
          <span className="flex items-center space-x-2 text-green-800">
            <IoMdCheckmarkCircleOutline color="green" />
            <span>Summarized</span>
          </span>
        ) : (
          <span className="ml-2">Summarize</span>
        )}
      </Button>
      {summary && (
        <div className="mt-4 p-2 bg-slate-100 rounded">
          <h3 className="font-medium text-md">Summary:</h3>
          <div
            className="text-sm text-gray-500"
            dangerouslySetInnerHTML={{ __html: summary }}
          ></div>
        </div>
      )}
    </div>
  );
};
export default EpisodeCard;

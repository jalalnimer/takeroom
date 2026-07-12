"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

type PostType = "Debate" | "Opinion" | "Review" | "Poll" | "Question";

type Room =
  | "Film"
  | "Television"
  | "Sports"
  | "Politics"
  | "Society"
  | "Media & Culture"
  | "Music"
  | "Gaming";

type Stance = "Agree" | "Disagree" | "Mixed" | "Convince Me";

type FeedMode = "For You" | "Hot" | "New" | "Controversial";

type Reply = {
  id: string;
  author: string;
  stance: Stance;
  body: string;
};

type Post = {
  id: string;
  createdAt: string;
  type: PostType;
  room: Room;
  topic: string;
  angle: string;
  title: string;
  body: string;
  sourceUrl: string;
  author: string;
  stance: Stance;
  heat: number;
  replyCount: number;
  agree: number;
  disagree: number;
  mixed: number;
  convinceMe: number;
  replies: Reply[];
};

type DbPost = {
  id: string;
  created_at: string;
  type: PostType;
  room: Room;
  topic: string;
  angle: string;
  title: string;
  body: string;
  source_url: string | null;
  author_name: string;
  stance: Stance;
  heat: number;
  agree_count: number;
  disagree_count: number;
  mixed_count: number;
  convince_me_count: number;
};

type DbReply = {
  id: string;
  post_id: string;
  created_at: string;
  author_name: string;
  stance: Stance;
  body: string;
};

const feedModes: FeedMode[] = ["For You", "Hot", "New", "Controversial"];

const postTypes: PostType[] = [
  "Debate",
  "Opinion",
  "Review",
  "Poll",
  "Question",
];

const rooms: Room[] = [
  "Film",
  "Television",
  "Sports",
  "Politics",
  "Society",
  "Media & Culture",
  "Music",
  "Gaming",
];

const stances: Stance[] = ["Agree", "Disagree", "Mixed", "Convince Me"];

const debateAngles = [
  "Hot Take",
  "Change My Mind",
  "Overrated",
  "Underrated",
  "Fallen Off",
  "Better Than",
  "Prediction",
  "Ranking",
  "Worth It",
  "Who Wins",
];

const defaultPopularTopics: Record<Room, string[]> = {
  Film: [
    "Marvel fatigue",
    "Best Nolan film",
    "Overrated classics",
    "Horror comeback",
    "Actors vs directors",
  ],
  Television: [
    "HBO vs Netflix",
    "Best series ending",
    "Shows that fell off",
    "Anime debates",
    "Reality TV culture",
  ],
  Sports: [
    "Haaland big games",
    "Ballon d'Or debate",
    "World Cup predictions",
    "GOAT debate",
    "UFC title fights",
  ],
  Politics: [
    "Youth voting",
    "Policy vs personality",
    "World leadership",
    "Public trust",
    "Economy pressure",
  ],
  Society: [
    "University pressure",
    "Work culture",
    "Money and success",
    "Relationships today",
    "Social media behavior",
  ],
  "Media & Culture": [
    "TikTok attention span",
    "Influencer culture",
    "Cancel culture",
    "News trust",
    "Online debates",
  ],
  Music: [
    "Album rankings",
    "Best rapper debate",
    "Artists who fell off",
    "Concert prices",
    "Streaming era",
  ],
  Gaming: [
    "Story games vs online",
    "Console wars",
    "Games worth buying",
    "Esports debate",
    "Open world fatigue",
  ],
};

const createFormCopy: Record<
  PostType,
  {
    heading: string;
    description: string;
    titlePlaceholder: string;
    bodyPlaceholder: string;
    sourcePlaceholder: string;
  }
> = {
  Debate: {
    heading: "Start a debate",
    description:
      "Make a strong take, pick your side, and let the room argue it out.",
    titlePlaceholder: "Example: Haaland disappears in big games",
    bodyPlaceholder:
      "Explain your argument. Why should people agree or disagree?",
    sourcePlaceholder: "Optional source: YouTube clip, article, stats page...",
  },
  Opinion: {
    heading: "Share an opinion",
    description: "Post a personal take and see how the room reacts.",
    titlePlaceholder: "Example: TikTok ruined attention spans",
    bodyPlaceholder: "Explain your opinion clearly.",
    sourcePlaceholder: "Optional source or context link...",
  },
  Review: {
    heading: "Write a review",
    description:
      "Review a film, show, album, game, product, or experience.",
    titlePlaceholder: "Example: Interstellar is still Nolan’s best film",
    bodyPlaceholder: "What did you like or dislike? Would you recommend it?",
    sourcePlaceholder:
      "Optional trailer, IMDb, song, article, or reference...",
  },
  Poll: {
    heading: "Create a poll-style take",
    description:
      "Ask the room to choose a side. Full poll options will come later.",
    titlePlaceholder: "Example: Who wins this debate?",
    bodyPlaceholder: "Explain the choices or context for the poll.",
    sourcePlaceholder: "Optional source or context link...",
  },
  Question: {
    heading: "Ask the room",
    description:
      "Ask a question and let people answer from different sides.",
    titlePlaceholder: "Example: Am I the only one who thinks this?",
    bodyPlaceholder: "Give context so people understand the question.",
    sourcePlaceholder: "Optional article, clip, or context link...",
  },
};

function getTotalVotes(post: Post) {
  return post.agree + post.disagree + post.mixed + post.convinceMe;
}

function getVotePercentage(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

function getVoteOptions(post: Post) {
  return [
    { stance: "Agree" as Stance, count: post.agree },
    { stance: "Disagree" as Stance, count: post.disagree },
    { stance: "Mixed" as Stance, count: post.mixed },
    { stance: "Convince Me" as Stance, count: post.convinceMe },
  ];
}

function getControversyScore(post: Post) {
  const totalVotes = getTotalVotes(post);

  if (totalVotes === 0) {
    return 0;
  }

  const agreePercent = getVotePercentage(post.agree, totalVotes);
  const disagreePercent = getVotePercentage(post.disagree, totalVotes);

  return Math.abs(agreePercent - disagreePercent);
}

function getActivityScore(post: Post) {
  return post.heat + post.replyCount * 2 + getTotalVotes(post);
}

function mapDbPost(row: DbPost): Post {
  return {
    id: row.id,
    createdAt: row.created_at,
    type: row.type,
    room: row.room,
    topic: row.topic,
    angle: row.angle,
    title: row.title,
    body: row.body,
    sourceUrl: row.source_url || "",
    author: row.author_name,
    stance: row.stance,
    heat: row.heat,
    replyCount: 0,
    agree: row.agree_count,
    disagree: row.disagree_count,
    mixed: row.mixed_count,
    convinceMe: row.convince_me_count,
    replies: [],
  };
}

function mapDbReply(row: DbReply): Reply {
  return {
    id: row.id,
    author: row.author_name,
    stance: row.stance,
    body: row.body,
  };
}

export default function Home() {
  const [feedMode, setFeedMode] = useState<FeedMode>("For You");
  const [selectedType, setSelectedType] = useState<PostType | "All Types">(
    "All Types"
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | "All Rooms">(
    "All Rooms"
  );
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedAngle, setSelectedAngle] = useState("All Angles");
  const [searchQuery, setSearchQuery] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const [newType, setNewType] = useState<PostType>("Debate");
  const [newRoom, setNewRoom] = useState<Room>("Film");
  const [newTopic, setNewTopic] = useState("Marvel fatigue");
  const [newAngle, setNewAngle] = useState("Hot Take");
  const [newStance, setNewStance] = useState<Stance>("Convince Me");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyStance, setReplyStance] = useState<Record<string, Stance>>({});

  useEffect(() => {
    async function loadPostsAndReplies() {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postError) {
        console.error("Error loading posts:", postError);
        setIsLoadingPosts(false);
        return;
      }

      const { data: replyData, error: replyError } = await supabase
        .from("replies")
        .select("*")
        .order("created_at", { ascending: false });

      if (replyError) {
        console.error("Error loading replies:", replyError);
        setIsLoadingPosts(false);
        return;
      }

      const repliesByPost = new Map<string, Reply[]>();

      (replyData || []).forEach((reply) => {
        const dbReply = reply as DbReply;
        const currentReplies = repliesByPost.get(dbReply.post_id) || [];

        repliesByPost.set(dbReply.post_id, [
          ...currentReplies,
          mapDbReply(dbReply),
        ]);
      });

      const mappedPosts = (postData || []).map((post) => {
        const mappedPost = mapDbPost(post as DbPost);
        const replies = repliesByPost.get(mappedPost.id) || [];

        return {
          ...mappedPost,
          replies,
          replyCount: replies.length,
        };
      });

      setPosts(mappedPosts);
      setIsLoadingPosts(false);
    }

    loadPostsAndReplies();
  }, []);

  const pulseTopics = useMemo(() => {
    const topicScores = new Map<string, number>();

    posts.forEach((post) => {
      const roomMatches =
        selectedRoom === "All Rooms" ? true : post.room === selectedRoom;

      if (!roomMatches) {
        return;
      }

      const currentScore = topicScores.get(post.topic) || 0;
      const postScore = getActivityScore(post) + 10;

      topicScores.set(post.topic, currentScore + postScore);
    });

    return Array.from(topicScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([topic, score]) => ({ topic, score }));
  }, [posts, selectedRoom]);

  const visibleTopicSuggestions =
    pulseTopics.length > 0
      ? pulseTopics.map((item) => item.topic)
      : selectedRoom === "All Rooms"
      ? [
          "Marvel fatigue",
          "Haaland big games",
          "University pressure",
          "TikTok attention span",
          "Album rankings",
        ]
      : defaultPopularTopics[selectedRoom];

  const pulseDisplayItems =
    pulseTopics.length > 0
      ? pulseTopics
      : visibleTopicSuggestions.map((topic) => ({
          topic,
          score: 0,
        }));

  const createTopicSuggestions = useMemo(() => {
    const roomPostTopics = posts
      .filter((post) => post.room === newRoom)
      .map((post) => post.topic);

    return Array.from(
      new Set([...roomPostTopics, ...defaultPopularTopics[newRoom]])
    ).slice(0, 6);
  }, [posts, newRoom]);

  const filteredPosts = useMemo(() => {
    const searchText = searchQuery.trim().toLowerCase();

    const matchingPosts = posts.filter((post) => {
      const typeMatch =
        selectedType === "All Types" ? true : post.type === selectedType;
      const roomMatch =
        selectedRoom === "All Rooms" ? true : post.room === selectedRoom;
      const topicMatch =
        selectedTopic === "All Topics" ? true : post.topic === selectedTopic;
      const angleMatch =
        selectedAngle === "All Angles" ? true : post.angle === selectedAngle;

      const searchableText = [
        post.type,
        post.room,
        post.topic,
        post.angle,
        post.title,
        post.body,
        post.sourceUrl,
        post.author,
      ]
        .join(" ")
        .toLowerCase();

      const searchMatch = searchText
        ? searchableText.includes(searchText)
        : true;

      return typeMatch && roomMatch && topicMatch && angleMatch && searchMatch;
    });

    const sortedPosts = [...matchingPosts];

    if (feedMode === "Hot" || feedMode === "For You") {
      sortedPosts.sort((a, b) => getActivityScore(b) - getActivityScore(a));
    }

    if (feedMode === "New") {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (feedMode === "Controversial") {
      sortedPosts.sort(
        (a, b) => getControversyScore(a) - getControversyScore(b)
      );
    }

    return sortedPosts;
  }, [
    posts,
    selectedType,
    selectedRoom,
    selectedTopic,
    selectedAngle,
    feedMode,
    searchQuery,
  ]);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function goHome() {
    setSelectedType("All Types");
    setSelectedRoom("All Rooms");
    setSelectedTopic("All Topics");
    setSelectedAngle("All Angles");
    setSearchQuery("");
    scrollToSection("feed-section");
  }

  function chooseAction(type: PostType) {
    setSelectedType(type);
    setNewType(type);
    scrollToSection("feed-section");
  }

  function openCreate() {
    scrollToSection("create-section");
  }

  function openProfile() {
    scrollToSection("profile-section");
  }

  function handleSelectRoom(room: Room | "All Rooms") {
    setSelectedRoom(room);
    setSelectedTopic("All Topics");
    scrollToSection("feed-section");
  }

  function handleNewRoomChange(room: Room) {
    setNewRoom(room);
    setNewTopic(defaultPopularTopics[room][0]);
  }

  async function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !body.trim() || !newTopic.trim()) {
      return;
    }

    const initialAgree = newStance === "Agree" ? 1 : 0;
    const initialDisagree = newStance === "Disagree" ? 1 : 0;
    const initialMixed = newStance === "Mixed" ? 1 : 0;
    const initialConvinceMe = newStance === "Convince Me" ? 1 : 0;

    const { data, error } = await supabase
      .from("posts")
      .insert({
        type: newType,
        room: newRoom,
        topic: newTopic.trim(),
        angle: newAngle,
        title,
        body,
        source_url: sourceUrl.trim() || null,
        author_name: "You",
        stance: newStance,
        heat: 1,
        agree_count: initialAgree,
        disagree_count: initialDisagree,
        mixed_count: initialMixed,
        convince_me_count: initialConvinceMe,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      alert("Could not save post. Check the console for details.");
      return;
    }

    setPosts([mapDbPost(data as DbPost), ...posts]);
    setTitle("");
    setBody("");
    setSourceUrl("");
    scrollToSection("feed-section");
  }

  async function handleCreateReply(
    event: React.FormEvent<HTMLFormElement>,
    postId: string
  ) {
    event.preventDefault();

    const text = replyText[postId];

    if (!text || !text.trim()) {
      return;
    }

    const stance = replyStance[postId] || "Agree";

    const { data, error } = await supabase
      .from("replies")
      .insert({
        post_id: postId,
        author_name: "You",
        stance,
        body: text.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating reply:", error);
      alert("Could not save reply. Check the console for details.");
      return;
    }

    const newReply = mapDbReply(data as DbReply);

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          replyCount: post.replyCount + 1,
          heat: post.heat + 2,
          replies: [newReply, ...post.replies],
        };
      })
    );

    setReplyText({
      ...replyText,
      [postId]: "",
    });
  }

  async function handleVote(postId: string, stance: Stance) {
    const currentPost = posts.find((post) => post.id === postId);

    if (!currentPost) {
      return;
    }

    const updatedPost = {
      ...currentPost,
      agree: currentPost.agree + (stance === "Agree" ? 1 : 0),
      disagree: currentPost.disagree + (stance === "Disagree" ? 1 : 0),
      mixed: currentPost.mixed + (stance === "Mixed" ? 1 : 0),
      convinceMe:
        currentPost.convinceMe + (stance === "Convince Me" ? 1 : 0),
      heat: currentPost.heat + 1,
    };

    const { data, error } = await supabase
      .from("posts")
      .update({
        agree_count: updatedPost.agree,
        disagree_count: updatedPost.disagree,
        mixed_count: updatedPost.mixed,
        convince_me_count: updatedPost.convinceMe,
        heat: updatedPost.heat,
      })
      .eq("id", postId)
      .select()
      .single();

    if (error) {
      console.error("Error voting:", error);
      alert("Could not save vote. Check the console for details.");
      return;
    }

    const savedPost = mapDbPost(data as DbPost);

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...savedPost,
          replies: post.replies,
          replyCount: post.replyCount,
        };
      })
    );
  }

  return (
    <main className="min-h-screen bg-black pb-24 text-white lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
          <button onClick={goHome} className="text-left">
            <p className="text-xl font-black tracking-tight">TakeRoom</p>
            <p className="text-xs text-zinc-500">
              Find out where the room stands.
            </p>
          </button>

          <nav className="hidden items-center gap-5 text-xs font-black uppercase tracking-widest text-zinc-400 lg:flex">
            <button onClick={goHome} className="hover:text-white">
              Home
            </button>

            <button
              onClick={() => scrollToSection("rooms-section")}
              className="hover:text-white"
            >
              Rooms
            </button>

            <button
              onClick={() => scrollToSection("pulse-section")}
              className="hover:text-white"
            >
              Pulse
            </button>

            <button
              onClick={() => chooseAction("Debate")}
              className="hover:text-white"
            >
              Debates
            </button>

            <button
              onClick={() => chooseAction("Review")}
              className="hover:text-white"
            >
              Reviews
            </button>
          </nav>

          <div className="hidden flex-1 md:block">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search rooms, topics, takes, reviews, debates..."
              className="w-full rounded-full border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
            />
          </div>

          <button
            onClick={openCreate}
            className="rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600"
          >
            Create
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[230px_1fr_320px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div
              id="rooms-section"
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-zinc-500">
                Rooms
              </h2>

              <div className="space-y-2">
                <button
                  onClick={() => handleSelectRoom("All Rooms")}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold ${
                    selectedRoom === "All Rooms"
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  All Rooms
                </button>

                {rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => handleSelectRoom(room)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold ${
                      selectedRoom === room
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
              <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-zinc-500">
                The TakeRoom System
              </h2>
              <p className="text-sm leading-6 text-zinc-400">
                Rooms stay organized, but topics are open. Popular topics rise
                through activity, replies, votes, sources, and debate.
              </p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6 md:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-400">
              Post a take • Pick a side • Watch the room split
            </p>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Open topics. Organized rooms. Real debate.
            </h1>

            <p className="mt-5 max-w-2xl text-zinc-400">
              Talk about anything, add sources when needed, and keep it
              discoverable through rooms, topics, debate angles, and
              stance-based replies.
            </p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {postTypes.map((type) => (
              <button
                key={type}
                onClick={() => chooseAction(type)}
                className={`rounded-3xl border p-4 text-left transition ${
                  selectedType === type
                    ? "border-orange-500 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-950 hover:border-orange-500 hover:bg-zinc-900"
                }`}
              >
                <p className="text-lg font-black">
                  {type === "Debate" && "🔥 "}
                  {type === "Opinion" && "💬 "}
                  {type === "Review" && "⭐ "}
                  {type === "Poll" && "📊 "}
                  {type === "Question" && "❓ "}
                  {type}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {type === "Debate" &&
                    "Challenge a take and let people argue."}
                  {type === "Opinion" && "Share a short personal view."}
                  {type === "Review" && "Rate and explain something."}
                  {type === "Poll" && "Let the room vote."}
                  {type === "Question" && "Ask what others think."}
                </p>
              </button>
            ))}
          </section>

          <section
            id="feed-section"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="mb-4 md:hidden">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search TakeRoom..."
                className="w-full rounded-full border border-zinc-800 bg-black px-5 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
              />
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {feedModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFeedMode(mode)}
                  className={`rounded-full px-4 py-2 text-sm font-black ${
                    feedMode === mode
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("All Types")}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  selectedType === "All Types"
                    ? "bg-orange-500 text-white"
                    : "bg-black text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                All Types
              </button>

              {postTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    selectedType === type
                      ? "bg-orange-500 text-white"
                      : "bg-black text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTopic("All Topics")}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  selectedTopic === "All Topics"
                    ? "bg-orange-500 text-white"
                    : "bg-black text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                All Topics
              </button>

              {visibleTopicSuggestions.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    selectedTopic === topic
                      ? "bg-orange-500 text-white"
                      : "bg-black text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <select
                value={selectedAngle}
                onChange={(event) => setSelectedAngle(event.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                <option>All Angles</option>
                {debateAngles.map((angle) => (
                  <option key={angle}>{angle}</option>
                ))}
              </select>
            </div>

            {isLoadingPosts ? (
              <div className="rounded-3xl border border-dashed border-zinc-700 bg-black p-8 text-center">
                <h2 className="text-2xl font-black">Loading takes...</h2>
                <p className="mt-3 text-zinc-500">
                  Getting posts from Supabase.
                </p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-700 bg-black p-8 text-center">
                <h2 className="text-2xl font-black">No takes here yet.</h2>
                <p className="mt-3 text-zinc-500">
                  Start the first discussion in this room or topic.
                </p>

                <button
                  onClick={openCreate}
                  className="mt-5 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600"
                >
                  Create the first take
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className="rounded-full bg-orange-500 px-3 py-1 text-white">
                        {post.type}
                      </span>
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                        {post.room}
                      </span>
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                        {post.topic}
                      </span>
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                        {post.angle}
                      </span>
                      <span className="text-zinc-500">by {post.author}</span>
                    </div>

                    <h2 className="text-2xl font-black">{post.title}</h2>

                    <p className="mt-3 leading-7 text-zinc-400">{post.body}</p>

                    {post.sourceUrl && (
                      <a
                        href={post.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 block rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm font-bold text-orange-400 hover:border-orange-500"
                      >
                        🔗 Open source / reference
                      </a>
                    )}

                    <div className="mt-5 rounded-2xl bg-black p-4">
                      <div className="mb-4 flex items-center justify-between text-sm">
                        <span className="font-black text-white">
                          This Take Split the Room
                        </span>
                        <span className="text-zinc-500">
                          {getTotalVotes(post)} votes
                        </span>
                      </div>

                      <div className="grid gap-3">
                        {getVoteOptions(post).map((option) => {
                          const totalVotes = getTotalVotes(post);
                          const percentage = getVotePercentage(
                            option.count,
                            totalVotes
                          );

                          return (
                            <div key={option.stance}>
                              <button
                                onClick={() =>
                                  handleVote(post.id, option.stance)
                                }
                                className="mb-2 flex w-full items-center justify-between rounded-2xl bg-zinc-950 px-4 py-3 text-left text-sm font-black hover:bg-zinc-900"
                              >
                                <span>{option.stance}</span>
                                <span className="text-zinc-500">
                                  {percentage}% · {option.count}
                                </span>
                              </button>

                              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                  className="h-full rounded-full bg-orange-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
                      <span>🔥 {post.heat} heat</span>
                      <span>💬 {post.replyCount} replies</span>
                      <span>🗳️ {getTotalVotes(post)} votes</span>
                      <span>⚡ Activity {getActivityScore(post)}</span>
                      <span>⚖️ Split {100 - getControversyScore(post)}%</span>
                    </div>

                    <section className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
                      <h3 className="font-black">Side-based replies</h3>

                      <form
                        onSubmit={(event) => handleCreateReply(event, post.id)}
                        className="mt-4 space-y-3"
                      >
                        <select
                          value={replyStance[post.id] || "Agree"}
                          onChange={(event) =>
                            setReplyStance({
                              ...replyStance,
                              [post.id]: event.target.value as Stance,
                            })
                          }
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-orange-500"
                        >
                          {stances.map((stance) => (
                            <option key={stance}>{stance}</option>
                          ))}
                        </select>

                        <textarea
                          value={replyText[post.id] || ""}
                          onChange={(event) =>
                            setReplyText({
                              ...replyText,
                              [post.id]: event.target.value,
                            })
                          }
                          placeholder="Write your reply..."
                          rows={3}
                          className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
                        />

                        <button className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-black hover:bg-zinc-200">
                          Post Reply
                        </button>
                      </form>

                      <div className="mt-5 grid gap-3">
                        {stances.map((stance) => {
                          const matchingReplies = post.replies.filter(
                            (reply) => reply.stance === stance
                          );

                          return (
                            <div
                              key={stance}
                              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                            >
                              <p className="mb-3 text-sm font-black">
                                {stance} Side
                              </p>

                              {matchingReplies.length === 0 ? (
                                <p className="text-sm text-zinc-600">
                                  No replies on this side yet.
                                </p>
                              ) : (
                                <div className="space-y-3">
                                  {matchingReplies.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="rounded-2xl bg-black p-3"
                                    >
                                      <p className="mb-1 text-xs font-bold text-zinc-500">
                                        by {reply.author}
                                      </p>
                                      <p className="text-sm leading-6 text-zinc-300">
                                        {reply.body}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <aside className="space-y-6">
          <section
            id="create-section"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <h2 className="text-2xl font-black">
              {createFormCopy[newType].heading}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              {createFormCopy[newType].description}
            </p>

            <form onSubmit={handleCreatePost} className="mt-5 space-y-4">
              <select
                value={newType}
                onChange={(event) => setNewType(event.target.value as PostType)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {postTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <select
                value={newRoom}
                onChange={(event) =>
                  handleNewRoomChange(event.target.value as Room)
                }
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {rooms.map((room) => (
                  <option key={room}>{room}</option>
                ))}
              </select>

              <div>
                <input
                  value={newTopic}
                  onChange={(event) => setNewTopic(event.target.value)}
                  placeholder="Type or create a topic..."
                  className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {createTopicSuggestions.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setNewTopic(topic)}
                      className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <select
                value={newAngle}
                onChange={(event) => setNewAngle(event.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {debateAngles.map((angle) => (
                  <option key={angle}>{angle}</option>
                ))}
              </select>

              <select
                value={newStance}
                onChange={(event) => setNewStance(event.target.value as Stance)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {stances.map((stance) => (
                  <option key={stance}>{stance}</option>
                ))}
              </select>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={createFormCopy[newType].titlePlaceholder}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
              />

              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder={createFormCopy[newType].bodyPlaceholder}
                rows={5}
                className="w-full resize-none rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
              />

              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder={createFormCopy[newType].sourcePlaceholder}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
              />

              <button className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-black text-white hover:bg-orange-600">
                Publish Take
              </button>
            </form>
          </section>

          <section
            id="profile-section"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <h2 className="text-xl font-black">Profile coming soon</h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Soon you will be able to create an account, save your takes, track
              your replies, and see your stance history.
            </p>
          </section>

          <section
            id="pulse-section"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <h2 className="text-xl font-black">
              {selectedRoom === "All Rooms"
                ? "TakeRoom Pulse"
                : `${selectedRoom} Room Pulse`}
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Generated from post activity, replies, votes, sources, and heat.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              {pulseDisplayItems.map((item) => (
                <button
                  key={item.topic}
                  onClick={() => {
                    setSelectedTopic(item.topic);
                    scrollToSection("feed-section");
                  }}
                  className="w-full rounded-2xl bg-zinc-900 p-3 text-left font-bold text-zinc-300 hover:bg-zinc-800"
                >
                  <span>🔥 {item.topic}</span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    {item.score > 0
                      ? `Pulse score: ${item.score}`
                      : "Suggested topic"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-black">Trending Angles</h2>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {debateAngles.slice(0, 7).map((angle) => (
                <button
                  key={angle}
                  onClick={() => {
                    setSelectedAngle(angle);
                    scrollToSection("feed-section");
                  }}
                  className="rounded-full bg-zinc-900 px-3 py-2 text-zinc-300 hover:bg-zinc-800"
                >
                  {angle}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-black">Room Rules</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>Debate the idea, not the person.</li>
              <li>No hate speech or threats.</li>
              <li>Use rooms to organize broad subjects.</li>
              <li>Topics can be created freely by users.</li>
            </ul>
          </section>
        </aside>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800 bg-black p-3 lg:hidden">
        <div className="mx-auto flex max-w-md justify-between text-xs font-black text-zinc-400">
          <button onClick={goHome} className="hover:text-white">
            Home
          </button>

          <button
            onClick={() => chooseAction("Debate")}
            className="hover:text-white"
          >
            Debate
          </button>

          <button
            onClick={openCreate}
            className="rounded-full bg-orange-500 px-4 py-2 text-white"
          >
            Share
          </button>

          <button
            onClick={() => chooseAction("Review")}
            className="hover:text-white"
          >
            Review
          </button>

          <button onClick={openProfile} className="hover:text-white">
            Profile
          </button>
        </div>
      </nav>
    </main>
  );
}
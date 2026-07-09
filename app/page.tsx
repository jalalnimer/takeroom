"use client";

import { useMemo, useState } from "react";

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

type Reply = {
  id: number;
  author: string;
  stance: Stance;
  body: string;
};

type Post = {
  id: number;
  type: PostType;
  room: Room;
  topic: string;
  subtopic: string;
  angle: string;
  title: string;
  body: string;
  author: string;
  stance: Stance;
  heat: number;
  replyCount: number;
  agree: number;
  disagree: number;
  replies: Reply[];
};

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
  "Overrated",
  "Underrated",
  "Fallen Off",
  "Better Than",
  "Change My Mind",
  "Prediction",
  "Ranking",
  "Worth It",
  "Who Wins",
  "Hot Take",
];

const roomStructure: Record<Room, { name: string; subtopics: string[] }[]> = {
  Film: [
    {
      name: "Superhero Films",
      subtopics: ["Marvel", "DC", "The Batman", "Spider-Man", "X-Men"],
    },
    {
      name: "Genres",
      subtopics: ["Horror", "Crime", "Drama", "Comedy", "Action"],
    },
    {
      name: "Film Culture",
      subtopics: ["Classics", "Awards Season", "Directors", "Actors"],
    },
  ],
  Television: [
    {
      name: "Streaming Platforms",
      subtopics: ["Netflix", "HBO", "Prime Video", "Disney+", "Apple TV+"],
    },
    {
      name: "Show Types",
      subtopics: ["Drama", "Sitcoms", "Anime", "Reality TV", "Crime Shows"],
    },
  ],
  Sports: [
    {
      name: "Football",
      subtopics: [
        "Premier League",
        "Champions League",
        "World Cup",
        "Ballon d'Or",
        "Player Debates",
      ],
    },
    {
      name: "Combat Sports",
      subtopics: ["UFC", "Boxing", "Title Fights", "GOAT Debates"],
    },
    {
      name: "Other Sports",
      subtopics: ["NBA", "Formula 1", "Tennis", "Transfers"],
    },
  ],
  Politics: [
    {
      name: "Government",
      subtopics: ["Elections", "Leadership", "Policy", "Public Opinion"],
    },
    {
      name: "World Affairs",
      subtopics: ["International Relations", "Economy", "Conflict", "Diplomacy"],
    },
  ],
  Society: [
    {
      name: "Modern Life",
      subtopics: ["Education", "Work Culture", "Money & Success", "Lifestyle"],
    },
    {
      name: "People & Behavior",
      subtopics: ["Relationships", "Identity", "Social Pressure", "Generations"],
    },
  ],
  "Media & Culture": [
    {
      name: "Internet Culture",
      subtopics: ["TikTok", "YouTube", "Influencers", "Memes"],
    },
    {
      name: "Public Conversation",
      subtopics: ["News", "Celebrities", "Cancel Culture", "Online Debates"],
    },
  ],
  Music: [
    {
      name: "Genres",
      subtopics: ["Hip-Hop", "R&B", "Pop", "Rock", "Afrobeats"],
    },
    {
      name: "Music Culture",
      subtopics: ["Albums", "Artists", "Concerts", "Rankings"],
    },
  ],
  Gaming: [
    {
      name: "Platforms",
      subtopics: ["PlayStation", "Xbox", "PC Gaming", "Nintendo"],
    },
    {
      name: "Game Types",
      subtopics: ["Story Games", "Esports", "Open World", "Online Multiplayer"],
    },
  ],
};

const roomPulse: Record<Room, string[]> = {
  Film: [
    "🔥 Marvel fatigue",
    "🎬 Best actor working today",
    "⭐ Overrated classics",
    "🍿 Best film of the 2020s",
  ],
  Television: [
    "📺 HBO vs Netflix",
    "🔥 Best ending ever",
    "🎭 Best anti-hero",
    "⭐ Shows that fell off",
  ],
  Sports: [
    "⚽ Ballon d'Or debate",
    "🔥 Haaland big games",
    "🏆 World Cup predictions",
    "🥊 UFC title fights",
  ],
  Politics: [
    "🗳️ Youth voting",
    "🌍 World leadership",
    "📊 Public trust",
    "⚖️ Policy vs personality",
  ],
  Society: [
    "🎓 Are degrees worth it?",
    "💼 Work culture",
    "💰 Money pressure",
    "📱 Social media behavior",
  ],
  "Media & Culture": [
    "📱 TikTok attention span",
    "🎥 Influencer culture",
    "📰 News trust",
    "🔥 Cancel culture debates",
  ],
  Music: [
    "🎧 Album rankings",
    "🔥 Best rapper debate",
    "🎤 Concert prices",
    "⭐ Artists who fell off",
  ],
  Gaming: [
    "🎮 Story games vs online",
    "🔥 Console wars",
    "🏆 Esports debate",
    "🕹️ Games worth buying",
  ],
};

const starterPosts: Post[] = [
  {
    id: 1,
    type: "Debate",
    room: "Film",
    topic: "Superhero Films",
    subtopic: "Marvel",
    angle: "Fallen Off",
    title: "Has Marvel lost its cultural power after Endgame?",
    body: "The movies still get attention, but the excitement does not feel the same anymore.",
    author: "Jalal",
    stance: "Convince Me",
    heat: 91,
    replyCount: 42,
    agree: 64,
    disagree: 36,
    replies: [
      {
        id: 101,
        author: "Omar",
        stance: "Agree",
        body: "The hype is not completely gone, but it definitely does not feel like an event anymore.",
      },
      {
        id: 102,
        author: "Sara",
        stance: "Disagree",
        body: "I think people still care. They just became more selective with what they watch.",
      },
    ],
  },
  {
    id: 2,
    type: "Opinion",
    room: "Sports",
    topic: "Football",
    subtopic: "Player Debates",
    angle: "Hot Take",
    title: "Football debates are sometimes better than the match itself",
    body: "The arguments, predictions, and reactions after games can be more entertaining than the actual 90 minutes.",
    author: "Omar",
    stance: "Agree",
    heat: 78,
    replyCount: 26,
    agree: 72,
    disagree: 28,
    replies: [
      {
        id: 201,
        author: "Adam",
        stance: "Mixed",
        body: "Depends on the match. Some games are boring, but the debates after are always funny.",
      },
    ],
  },
  {
    id: 3,
    type: "Review",
    room: "Television",
    topic: "Streaming Platforms",
    subtopic: "HBO",
    angle: "Better Than",
    title: "Prestige television still feels stronger than most streaming originals",
    body: "Some platforms release a lot of shows, but only a few feel like they will be remembered years later.",
    author: "Sara",
    stance: "Mixed",
    heat: 84,
    replyCount: 31,
    agree: 55,
    disagree: 45,
    replies: [],
  },
  {
    id: 4,
    type: "Debate",
    room: "Media & Culture",
    topic: "Internet Culture",
    subtopic: "TikTok",
    angle: "Change My Mind",
    title: "Short-form content made people worse at real discussions",
    body: "Everything becomes a quick reaction instead of a real conversation.",
    author: "Nadine",
    stance: "Agree",
    heat: 96,
    replyCount: 58,
    agree: 68,
    disagree: 32,
    replies: [],
  },
  {
    id: 5,
    type: "Question",
    room: "Society",
    topic: "Modern Life",
    subtopic: "Education",
    angle: "Worth It",
    title: "Are degrees still worth the same as they used to be?",
    body: "A lot of people are studying for years, but the job market feels more confusing than before.",
    author: "Adam",
    stance: "Mixed",
    heat: 73,
    replyCount: 19,
    agree: 52,
    disagree: 48,
    replies: [],
  },
  {
    id: 6,
    type: "Poll",
    room: "Music",
    topic: "Music Culture",
    subtopic: "Albums",
    angle: "Ranking",
    title: "Do albums still matter in the streaming era?",
    body: "Some listeners still care about full projects, but many people only follow singles and playlists now.",
    author: "Maya",
    stance: "Convince Me",
    heat: 80,
    replyCount: 22,
    agree: 59,
    disagree: 41,
    replies: [],
  },
  {
    id: 7,
    type: "Opinion",
    room: "Gaming",
    topic: "Game Types",
    subtopic: "Story Games",
    angle: "Better Than",
    title: "Story games create stronger memories than online multiplayer",
    body: "Online games are fun, but a strong story can stay with you for years.",
    author: "Kareem",
    stance: "Agree",
    heat: 69,
    replyCount: 15,
    agree: 75,
    disagree: 25,
    replies: [],
  },
  {
    id: 8,
    type: "Debate",
    room: "Politics",
    topic: "Government",
    subtopic: "Leadership",
    angle: "Who Wins",
    title: "Do people vote for policies or personalities?",
    body: "Sometimes campaigns feel more focused on image, emotion, and identity than actual plans.",
    author: "Lina",
    stance: "Convince Me",
    heat: 88,
    replyCount: 37,
    agree: 61,
    disagree: 39,
    replies: [],
  },
];

function getFirstTopic(room: Room) {
  return roomStructure[room][0].name;
}

function getFirstSubtopic(room: Room, topic: string) {
  return (
    roomStructure[room].find((item) => item.name === topic)?.subtopics[0] || ""
  );
}

function getSubtopics(room: Room, topic: string) {
  return roomStructure[room].find((item) => item.name === topic)?.subtopics || [];
}

export default function Home() {
  const [selectedType, setSelectedType] = useState<PostType | "For You">(
    "For You"
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | "All Rooms">(
    "All Rooms"
  );
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedAngle, setSelectedAngle] = useState("All Angles");

  const [posts, setPosts] = useState<Post[]>(starterPosts);

  const [newType, setNewType] = useState<PostType>("Debate");
  const [newRoom, setNewRoom] = useState<Room>("Film");
  const [newTopic, setNewTopic] = useState(getFirstTopic("Film"));
  const [newSubtopic, setNewSubtopic] = useState(
    getFirstSubtopic("Film", getFirstTopic("Film"))
  );
  const [newAngle, setNewAngle] = useState("Hot Take");
  const [newStance, setNewStance] = useState<Stance>("Convince Me");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyStance, setReplyStance] = useState<Record<number, Stance>>({});

  const availableTopics =
    selectedRoom === "All Rooms"
      ? []
      : roomStructure[selectedRoom].map((topic) => topic.name);

  const pulseItems =
    selectedRoom === "All Rooms"
      ? [
          "🔥 Most divided takes today",
          "⚖️ Best arguments from all rooms",
          "📊 Polls getting attention",
          "💬 Debates people are joining",
        ]
      : roomPulse[selectedRoom];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const typeMatch =
        selectedType === "For You" ? true : post.type === selectedType;
      const roomMatch =
        selectedRoom === "All Rooms" ? true : post.room === selectedRoom;
      const topicMatch =
        selectedTopic === "All Topics" ? true : post.topic === selectedTopic;
      const angleMatch =
        selectedAngle === "All Angles" ? true : post.angle === selectedAngle;

      return typeMatch && roomMatch && topicMatch && angleMatch;
    });
  }, [posts, selectedType, selectedRoom, selectedTopic, selectedAngle]);

  function chooseAction(type: PostType) {
    setSelectedType(type);
    setNewType(type);
  }

  function handleSelectRoom(room: Room | "All Rooms") {
    setSelectedRoom(room);
    setSelectedTopic("All Topics");
  }

  function handleNewRoomChange(room: Room) {
    const firstTopic = getFirstTopic(room);
    const firstSubtopic = getFirstSubtopic(room, firstTopic);

    setNewRoom(room);
    setNewTopic(firstTopic);
    setNewSubtopic(firstSubtopic);
  }

  function handleNewTopicChange(topic: string) {
    setNewTopic(topic);
    setNewSubtopic(getFirstSubtopic(newRoom, topic));
  }

  function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      return;
    }

    const agree = Math.floor(Math.random() * 45) + 35;
    const disagree = 100 - agree;

    const newPost: Post = {
      id: Date.now(),
      type: newType,
      room: newRoom,
      topic: newTopic,
      subtopic: newSubtopic,
      angle: newAngle,
      title,
      body,
      author: "You",
      stance: newStance,
      heat: Math.floor(Math.random() * 30) + 70,
      replyCount: 0,
      agree,
      disagree,
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    setBody("");
  }

  function handleCreateReply(
    event: React.FormEvent<HTMLFormElement>,
    postId: number
  ) {
    event.preventDefault();

    const text = replyText[postId];

    if (!text || !text.trim()) {
      return;
    }

    const stance = replyStance[postId] || "Agree";

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const newReply: Reply = {
          id: Date.now(),
          author: "You",
          stance,
          body: text,
        };

        return {
          ...post,
          replyCount: post.replyCount + 1,
          replies: [newReply, ...post.replies],
        };
      })
    );

    setReplyText({
      ...replyText,
      [postId]: "",
    });
  }

  return (
    <main className="min-h-screen bg-black pb-20 text-white lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
          <div>
            <p className="text-xl font-black tracking-tight">TakeRoom</p>
            <p className="text-xs text-zinc-500">
              Find out where the room stands.
            </p>
          </div>

          <div className="hidden flex-1 md:block">
            <input
              placeholder="Search rooms, topics, takes, reviews, debates..."
              className="w-full rounded-full border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
            />
          </div>

          <button className="rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600">
            Create
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[230px_1fr_320px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
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
                How it works
              </h2>
              <p className="text-sm leading-6 text-zinc-400">
                Pick a <span className="font-bold text-white">Room</span>, then
                choose a <span className="font-bold text-white">Topic</span>, a{" "}
                <span className="font-bold text-white">Subtopic</span>, and a{" "}
                <span className="font-bold text-white">Debate Angle</span>.
              </p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6 md:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-400">
              Post a take • Pick a side • Change minds
            </p>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Debate by rooms, topics, and sides.
            </h1>

            <p className="mt-5 max-w-2xl text-zinc-400">
              TakeRoom organizes opinions by what people want to do, what they
              are talking about, and where they stand.
            </p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {postTypes.map((type) => (
              <button
                key={type}
                onClick={() => chooseAction(type)}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-orange-500 hover:bg-zinc-900"
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
                  {type === "Debate" && "Challenge a take and let people argue."}
                  {type === "Opinion" && "Share a short personal view."}
                  {type === "Review" && "Rate and explain something."}
                  {type === "Poll" && "Let the room vote."}
                  {type === "Question" && "Ask what others think."}
                </p>
              </button>
            ))}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("For You")}
                className={`rounded-full px-4 py-2 text-sm font-black ${
                  selectedType === "For You"
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                For You
              </button>

              {postTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-black ${
                    selectedType === type
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="mb-4 grid gap-3 md:grid-cols-2">
              <select
                value={selectedTopic}
                onChange={(event) => setSelectedTopic(event.target.value)}
                disabled={selectedRoom === "All Rooms"}
                className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none disabled:text-zinc-600 focus:border-orange-500"
              >
                <option>All Topics</option>
                {availableTopics.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>

              <select
                value={selectedAngle}
                onChange={(event) => setSelectedAngle(event.target.value)}
                className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                <option>All Angles</option>
                {debateAngles.map((angle) => (
                  <option key={angle}>{angle}</option>
                ))}
              </select>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-700 bg-black p-8 text-center">
                <h2 className="text-2xl font-black">No takes here yet.</h2>
                <p className="mt-3 text-zinc-500">
                  Start the first discussion in this room, topic, or angle.
                </p>
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
                        {post.subtopic}
                      </span>
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                        {post.angle}
                      </span>
                      <span className="text-zinc-500">by {post.author}</span>
                    </div>

                    <h2 className="text-2xl font-black">{post.title}</h2>

                    <p className="mt-3 leading-7 text-zinc-400">{post.body}</p>

                    <div className="mt-5 rounded-2xl bg-black p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-black text-white">
                          This Take Split the Room
                        </span>
                        <span className="text-zinc-500">{post.stance}</span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{ width: `${post.agree}%` }}
                        />
                      </div>

                      <div className="mt-2 flex justify-between text-xs text-zinc-500">
                        <span>{post.agree}% Agree</span>
                        <span>{post.disagree}% Disagree</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
                      <span>🔥 {post.heat} heat</span>
                      <span>💬 {post.replyCount} replies</span>
                      <span>⚖️ Join debate</span>
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
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-2xl font-black">Create a take</h2>

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
                onChange={(event) => handleNewRoomChange(event.target.value as Room)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {rooms.map((room) => (
                  <option key={room}>{room}</option>
                ))}
              </select>

              <select
                value={newTopic}
                onChange={(event) => handleNewTopicChange(event.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {roomStructure[newRoom].map((topic) => (
                  <option key={topic.name}>{topic.name}</option>
                ))}
              </select>

              <select
                value={newSubtopic}
                onChange={(event) => setNewSubtopic(event.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {getSubtopics(newRoom, newTopic).map((subtopic) => (
                  <option key={subtopic}>{subtopic}</option>
                ))}
              </select>

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
                placeholder="Title of your take"
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
              />

              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Explain your opinion..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-orange-500"
              />

              <button className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-black text-white hover:bg-orange-600">
                Publish Take
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-black">
              {selectedRoom === "All Rooms" ? "TakeRoom Pulse" : `${selectedRoom} Room Pulse`}
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              {pulseItems.map((item) => (
                <p key={item} className="rounded-2xl bg-zinc-900 p-3">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-black">Trending Angles</h2>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {debateAngles.slice(0, 7).map((angle) => (
                <span
                  key={angle}
                  className="rounded-full bg-zinc-900 px-3 py-2 text-zinc-300"
                >
                  {angle}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-black">Room Rules</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>Debate the idea, not the person.</li>
              <li>No hate speech or threats.</li>
              <li>Choose the correct topic and debate angle.</li>
              <li>Strong opinions are welcome. Personal attacks are not.</li>
            </ul>
          </section>
        </aside>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800 bg-black p-3 lg:hidden">
        <div className="mx-auto flex max-w-md justify-between text-xs font-black text-zinc-400">
          <button>Home</button>
          <button>Debate</button>
          <button className="rounded-full bg-orange-500 px-4 py-2 text-white">
            Share
          </button>
          <button>Review</button>
          <button>Profile</button>
        </div>
      </nav>
    </main>
  );
}
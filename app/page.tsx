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
  subtopic: string;
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

const subtopics: Record<Room, string[]> = {
  Film: ["Marvel", "DC", "Horror", "Crime", "Classics", "Awards Season"],
  Television: ["Netflix", "HBO", "Anime", "Sitcoms", "Drama", "Reality TV"],
  Sports: [
    "Football",
    "NBA",
    "UFC",
    "Formula 1",
    "Champions League",
    "World Cup",
  ],
  Politics: ["Elections", "Policy", "International Relations", "Leadership"],
  Society: ["Education", "Relationships", "Work Culture", "Lifestyle"],
  "Media & Culture": ["TikTok", "YouTube", "Influencers", "News", "Celebrities"],
  Music: ["Hip-Hop", "R&B", "Pop", "Albums", "Artists", "Concerts"],
  Gaming: ["PlayStation", "Xbox", "PC Gaming", "Esports", "Story Games"],
};

const starterPosts: Post[] = [
  {
    id: 1,
    type: "Debate",
    room: "Film",
    subtopic: "Marvel",
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
    subtopic: "Football",
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
    subtopic: "HBO",
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
    subtopic: "TikTok",
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
    subtopic: "Education",
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
    subtopic: "Albums",
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
    subtopic: "Story Games",
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
    subtopic: "Leadership",
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

export default function Home() {
  const [selectedType, setSelectedType] = useState<PostType | "For You">(
    "For You"
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | "All Rooms">(
    "All Rooms"
  );

  const [posts, setPosts] = useState<Post[]>(starterPosts);

  const [newType, setNewType] = useState<PostType>("Debate");
  const [newRoom, setNewRoom] = useState<Room>("Film");
  const [newSubtopic, setNewSubtopic] = useState("Marvel");
  const [newStance, setNewStance] = useState<Stance>("Convince Me");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyStance, setReplyStance] = useState<Record<number, Stance>>({});

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const typeMatch =
        selectedType === "For You" ? true : post.type === selectedType;
      const roomMatch =
        selectedRoom === "All Rooms" ? true : post.room === selectedRoom;

      return typeMatch && roomMatch;
    });
  }, [posts, selectedType, selectedRoom]);

  function chooseAction(type: PostType) {
    setSelectedType(type);
    setNewType(type);
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
      subtopic: newSubtopic,
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
              Debate the take, not the person.
            </p>
          </div>

          <div className="hidden flex-1 md:block">
            <input
              placeholder="Search rooms, takes, reviews, debates..."
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
                  onClick={() => setSelectedRoom("All Rooms")}
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
                    onClick={() => setSelectedRoom(room)}
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
                Unique Feature
              </h2>
              <p className="text-sm leading-6 text-zinc-400">
                <span className="font-bold text-white">Stance Meter</span> shows
                how divided people are instead of only counting likes.
              </p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6 md:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-400">
              Debate • Opinion • Review • Poll • Question
            </p>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              A room for hot takes, reviews, and real debate.
            </h1>

            <p className="mt-5 max-w-2xl text-zinc-400">
              Choose what you want to do, pick a room, filter by subtopic, and
              see where people stand through the Stance Meter.
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

            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-700 bg-black p-8 text-center">
                <h2 className="text-2xl font-black">No takes here yet.</h2>
                <p className="mt-3 text-zinc-500">
                  Start the first discussion in this room.
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
                        {post.subtopic}
                      </span>
                      <span className="text-zinc-500">by {post.author}</span>
                    </div>

                    <h2 className="text-2xl font-black">{post.title}</h2>

                    <p className="mt-3 leading-7 text-zinc-400">{post.body}</p>

                    <div className="mt-5 rounded-2xl bg-black p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-black text-white">
                          Stance Meter
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
                      <h3 className="font-black">Replies</h3>

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
                          <option>Agree</option>
                          <option>Disagree</option>
                          <option>Mixed</option>
                          <option>Convince Me</option>
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

                      <div className="mt-5 space-y-3">
                        {post.replies.length === 0 ? (
                          <p className="text-sm text-zinc-500">
                            No visible replies yet. Be the first to respond.
                          </p>
                        ) : (
                          post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
                            >
                              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                                <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                                  {reply.stance}
                                </span>
                                <span className="text-zinc-500">
                                  by {reply.author}
                                </span>
                              </div>

                              <p className="text-sm leading-6 text-zinc-300">
                                {reply.body}
                              </p>
                            </div>
                          ))
                        )}
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
                onChange={(event) => {
                  const room = event.target.value as Room;
                  setNewRoom(room);
                  setNewSubtopic(subtopics[room][0]);
                }}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {rooms.map((room) => (
                  <option key={room}>{room}</option>
                ))}
              </select>

              <select
                value={newSubtopic}
                onChange={(event) => setNewSubtopic(event.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                {subtopics[newRoom].map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>

              <select
                value={newStance}
                onChange={(event) => setNewStance(event.target.value as Stance)}
                className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-orange-500"
              >
                <option>Agree</option>
                <option>Disagree</option>
                <option>Mixed</option>
                <option>Convince Me</option>
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
            <h2 className="text-xl font-black">Trending Rooms</h2>

            <div className="mt-4 space-y-3 text-sm">
              <p className="rounded-2xl bg-zinc-900 p-3">
                🔥 Film: Marvel fatigue
              </p>
              <p className="rounded-2xl bg-zinc-900 p-3">
                ⚽ Sports: Ballon d&apos;Or debate
              </p>
              <p className="rounded-2xl bg-zinc-900 p-3">
                📱 Media: TikTok culture
              </p>
              <p className="rounded-2xl bg-zinc-900 p-3">
                🎧 Music: Album rankings
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-xl font-black">Room Rules</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>Debate the idea, not the person.</li>
              <li>No hate speech or threats.</li>
              <li>Reviews should explain the rating.</li>
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
"use client";

import { useMemo, useState } from "react";

type Category =
  | "Movies"
  | "Series"
  | "Media"
  | "Politics"
  | "Social Topics"
  | "Sports";

type Post = {
  id: number;
  title: string;
  body: string;
  category: Category;
  author: string;
  heat: number;
  comments: number;
};

const categories: Category[] = [
  "Movies",
  "Series",
  "Media",
  "Politics",
  "Social Topics",
  "Sports",
];

const starterPosts: Post[] = [
  {
    id: 1,
    title: "Marvel movies are becoming too safe",
    body: "They still make money, but most of them feel like the same formula now.",
    category: "Movies",
    author: "Jalal",
    heat: 82,
    comments: 24,
  },
  {
    id: 2,
    title: "Football debates are better than match reviews",
    body: "Sometimes the arguments after the game are more entertaining than the game itself.",
    category: "Sports",
    author: "Omar",
    heat: 71,
    comments: 18,
  },
  {
    id: 3,
    title: "Social media made every opinion feel extreme",
    body: "People are rewarded for saying the wildest version of what they believe.",
    category: "Media",
    author: "Sara",
    heat: 94,
    comments: 41,
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All"
  );

  const [posts, setPosts] = useState<Post[]>(starterPosts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Category>("Movies");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return posts;
    }

    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      title,
      body,
      category,
      author: "You",
      heat: Math.floor(Math.random() * 100),
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    setBody("");
    setCategory("Movies");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-400">
            TakeRoom
          </p>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Share opinions, hot takes, and debates by topic.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-zinc-400">
            A beginner MVP inspired by Reddit, Letterboxd, and Twitter. Filter
            by category, post a take, and start discussions.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  selectedCategory === "All"
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                All
              </button>

              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedCategory(item)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    selectedCategory === item
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 font-bold text-orange-300">
                      {post.category}
                    </span>
                    <span className="text-zinc-500">Posted by {post.author}</span>
                  </div>

                  <h2 className="text-2xl font-black">{post.title}</h2>

                  <p className="mt-3 text-zinc-400">{post.body}</p>

                  <div className="mt-5 flex gap-4 text-sm text-zinc-400">
                    <span>🔥 {post.heat} heat</span>
                    <span>💬 {post.comments} comments</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-black">Share a take</h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Example: The sequel was better"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as Category)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  Your opinion
                </label>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Write your hot take here..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <button className="w-full rounded-xl bg-orange-500 px-4 py-3 font-black text-white hover:bg-orange-600">
                Post take
              </button>
            </form>

            <p className="mt-4 text-sm text-zinc-500">
              For now, posts only stay on the page temporarily. Later we will
              save them in a real database.
            </p>
          </aside>
        </section>
      </section>
    </main>
  );
}
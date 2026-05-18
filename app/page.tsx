"use client";

import React, { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Play, Pause, Square, Mic, BookOpen, Sparkles, Volume2, ChevronLeft, ChevronRight, Home, Library, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StoryBook = {
  id: number;
  title: string;
  author: string;
  age: string;
  category: string;
  cover: string;
  description: string;
  pages: string[];
};

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const books: StoryBook[] = [
  {
    id: 1,
    title: "The Moonlight Garden",
    author: "StoryNest Originals",
    age: "Ages 5–8",
    category: "Adventure",
    cover: "🌙",
    description: "A curious girl discovers a garden that only blooms when the moon is smiling.",
    pages: [
      "Mira loved looking out of her window at night. One evening, the moon seemed brighter than ever, and a silver path appeared in the grass below.",
      "She followed the path to a hidden gate. Behind it was a garden filled with glowing flowers, whispering trees, and tiny lantern bugs.",
      "At the center of the garden, Mira found a sleepy moonflower. It opened slowly and said, 'Kindness is the key that keeps this garden shining.'",
      "Mira promised to return with kind thoughts every night. From then on, the moonlight garden bloomed brighter for everyone in town."
    ]
  },
  {
    id: 2,
    title: "Biko and the Talking Drum",
    author: "StoryNest Originals",
    age: "Ages 6–10",
    category: "Culture",
    cover: "🥁",
    description: "A young boy learns that rhythm can carry messages of courage and friendship.",
    pages: [
      "Biko found an old drum in his grandmother's room. It was small, brown, and covered with patterns that looked like dancing waves.",
      "When he tapped it, the drum answered with a sound like a friendly voice. Boom-ba, boom-ba, it seemed to say, 'Listen closely.'",
      "Biko practiced every day until he could send messages through rhythm. He used the drum to call his friends together and help a lost traveler find the village.",
      "Grandmother smiled and said, 'A drum is not only for music. It is a heart that speaks when words are too small.'"
    ]
  },
  {
    id: 3,
    title: "Nora Builds a Cloud Ship",
    author: "StoryNest Originals",
    age: "Ages 7–11",
    category: "Science",
    cover: "☁️",
    description: "Nora uses imagination and science to build a ship that sails through clouds.",
    pages: [
      "Nora collected paper, string, jars, and tiny fans. She wanted to build a cloud ship, even though everyone said clouds were too soft to sail.",
      "She studied wind, water, and air. She learned that clouds were made of tiny drops floating high above the ground.",
      "Her first ship fell. Her second ship spun in circles. Her third ship lifted gently when warm air filled its silver balloon.",
      "Nora did not reach the clouds that day, but she reached something better: the beginning of a great idea."
    ]
  }
];

export default function StorybookVoiceWebsite() {
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(books[0]);
  const [page, setPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Voice controls ready");
  const totalPages = books.reduce((sum, book) => sum + book.pages.length, 0);
  const recognitionRef = useRef<any>(null);

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const currentText = selectedBook.pages[page];

  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const readCurrentPage = () => {
    stopReading();
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const pauseReading = () => {
    window.speechSynthesis?.pause();
    setIsSpeaking(false);
  };

  const resumeReading = () => {
    window.speechSynthesis?.resume();
    setIsSpeaking(true);
  };

  const nextPage = () => {
    stopReading();
    setPage((p) => Math.min(p + 1, selectedBook.pages.length - 1));
  };

  const previousPage = () => {
    stopReading();
    setPage((p) => Math.max(p - 1, 0));
  };

  const chooseBook = (book: StoryBook) => {
    stopReading();
    setSelectedBook(book);
    setPage(0);
  };

  const startVoiceCommands = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus("Voice commands are not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setVoiceStatus("Listening... Say: read, stop, next page, or previous page");
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setVoiceStatus(`Heard: ${command}`);
      if (command.includes("read") || command.includes("play")) readCurrentPage();
      else if (command.includes("stop")) stopReading();
      else if (command.includes("pause")) pauseReading();
      else if (command.includes("resume")) resumeReading();
      else if (command.includes("next")) nextPage();
      else if (command.includes("previous") || command.includes("back")) previousPage();
      else setVoiceStatus("Command not recognized. Try: read, stop, next page, previous page.");
    };
    recognition.onerror = () => setVoiceStatus("Voice command failed. Please try again.");
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm">📚</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">StoryNest Voice</h1>
              <p className="text-sm text-slate-500">Read, listen, and explore stories</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
            <a href="#home" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900">
              <Home className="h-4 w-4" /> Home
            </a>
            <a href="#library" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900">
              <Library className="h-4 w-4" /> Library
            </a>
            <a href="#reader" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900">
              <BookOpen className="h-4 w-4" /> Reader
            </a>
            <a href="#upload" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900">
              <Upload className="h-4 w-4" /> Add Books
            </a>
          </nav>

          <Button onClick={startVoiceCommands} variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50">
            <Mic className="mr-2 h-4 w-4" /> Voice Command
          </Button>
        </div>
      </header>

      <section id="home" className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl md:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-amber-100">
              <Sparkles className="h-4 w-4" /> Voice-powered story reading
            </div>
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">Discover stories children can read and hear.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              StoryNest Voice helps readers explore original storybooks, listen to narration, and move through pages with simple voice commands.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#library" className="rounded-2xl bg-amber-400 px-6 py-3 text-center font-bold text-slate-950 hover:bg-amber-300">Browse Library</a>
              <a href="#reader" className="rounded-2xl border border-white/20 px-6 py-3 text-center font-bold text-white hover:bg-white/10">Continue Reading</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Card className="rounded-3xl border-0 shadow-lg"><CardContent className="p-6"><p className="text-3xl font-black">{books.length}</p><p className="text-sm text-slate-500">Storybooks available</p></CardContent></Card>
            <Card className="rounded-3xl border-0 shadow-lg"><CardContent className="p-6"><p className="text-3xl font-black">{totalPages}</p><p className="text-sm text-slate-500">Readable pages</p></CardContent></Card>
            <Card className="rounded-3xl border-0 shadow-lg"><CardContent className="p-6"><p className="text-3xl font-black">Voice</p><p className="text-sm text-slate-500">Read aloud + commands</p></CardContent></Card>
          </motion.div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or category..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <section id="library" className="space-y-5 scroll-mt-28">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Story Library</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search stories..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 outline-none focus:border-amber-400"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <motion.button
                key={book.id}
                onClick={() => chooseBook(book)}
                whileHover={{ scale: 1.01 }}
                className={`w-full rounded-3xl border p-4 text-left shadow-sm transition ${selectedBook.id === book.id ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
              >
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-4xl">{book.cover}</div>
                  <div className="flex-1">
                    <h3 className="font-bold">{book.title}</h3>
                    <p className="text-sm text-slate-500">{book.age} • {book.category}</p>
                    <p className="mt-2 text-sm text-slate-600">{book.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="reader" className="scroll-mt-28">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden rounded-[2rem] border-0 shadow-xl">
              <div className="bg-slate-900 px-6 py-7 text-white">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-amber-200">
                      <BookOpen className="h-5 w-5" />
                      <span className="text-sm font-medium">Now Reading</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight md:text-4xl">{selectedBook.title}</h2>
                    <p className="mt-2 text-slate-300">By {selectedBook.author}</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-white/90">
                    Page {page + 1} of {selectedBook.pages.length}
                  </div>
                </div>
              </div>

              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="rounded-[2rem] bg-amber-50 p-6 md:p-8">
                  <p className="text-xl leading-9 text-slate-800 md:text-2xl md:leading-10">{currentText}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Button onClick={readCurrentPage} variant="outline" className="rounded-2xl border-amber-400 bg-amber-50 py-6 text-base text-slate-900 hover:bg-amber-100">
                    <Play className="mr-2 h-5 w-5" /> Read Aloud
                  </Button>
                  <Button onClick={pauseReading} variant="outline" className="rounded-2xl border-slate-300 bg-white py-6 text-base text-slate-900 hover:bg-slate-50">
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </Button>
                  <Button onClick={resumeReading} variant="outline" className="rounded-2xl border-green-300 bg-green-50 py-6 text-base text-green-800 hover:bg-green-100">
                    <Volume2 className="mr-2 h-5 w-5" /> Resume
                  </Button>
                  <Button onClick={stopReading} variant="outline" className="rounded-2xl border-red-300 bg-red-50 py-6 text-base text-red-700 hover:bg-red-100">
                    <Square className="mr-2 h-5 w-5" /> Stop
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4 md:flex-row">
                  <Button onClick={previousPage} disabled={page === 0} variant="ghost" className="rounded-2xl text-slate-700 hover:bg-white disabled:text-slate-400">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Page
                  </Button>
                  <p className="text-center text-sm text-slate-500">{voiceStatus}</p>
                  <Button onClick={nextPage} disabled={page === selectedBook.pages.length - 1} variant="ghost" className="rounded-2xl text-slate-700 hover:bg-white disabled:text-slate-400">
                    Next Page <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      <section id="upload" className="mx-auto max-w-7xl px-4 pb-12 scroll-mt-28">
        <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">✍️</div>
              <div>
                <h2 className="text-2xl font-black">Add More Books</h2>
                <p className="text-slate-500">For now, add books inside the code. Next, we can upgrade this into a real admin upload dashboard.</p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              <p><strong>Current method:</strong> open <code>app/page.tsx</code>, find <code>const books</code>, and add a new book object.</p>
              <p><strong>Advanced method coming next:</strong> connect a database so you can upload books from a form without touching code.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

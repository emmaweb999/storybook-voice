"use client";
import React, { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Play, Pause, Square, Mic, BookOpen, Sparkles, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
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
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-2xl shadow-sm">📚</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">StoryNest Voice</h1>
              <p className="text-sm text-slate-500">Read, listen, and explore stories</p>
            </div>
          </div>
          <Button onClick={startVoiceCommands} className="rounded-2xl">
            <Mic className="mr-2 h-4 w-4" /> Voice Command
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <section className="space-y-5">
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

        <section>
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
                  <button
                  onClick={readCurrentPage}
                  className="rounded-2xl border border-amber-400 bg-amber-50 py-4 text-black hover:bg-amber-100"
                  >
                    ▶ Read Aloud
                    </button>
                    <button
                    onClick={pauseReading}
                    className="rounded-2xl border border-slate-300 bg-white py-4 text-black hover:bg-slate-100"
                    >
                   ⏸ Pause
                    </button>
                      <button
                      onClick={resumeReading}
                      className="rounded-2xl border border-green-300 bg-green-50 py-4 text-green-800 hover:bg-green-100"
                    >
                   🔊 Resume
                    </button>
                    <button
                    onClick={stopReading}
                    className="rounded-2xl border border-red-300 bg-red-50 py-4 text-red-700 hover:bg-red-100"
                    >
                      ⏹ Stop
                    </button>
                      
                </div>

                <div className="flex flex-col items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4 md:flex-row">
                  <Button onClick={previousPage} disabled={page === 0} variant="ghost" className="rounded-2xl">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Page
                  </Button>
                  <p className="text-center text-sm text-slate-500">{voiceStatus}</p>
                  <Button onClick={nextPage} disabled={page === selectedBook.pages.length - 1} variant="ghost" className="rounded-2xl">
                    Next Page <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

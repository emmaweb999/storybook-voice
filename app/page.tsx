"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  Search,
  Play,
  Pause,
  Square,
  Mic,
  BookOpen,
  Sparkles,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Home,
  Library,
  Upload,
  Lock,
  LogOut,
  FileText,
  ExternalLink,
  Languages,
  UserRound,
  Clock3,
  Star,
  BookMarked
} from "lucide-react";
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
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
};

type LanguageOption = {
  code: string;
  name: string;
};

type UiText = {
  home: string;
  library: string;
  reader: string;
  myBooks: string;
  login: string;
  admin: string;
  logout: string;
  voiceCommand: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  browseLibrary: string;
  continueReading: string;
  storybooksAvailable: string;
  readablePages: string;
  voiceFeature: string;
  searchMain: string;
  searchStories: string;
  storyLibrary: string;
  nowReading: string;
  by: string;
  page: string;
  of: string;
  readAloud: string;
  pause: string;
  resume: string;
  stop: string;
  previousPage: string;
  nextPage: string;
  previewEnded: string;
  previewNotice: string;
  fullAccess: string;
  readerAccount: string;
  accountDescription: string;
  createAccount: string;
  emailAddress: string;
  password: string;
  signUp: string;
  signedInAs: string;
  adminAccess: string;
  adminDashboard: string;
  adminDescription: string;
  bookTitle: string;
  author: string;
  ageRange: string;
  category: string;
  emojiCover: string;
  shortDescription: string;
  uploadFile: string;
  selected: string;
  writePages: string;
  uploadBook: string;
  openFile: string;
  guestTitle: string;
  guestDescription: string;
  previewOnly: string;
  featuredBooks: string;
  recommended: string;
  popular: string;
  progress: string;
  noProgress: string;
  startReading: string;
  keepReading: string;
};

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const defaultUi: UiText = {
  home: "Home",
  library: "Library",
  reader: "Reader",
  myBooks: "Your Books",
  login: "Login",
  admin: "Admin",
  logout: "Logout",
  voiceCommand: "Voice Command",
  heroBadge: "Voice-powered story reading",
  heroTitle: "Discover stories children can read and hear.",
  heroDescription: "StoryNest Voice helps readers explore original storybooks, listen to narration, and move through pages with simple voice commands.",
  browseLibrary: "Browse Library",
  continueReading: "Continue Reading",
  storybooksAvailable: "Storybooks available",
  readablePages: "Readable pages",
  voiceFeature: "Read aloud + commands",
  searchMain: "Search by title, author, or category...",
  searchStories: "Search stories...",
  storyLibrary: "Story Library",
  nowReading: "Now Reading",
  by: "By",
  page: "Page",
  of: "of",
  readAloud: "Read Aloud",
  pause: "Pause",
  resume: "Resume",
  stop: "Stop",
  previousPage: "Previous Page",
  nextPage: "Next Page",
  previewEnded: "Preview ended. Please create a free account or log in to continue reading this book.",
  previewNotice: "You are reading a free preview",
  fullAccess: "Log in or create an account for full access.",
  readerAccount: "Reader Account",
  accountDescription: "Visitors can preview less than 20% of a book. Logged-in readers get full access.",
  createAccount: "Create Account",
  emailAddress: "Email address",
  password: "Password",
  signUp: "Sign Up",
  signedInAs: "Signed in as",
  adminAccess: "Admin access enabled.",
  adminDashboard: "Admin Dashboard: Upload a Book",
  adminDescription: "Uploaded books and files save permanently in Supabase.",
  bookTitle: "Book title",
  author: "Author",
  ageRange: "Age range",
  category: "Category",
  emojiCover: "Emoji cover",
  shortDescription: "Short book description",
  uploadFile: "Upload PDF, Word, EPUB, or TXT",
  selected: "Selected",
  writePages: `Write your book pages here.

Separate each page with --- on its own line.

Example:
Page one text...
---
Page two text...`,
  uploadBook: "Upload Book",
  openFile: "Open uploaded file",
  guestTitle: "Read a short preview before signing in.",
  guestDescription: "Create a free account to unlock full books, save reading progress, and continue from where you stopped.",
  previewOnly: "Guest preview is limited to less than 20% of each book.",
  featuredBooks: "Featured Books",
  recommended: "Recommended for You",
  popular: "Popular Stories",
  progress: "Progress",
  noProgress: "No reading progress yet.",
  startReading: "Start Reading",
  keepReading: "Keep Reading"
};

const sampleBooks: StoryBook[] = [
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

function getVoiceLocale(language: string) {
  const map: Record<string, string> = {
    en: "en-US",
    fi: "fi-FI",
    fr: "fr-FR",
    es: "es-ES",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
    "pt-br": "pt-BR",
    nl: "nl-NL",
    pl: "pl-PL",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN"
  };

  return map[language.toLowerCase()] || "en-US";
}

function BookStoreCard({ book, progress, onOpen, actionLabel }: { book: StoryBook; progress: number; onOpen: () => void; actionLabel: string }) {
  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ y: -4 }}
      className="group rounded-[1.75rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-xl"
    >
      <div className="flex h-44 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-slate-100 text-7xl">
        {book.cover}
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-black leading-tight text-slate-950 group-hover:text-amber-700">{book.title}</h3>
          <Star className="h-4 w-4 shrink-0 text-amber-500" />
        </div>
        <p className="text-sm text-slate-500">{book.author}</p>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{book.description}</p>
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">{book.category}</span>
          <span>{book.age}</span>
        </div>
        {progress > 0 && (
          <div className="pt-2">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{progress}% complete</p>
          </div>
        )}
        <div className="pt-2 text-sm font-bold text-slate-900">{actionLabel} →</div>
      </div>
    </motion.button>
  );
}

export default function StorybookVoiceWebsite() {
  const [books, setBooks] = useState<StoryBook[]>(sampleBooks);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([
    { code: "en", name: "English" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" }
  ]);
  const [selectedBook, setSelectedBook] = useState<StoryBook>(sampleBooks[0]);
  const [page, setPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Voice controls ready");
  const [translationStatus, setTranslationStatus] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [translatedUi, setTranslatedUi] = useState<UiText>(defaultUi);
  const [translatedBook, setTranslatedBook] = useState<StoryBook>(sampleBooks[0]);
  const [readingProgress, setReadingProgress] = useState<Record<number, number>>({});
  const [newBook, setNewBook] = useState({
    title: "",
    author: "StoryNest Originals",
    age: "Ages 5–8",
    category: "Adventure",
    cover: "📘",
    description: "",
    pagesText: ""
  });

  const recognitionRef = useRef<any>(null);
  const isAdmin = Boolean(session?.user?.email && session.user.email === adminEmail);
  const isLoggedIn = Boolean(session?.user?.email);
  const userDisplayName = isAdmin ? "Administrator" : session?.user?.email?.split("@")[0] || "Reader";
  const t = translatedUi;
  const selectedBookText = translatedBook;
  const totalPages = books.reduce((sum, book) => sum + book.pages.length, 0);
  const previewPageLimit = Math.max(1, Math.floor(selectedBookText.pages.length * 0.19));
  const currentText = selectedBookText.pages[page] || "";
  const canReadCurrentPage = isLoggedIn || page < previewPageLimit;
  const visibleText = canReadCurrentPage ? currentText : t.previewEnded;

  useEffect(() => {
    const setup = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      await loadBooks();
    };

    setup();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("storybook-progress");
    if (saved) setReadingProgress(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!selectedBook?.id || selectedBookText.pages.length === 0) return;
    const percent = Math.round(((page + 1) / selectedBookText.pages.length) * 100);
    setReadingProgress((current) => {
      const next = { ...current, [selectedBook.id]: Math.max(current[selectedBook.id] || 0, percent) };
      localStorage.setItem("storybook-progress", JSON.stringify(next));
      return next;
    });
  }, [page, selectedBook.id, selectedBookText.pages.length]);

  useEffect(() => {
    const loadDeepLLanguages = async () => {
      try {
        const response = await fetch("/api/deepl-languages");
        const data = await response.json();
        if (response.ok && Array.isArray(data.languages)) setLanguageOptions(data.languages);
      } catch (error) {
        console.error("Could not load DeepL languages:", error);
      }
    };
    loadDeepLLanguages();
  }, []);

  useEffect(() => {
    const translateOne = async (text: string, targetLanguage: string) => {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: targetLanguage.toUpperCase() })
      });

      const rawResponse = await response.text();
      try {
        const data = JSON.parse(rawResponse);
        return response.ok && data.translatedText ? data.translatedText : text;
      } catch {
        return text;
      }
    };

    const translateAll = async () => {
      setPage(0);
      if (language === "en") {
        setTranslatedUi(defaultUi);
        setTranslatedBook(selectedBook);
        setTranslationStatus("");
        return;
      }

      try {
        setTranslationStatus("Translating with DeepL...");
        const uiKeys = Object.keys(defaultUi) as Array<keyof UiText>;
        const uiTranslations = await Promise.all(uiKeys.map((key) => translateOne(defaultUi[key], language)));
        const nextUi = uiKeys.reduce((result, key, index) => {
          result[key] = uiTranslations[index];
          return result;
        }, {} as UiText);
        const translatedPages = await Promise.all(selectedBook.pages.map((storyPage) => translateOne(storyPage, language)));
        const nextBook: StoryBook = {
          ...selectedBook,
          title: await translateOne(selectedBook.title, language),
          age: await translateOne(selectedBook.age, language),
          category: await translateOne(selectedBook.category, language),
          description: await translateOne(selectedBook.description, language),
          pages: translatedPages
        };
        setTranslatedUi(nextUi);
        setTranslatedBook(nextBook);
        setTranslationStatus("Translated with DeepL.");
      } catch {
        setTranslatedUi(defaultUi);
        setTranslatedBook(selectedBook);
        setTranslationStatus("Translation failed. Check /api/translate and your DeepL key.");
      }
    };
    translateAll();
  }, [language, selectedBook]);

  const loadBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("id,title,author,age,category,cover,description,pages,file_url,file_name,file_type")
      .order("created_at", { ascending: false });
    if (error) return;
    if (data && data.length > 0) {
      const cloudBooks = data as StoryBook[];
      setBooks(cloudBooks);
      setSelectedBook(cloudBooks[0]);
      setTranslatedBook(cloudBooks[0]);
      setPage(0);
    }
  };

  const loginUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthMessage(authMode === "login" ? "Signing in..." : "Creating account...");
    const response = authMode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (response.error) {
      setAuthMessage(response.error.message);
      return;
    }
    setAuthMessage(authMode === "login" ? "Signed in successfully." : "Account created. Check your email if confirmation is required.");
    setPassword("");
  };

  const logoutUser = async () => {
    await supabase.auth.signOut();
    setAuthMessage("Signed out.");
  };

  const addBook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin) {
      setAdminMessage("Only the admin account can upload books.");
      return;
    }
    const pages = newBook.pagesText.split("\n---\n").map((bookPage) => bookPage.trim()).filter(Boolean);
    if (!newBook.title.trim() || !newBook.description.trim()) {
      setAdminMessage("Please add a title and description.");
      return;
    }
    if (pages.length === 0 && !selectedFile) {
      setAdminMessage("Please add story text pages or upload a book file.");
      return;
    }

    let fileUrl = null;
    let fileName = null;
    let fileType = null;
    if (selectedFile) {
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const filePath = `${Date.now()}-${safeName}`;
      setAdminMessage("Uploading file...");
      const { error: uploadError } = await supabase.storage.from("book-files").upload(filePath, selectedFile, { upsert: false });
      if (uploadError) {
        setAdminMessage(uploadError.message);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from("book-files").getPublicUrl(filePath);
      fileUrl = publicUrlData.publicUrl;
      fileName = selectedFile.name;
      fileType = selectedFile.type || "unknown";
    }

    const bookToSave = {
      title: newBook.title.trim(),
      author: newBook.author.trim() || "Unknown Author",
      age: newBook.age.trim() || "All ages",
      category: newBook.category.trim() || "General",
      cover: newBook.cover.trim() || "📘",
      description: newBook.description.trim(),
      pages: pages.length > 0 ? pages : ["This book was uploaded as a file. Open the file below to read it."],
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType
    };
    setAdminMessage("Uploading book...");
    const { data, error } = await supabase.from("books").insert(bookToSave).select("id,title,author,age,category,cover,description,pages,file_url,file_name,file_type").single();
    if (error) {
      setAdminMessage(error.message);
      return;
    }
    const savedBook = data as StoryBook;
    setBooks((currentBooks) => [savedBook, ...currentBooks]);
    setSelectedBook(savedBook);
    setTranslatedBook(savedBook);
    setPage(0);
    setNewBook({ title: "", author: "StoryNest Originals", age: "Ages 5–8", category: "Adventure", cover: "📘", description: "", pagesText: "" });
    setSelectedFile(null);
    setAdminMessage("Book uploaded successfully.");
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase()));
  }, [books, query]);

  const booksWithProgress = books.filter((book) => (readingProgress[book.id] || 0) > 0);

  const openBook = (book: StoryBook) => {
    stopReading();
    setSelectedBook(book);
    setTranslatedBook(book);
    setPage(0);
    setTimeout(() => document.getElementById("reader")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const readCurrentPage = () => {
    if (!canReadCurrentPage) {
      setVoiceStatus("Please log in to continue listening to this book.");
      return;
    }
    stopReading();
    const utterance = new SpeechSynthesisUtterance(visibleText);
    utterance.lang = getVoiceLocale(language);
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
    setPage((p) => Math.min(p + 1, selectedBookText.pages.length - 1));
  };

  const previousPage = () => {
    stopReading();
    setPage((p) => Math.max(p - 1, 0));
  };

  const startVoiceCommands = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus("Voice commands are not supported in this browser. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = getVoiceLocale(language);
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
              <p className="text-sm text-slate-500">{t.heroBadge}</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
            <a href="#home" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900"><Home className="h-4 w-4" /> {t.home}</a>
            <a href="#library" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900"><Library className="h-4 w-4" /> {t.library}</a>
            {isLoggedIn && <a href="#my-books" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900"><BookMarked className="h-4 w-4" /> {t.myBooks}</a>}
            <a href="#reader" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900"><BookOpen className="h-4 w-4" /> {t.reader}</a>
            <a href="#account" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900"><Lock className="h-4 w-4" /> {isLoggedIn ? userDisplayName : t.login}</a>
            {isAdmin && <a href="#admin" className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-amber-50 hover:text-slate-900"><Upload className="h-4 w-4" /> {t.admin}</a>}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <Languages className="h-4 w-4" />
              <select value={language} onChange={(e) => setLanguage(e.target.value.toLowerCase())} className="bg-transparent outline-none">
                {languageOptions.map((lang) => <option key={lang.code} value={lang.code.toLowerCase()}>{lang.name}</option>)}
              </select>
            </label>
            {isLoggedIn && <Button onClick={logoutUser} variant="outline" className="rounded-2xl border-red-300 bg-red-50 text-red-700 hover:bg-red-100"><LogOut className="mr-2 h-4 w-4" /> {t.logout}</Button>}
            <Button onClick={startVoiceCommands} variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"><Mic className="mr-2 h-4 w-4" /> {t.voiceCommand}</Button>
          </div>
        </div>
      </header>

      <section id="home" className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {!isLoggedIn ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Card className="rounded-[2rem] border-0 bg-slate-900 text-white shadow-xl">
              <CardContent className="p-8 md:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-amber-100"><Lock className="h-4 w-4" /> {t.previewOnly}</div>
                <h2 className="text-4xl font-black tracking-tight md:text-5xl">{t.guestTitle}</h2>
                <p className="mt-5 text-lg leading-8 text-slate-300">{t.guestDescription}</p>
                <form onSubmit={loginUser} className="mt-8 space-y-4 rounded-[1.5rem] bg-white/10 p-5">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setAuthMode("login")} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${authMode === "login" ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"}`}>{t.login}</button>
                    <button type="button" onClick={() => setAuthMode("signup")} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${authMode === "signup" ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"}`}>{t.createAccount}</button>
                  </div>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={t.emailAddress} className="w-full rounded-2xl border border-white/20 bg-white p-4 text-slate-900 outline-none" />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder={t.password} className="w-full rounded-2xl border border-white/20 bg-white p-4 text-slate-900 outline-none" />
                  <Button type="submit" className="w-full rounded-2xl bg-amber-400 py-6 font-black text-slate-950 hover:bg-amber-300">{authMode === "login" ? t.login : t.signUp}</Button>
                  {authMessage && <p className="text-sm text-amber-100">{authMessage}</p>}
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h3 className="mb-5 text-2xl font-black">{t.featuredBooks}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {books.slice(0, 4).map((book) => (
                    <button key={book.id} onClick={() => openBook(book)} className="rounded-3xl border border-slate-200 bg-white p-4 text-left hover:bg-amber-50">
                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-4xl">{book.cover}</div>
                        <div>
                          <h4 className="font-bold">{book.title}</h4>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{book.description}</p>
                          <p className="mt-2 text-xs font-semibold text-amber-700">{t.previewOnly}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl md:p-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-amber-100"><UserRound className="h-4 w-4" /> Welcome, {userDisplayName}</div>
              <h2 className="text-4xl font-black tracking-tight md:text-6xl">{t.featuredBooks}</h2>
              <p className="mt-4 max-w-3xl text-slate-300">{t.heroDescription}</p>
            </div>

            <section>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-2xl font-black">{t.recommended}</h3>
                <a href="#library" className="font-semibold text-amber-700">{t.browseLibrary} →</a>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {books.slice(0, 8).map((book) => <BookStoreCard key={book.id} book={book} progress={readingProgress[book.id] || 0} onOpen={() => openBook(book)} actionLabel={t.startReading} />)}
              </div>
            </section>
          </div>
        )}
      </section>

      {isLoggedIn && (
        <section id="my-books" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-28">
          <div className="mb-5 flex items-center gap-3">
            <BookMarked className="h-6 w-6 text-amber-600" />
            <h2 className="text-3xl font-black">{t.myBooks}</h2>
          </div>
          {booksWithProgress.length === 0 ? (
            <Card className="rounded-[2rem] border-0 shadow-lg"><CardContent className="p-8 text-slate-600">{t.noProgress}</CardContent></Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {booksWithProgress.map((book) => <BookStoreCard key={book.id} book={book} progress={readingProgress[book.id] || 0} onOpen={() => openBook(book)} actionLabel={t.keepReading} />)}
            </div>
          )}
        </section>
      )}

      <section id="library" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-28">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">{t.storyLibrary}</h2>
            <p className="text-slate-500">{books.length} {t.storybooksAvailable}</p>
          </div>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchMain} className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none focus:border-amber-400" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBooks.map((book) => <BookStoreCard key={book.id} book={book} progress={readingProgress[book.id] || 0} onOpen={() => openBook(book)} actionLabel={isLoggedIn ? t.startReading : t.previewOnly} />)}
        </div>
      </section>

      <section id="reader" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-28">
        <Card className="overflow-hidden rounded-[2rem] border-0 shadow-xl">
          <div className="bg-slate-900 px-6 py-7 text-white">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-amber-200"><BookOpen className="h-5 w-5" /><span className="text-sm font-medium">{t.nowReading}</span></div>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">{selectedBookText.title}</h2>
                <p className="mt-2 text-slate-300">{t.by} {selectedBookText.author}</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-white/90">{t.page} {page + 1} {t.of} {selectedBookText.pages.length}</div>
            </div>
          </div>
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="rounded-[2rem] bg-amber-50 p-6 md:p-8">
              <p className="text-xl leading-9 text-slate-800 md:text-2xl md:leading-10">{visibleText}</p>
              {!isLoggedIn && <div className="mt-6 rounded-2xl border border-amber-300 bg-white p-4 text-sm text-slate-700">{t.previewNotice}: {previewPageLimit} {t.of} {selectedBookText.pages.length} page(s). {t.fullAccess}</div>}
              {selectedBook.file_url && isLoggedIn && <a href={selectedBook.file_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-amber-100"><ExternalLink className="h-4 w-4" /> {t.openFile}: {selectedBook.file_name || "Book file"}</a>}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Button onClick={readCurrentPage} variant="outline" className="rounded-2xl border-amber-400 bg-amber-50 py-6 text-base text-slate-900 hover:bg-amber-100"><Play className="mr-2 h-5 w-5" /> {t.readAloud}</Button>
              <Button onClick={pauseReading} variant="outline" className="rounded-2xl border-slate-300 bg-white py-6 text-base text-slate-900 hover:bg-slate-50"><Pause className="mr-2 h-5 w-5" /> {t.pause}</Button>
              <Button onClick={resumeReading} variant="outline" className="rounded-2xl border-green-300 bg-green-50 py-6 text-base text-green-800 hover:bg-green-100"><Volume2 className="mr-2 h-5 w-5" /> {t.resume}</Button>
              <Button onClick={stopReading} variant="outline" className="rounded-2xl border-red-300 bg-red-50 py-6 text-base text-red-700 hover:bg-red-100"><Square className="mr-2 h-5 w-5" /> {t.stop}</Button>
            </div>

            <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{t.progress}</span>
                <span>{readingProgress[selectedBook.id] || 0}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-amber-400" style={{ width: `${readingProgress[selectedBook.id] || 0}%` }} /></div>
              <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                <Button onClick={previousPage} disabled={page === 0} variant="ghost" className="rounded-2xl text-slate-700 hover:bg-white disabled:text-slate-400"><ChevronLeft className="mr-2 h-4 w-4" /> {t.previousPage}</Button>
                <p className="text-center text-sm text-slate-500">{translationStatus || voiceStatus}</p>
                <Button onClick={nextPage} disabled={page === selectedBookText.pages.length - 1} variant="ghost" className="rounded-2xl text-slate-700 hover:bg-white disabled:text-slate-400">{t.nextPage} <ChevronRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="account" className="mx-auto max-w-7xl px-4 pb-12 scroll-mt-28">
        <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl"><Lock className="h-6 w-6" /></div>
              <div>
                <h2 className="text-2xl font-black">{isLoggedIn ? userDisplayName : t.readerAccount}</h2>
                <p className="text-slate-500">{t.accountDescription}</p>
              </div>
            </div>
            {session && <div className="mt-6 rounded-3xl bg-green-50 p-5 text-green-800"><p>{t.signedInAs} {session.user.email}. {t.fullAccess}</p>{isAdmin && <p className="mt-2 font-semibold">{t.adminAccess}</p>}</div>}
            {authMessage && <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{authMessage}</p>}
          </CardContent>
        </Card>
      </section>

      {isAdmin && (
        <section id="admin" className="mx-auto max-w-7xl px-4 pb-12 scroll-mt-28">
          <Card className="rounded-[2rem] border-0 bg-white shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">✍️</div><div><h2 className="text-2xl font-black">{t.adminDashboard}</h2><p className="text-slate-500">{t.adminDescription}</p></div></div>
              <form onSubmit={addBook} className="mt-8 grid gap-5 lg:grid-cols-2">
                <div className="space-y-4">
                  <input value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} placeholder={t.bookTitle} className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400" />
                  <input value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} placeholder={t.author} className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400" />
                  <div className="grid gap-4 sm:grid-cols-3"><input value={newBook.age} onChange={(e) => setNewBook({ ...newBook, age: e.target.value })} placeholder={t.ageRange} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400" /><input value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} placeholder={t.category} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400" /><input value={newBook.cover} onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })} placeholder={t.emojiCover} className="rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400" /></div>
                  <textarea value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} placeholder={t.shortDescription} rows={4} className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400" />
                  <textarea value={newBook.pagesText} onChange={(e) => setNewBook({ ...newBook, pagesText: e.target.value })} placeholder={t.writePages} rows={10} className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-amber-400" />
                </div>
                <div className="space-y-4"><label className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600"><div className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><FileText className="h-4 w-4" /> {t.uploadFile}</div><input type="file" accept=".pdf,.doc,.docx,.epub,.txt,.rtf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full text-sm" />{selectedFile && <p className="mt-2 text-green-700">{t.selected}: {selectedFile.name}</p>}</label><Button type="submit" className="w-full rounded-2xl bg-slate-900 py-6 text-white hover:bg-slate-800"><Upload className="mr-2 h-5 w-5" /> {t.uploadBook}</Button>{adminMessage && <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">{adminMessage}</div>}</div>
              </form>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

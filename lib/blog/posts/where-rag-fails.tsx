import React from "react";
import {
  BookOpen,
  Search,
  Scissors,
  Link2,
  Brain,
  Clock,
  Ghost,
  ScanText,
  Layers,
  HelpCircle,
  Users,
  BookX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { BlogPostMeta } from "@/types/blog";
import { Prose } from "@/components/blog/Prose";
import { SectionHeading } from "@/components/blog/SectionHeading";
import { ExampleBox } from "@/components/blog/ExampleBox";
import { PullQuote } from "@/components/blog/PullQuote";
import { ImagePlaceholder } from "@/components/blog/ImagePlaceholder";
import { NumberedCard } from "@/components/blog/NumberedCard";

export const meta: BlogPostMeta = {
  slug: "where-rag-fails",
  title: "Where RAG Fails: The Truth Nobody Talks About",
  description:
    "RAG doesn't make an AI smarter — it just helps it read the right information before answering. Here's why RAG systems confidently give wrong answers, and how to fix it.",
  category: "AI Engineering",
  publishedAt: "2026-07-19",
  readTimeMinutes: 9,
  icon: BookOpen,
};

// ── Post-specific content data ──────────────────────────────────────

const RAG_GOOD_FOR = [
  "Documentation",
  "Company knowledge",
  "Research papers",
  "FAQs",
  "Policies",
  "Technical manuals",
];

const RAG_BAD_FOR = [
  "Live cricket scores",
  "Today's weather",
  "Stock prices",
  "Cryptocurrency prices",
  "Flight tracking",
  "Real-time traffic",
];

const IMPROVEMENTS = [
  "Better chunking strategies",
  "Overlapping chunks to preserve context",
  "Hybrid search (keyword + semantic search)",
  "Better embedding models",
  "Regularly updating the knowledge base",
  "Returning citations so users can verify answers",
  "Asking clarification questions when queries are ambiguous",
  "Using reranking models to improve retrieved results",
  "Combining RAG with tool calling for real-time information",
];

const PIPELINE_STEPS = [
  "User asks a question.",
  "The question is converted into an embedding.",
  "Similar document chunks are retrieved.",
  "Those chunks are sent to the LLM.",
  "The LLM generates the answer using those chunks.",
];

interface Failure {
  icon: LucideIcon;
  title: string;
  body: React.ReactNode;
}

const FAILURES: Failure[] = [
  {
    icon: Search,
    title: "Poor Retrieval Is the Biggest Enemy",
    body: (
      <>
        <p>
          People often blame the language model. But in reality, most RAG
          failures happen <strong>before</strong> the AI even starts
          generating an answer.
        </p>
        <ExampleBox label="Document says" text="Black-box Testing" />
        <ExampleBox
          label="Question says"
          text="Testing where internal code isn't visible."
        />
        <p>
          If retrieval doesn&apos;t understand those two mean the same
          thing, the relevant chunk is never returned. The LLM can&apos;t
          answer something it never received.
        </p>
        <PullQuote>Garbage in. Garbage out.</PullQuote>
      </>
    ),
  },
  {
    icon: Scissors,
    title: "Chunking Can Accidentally Break Knowledge",
    body: (
      <>
        <p>This one surprises almost everyone. Imagine your document looks like this:</p>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8] mb-2">Chunk 1</p>
            <p className="text-sm font-semibold text-[#111111] dark:text-[#F8FAFC]">Black-box Testing</p>
            <p className="text-sm text-[#667085] dark:text-[#94A3B8]">Definition</p>
          </div>
          <div className="rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8] mb-2">Chunk 2</p>
            <p className="text-sm text-[#667085] dark:text-[#94A3B8]">Advantages</p>
            <p className="text-sm text-[#667085] dark:text-[#94A3B8]">Disadvantages</p>
          </div>
        </div>
        <p>Now ask: <em>&ldquo;What are the advantages of Black-box Testing?&rdquo;</em></p>
        <p>
          The retriever only finds Chunk 2. But Chunk 2 never says what
          it&apos;s talking about — the title disappeared. The LLM reads:
        </p>
        <ExampleBox label="Retrieved chunk" text={"Advantages:\n• Easy to perform\n• No programming required"} multiline />
        <p>
          Advantages of <em>what</em>? It has to guess. Sometimes it guesses
          correctly. Sometimes, it doesn&apos;t.
        </p>
      </>
    ),
  },
  {
    icon: Link2,
    title: "Missing Context Changes Everything",
    body: (
      <>
        <ExampleBox label="Retrieved sentence" text="It improves rendering performance." />
        <p>What is &ldquo;it&rdquo;? React? Vue? Angular? A new browser? Nobody knows.</p>
        <p>
          Humans naturally read the previous paragraph. LLMs only see what
          retrieval provides. If the retriever returns that sentence without
          the earlier context, the AI has no clue what &ldquo;it&rdquo;
          refers to — and the answer becomes a guessing game.
        </p>
      </>
    ),
  },
  {
    icon: Brain,
    title: "Humans Understand Meaning Better Than Search",
    body: (
      <>
        <p>
          Let&apos;s play a game. Imagine someone asks you: <em>&ldquo;What
          vehicle has four wheels, carries passengers, and is commonly used
          for transportation?&rdquo;</em>
        </p>
        <p>You immediately think: <strong>Car.</strong></p>
        <p>Now imagine the document only contains the word:</p>
        <ExampleBox label="Document" text="Automobile" />
        <p>
          Humans connect those words instantly. A search engine may not.
          Even modern embeddings sometimes miss these relationships
          depending on wording. We understand concepts — retrievers
          calculate similarity. Those aren&apos;t always the same thing.
        </p>
      </>
    ),
  },
  {
    icon: Clock,
    title: "Your Knowledge Base Can Become Outdated",
    body: (
      <>
        <p>
          Imagine your company updates its leave policy yesterday, but your
          vector database still contains last year&apos;s PDF. Now someone
          asks: <em>&ldquo;How many casual leaves do employees get?&rdquo;</em>
        </p>
        <ExampleBox label="AI answers (confidently)" text="12 days." />
        <p>Except the new policy says 18. Was the AI hallucinating? No — it answered based on outdated information.</p>
        <PullQuote>RAG is only as fresh as the documents you feed it. No update, no correct answer.</PullQuote>
      </>
    ),
  },
  {
    icon: Ghost,
    title: "Hallucinations Don't Magically Disappear",
    body: (
      <>
        <p>
          One of the biggest myths is: <em>&ldquo;If I use RAG,
          hallucinations are gone.&rdquo;</em> Unfortunately, no.
        </p>
        <ExampleBox label="Document says" text="Office timing starts at 9:00 AM." />
        <ExampleBox label="AI responds" text="Employees usually arrive around 8:30 AM." />
        <p>
          Where did 8:30 come from? Nowhere. The model filled the gap using
          its own learned knowledge. Even when documents are provided, LLMs
          still generate text — and generation means mistakes can still
          happen.
        </p>
        <PullQuote>RAG reduces hallucinations. It doesn&apos;t eliminate them.</PullQuote>
      </>
    ),
  },
  {
    icon: ScanText,
    title: "Scanned PDFs Can Completely Fool Your AI",
    body: (
      <>
        <p>Suppose you upload an old scanned PDF. The OCR extracts:</p>
        <ExampleBox label="OCR output" text="BlacK B0X TesT1ng" broken />
        <p>instead of</p>
        <ExampleBox label="Actual term" text="Black-box Testing" />
        <p>
          Now retrieval searches for &ldquo;Black-box Testing.&rdquo;
          Nothing matches. The answer exists — the OCR destroyed it. The AI
          never had a chance.
        </p>
      </>
    ),
  },
  {
    icon: Layers,
    title: "Context Window Has Limits",
    body: (
      <>
        <p>
          Imagine your retriever finds twenty useful pages. Sounds amazing.
          Except the model can only fit eight of them into its context
          window — the remaining twelve are discarded.
        </p>
        <p>What if the missing page contained the actual answer? Oops.</p>
        <PullQuote>Bigger knowledge bases don&apos;t automatically mean better answers.</PullQuote>
      </>
    ),
  },
  {
    icon: HelpCircle,
    title: "Ambiguous Questions Confuse Everyone",
    body: (
      <>
        <p>
          Imagine your documents contain information about Apple 🍎 (the
          fruit). Someone asks: <em>&ldquo;Who founded Apple?&rdquo;</em>
        </p>
        <p>
          The retriever happily returns fruit information. The AI tries to
          answer. Everything goes downhill.
        </p>
        <p>
          Even humans ask follow-up questions when something is unclear.
          Many RAG systems don&apos;t.
        </p>
      </>
    ),
  },
  {
    icon: Users,
    title: "Sometimes Humans Fail Too",
    body: (
      <>
        <p>This is my favorite comparison. Imagine you ask your friend:</p>
        <ExampleBox label="You" text="Remember that restaurant we visited two years ago?" />
        <ExampleBox label="Friend" text="No." />
        <p>Then suddenly, you mention:</p>
        <ExampleBox label="You" text="It was the place with the rooftop and live music." />
        <ExampleBox label="Friend" text="Ohhh! Yes!" />
        <p>
          Humans retrieve memories using hints. AI retrieval works
          similarly — sometimes one wording works, another wording
          doesn&apos;t. That doesn&apos;t mean the knowledge disappeared. It
          just wasn&apos;t retrieved.
        </p>
      </>
    ),
  },
  {
    icon: BookX,
    title: "RAG Doesn't Actually Understand Your Documents",
    body: (
      <>
        <p>
          This surprises beginners. RAG doesn&apos;t &ldquo;read&rdquo;
          your documents beforehand — it stores mathematical
          representations called embeddings. When you ask a question, it
          searches for similar vectors. Only the retrieved chunks are
          actually read by the LLM.
        </p>
        <p>So if retrieval misses, the AI never sees the rest of your PDF.</p>
        <PullQuote>
          It&apos;s like giving someone a 500-page book but allowing them to
          read only three random pages before answering.
        </PullQuote>
      </>
    ),
  },
];

// ── Article body ────────────────────────────────────────────────────

export function Content() {
  return (
    <>
      <Prose>
        <PullQuote>
          &ldquo;I uploaded the PDF&hellip; so why is the AI still giving the
          wrong answer?&rdquo;
        </PullQuote>
        <p>
          That&apos;s probably one of the most common questions people ask
          after building their first RAG application.
        </p>
        <p>
          RAG (Retrieval-Augmented Generation) is often marketed as the
          magic solution that fixes AI hallucinations and gives language
          models access to your own documents.
        </p>
        <p>But here&apos;s the reality&hellip;</p>
        <p className="font-bold text-[#111111] dark:text-[#F8FAFC]">
          RAG is amazing.
          <br />
          RAG is powerful.
          <br />
          RAG is absolutely not perfect.
        </p>
        <p>
          Even the best RAG systems can confidently give incorrect answers,
          miss information that&apos;s literally inside your documents, or
          misunderstand what you&apos;re asking.
        </p>
        <p>And surprisingly&hellip; sometimes it&apos;s not the AI&apos;s fault at all.</p>
        <p>Let&apos;s understand why.</p>

        <ImagePlaceholder caption="RAG Architecture — User → Retriever → Knowledge Base → LLM → Response" />

        <SectionHeading>First&hellip; Why Do We Even Need RAG?</SectionHeading>
        <p>Imagine asking ChatGPT: <em>&ldquo;What is my company&apos;s leave policy?&rdquo;</em></p>
        <p>
          Unless OpenAI trained their model on your company&apos;s
          confidential handbook (which they obviously didn&apos;t 😅), the
          AI has absolutely no idea.
        </p>
        <p>The same happens with:</p>
        <ul className="list-none space-y-1.5 my-4">
          {["Your college notes", "Internal company documentation", "Research papers", "Product manuals", "Legal contracts", "Medical reports", "Private PDFs"].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D5DF6] flex-shrink-0" />
              <span className="font-medium text-[#111111] dark:text-[#F8FAFC]">{item}</span>
            </li>
          ))}
        </ul>
        <p>LLMs only know what they were trained on. They don&apos;t automatically know your documents.</p>
        <p>That&apos;s where RAG comes in.</p>
        <p>
          Instead of expecting the model to magically know everything, we
          first search the relevant documents, fetch the useful
          information, and then give that information to the model before
          it answers.
        </p>
        <PullQuote>
          Think of it like an open-book exam — instead of relying on
          memory, the AI gets permission to open the book first.
        </PullQuote>

        <SectionHeading>How a Basic RAG Pipeline Works</SectionHeading>
        <p>The flow is actually quite simple.</p>
        <ol className="my-4 space-y-2.5">
          {PIPELINE_STEPS.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="font-medium text-[#111111] dark:text-[#F8FAFC] pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p>Simple, right? Unfortunately&hellip; this is exactly where things begin to break.</p>

        <SectionHeading>When RAG Works Really Well ✅</SectionHeading>
        <p>Let&apos;s say your Software Testing PDF contains:</p>
        <ExampleBox
          label="Document"
          text="Black-box Testing is a software testing technique where the tester validates the application's functionality without looking at its internal implementation."
          multiline
        />
        <p>Now you ask: <em>&ldquo;What is Black-box Testing?&rdquo;</em></p>
        <p>The retriever finds the exact paragraph. The LLM reads it. You receive a perfect answer. Easy.</p>
        <p>Another example. Suppose your HR handbook says:</p>
        <ExampleBox label="Document" text="Employees receive 18 paid leaves annually." />
        <p>You ask: <em>&ldquo;How many paid leaves do employees get?&rdquo;</em></p>
        <p>Again&hellip; perfect retrieval. Perfect answer. Life is good.</p>

        <SectionHeading>Then Reality Hits 😅</SectionHeading>
        <p>Let&apos;s use the exact same PDF. Instead of asking <em>&ldquo;What is Black-box Testing?&rdquo;</em> you ask:</p>
        <ExampleBox
          label="Question"
          text="What is the testing method where we cannot see the source code but only verify whether the application works correctly?"
          multiline
        />
        <p>
          As humans, most of us instantly know that&apos;s Black-box
          Testing. But your RAG system? It might completely fail.
        </p>
        <p>Why? Because retrieval isn&apos;t reading like a human — it&apos;s searching for relevance.</p>
        <p>If it doesn&apos;t retrieve the right chunk, the AI never even sees the answer.</p>
        <p>
          Imagine asking your friend: <em>&ldquo;Where&apos;s my blue
          notebook?&rdquo;</em> But your friend only searches for things
          labeled &ldquo;Notebook.&rdquo; Your notebook is labeled
          &ldquo;Journal.&rdquo; They return empty-handed.
        </p>
        <PullQuote>The notebook was always there. It just wasn&apos;t found.</PullQuote>
      </Prose>

      {/* Numbered failure list */}
      <div className="mt-16 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D5DF6] mb-2">
          Eleven ways it breaks
        </p>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-[#F8FAFC] tracking-tight">
          Why RAG Actually Fails
        </h2>
      </div>
      <div className="space-y-5">
        {FAILURES.map((failure, i) => (
          <NumberedCard key={failure.title} index={i + 1} icon={failure.icon} title={failure.title}>
            {failure.body}
          </NumberedCard>
        ))}
      </div>

      <Prose>
        <SectionHeading>When RAG Is NOT the Right Solution 🚫</SectionHeading>
        <p>People try solving every AI problem with RAG. That&apos;s a mistake.</p>

        <div className="grid sm:grid-cols-2 gap-4 my-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
              RAG is great for
            </p>
            <ul className="space-y-2">
              {RAG_GOOD_FOR.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#111111] dark:text-[#F8FAFC]">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">
              Not ideal for
            </p>
            <ul className="space-y-2">
              {RAG_BAD_FOR.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#111111] dark:text-[#F8FAFC]">
                  <XCircle size={14} className="text-red-500 flex-shrink-0" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p>Those require APIs and live tools, not static document retrieval.</p>

        <SectionHeading>So&hellip; How Can We Build Better RAG Systems?</SectionHeading>
        <p>Thankfully, these problems aren&apos;t impossible to solve. Some practical improvements include:</p>
        <ul className="list-none space-y-2 my-4">
          {IMPROVEMENTS.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <ArrowRight size={14} className="text-[#6D5DF6] flex-shrink-0 mt-1" strokeWidth={2.5} />
              <span className="font-medium text-[#111111] dark:text-[#F8FAFC]">{item}</span>
            </li>
          ))}
        </ul>
        <p>No single trick fixes everything. Good RAG is a combination of many small improvements.</p>

        <SectionHeading>Final Thoughts 💭</SectionHeading>
        <p>
          RAG is one of the biggest improvements we&apos;ve seen in AI
          applications. It allows language models to answer questions using
          your own documents instead of relying only on their training.
        </p>
        <p>But here&apos;s the important takeaway:</p>
        <PullQuote>
          RAG doesn&apos;t make an AI smarter. It simply helps the AI read
          the right information before answering.
        </PullQuote>
        <p>
          If the wrong information is retrieved, if the document is poorly
          chunked, if the knowledge base is outdated, or if important
          context is missing, even the most advanced language model can
          produce incorrect answers.
        </p>
        <p>In many ways, AI behaves a lot like us.</p>
        <p>
          Give a person the wrong page from a book, and they&apos;ll
          probably answer incorrectly too.
        </p>
        <p>
          The difference between an average RAG system and a great one
          isn&apos;t just the language model. It&apos;s how well you
          retrieve, organize, maintain, and present knowledge.
        </p>
        <p>So the next time your RAG chatbot gives a strange answer&hellip;</p>
        <p>Don&apos;t immediately blame the LLM. Ask a different question first:</p>
        <p className="text-lg font-bold text-[#111111] dark:text-[#F8FAFC]">
          Did the AI actually retrieve the right information?
        </p>
        <p>
          Because more often than not&hellip; that&apos;s where the real
          problem begins. 🚀
        </p>
      </Prose>
    </>
  );
}

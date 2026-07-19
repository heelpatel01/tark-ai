"use client";
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import { FiCopy, FiCheck } from "react-icons/fi";

// ─────────────────────────────────────────────────────────────────────────────
// Markdown rendering for assistant messages (extracted from the chat page so
// the page stays presentational and this stays reusable). Styling is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

const CodeBlockWithCopy: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const languageMap: Record<string, string> = {
    javascript: "JavaScript", typescript: "TypeScript", python: "Python",
    jsx: "JSX", tsx: "TSX", css: "CSS", html: "HTML", json: "JSON",
    bash: "Bash", sql: "SQL", java: "Java", cpp: "C++", go: "Go", rust: "Rust",
  };

  return (
    <div className="relative group w-full my-4 overflow-hidden rounded-2xl border border-[#1e1e1e]/20 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2">
        <span className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider">
          {languageMap[language.toLowerCase()] || language.toUpperCase()}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1 px-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all flex items-center gap-1 text-[10px] font-bold"
        >
          {copied ? <FiCheck size={11} strokeWidth={3} /> : <FiCopy size={11} strokeWidth={2.5} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="w-full overflow-x-auto bg-[#1e1e1e]">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          showLineNumbers
          className="!bg-transparent !p-0 !m-0"
          customStyle={{ margin: 0, padding: "1.2rem", background: "transparent", fontSize: "0.75rem", lineHeight: "1.6", minWidth: "100%", overflowX: "auto" }}
          codeTagProps={{ style: { fontSize: "0.75rem", lineHeight: "1.6", display: "block" } }}
          lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em", color: "#555", userSelect: "none" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const TableWithCopy: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  const copyToClipboard = async () => {
    try {
      if (!tableRef.current) return;
      const rows = Array.from(tableRef.current.querySelectorAll("tr"));
      const text = rows.map(r => Array.from(r.querySelectorAll("th, td")).map(c => c.textContent?.trim() || "").join("\t")).join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative group w-full my-4 overflow-hidden rounded-2xl border border-black/5 flex flex-col bg-white shadow-sm">
      <div className="flex items-center justify-between bg-black/[0.02] px-4 py-2 border-b border-black/5">
        <span className="text-[#111111] font-bold text-[10px] uppercase tracking-wider">Data Table</span>
        <button onClick={copyToClipboard} className="p-1 px-3 bg-white hover:bg-[#F8FAFC] text-[#111111] border border-black/5 rounded-full transition-all flex items-center gap-1 text-[10px] font-bold shadow-sm">
          {copied ? <FiCheck size={11} strokeWidth={3} /> : <FiCopy size={11} strokeWidth={2.5} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table ref={tableRef} className="w-full text-left border-collapse min-w-max text-xs">{children}</table>
      </div>
    </div>
  );
};

export const MarkdownMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) return <div className="whitespace-pre-wrap break-words font-semibold text-xs sm:text-sm">{content}</div>;

  const components: Components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");
      const isMultiLine = codeString.includes("\n");
      const hasLanguage = match && match[1];
      if (!inline && (hasLanguage || isMultiLine)) {
        return <div className="w-full max-w-full overflow-hidden"><CodeBlockWithCopy code={codeString} language={hasLanguage ? match[1] : "text"} /></div>;
      }
      return <code className="bg-[#6D5DF6]/10 text-[#6D5DF6] px-1.5 py-0.5 rounded font-mono text-xs font-semibold break-all" {...props}>{children}</code>;
    },
    h1: ({ children }) => <h1 className="text-lg font-bold text-[#111111] mt-4 mb-2 uppercase tracking-wide">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold text-[#111111] mt-4 mb-2 uppercase tracking-wide">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold text-[#111111] mt-3 mb-2 uppercase tracking-wide">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-2.5 font-medium">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-2.5 font-medium">{children}</ol>,
    li: ({ children }) => <li className="text-[#111111] font-medium leading-relaxed">{children}</li>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-[#6D5DF6]/40 pl-4 font-semibold italic text-[#667085] my-3 bg-[#6D5DF6]/5 py-2.5 rounded-r-xl">{children}</blockquote>,
    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#6D5DF6] font-bold underline hover:opacity-85 transition-opacity">{children}</a>,
    p: ({ children }) => <p className="mb-2.5 font-medium text-[#111111] leading-relaxed">{children}</p>,
    strong: ({ children }) => <strong className="font-bold text-[#111111]">{children}</strong>,
    table: ({ children }) => <TableWithCopy>{children}</TableWithCopy>,
    thead: ({ children }) => <thead className="border-b border-black/5 bg-black/[0.01]">{children}</thead>,
    tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-black/5 last:border-0 hover:bg-[#F8FAFC] transition-colors">{children}</tr>,
    th: ({ children }) => <th className="p-3 font-bold text-[#111111] uppercase tracking-wider whitespace-nowrap">{children}</th>,
    td: ({ children }) => <td className="p-3 font-medium text-[#667085] border-r border-black/5 last:border-r-0">{children}</td>,
  };

  return (
    <div className="prose prose-sm max-w-none overflow-hidden">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>
    </div>
  );
};

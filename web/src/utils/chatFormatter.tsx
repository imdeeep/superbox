import React, { useCallback } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Copy, Check } from 'lucide-react';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('python', python);

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [code]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-sm text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-2 py-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vs2015}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#1e1e1e',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export const formatResponse = (response: string) => {
  const sections = parseContent(response);
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'code':
            return (
              <CodeBlock
                key={index}
                code={section.content}
                language={section.language || 'plaintext'}
              />
            );
          case 'heading':
            const level = section.content.match(/^(#{1,6})\s/)?.[1].length || 1;
            const text = section.content.replace(/^#{1,6}\s/, '');
            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag key={index} className="text-white font-semibold my-4">
                {text}
              </HeadingTag>
            );
          case 'text':
            return (
              <div
                key={index}
                className="text-gray-200"
                dangerouslySetInnerHTML={{
                  __html: formatText(section.content),
                }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const parseContent = (response: string) => {
  const sections = [];
  const lines = response.split('\n');
  let currentSection = null;
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        const language = line.trim().slice(3);
        currentSection = {
          type: 'code',
          content: '',
          language: language || 'plaintext',
        };
        inCodeBlock = true;
      } else {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = null;
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock && currentSection) {
      currentSection.content += line + '\n';
      continue;
    }

    if (!inCodeBlock && line.trim().match(/^#{1,6}\s/)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      sections.push({
        type: 'heading',
        content: line.trim(),
      });
      currentSection = null;
      continue;
    }

    if (!inCodeBlock) {
      if (!currentSection || currentSection.type !== 'text') {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          type: 'text',
          content: line,
        };
      } else {
        currentSection.content += '\n' + line;
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

const formatText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');
};

export default formatResponse;

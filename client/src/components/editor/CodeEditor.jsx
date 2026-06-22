import { useState } from 'react'
import Editor from '@monaco-editor/react'
import LanguageSelector from './LanguageSelector'
import Button from '../common/Button'

const CODE_TEMPLATES = {
  javascript: `function hello() {
  console.log("Hello World");
}`,

  python: `def hello():
    print("Hello World")`,

  java: `public class Main {
    public static void main(String[] args) {

    }
}`,

  cpp: `#include <iostream>

int main() {

    return 0;
}`,

typescript: `function hello(): void {
  console.log("Hello World");
}`,

c: `#include <stdio.h>

int main() {
  return 0;
}`,

go: `package main

import "fmt"

func main() {
  fmt.Println("Hello World")
}`,

rust: `fn main() {
  println!("Hello World");
}`,

php: `<?php
echo "Hello World";
`,

ruby: `puts "Hello World"`
}

export default function CodeEditor({ onReview, loading }) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(CODE_TEMPLATES.javascript)

  const handleSubmit = () => {
    if (code.trim()) {
      onReview({ code, language })
    }
  }

  const lineCount = code.split('\n').length

  const handleLanguageChange = (lang) => {
  setLanguage(lang)
  setCode(CODE_TEMPLATES[lang] || '')
}

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-surface border border-dark-border rounded-t-lg">
        <LanguageSelector
          value={language}
          onChange={handleLanguageChange}
        />

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 font-mono">
            {lineCount} line{lineCount !== 1 ? 's' : ''}
          </span>

          <button
            onClick={() => setCode('')}
            className="text-xs text-gray-500 hover:text-gray-300 bg-transparent border-none cursor-pointer transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="border border-t-0 border-dark-border rounded-b-lg overflow-hidden">
        <Editor
          height="500px"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: {
              enabled: false,
            },
            fontSize: 14,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            roundedSelection: false,
            renderLineHighlight: 'all',
            tabSize: 2,
            padding: {
              top: 12,
            },
          }}
        />
      </div>

      <Button
        onClick={handleSubmit}
        loading={loading}
        disabled={!code.trim()}
        size="lg"
        className="self-end"
      >
        {loading ? 'Reviewing...' : 'Review code →'}
      </Button>
    </div>
  )
}
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Very basic parser for the specific format requested
  // Handles Bold (**), Headers (##), and Newlines
  
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Header 2/3
      if (line.startsWith('## ') || line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold text-nyc-accent mt-4 mb-2">{line.replace(/^#+\s/, '')}</h3>;
      }
      
      // Bold handling with regex
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Special handling for Emoji bullets/lists
      if (line.trim().startsWith('🍽️') || line.trim().startsWith('📍') || line.trim().startsWith('⭐') || line.trim().startsWith('✨')) {
         return <div key={i} className="my-1">{formattedLine}</div>;
      }
      
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      }

      return <p key={i} className="leading-relaxed mb-1 text-gray-300">{formattedLine}</p>;
    });
  };

  return <div className="text-sm md:text-base">{formatText(content)}</div>;
};
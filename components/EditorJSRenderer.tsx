import Image from "next/image";
import React from "react";

import type { EditorJSContent, EditorJSBlock } from "@/types/news";

interface EditorJSRendererProps {
  content: EditorJSContent;
}

export function EditorJSRenderer({ content }: EditorJSRendererProps) {
  const renderBlock = (block: EditorJSBlock, key: string) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p
            key={key}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
            className="EditorJS-paragraph"
          />
        );

      case 'header':
        const level = Math.min(Math.max(block.data.level, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
        const HeaderTag = `h${level}` as const;
        return (
          <HeaderTag
            key={key}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
            className={`EditorJS-header EditorJS-header--${level}`}
          />
        );

      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={key} className="EditorJS-list">
            {block.data.items.map((item: string, index: number) => (
              <li
                key={index}
                dangerouslySetInnerHTML={{ __html: item }}
                className="EditorJS-list-item"
              />
            ))}
          </ListTag>
        );

      case 'image':
        return (
          <figure key={key} className="EditorJS-image">
            <Image
              src={block.data.file.url}
              alt={block.data.file.alt || block.data.caption || 'News image'}
              width={800}
              height={600}
              className="EditorJS-image-img"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            {block.data.caption && (
              <figcaption
                className="EditorJS-image-caption"
                dangerouslySetInnerHTML={{ __html: block.data.caption }}
              />
            )}
          </figure>
        );

      case 'quote':
        return (
          <blockquote key={key} className="EditorJS-quote">
            <p
              dangerouslySetInnerHTML={{ __html: block.data.text }}
              className="EditorJS-quote-text"
            />
            {block.data.caption && (
              <cite
                dangerouslySetInnerHTML={{ __html: block.data.caption }}
                className="EditorJS-quote-caption"
              />
            )}
          </blockquote>
        );

      case 'delimiter':
        return <hr key={key} className="EditorJS-delimiter" />;

      default:
        // Fallback for unsupported block types
        return (
          <div key={key} className="EditorJS-unsupported">
            <p className="EditorJS-unsupported-label">
              Unsupported content block: {block.type}
            </p>
            {block.data.text && (
              <div
                className="EditorJS-unsupported-content"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="EditorJS-content">
      {content.blocks.map((block, index) => 
        renderBlock(block, `block-${index}`)
      )}
    </div>
  );
}
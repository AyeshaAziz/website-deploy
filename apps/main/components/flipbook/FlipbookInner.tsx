'use client';

import { type ReactNode } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { cn } from '@itqasys/core';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipbookInnerProps {
  src: string;
  page: number;
  width: number;
  onLoadSuccess: (numPages: number) => void;
  className?: string;
}

export default function FlipbookInner({ src, page, width, onLoadSuccess, className }: FlipbookInnerProps): ReactNode {
  return (
    <div className={cn('overflow-hidden rounded-card border border-primary-5 bg-white shadow-card', className)}>
      <Document
        file={src}
        onLoadSuccess={({ numPages: n }) => onLoadSuccess(n)}
        suspense
        options={{ verbosity: 0 }}
        error={<div className="flex h-full items-center justify-center text-danger">Failed to load PDF.</div>}
      >
        <Page
          pageNumber={page}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          suspense
        />
      </Document>
    </div>
  );
}

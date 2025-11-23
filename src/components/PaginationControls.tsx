"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  const maxPageButtons = 5; // Number of page buttons to show

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary uppercase font-semibold text-sm"
      >
        Previous
      </Button>
      {startPage > 1 && (
        <>
          <Button
            variant="outline"
            onClick={() => onPageChange(1)}
            className="bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary uppercase font-semibold text-sm"
          >
            1
          </Button>
          {startPage > 2 && <span className="text-muted-foreground">...</span>}
        </>
      )}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className={
            page === currentPage
              ? "bg-primary text-primary-foreground uppercase font-semibold text-sm"
              : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary uppercase font-semibold text-sm"
          }
        >
          {page}
        </Button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-muted-foreground">...</span>}
          <Button
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            className="bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary uppercase font-semibold text-sm"
          >
            {totalPages}
          </Button>
        </>
      )}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary uppercase font-semibold text-sm"
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
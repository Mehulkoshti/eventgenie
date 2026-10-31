"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import type { PlanResult } from "@/lib/types";
import { PlanDocument } from "@/lib/pdf/PlanDocument";
import { Button } from "@/components/ui/Button";

export function DownloadPdfButton({ plan }: { plan: PlanResult }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<PlanDocument plan={plan} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${plan.input.eventName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "event-plan"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      {isGenerating ? "Preparing PDF…" : "Download PDF"}
    </Button>
  );
}

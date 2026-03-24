import ReportForm from "@/components/ReportForm";
import { PlusCircle } from "lucide-react";

export default function ReportFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="mx-auto max-w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Found Item</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">Report a Found Item</h1>
          <p className="text-muted mt-2 text-sm">Tell us what you found and where — we&apos;ll match it to it&apos;s owner.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <ReportForm type="FOUND" />
        </div>
      </div>
    </div>
  );
}

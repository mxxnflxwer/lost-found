import ReportForm from "@/components/ReportForm";
import { Search } from "lucide-react";

export default function ReportLostPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="mx-auto max-w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Lost Item</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">Report a Lost Item</h1>
          <p className="text-muted mt-2 text-sm">Provide as much detail as possible to help us find a match.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <ReportForm type="LOST" />
        </div>
      </div>
    </div>
  );
}

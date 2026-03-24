import Link from "next/link";
import { Search, PlusCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-4xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Lost Something? <br className="hidden sm:inline" /> Found Something?
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted">
          A seamless, community-driven platform to report and recover lost items quickly.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out fill-mode-both delay-150">
        
        {/* Report Lost Card */}
        <Link href="/report-lost" className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
          <div className="flex flex-col h-full">
            <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">I lost an item</h3>
            <p className="text-muted flex-grow mb-6">
              Create a detailed report for your lost item to help the community find it.
            </p>
            <div className="flex items-center text-sm font-semibold text-primary">
              Report lost <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Report Found Card */}
        <Link href="/report-found" className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
          <div className="flex flex-col h-full">
            <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">I found an item</h3>
            <p className="text-muted flex-grow mb-6">
              Report an item you've found so we can match it with its rightful owner.
            </p>
            <div className="flex items-center text-sm font-semibold text-primary">
              Report found <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
        
      </div>
    </div>
  );
}

import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="font-bold text-xl text-primary">
            SMMID
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Panel SMM Termurah & Tercepat di Indonesia
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SMMID. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

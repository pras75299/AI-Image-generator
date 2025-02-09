import { ImageGenerator } from "@/components/image-generator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, Heart } from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      <nav className="fixed w-full p-4 flex justify-end">
        <ThemeToggle />
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 pt-12">
          <div className="flex items-center space-x-2 flex-wrap justify-center">
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary animate-pulse" />
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 leading-relaxed pb-2">
              AI Image Generator
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl px-4">
            Transform your ideas into stunning visuals with our AI-powered image
            generator. Just describe what you want to see, and watch the magic
            happen.
          </p>

          <ImageGenerator />
          <footer className="fixed bottom-0 w-full p-2 md:p-4 flex flex-wrap items-center justify-center gap-1 md:gap-2 text-sm md:text-base text-muted-foreground">
            Made with{" "}
            <Heart className="h-3 w-3 md:h-4 md:w-4 text-red-500 animate-pulse" />{" "}
            by{" "}
            <a
              href="https://github.com/pras75299"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 hover:opacity-80 transition-opacity"
            >
              Prashant Kumar Singh
            </a>
          </footer>
        </div>
      </div>
    </main>
  );
}

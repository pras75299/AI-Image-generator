"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt) {
      toast({
        title: "Please enter a prompt",
        description:
          "You need to provide a description of the image you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: size,
            quality: "standard",
            response_format: "url",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate image");
      }

      const data = await response.json();
      setImage(data.data[0].url);

      toast({
        title: "Image generated successfully",
        description: "Your image has been created!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={generateImage} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </div>
        </div>
      </Card>

      {image && (
        <Card className="p-4">
          <div className="relative aspect-square">
            <img
              src={image}
              alt={prompt}
              className="rounded-lg object-cover w-full h-full"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => generateImage()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" asChild>
                <a href={image} download="generated-image.png">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

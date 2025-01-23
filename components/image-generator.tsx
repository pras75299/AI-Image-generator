"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const IMAGE_SIZES = [
  { value: "1024x1024", label: "Square (1024x1024)" },
  { value: "1024x1792", label: "Portrait (1024x1792)" },
  { value: "1792x1024", label: "Landscape (1792x1024)" },
];

const SYSTEM_PROMPT = `
You are a master AI artist specializing in creating stunning anime and manga-style illustrations. Create images with:
- Vivid, eye-catching colors and dynamic lighting
- Clean, precise linework and detailed character designs
- Professional composition and dramatic angles
- Modern anime aesthetics with attention to highlights and shadows
- Careful attention to proportions and anatomical accuracy
- Background elements that enhance the overall scene
Please maintain a family-friendly style suitable for all audiences.
`;

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
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
    //   setImage(
    //     "https://images.unsplash.com/photo-1699116550661-bea051952f96?q=80&w=1024"
    //   );
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to generate image. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setLoading(false);
    // }
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
            prompt: `${SYSTEM_PROMPT} ${prompt}`,
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

          <div className="flex gap-4">
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={generateImage}
              disabled={loading}
              className="flex-1"
            >
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

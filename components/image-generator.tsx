"use client";

import { useState, useEffect } from "react";
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

const IMAGE_STYLES = [
  {
    value: "anime",
    label: "Anime",
    prompt: `You are a master AI artist specializing in creating stunning anime and manga-style illustrations. Create images with:
- Vivid, eye-catching colors and dynamic lighting
- Clean, precise linework and detailed character designs
- Wide-angle perspective with a medium distance from the subject
- Professional composition emphasizing depth and scale
- Modern anime aesthetics with attention to highlights and shadows
- Careful attention to proportions and anatomical accuracy
- Balanced background elements that enhance the overall scene
- Consistent focal length that maintains a cinematic wide field of view
Please maintain a family-friendly style suitable for all audiences.`,
  },
  {
    value: "realistic",
    label: "Realistic",
    prompt: `You are a master AI artist specializing in creating photorealistic images. Create images with:
- Natural lighting and true-to-life colors
- High attention to detail and textures
- Proper perspective and depth of field
- Photographic composition principles
- Realistic shadows and reflections
- Accurate proportions and scale
- Environmental context and atmosphere
- Professional photography aesthetics
Please maintain a family-friendly style suitable for all audiences.`,
  },
  {
    value: "watercolor",
    label: "Watercolor",
    prompt: `You are a master AI artist specializing in watercolor paintings. Create images with:
- Soft, flowing colors with gentle transitions
- Visible brush strokes and paper texture
- Natural color bleeding and gradients
- Light and airy composition
- Translucent layers and washes
- Loose, expressive style
- Organic shapes and forms
Please maintain a family-friendly style suitable for all audiences.`,
  },
  {
    value: "pixel-art",
    label: "Pixel Art",
    prompt: `You are a master AI artist specializing in pixel art. Create images with:
- Clear pixel-by-pixel detail
- Limited color palette
- Sharp, distinct edges
- Retro gaming aesthetic
- Careful dithering and shading
- Isometric or side-on perspective
- Classic 8-bit or 16-bit style
Please maintain a family-friendly style suitable for all audiences.`,
  },
  {
    value: "3d-render",
    label: "3D Render",
    prompt: `You are a master AI artist specializing in 3D rendered images. Create images with:
- Clean, polished 3D modeling
- Professional material textures
- Global illumination and ray-tracing effects
- Realistic reflections and refractions
- Proper depth of field
- Modern CGI aesthetics
- Physically accurate lighting
Please maintain a family-friendly style suitable for all audiences.`,
  },
  {
    value: "gaming",
    label: "Gaming",
    prompt: `You are a master AI artist specializing in creating modern video game art. Create images with:
- High-quality game engine render style
- Dynamic action poses and compositions
- Dramatic lighting and particle effects
- Detailed character and environment designs
- Modern gaming visual aesthetics
- Rich atmospheric elements
- Strong focal points and depth
- Cinematic game scene presentation
Please maintain a family-friendly style suitable for all audiences.`,
  },
  {
    value: "comic-&-cartoon",
    label: "Comic & Cartoon",
    prompt: `You are a master AI artist specializing in creating comic and cartoon style illustrations. Create images with:
- Bold, clean outlines and flat colors
- Expressive character designs and exaggerated features
- Dynamic poses and energetic compositions
- Simplified backgrounds with proper perspective
- Comic-style shading and highlights
- Clear storytelling elements
- Characteristic cartoon aesthetics
- Fun and appealing visual style
Please maintain a family-friendly style suitable for all audiences.`,
  },
  {
    value: "photograpic",
    label: "Photographic",
    prompt: `You are a master AI artist specializing in creating professional photographic images. Create images with:
- Professional DSLR camera quality and resolution
- Perfect exposure and white balance
- Sharp focus on key subjects with natural bokeh
- Rule of thirds and golden ratio compositions
- Natural color grading and contrast
- Professional lighting techniques
- Authentic photojournalistic style
- High dynamic range and tonal depth
Please maintain a family-friendly style suitable for all audiences.`,
  },
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [style, setStyle] = useState("anime");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { toast } = useToast();
  const [generationCount, setGenerationCount] = useState(0);
  const maxGenerations = Number(process.env.NEXT_PUBLIC_MAX_GENERATIONS) || 2;

  useEffect(() => {
    const storedCount = localStorage.getItem("generationCount") || "0";
    setGenerationCount(parseInt(storedCount));
  }, []);

  const generateImage = async () => {
    if (generationCount >= maxGenerations) {
      toast({
        title: "Generation limit reached",
        description: `You have reached the maximum limit of ${maxGenerations} image generations. Please try again later.`,
        variant: "destructive",
      });
      return;
    }

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
      const selectedStyle = IMAGE_STYLES.find((s) => s.value === style);
      const systemPrompt = selectedStyle
        ? selectedStyle.prompt
        : IMAGE_STYLES[0].prompt;

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
            prompt: `${systemPrompt} ${prompt}`,
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

      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      localStorage.setItem("generationCount", newCount.toString());

      toast({
        title: "Image generated successfully",
        description: `${maxGenerations - newCount} generations remaining`,
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
      setPrompt("");
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  generateImage();
                }
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={generateImage}
              disabled={loading}
              className="w-full sm:flex-1"
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
          <div className="text-sm text-muted-foreground text-right">
            {maxGenerations - generationCount} generations remaining
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

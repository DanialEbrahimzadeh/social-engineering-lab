'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";

const SAMPLE_PERSONAS = [
  "Corporate Finance Manager",
  "IT Support Specialist",
  "HR Director",
  "System Administrator",
  "Sales Executive",
  "Customer Service Rep",
];

export default function Home() {
  const [keywords, setKeywords] = useState<string>("");
  const [persona, setPersona] = useState<string>("");
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiInput, setShowApiInput] = useState(false);

  const generateRandomPersona = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PERSONAS.length);
    setPersona(SAMPLE_PERSONAS[randomIndex]);
  };

  const handleGenerate = async () => {
    if (!keywords || !persona) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!apiKey) {
      toast.error("Please enter your API key");
      setShowApiInput(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        },
        body: JSON.stringify({
          keywords: keywords.split(",").map(k => k.trim()),
          persona,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate message");

      const data = await res.json();
      setGeneratedMessage(data.result);
    } catch (error) {
      toast.error("Failed to generate message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen relative">
      {/* Header Logos */}
      <div className="flex justify-between items-start mb-12">
        <Image
          src="/inquire-logo-light.avif"
          alt="INQUIRE Lab Logo"
          width={150}
          height={60}
          className="object-contain inquire-logo"
        />
        <Image
          src="/College of Engineering_linear-crimson-WEB.png"
          alt="College of Engineering Logo"
          width={300}
          height={80}
          className="object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold cyber-gradient tracking-tight">
            Social Engineering Lab
          </h1>
          <p className="text-foreground/80 text-lg">
            AI-Powered Message Generator for Security Research
          </p>
          <div className="flex gap-2 justify-center">
            <Badge variant="outline" className="glass-panel">
              Educational Purpose
            </Badge>
            <Badge variant="outline" className="glass-panel">
              Security Research
            </Badge>
          </div>
        </div>

        {/* Instructions Card */}
        <Card className="p-6 glass-panel space-y-4">
          <h2 className="text-xl font-semibold cyber-gradient">About This Research Tool</h2>
          <div className="space-y-4 text-sm text-foreground/80">
            <div>
              <h3 className="font-semibold mb-2">Purpose & Methodology</h3>
              <p className="leading-relaxed">
                This tool demonstrates the intersection of artificial intelligence and social engineering tactics,
                showcasing how AI can be used to understand and prevent social engineering attacks. By generating
                example messages, it helps researchers and security professionals study common manipulation patterns
                and develop better defense strategies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How It Works</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">AI Integration:</span> Utilizes Google's Gemini AI model to analyze
                  and generate context-aware social engineering scenarios
                </li>
                <li>
                  <span className="font-medium">Persona-based Analysis:</span> Targets specific organizational roles
                  to demonstrate how attackers might customize their approach
                </li>
                <li>
                  <span className="font-medium">Keyword Implementation:</span> Incorporates user-specified keywords
                  to show how attackers leverage relevant business terminology
                </li>
                <li>
                  <span className="font-medium">Educational Output:</span> Generates examples that highlight manipulation
                  tactics, psychological triggers, and social engineering techniques
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Research Applications</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Study patterns in social engineering attacks and their evolution with AI</li>
                <li>Develop and test detection mechanisms for AI-generated phishing attempts</li>
                <li>Train security teams to recognize sophisticated social engineering tactics</li>
                <li>Research the impact of AI on cybersecurity threat landscapes</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
              <p className="text-destructive font-medium">Important Notice:</p>
              <p className="mt-1 text-foreground/70">
                This tool is strictly for cybersecurity research and educational purposes.
                Any use for actual malicious activities is prohibited and may be subject to legal consequences.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold cyber-gradient">Message Generator</h2>
              <Button
                variant="outline"
                onClick={() => setShowApiInput(!showApiInput)}
                className="text-sm glass-panel"
              >
                {showApiInput ? "Hide API Settings" : "Configure API"}
              </Button>
            </div>

            {showApiInput && (
              <div className="space-y-4 p-4 rounded-lg glass-panel">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90">Gemini API Key</label>
                  <Input
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="text-input font-mono"
                  />
                </div>
                <p className="text-xs text-foreground/70 space-y-1.5">
                  <span className="block font-medium text-primary/90">Get your free API key:</span>
                  <span className="block">1. Visit{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/90 underline underline-offset-4"
                    >
                      Google AI Studio
                    </a>
                  </span>
                  <span className="block">2. Sign in with your Google account</span>
                  <span className="block">3. Click "Get API key" and create a new key</span>
                  <span className="block">4. Copy and paste your key above</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Target Persona</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Corporate Finance Manager"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="text-input"
                />
                <Button
                  variant="outline"
                  onClick={generateRandomPersona}
                  className="whitespace-nowrap glass-panel"
                >
                  Random
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/90">Keywords</label>
              <Input
                placeholder="e.g. urgent, invoice, payment due"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="text-input"
              />
              <p className="text-xs text-foreground/70">Separate keywords with commas</p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full relative overflow-hidden group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  Generating
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                <span>Generate Message</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent group-hover:translate-x-full transition-transform duration-500" />
            </Button>

            {generatedMessage && (
              <div className="space-y-2 mt-4">
                <div className="p-4 rounded-lg glass-panel relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                  <pre className="whitespace-pre-wrap font-mono text-sm relative">
                    {generatedMessage}
                  </pre>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedMessage);
                      toast.success("Copied to clipboard");
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glass-panel"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Sponsor Logos */}
        <div className="mt-16 space-y-6">
          <h3 className="text-center text-lg font-semibold text-foreground/80">Sponsored By</h3>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            <Image
              src="/fema.png"
              alt="FEMA Logo"
              width={160}
              height={80}
              className="object-contain"
            />
            <Image
              src="/oklahoma homeland security.png"
              alt="Oklahoma Homeland Security Logo"
              width={280}
              height={140}
              className="object-contain"
            />
            <Image
              src="/oklahoma office of homeland security.png"
              alt="Oklahoma Office of Homeland Security Logo"
              width={160}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* Copyright */}
        <footer className="text-center text-sm text-foreground/60 pt-8 border-t border-primary/20">
          <p>© 2025 INQUIRE-LAB. All rights reserved.</p>
          <p className="mt-1">
            Designed by INQUIRE-LAB and developed by Danial Ebrahimzadeh
          </p>
        </footer>
      </div>
      <Toaster />
    </main>
  );
}

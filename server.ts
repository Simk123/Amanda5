import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Robust helper to generate content across fallback models when one is experiencing high demand (503/429)
async function generateWithModelFallback(contents: any, preferredModel = 'gemini-2.5-flash'): Promise<string> {
  const models = [preferredModel, 'gemini-3.7-flash', 'gemini-3.1-flash-lite'];
  const uniqueModels = Array.from(new Set(models));
  const ai = getGeminiClient();
  let lastErr: any = null;

  for (const model of uniqueModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} unavailable (${err?.status || err?.message || 'error'}), trying fallback model...`);
      lastErr = err;
    }
  }
  throw lastErr || new Error('All generative model fallbacks exhausted');
}

// Procedural high-art beaded SVG fallback generator
function generateProceduralBeadedSvg(subject: string, theme: string): { svg: string; title: string } {
  const uid = `bead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  let primaryColor = '#e11d48'; // Ruby red
  let secondaryColor = '#f5f2e9'; // Pearl white
  let accentColor = '#eab308'; // Metallic gold

  if (theme.includes('ocean') || theme.includes('sapphire')) {
    primaryColor = '#0284c7';
    secondaryColor = '#38bdf8';
    accentColor = '#f0fdfa';
  } else if (theme.includes('forest') || theme.includes('emerald')) {
    primaryColor = '#059669';
    secondaryColor = '#34d399';
    accentColor = '#fef08a';
  } else if (theme.includes('lavender') || theme.includes('purple')) {
    primaryColor = '#9333ea';
    secondaryColor = '#c084fc';
    accentColor = '#fef08a';
  } else if (theme.includes('sunset') || theme.includes('amber')) {
    primaryColor = '#ea580c';
    secondaryColor = '#f59e0b';
    accentColor = '#fef08a';
  }

  // Generate bead circles along floral and star garland rings
  let beadElements = '';
  const beadCount = 18;
  const radius = 52;
  const cx = 100;
  const cy = 105;

  for (let i = 0; i < beadCount; i++) {
    const angle = (i / beadCount) * Math.PI * 2;
    const bx = cx + Math.cos(angle) * radius;
    const by = cy + Math.sin(angle) * radius;
    const isGold = i % 3 === 0;
    const isPearl = i % 3 === 1;
    const fill = isGold ? `url(#gold_${uid})` : isPearl ? `url(#pearl_${uid})` : `url(#ruby_${uid})`;
    const beadRadius = isGold ? 7.5 : 8.5;
    beadElements += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${beadRadius}" fill="${fill}" stroke="rgba(0,0,0,0.25)" stroke-width="0.75" />\n`;
  }

  // Inner ring of iridescent pearls
  for (let j = 0; j < 8; j++) {
    const innerAngle = (j / 8) * Math.PI * 2 + 0.3;
    const ix = cx + Math.cos(innerAngle) * 26;
    const iy = cy + Math.sin(innerAngle) * 26;
    beadElements += `<circle cx="${ix.toFixed(1)}" cy="${iy.toFixed(1)}" r="6" fill="url(#pearl_${uid})" stroke="rgba(0,0,0,0.2)" stroke-width="0.5" />\n`;
  }

  // Centerpiece golden medallion bead
  beadElements += `<circle cx="${cx}" cy="${cy}" r="15" fill="url(#gold_${uid})" stroke="rgba(0,0,0,0.3)" stroke-width="1" />\n`;
  beadElements += `<circle cx="${cx - 3}" cy="${cy - 3}" r="4" fill="#ffffff" opacity="0.8" />\n`;

  // Top chrome jewelry hanger loop
  beadElements += `<path d="M 94 48 C 94 30, 106 30, 106 48" fill="none" stroke="#e5e7eb" stroke-width="3.5" stroke-linecap="round" />\n`;
  beadElements += `<circle cx="100" cy="46" r="5" fill="url(#gold_${uid})" stroke="rgba(0,0,0,0.3)" stroke-width="0.75" />\n`;

  const svg = `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ruby_${uid}" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
        <stop offset="25%" stop-color="${primaryColor}" />
        <stop offset="85%" stop-color="#881337" />
        <stop offset="100%" stop-color="#4c0519" />
      </radialGradient>
      <radialGradient id="pearl_${uid}" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="45%" stop-color="${secondaryColor}" />
        <stop offset="80%" stop-color="#d6d3d1" />
        <stop offset="100%" stop-color="#a8a29e" />
      </radialGradient>
      <radialGradient id="gold_${uid}" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#fffbeb" />
        <stop offset="35%" stop-color="${accentColor}" />
        <stop offset="80%" stop-color="#b45309" />
        <stop offset="100%" stop-color="#78350f" />
      </radialGradient>
      <filter id="shadow_${uid}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.5" />
      </filter>
    </defs>
    <g filter="url(#shadow_${uid})">
      ${beadElements}
    </g>
  </svg>`;

  const words = subject.split(/[\s,.-]+/);
  const title = (words.slice(0, 2).join(' ') || 'CHARM').toUpperCase();
  return { svg, title };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API: AI Beaded Charm Generator (generates customized beaded jewelry charms)
  app.post('/api/generate-charm', async (req, res) => {
    const { prompt: userPrompt, theme = 'candy-cane' } = req.body;
    const subject = (userPrompt || 'lucky star charm').trim();
    const words = subject.split(/[\s,.-]+/);
    const mainWord = words.slice(0, 2).join(' ') || 'CHARM';
    const suggestedTitle = mainWord.toUpperCase();

    try {
      const text = await generateWithModelFallback([
        {
          text: `You are an expert artisan jewelry designer and SVG vector artist specializing in beaded phone charms, woven glass seed bead keychains, and pearl milestone ornaments.
Create a stunning, intricate, tactile vector SVG illustration of a beaded charm.
Subject: "${subject}"
Color/Bead Palette Theme: "${theme}" (e.g. lustrous pearl whites, ruby glass seed beads, metallic gold spacer beads, seafoam turquoise, emerald).

STRICT SVG REQUIREMENTS:
1. Return ONLY valid SVG code starting with <svg and ending with </svg>.
2. viewBox="0 0 200 200" with width="100%" height="100%".
3. Render individual spherical seed beads, lustrous freshwater pearls with radial specular gradients, golden spacer beads, and textured bead rows that compose the shape of the subject.
4. Transparent background (do not put a black/white background box).
5. Rich highlights (<radialGradient> or specular dots on beads) for realistic gloss and shine.
6. Do NOT include markdown fences, backticks, or any conversational text.`,
        },
      ], 'gemini-2.5-flash');

      const svgMatch = text ? text.match(/<svg[\s\S]*<\/svg>/i) : null;
      let cleanSvg = svgMatch ? svgMatch[0] : null;

      if (cleanSvg) {
        // Namespace IDs to avoid collision in DOM
        const uid = `bead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        cleanSvg = cleanSvg
          .replace(/id="([^"]+)"/g, `id="$1_${uid}"`)
          .replace(/url\(#([^)]+)\)/g, `url(#$1_${uid})`)
          .replace(/href="#([^"]+)"/g, `href="#$1_${uid}"`);

        return res.json({
          svg: cleanSvg,
          suggestedTitle: suggestedTitle,
        });
      }

      // If SVG parsing was imperfect, use procedural beaded SVG
      const procedural = generateProceduralBeadedSvg(subject, theme);
      return res.json({
        svg: procedural.svg,
        suggestedTitle: procedural.title || suggestedTitle,
      });
    } catch (error: any) {
      console.warn('[Bead Generator] Using procedural fallback due to upstream error:', error?.message);
      const procedural = generateProceduralBeadedSvg(subject, theme);
      return res.json({
        svg: procedural.svg,
        suggestedTitle: procedural.title || suggestedTitle,
      });
    }
  });

  // API: Suggest Heartfelt Anniversary Letter
  app.post('/api/suggest-letter', async (req, res) => {
    const { author, currentNote } = req.body;
    try {
      const letterText = await generateWithModelFallback([
        {
          text: `Write a short, heartfelt, warm 2-3 sentence congratulatory anniversary note from teammate "${author || 'a teammate'}" celebrating Amanda's 5-year work anniversary.
Highlight her warm leadership, helpfulness, and creative dedication.
Keep it authentic, touching, and avoid clichés or corporate fluff.
Current draft context: "${currentNote || ''}". Output only the letter body text without quotation marks.`,
        },
      ], 'gemini-2.5-flash');

      return res.json({ letter: letterText.trim() });
    } catch (error: any) {
      console.warn('[Letter Generator] Using fallback note due to upstream error:', error?.message);
      return res.json({
        letter:
          "Thank you for being such an extraordinary, warm, and helpful teammate.\nHere's to 5 incredible years and many more milestones ahead!",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Amanda Collection server running on http://localhost:${PORT}`);
  });
}

startServer();

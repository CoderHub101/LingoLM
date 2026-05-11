# LingoLM Frontend

A modern, beautifully designed Next.js frontend for LingoLM - an AI-powered vocabulary learning platform.

## Design Philosophy

This frontend avoids generic AI-generated aesthetics by implementing:

- **Typography-forward design** using Merriweather (serif), Outfit (sans), and JetBrains Mono
- **Warm, editorial color palette** with cream, sage, terracotta, and ochre tones
- **Thoughtful animations** using Framer Motion for delightful micro-interactions
- **Asymmetric, magazine-style layouts** that feel curated and intentional
- **Generous spacing** and attention to typographic hierarchy

## Features

### Lookup Page (/)
- Language selection with elegant pill buttons
- Real-time search with loading states
- Auto-populated vocabulary cards with:
  - Definitions
  - Example sentences
  - Related words
  - Personal notes section
- AI chat assistant for nuance questions

### Saved Cards Page (/cards)
- Personal knowledge base with search and filtering
- Grid/list view toggle
- Card preview with quick access to definitions and notes
- Tag system for organization
- Click-to-expand full card details

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Custom color palette** avoiding generic purples and blues

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lingolm-frontend/
├── app/
│   ├── page.tsx          # Lookup page
│   ├── cards/
│   │   └── page.tsx      # Saved cards page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Navigation.tsx    # Top navigation bar
│   ├── VocabularyCard.tsx # Card component
│   └── ChatAssistant.tsx  # AI chat modal
├── tailwind.config.js    # Custom theme
└── package.json
```

## Design Decisions

### Color Palette
- **Cream (#F8F5F0)**: Warm background, easy on the eyes
- **Ink (#1A1A1A)**: Deep text color, high contrast
- **Sage (#7A8B7F)**: Muted green for secondary elements
- **Terracotta (#D4745F)**: Warm accent for CTAs
- **Ochre (#C89F5E)**: Golden accent for highlights

### Typography
- **Merriweather**: Serif for headings, adds authority and editorial feel
- **Outfit**: Modern sans-serif for body text, clean and readable
- **JetBrains Mono**: Code-style font for tags and metadata

### Animations
- Subtle fade-ins and slide-ups on page load
- Hover states that feel responsive but not distracting
- Staggered reveals for lists to create rhythm
- Smooth transitions between states

## Future Enhancements

- Spaced repetition system
- Article ingestion and batch processing
- Advanced search with tags and linking
- Export functionality
- Dark mode toggle
- Mobile-optimized gestures

## Notes

This design intentionally avoids:
- Generic system fonts (Inter, Arial, Roboto)
- Purple gradients on white backgrounds
- Cookie-cutter component libraries
- Predictable card layouts
- Overused animations

Instead, it creates a distinctive, editorial aesthetic that feels hand-crafted and purposeful.

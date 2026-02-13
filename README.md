# Will You Be My Valentine? 💘

A cute, playful Valentine's Day proposal website built with React + Vite.

## 🖼️ Adding Your Own Images

1. Replace the images in `public/images/` with your own photos
2. Name them `image01.jpg` through `image12.jpg`
3. Square images (1:1 ratio) work best, but any aspect ratio is fine
4. If you have more/fewer than 12, update the `IMAGES` array in `src/components/ValentinePage.tsx`

## ✏️ Customizing

Edit `src/components/ValentinePage.tsx`:

- **`NO_MESSAGES`** — Funny escalating messages shown on each "No" click
- **`CAPTIONS`** — Cute captions shown under each photo
- **`RUNAWAY_THRESHOLD`** — After this many "No" clicks, the button runs away (default: 10)
- **Headline** — Search for "Will you be my Valentine?" and change it
- **Success message** — Search for "YAY!!" and customise

## 🚀 Deploy

1. `npm install`
2. `npm run build`
3. Deploy the `dist/` folder to GitHub Pages or any static host
4. For GitHub Pages with a subpath, set `base: '/your-repo-name/'` in `vite.config.ts`

## 🎮 How It Works

- **No** → cycles images, shows funny messages, Yes button grows bigger
- **After 10 No clicks** → the No button runs away from your cursor!
- **Yes** → confetti celebration + cute success screen 🎉
- Respects `prefers-reduced-motion` for accessibility

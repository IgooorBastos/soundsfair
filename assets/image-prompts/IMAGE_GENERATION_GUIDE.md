# Image Generation Guide

**Purpose:** Complete instructions for generating all 34 educational images using AI tools
**Tools Supported:** Midjourney, DALL-E 3, Stable Diffusion, other AI image generators
**Estimated Time:** 4-8 hours total (spread across 1-4 weeks)
**Cost Estimate:** $30-60 (Midjourney Standard Plan) or $20 (OpenAI API credits)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Tool Selection](#tool-selection)
3. [Midjourney Instructions](#midjourney-instructions)
4. [DALL-E 3 Instructions](#dall-e-3-instructions)
5. [Quality Control](#quality-control)
6. [Post-Processing](#post-processing)
7. [Integration](#integration)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- [ ] AI image generation account (Midjourney or OpenAI)
- [ ] Image editing software (optional): Photopea (free), Photoshop, GIMP
- [ ] Image optimization tool: Squoosh.app (free, web-based)
- [ ] 30-60 minutes per session for quality generation

### Generation Workflow (Per Image)

1. **Read the prompt file** (e.g., `/level-01/inflation-thief.md`)
2. **Copy the "Primary AI Generation Prompt"**
3. **Add recommended parameters** (from prompt file)
4. **Generate 4 variations** (standard practice)
5. **Select best result** (matches quality criteria)
6. **Upscale if needed** (to 1920×1080px)
7. **Optimize** (convert to WebP, compress)
8. **Save** with correct filename and location
9. **Verify** against quality checklist

---

## Tool Selection

### Midjourney (Recommended)

**Pros:**
- Excellent at clean infographics and data visualizations
- Consistent visual quality
- Good at following color specifications
- --style raw mode prevents artistic over-interpretation

**Cons:**
- Requires Discord account
- Subscription required ($10-30/month)
- Less precise text rendering
- Community feed (less privacy)

**Best For:** Most images, especially data visualizations, diagrams, technical infographics

### DALL-E 3 (Alternative)

**Pros:**
- Excellent text rendering (good for charts with labels)
- More literal interpretation of prompts
- ChatGPT integration (convenient)
- Privacy (private generation)

**Cons:**
- Tends toward photorealism (need to explicitly request flat/infographic style)
- Fewer parameters/control
- Can be overly detailed when simplicity is needed

**Best For:** Charts with text labels, comparison tables, any image requiring readable text

### Stable Diffusion / Other Tools

**Pros:**
- Free and open source
- Maximum control
- No usage limits

**Cons:**
- Requires technical setup
- Steeper learning curve
- May need fine-tuning for infographic style

**Best For:** Advanced users, budget-conscious, or requiring complete control

---

## Midjourney Instructions

### Setup

1. **Sign up:** https://midjourney.com
2. **Join Discord server** (you'll receive invite after signup)
3. **Navigate to any #general or #newbies channel**
4. **Start with /imagine command**

### Basic Command Structure

```
/imagine prompt: [PASTE PRIMARY PROMPT HERE] --ar 16:9 --style raw --v 6 --s 250
```

### Parameter Explanations

- `--ar 16:9` - Aspect ratio (always use for these images)
- `--style raw` - Prevents artistic over-interpretation, stays closer to prompt
- `--v 6` - Version 6 (latest at time of writing)
- `--s 250` - Stylization level (200-300 recommended for educational content)

### Example: Generating "Inflation Thief" Image

1. Open `/level-01/inflation-thief.md`
2. Copy the **Primary AI Generation Prompt** section (the full paragraph)
3. In Midjourney Discord, type:

```
/imagine prompt: Create a minimalist, symbolic illustration showing the concept of inflation as wealth theft over time. Show a clean, geometric representation of a stack of gold coins gradually fading and dissolving from left to right across a horizontal timeline spanning three distinct time markers: 1950, 1985, and 2023. The leftmost stack (1950) should be full height representing 100% purchasing power, shown in bright libertarian gold (#FFD000). The middle stack (1985) should be approximately half the height, with some coins beginning to fade and dissolve into muted red particles. The rightmost stack (2023) should be a tiny remaining stack, only 5% of the original height, heavily faded with most coins dissolved into floating red particle effects representing lost value. Use a pure black background (#000000) for maximum contrast... [continue with full prompt] --ar 16:9 --style raw --v 6 --s 250
```

4. **Wait 1-2 minutes** for Midjourney to generate 4 variations
5. **Review results** using the quality criteria from the prompt file
6. **Upscale the best version** (click U1, U2, U3, or U4 below the image)
7. **Download** the upscaled image (right-click > Save Image)

### Using Negative Prompts

Midjourney v6 doesn't use `--no` as effectively as earlier versions. Instead, include negative instructions in the main prompt:

```
Style should be flat design... No photorealism, no 3D rendering, no cluttered elements, no human faces.
```

### Remix Mode (For Variations)

If first result is close but needs adjustments:

1. Enable Remix: `/settings` → Enable Remix Mode
2. Click "Vary (Strong)" or "Vary (Subtle)" under your image
3. Adjust prompt when prompted
4. Generate new variations based on original

---

## DALL-E 3 Instructions

### Access Options

**Option A: ChatGPT Plus ($20/month)**
1. Go to chat.openai.com
2. Select GPT-4 with DALL-E
3. Paste prompt
4. Download result

**Option B: OpenAI API (Pay-per-use)**
1. Use OpenAI Playground or API directly
2. Costs ~$0.04-0.08 per image
3. More control, less convenient

### Prompt Adaptations for DALL-E

DALL-E tends toward photorealism and complexity. For each prompt, **add these phrases**:

```
IMPORTANT: This should be a flat design infographic, NOT a photograph or 3D render.
Style: Clean vector illustration, minimal, educational diagram quality.
Avoid: Photorealism, 3D effects, complex textures, realistic lighting.
```

### Example: DALL-E Command

```
Create a minimalist, symbolic illustration showing the concept of inflation...
[full prompt from file]

IMPORTANT: Flat design infographic style only. Clean vector illustration.
Educational diagram quality. No photorealism, no 3D rendering.
```

### DALL-E Pro Tips

1. **Emphasize simplicity** - DALL-E adds detail unless told otherwise
2. **Request "infographic style"** explicitly
3. **Specify "educational diagram"** to avoid artistic interpretation
4. **Use color hex codes** - DALL-E respects them well
5. **Break complex prompts into parts** if needed (generate, then edit)

---

## Quality Control

### Pre-Generation Checklist

Before generating each image, verify:
- [ ] Read entire prompt file (not just primary prompt)
- [ ] Understand the concept being visualized
- [ ] Note quality criteria (what to accept/reject)
- [ ] Have parameters ready (--ar 16:9, etc.)
- [ ] Budget 3-5 attempts per image (some may need iteration)

### During Generation: Quick Quality Check

After each generation, ask:
1. **Does it match the concept?** (Immediately clear what it represents?)
2. **Are colors correct?** (Black background, gold/red/blue as specified?)
3. **Is it educational?** (Not too artistic, not propaganda-like?)
4. **Is it legible?** (Will text/elements be clear at various sizes?)
5. **Does it pass the quality criteria?** (Check "Approved if" list in prompt file)

### If Result Doesn't Match

**Common Issues & Fixes:**

| Issue | Solution |
|-------|----------|
| Too photorealistic | Add "flat design infographic, no photorealism" |
| Too artistic/abstract | Add "technical diagram, educational quality, clear and literal" |
| Wrong colors | Explicitly repeat hex codes: "background must be pure black #000000" |
| Too cluttered | Add "minimalist, clean, uncluttered, simple composition" |
| Missing key elements | List required elements: "must include: [X, Y, Z]" |
| Text illegible | Use DALL-E instead, or omit text and add in post-processing |

### When to Regenerate

Regenerate if the image:
- ❌ Fails any item in "Reject if" list (from prompt file)
- ❌ Uses wrong color scheme
- ❌ Misrepresents the concept (could teach incorrectly)
- ❌ Looks propagandistic or sensationalist
- ❌ Is too complex to understand quickly

Accept and move on if:
- ✅ Passes all items in "Approved if" list
- ✅ Educational and clear
- ✅ Matches visual identity (colors, style)
- ✅ Minor imperfections that won't affect learning

**Don't chase perfection** - 80% quality and moving forward is better than endlessly iterating on one image.

---

## Post-Processing

### 1. Crop to Exact Aspect Ratio (if needed)

**Tool:** Photopea (free): https://www.photopea.com

1. Open image in Photopea
2. Image → Canvas Size
3. Set to 1920 × 1080 px (16:9)
4. Position as needed
5. Export as PNG

### 2. Optimize Image Size

**Tool:** Squoosh (free): https://squoosh.app

**Process:**
1. Upload PNG from AI generator
2. **Right panel settings:**
   - Format: WebP
   - Quality: 85-90
   - Resize: 1920 × 1080 (if needed)
3. **Verify file size:** Should be <250KB (most images), <300KB max
4. Download WebP version
5. **Repeat for PNG fallback:**
   - Format: PNG
   - Compression: Palette (if <256 colors) or OxiPNG
   - Target: <500KB
6. Download PNG version

### 3. Add Text (if needed)

If AI didn't render text correctly:

**Tool:** Photopea or Figma

1. Open image
2. Add text layer with:
   - Font: Inter (sans-serif) for labels
   - Font: IBM Plex Mono (monospace) for numbers
   - Colors: As specified in prompt
   - Size: 16-24px for labels, 32-48px for titles
3. Export as PNG, then optimize

### 4. Verify Accessibility

**Color Contrast Check:** https://webaim.org/resources/contrastchecker/

- Text on black background: Minimum 4.5:1 ratio (WCAG AA)
- All specified colors should pass:
  - White (#FFFFFF) on black (#000000): ✅ 21:1
  - Gold (#FFD000) on black: ✅ 14:1
  - Red (#FF4444) on black: ✅ 5.4:1
  - Blue (#4477FF) on black: ✅ 6.7:1

If contrast fails, adjust color slightly lighter.

---

## Integration

### File Naming and Storage

After optimization, save two versions:

**WebP (primary):**
```
/public/images/lessons/level-01-inflation-thief.webp
```

**PNG (fallback):**
```
/public/images/lessons/level-01-inflation-thief.png
```

### File Naming Convention

Format: `level-XX-[image-id].ext`

Examples:
- `level-01-inflation-thief.webp`
- `level-03-blockchain-ledger-visualization.png`
- `level-08-portfolio-allocation-strategy.webp`

### Integration with Lesson Pages

Images will be automatically used by the `ImagePlaceholder` component:

```tsx
<ImagePlaceholder
  imageId="level-01-inflation-thief"
  title="The Inflation Thief"
  alt="Visualization showing three stacks of gold coins..."
  aspectRatio="16:9"
/>
```

The component will:
1. Check if `/public/images/lessons/level-01-inflation-thief.webp` exists
2. If yes: Display the image
3. If no: Show development placeholder with AI prompt reference

No code changes needed once images are in the correct location.

### Testing Integration

After adding images:

1. **Start dev server:**
   ```bash
   cd soundsfair-app
   npm run dev
   ```

2. **Navigate to lesson page** (e.g., `/learn/level-01`)
3. **Verify images load correctly**
4. **Test responsiveness** (resize browser window)
5. **Check WebP support:**
   - Modern browsers: Should load WebP
   - Older browsers: Should fall back to PNG

---

## Troubleshooting

### Issue: "AI keeps making it too artistic"

**Solutions:**
- Use Midjourney `--style raw` parameter
- Add "technical diagram, educational infographic, no artistic interpretation" to prompt
- Reference specific styles: "similar to IMF report infographic" or "World Bank data visualization"

### Issue: "Colors don't match specification"

**Solutions:**
- Put hex codes directly in prompt: "pure black background #000000"
- Emphasize: "Colors must match exactly: gold #FFD000, red #FF4444"
- Post-process: Use Photopea to color-correct with adjustment layers

### Issue: "Text is illegible or misspelled"

**Solutions:**
- Use DALL-E 3 (better text rendering)
- Generate without text, add text in post-processing with Photopea/Figma
- Simplify text: Use fewer words, larger size

### Issue: "Image looks propagandistic or biased"

**Solutions:**
- Emphasize neutral tone: "factual, objective, educational, unbiased presentation"
- Reference academic style: "research paper quality, think tank analysis aesthetic"
- Remove emotional language from prompt

### Issue: "File size too large (>300KB)"

**Solutions:**
- Use Squoosh with more aggressive compression (WebP quality 80-85)
- Reduce dimensions slightly if not critical (1600×900 instead of 1920×1080)
- Simplify image: More solid colors, less gradients

### Issue: "Can't decide between variations"

**Solutions:**
- Ask someone unfamiliar with Bitcoin: "Which explains the concept better?"
- Check against quality criteria in prompt file
- When in doubt, choose simpler/clearer over more artistic
- Remember: Education > Aesthetics

---

## Batch Generation Tips

### Efficient Workflow (Recommended)

**Week 1: HIGH Priority Batch 1 (7 images)**
- Generate all Level 1-3 HIGH priority images
- ~2-3 hours total
- Focus: Core concepts foundation

**Week 2: HIGH Priority Batch 2 (8 images)**
- Generate all Level 4-9 HIGH priority images
- ~2-3 hours total
- Focus: Economic case and practical guidance

**Week 3: MEDIUM Priority Batch 1 (10 images)**
- Generate half of remaining MEDIUM priority images
- ~3 hours total
- Focus: Supporting visualizations

**Week 4: MEDIUM Priority Batch 2 (9 images)**
- Generate remaining MEDIUM priority images
- ~3 hours total
- Complete full image suite

### Pro Tips for Batch Work

1. **Work in 2-hour blocks** - Mental fatigue reduces quality judgment
2. **Generate 3-5 images per session** - Don't rush
3. **Review with fresh eyes** - Generate one day, approve the next
4. **Keep prompt files open** - Constantly reference quality criteria
5. **Save all variations** - You might prefer a different one later
6. **Document modifications** - If you adjust prompts, note what worked

---

## Cost Estimates

### Midjourney

- **Plan:** Standard ($30/month) or Basic ($10/month)
- **Images per plan:** ~200 fast generations
- **Our need:** 34 images × ~3 attempts average = ~100 generations
- **Estimated cost:** $10-30 (one month) + potential overage
- **Recommendation:** Standard plan for one month, cancel after completion

### DALL-E 3

- **Via ChatGPT Plus:** $20/month, unlimited generations
- **Via API:** ~$0.04-0.08 per image × 34 images × 3 attempts = ~$4-8
- **Recommendation:** ChatGPT Plus for one month if already useful to you, otherwise API

### Free Alternative (Time Cost)

- **Stable Diffusion (free, self-hosted)**
- **Time investment:** +5-10 hours for setup and learning
- **Worth it if:** You'll generate many images beyond this project

---

## Success Metrics

After completing all images, verify:

- [ ] All 34 images generated (15 HIGH, 19 MEDIUM)
- [ ] All images match visual identity (black background, correct colors)
- [ ] All images pass quality criteria from prompt files
- [ ] All images optimized (<250KB WebP, <500KB PNG)
- [ ] All images saved in correct location with correct naming
- [ ] All images display correctly in lesson pages
- [ ] All images are accessible (sufficient contrast, alt text prepared)
- [ ] Total time investment logged (for future reference)

---

## Next Steps After Image Generation

Once all images are generated:

1. **Move to Phase 4:** Content Integration
   - Update lesson markdown files to use images
   - Add captions and accompanying text
   - Verify image placement enhances learning

2. **Quality Assurance:**
   - Review entire course with images integrated
   - Test on mobile devices
   - Verify loading performance
   - Run accessibility audit

3. **Documentation:**
   - Update `IMAGE_GENERATION_GUIDE.md` with lessons learned
   - Note any prompt modifications that worked better
   - Create image attribution file if required

---

## Resources

### AI Image Generation Tools

- **Midjourney:** https://midjourney.com
- **DALL-E 3:** https://chat.openai.com (ChatGPT Plus) or https://platform.openai.com/playground
- **Stable Diffusion:** https://stability.ai

### Post-Processing Tools

- **Photopea (free Photoshop alternative):** https://www.photopea.com
- **Squoosh (image optimization):** https://squoosh.app
- **Figma (design tool):** https://figma.com

### Quality Check Tools

- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Image Accessibility:** https://www.accessibilityoz.com/resources/tools/
- **WebP Support Check:** https://caniuse.com/webp

---

**Phase 3 Complete:** All image prompts ready ✅
**Your Phase (Phase 4):** Generate images using this guide
**Estimated Completion:** 4-8 hours across 1-4 weeks

Good luck! Take your time, prioritize HIGH priority images, and remember: educational clarity is more important than artistic perfection.

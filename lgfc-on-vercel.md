# LGFC Canva Code Pack (Copilot-Ready)

This pack reconstructs static scaffold code extracted from the 13 Canva screenshots for the **Lou Gehrig Fan Club** website.

It gives Copilot Agent a single source of truth to build the public prototype and convert each section into real React components under the existing Next.js App Router structure.

---

## 📁 Files to Create

| File | Path | Purpose |
|------|------|----------|
| `README.md` | `/public/prototype/README.md` | Copilot instructions |
| `index.html` | `/public/prototype/index.html` | Visual scaffold prototype |
| `styles.css` | `/public/prototype/styles.css` | Consolidated CSS styling |

---

## 🧩 Integration Steps

1. **Create branch** `feat/canva-scaffold`.
2. **Add folder** `/public/prototype/` and create the three files below.
3. **Commit + push.**
4. Verify `/prototype/index.html` renders in browser.
5. Begin React conversion:  
   - `components/Hero.tsx`  
   - `components/Voting.tsx`  
   - `components/Friends.tsx`  
   - `components/Timeline.tsx`  
   - `components/Faq.tsx`  
   - `components/Calendar.tsx`  
   - `components/Footer.tsx`  
6. Replace hardcoded text/images with Supabase + Backblaze B2 data and `/api/vote` endpoint.
7. Keep nav/footer identical to approved spec.

---

## 🧾 README.md (for prototype folder)

```markdown
# Lou Gehrig Fan Club — Prototype Scaffold

This static prototype mirrors the intended Next.js layout.

**Sections**
1. Header / Navigation  
2. Hero banner  
3. Weekly Matchup (Voting)  
4. Friends of the Club  
5. Timeline (Milestones)  
6. News & Q&A (FAQ)  
7. Results Table  
8. Calendar  
9. Social Wall (Elfsight)  
10. Footer  

Use this as a reference when implementing React components.
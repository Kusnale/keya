# KEYA – Summer Dresses (React + Vite)

## Run it
1. Install Node.js (v18 or newer) from nodejs.org
2. Open this folder in VS Code (File > Open Folder)
3. Open the terminal in VS Code (Terminal > New Terminal) and run:
   npm install
   npm run dev
4. Open the link it prints (usually http://localhost:5173)

## Build for hosting
   npm run build      (output goes to the dist folder)

## Two ways to use it
- Project (this folder): needs Node.js, run with npm as above.
- standalone/keya-standalone.html: the same site in ONE file (HTML + CSS + JavaScript + React). Just double-click it. No install needed (internet needed for React and fonts).

## Where things are
- src/data/dresses.js          all dresses: name, price, oldPrice, category, type, photo, section
                               section: "party" shows in the New launch 3D ring, "summer" shows in Summer dresses (70 dresses from the first videos + the last 24 of the party video = summer; the first 23 of the party video = party)
- public/dresses/              the dress photos (replace with your own, same file names)
- src/context/StoreContext.jsx bag, wishlist, popup and toast state
- src/components/              Hero3D, Launch, Ring3D, Collection, DressCard, DressModal, Drawer, Checkout ...
- src/styles.css               all styling

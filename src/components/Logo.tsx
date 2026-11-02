/**
 * Logo.tsx — the cursive "AD" monogram in the top-left corner.
 *
 * The letters are real vector shapes (SVG paths), traced from the
 * Great Vibes script font (open-source, SIL Open Font License) and
 * overlapped so they read as one monogram. Because they're shapes, not
 * text, the logo looks the same everywhere and never waits for a font.
 * The same shapes make the browser-tab icon (src/app/icon.svg) and the
 * big logo on the last photo (EndScene.tsx).
 *
 * On page load the logo "writes itself": Motion animates each letter's
 * outline from 0 to fully drawn (pathLength), then fills it in.
 * Clicking it glides back to the very top of the page.
 */
"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export const VIEWBOX = "6 -800 1623 876";
export const LETTERS = [
  // A
  "M545 64Q501 64 483 29.5Q465 -5 465 -51Q465 -92 476.5 -132Q488 -172 504 -193Q477 -161 437 -120Q397 -79 349 -41Q301 -3 250 22Q199 47 149 47Q83 47 50.5 5Q18 -37 18 -110Q18 -167 37.5 -232.5Q57 -298 95 -366Q113 -399 135.5 -431.5Q158 -464 184 -493Q153 -508 124 -526.5Q95 -545 77 -571Q59 -597 59 -633Q59 -652 67.5 -667.5Q76 -683 86 -683Q95 -683 95 -672Q95 -665 91 -657Q86 -644 86 -633Q86 -606 105 -582.5Q124 -559 151 -542Q178 -525 201 -515Q265 -585 341.5 -644.5Q418 -704 506 -740Q594 -776 691 -776Q772 -776 818 -740.5Q864 -705 864 -649Q864 -599 835.5 -563.5Q807 -528 761 -504.5Q715 -481 661.5 -467.5Q608 -454 556 -448.5Q504 -443 465 -443Q408 -443 354.5 -450Q301 -457 248 -472Q222 -435 191.5 -386.5Q161 -338 133.5 -284.5Q106 -231 88.5 -178.5Q71 -126 71 -81Q71 -32 94 -7.5Q117 17 156 17Q203 17 255.5 -11.5Q308 -40 361 -86Q414 -132 462 -186Q510 -240 548 -293Q586 -346 608 -387Q625 -419 641 -432.5Q657 -446 668 -446Q679 -446 685 -437.5Q691 -429 691 -415Q691 -387 666 -359Q632 -320 600 -264.5Q568 -209 548 -148.5Q528 -88 528 -35Q528 2 539.5 18Q551 34 570 34Q599 34 628.5 14.5Q658 -5 685 -38Q712 -71 735 -111.5Q758 -152 775 -193Q780 -193 783.5 -192Q787 -191 787 -184Q770 -141 746.5 -97Q723 -53 693 -16.5Q663 20 626 42Q589 64 545 64ZM456 -467Q496 -467 545 -471.5Q594 -476 642.5 -488Q691 -500 732 -522Q773 -544 798 -578Q823 -612 823 -661Q823 -705 786.5 -728Q750 -751 694 -751Q601 -751 524.5 -714.5Q448 -678 384.5 -619Q321 -560 264 -492Q308 -479 354.5 -473Q401 -467 456 -467Z",
  // D
  "M752 43Q711 43 674 31Q637 19 613.5 -5Q590 -29 590 -65Q590 -102 622.5 -132Q655 -162 715 -162Q778 -162 834.5 -133.5Q891 -105 954 -72Q1007 -123 1048.5 -190.5Q1090 -258 1128.5 -333Q1167 -408 1208 -482.5Q1249 -557 1300 -621Q1309 -632 1318 -643.5Q1327 -655 1337 -666Q1283 -698 1221 -715.5Q1159 -733 1093 -733Q1011 -733 941 -712Q871 -691 819.5 -655.5Q768 -620 739 -575.5Q710 -531 710 -484Q710 -442 727.5 -414.5Q745 -387 772 -374Q799 -361 825 -361Q860 -361 885 -374.5Q910 -388 926 -408Q942 -428 950 -447Q958 -466 959 -478Q959 -485 968 -485Q982 -485 979 -468Q974 -428 949 -398.5Q924 -369 889 -352.5Q854 -336 817 -336Q773 -336 737 -352.5Q701 -369 679.5 -402.5Q658 -436 658 -485Q658 -550 693 -601.5Q728 -653 789 -689Q850 -725 929 -744Q1008 -763 1096 -763Q1164 -763 1233 -746.5Q1302 -730 1364 -697Q1390 -726 1417.5 -748.5Q1445 -771 1474 -783Q1487 -788 1495 -788Q1501 -788 1501 -785Q1501 -780 1478 -760Q1465 -748 1447 -723.5Q1429 -699 1410 -670Q1470 -631 1516.5 -575.5Q1563 -520 1590 -449.5Q1617 -379 1617 -293Q1617 -209 1588 -146.5Q1559 -84 1509 -43Q1459 -2 1394 18.5Q1329 39 1257 39Q1172 39 1099.5 16Q1027 -7 965 -36Q916 3 863.5 23Q811 43 752 43ZM1342 -563Q1321 -530 1291 -479.5Q1261 -429 1224 -370Q1187 -311 1147 -252Q1107 -193 1066.5 -141.5Q1026 -90 988 -55Q1041 -29 1105 -10Q1169 9 1250 9Q1342 9 1410 -29.5Q1478 -68 1516 -134.5Q1554 -201 1554 -285Q1554 -394 1508 -483.5Q1462 -573 1385 -633Q1372 -612 1361 -593.5Q1350 -575 1342 -563ZM752 12Q803 15 851.5 -6.5Q900 -28 932 -53Q872 -82 821.5 -106Q771 -130 728 -130Q693 -130 674 -109.5Q655 -89 655 -64Q655 -32 680.5 -11Q706 10 752 12Z",
];

export function Logo() {
  const reduceMotion = usePrefersReducedMotion();

  const toTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // stay on the page without adding #top to the URL
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <a
      href="#top"
      onClick={toTop}
      aria-label="Aaron Du, back to top"
      className="-my-1 block text-accent transition-transform duration-200 ease-out-strong hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
    >
      <svg viewBox={VIEWBOX} className="h-9 w-auto overflow-visible" aria-hidden="true">
        {LETTERS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={6}
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{
              pathLength: { duration: 1.1, delay: 0.15 + i * 0.5, ease: "easeInOut" },
              fillOpacity: { duration: 0.5, delay: 0.85 + i * 0.5 },
            }}
          />
        ))}
      </svg>
    </a>
  );
}

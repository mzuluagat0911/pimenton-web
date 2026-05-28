"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type IconProps = {
  inView: boolean;
  hovered: boolean;
};

// =============================================================================
// PedidoSemana — delivery bag with "DELIVERY" lettering. Animation: scale-up
// entrance + hover micro-bounce on the whole icon. No internal animation
// needed — the bag reads as a single visual unit.
// =============================================================================
export function PedidoSemanaIcon({ inView, hovered }: IconProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 6 }}
      animate={inView ? { opacity: 1, scale: hovered ? 1.1 : 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="h-full w-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/icons/market/market_pedido-semana.svg"
        alt=""
        className="h-full w-full object-contain"
      />
    </motion.div>
  );
}

// =============================================================================
// Facturacion — dollar coin + 5 ascending bars + arrow. Animation: bars
// stagger up from their bottom edge (transform-box: fill-box, origin bottom).
// Hover: bars do a soft pulse.
// =============================================================================
const FACT_DOLLAR =
  "M88.2596 25.5923C131.078 20.3933 163.04 63.669 143.367 102.498C126.053 136.673 77.72 140.945 54.123 110.705C29.5777 79.2605 48.6025 30.4043 88.2542 25.5923H88.2596ZM93.1043 80.3341V103.277C90.7065 103.555 85.7855 101.174 84.2868 99.4841C80.0906 94.7647 84.968 89.8219 73.6 91.8056C73.0551 100.705 78.7881 105.212 86.2378 108.416C87.9108 109.135 92.7665 109.997 92.9899 110.264C94.663 112.253 89.5239 117.593 98.8428 115.899C98.0962 107.937 99.1426 111.059 104.619 109.642C128.609 103.43 120.02 77.3476 98.8374 74.5956V52.8024C101.655 52.6934 106.233 54.6607 108.053 56.7807C111.955 61.3311 108.102 67.3148 118.342 65.4238C119.274 57.0095 114.402 50.7751 106.848 47.6579C100.995 45.2437 97.4641 48.0449 98.8265 40.1756C91.5839 38.6987 94.1616 44.1919 92.9136 45.7233C92.6684 46.0285 87.1806 47.1565 85.4258 47.9958C66.9732 56.8297 75.3712 77.7782 93.0989 80.3286L93.1043 80.3341Z";
const FACT_ARROW =
  "M244.518 9.21606L238.785 50.5026C237.411 52.1048 227.155 42.6388 225.596 41.3745C206.087 59.3583 185.759 76.7264 163.089 90.6557C163.427 88.0126 160.195 80.9989 161.296 79.1951C162.026 77.9962 180.893 65.7017 184.25 63.075C195.58 54.2248 206.19 44.508 216.964 35.0202L204.375 24.1372L244.518 9.21606Z";
const FACT_SWOOSH =
  "M59.8342 138.825L0.193167 156.041C0.580093 153.218 -0.520749 148.967 0.334847 146.444C0.977906 144.553 16.4495 141.779 19.9318 140.803C26.1771 139.054 43.3381 132.166 47.9049 131.991C51.0984 131.872 57.5453 136.269 59.8342 138.82V138.825Z";
const FACT_DOLLAR_DETAIL_1 =
  "M98.8374 103.277V82.6284C113.9 84.6284 115.192 103.321 98.8374 103.277Z";
const FACT_DOLLAR_DETAIL_2 =
  "M93.1044 52.8022V72.3011C80.9789 69.7834 80.1287 54.8186 93.1044 52.8022Z";
// Bars left → right, shortest → tallest (the chart's ascending trend)
const FACT_BARS = [
  "M9.35948 184.722H50.0848C50.2047 184.722 51.8069 186.319 51.8069 186.444V244.946C51.8069 245.066 50.2101 246.668 50.0848 246.668H11.0816C10.9617 246.668 9.35948 245.072 9.35948 244.946V184.722Z",
  "M102.282 161.779H60.9841V246.668H102.282V161.779Z",
  "M153.901 137.692V244.952C153.901 245.072 152.304 246.674 152.179 246.674H112.603V137.697H153.901V137.692Z",
  "M204.375 114.749V246.668H163.078V116.465C163.078 114.182 167.754 115.926 169.318 115.948C180.822 116.122 193.171 116.563 204.375 114.743V114.749Z",
  "M256 92.95H214.702V246.668H256V92.95Z",
];

export function FacturacionIcon({ inView, hovered }: IconProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden
    >
      <motion.path
        d={FACT_DOLLAR}
        fill="currentColor"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <motion.path
        d={FACT_DOLLAR_DETAIL_1}
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
      />
      <motion.path
        d={FACT_DOLLAR_DETAIL_2}
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
      />
      <motion.path
        d={FACT_SWOOSH}
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.25 }}
      />
      <motion.path
        d={FACT_ARROW}
        fill="currentColor"
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8, y: 8 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
      />
      {FACT_BARS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="currentColor"
          style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0 }}
          animate={
            inView
              ? hovered && !reduced
                ? { opacity: 1, scaleY: [1, 1.06, 1] }
                : { opacity: 1, scaleY: 1 }
              : {}
          }
          transition={{
            duration: 0.55,
            delay: 0.3 + i * 0.09,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  );
}

// =============================================================================
// Personas — group of people. Animation: scale entry + hover scale-up. Same
// strategy as PedidoSemana since the visual reads as a composed unit.
// =============================================================================
export function PersonasIcon({ inView, hovered }: IconProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
      animate={inView ? { opacity: 1, scale: hovered ? 1.1 : 1 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="h-full w-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/icons/market/market_personas.svg"
        alt=""
        className="h-full w-full object-contain"
      />
    </motion.div>
  );
}

// =============================================================================
// Impresiones — eye. Animation: periodic blink (vertical scale 1→0.1→1)
// every 4-7s + instant blink on hover. Inline SVG so the blink applies to
// the whole eye group as one transform.
// =============================================================================
const EYE_OUTLINE =
  "M129.932 204.446C77.8411 204.346 31.5783 167.681 0 128.006C31.1419 88.8076 76.8727 52.4421 128.009 51.551C179.095 52.4512 224.976 88.7758 256 128.001C225.267 166.735 180.523 202.419 129.932 204.446ZM189.325 128.001C189.325 94.1404 161.874 66.6901 128.014 66.6901C94.1531 66.6901 66.7028 94.1404 66.7028 128.001C66.7028 161.862 94.1531 189.312 128.014 189.312C161.874 189.312 189.325 161.862 189.325 128.001ZM61.4473 165.526C48.3359 140.021 49.0087 113.862 61.8428 89.8396C45.2444 100.942 32.0511 113.758 19.0307 127.996C32.0421 142.099 45.1035 155.347 61.4473 165.526ZM237.042 128.051C223.876 113.658 210.342 100.464 194.33 90.1079C207.541 115.167 207.273 141.358 194.248 165.912C210.965 155.265 223.835 142.281 237.042 128.051Z";
const EYE_IRIS =
  "M92.2891 107.411C95.3851 113.453 100.031 117.576 106.837 117.185C112.547 116.858 118.048 112.68 119.508 106.52C120.972 100.341 118.248 93.7221 111.183 90.3669C129.396 81.9154 151.018 88.3257 162.22 104.86C173.594 121.654 171.185 144.304 156.155 158.252C141.662 171.7 119.453 173.068 103.423 161.18C87.2792 149.205 81.1872 126.842 92.2846 107.415L92.2891 107.411ZM155.409 148.491C155.409 144.399 152.095 141.085 148.004 141.085C143.912 141.085 140.598 144.399 140.598 148.491C140.598 152.583 143.912 155.897 148.004 155.897C152.095 155.897 155.409 152.583 155.409 148.491Z";

export function ImpresionesIcon({ inView, hovered }: IconProps) {
  const reduced = useReducedMotion() ?? false;
  const [blinkKey, setBlinkKey] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setBlinkKey((k) => k + 1);
      setTimeout(tick, 4000 + Math.random() * 3000);
    };
    const t = setTimeout(tick, 2200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [reduced]);

  return (
    <motion.svg
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
      animate={inView ? { opacity: 1, scale: hovered ? 1.1 : 1 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
      aria-hidden
    >
      <motion.g
        key={`blink-${blinkKey}-${hovered ? "h" : "i"}`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scaleY: 1 }}
        animate={reduced ? { scaleY: 1 } : { scaleY: [1, 0.1, 1] }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <path d={EYE_OUTLINE} fill="currentColor" />
        <path d={EYE_IRIS} fill="currentColor" />
      </motion.g>
    </motion.svg>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SmoothScroll() {
  const pathname = usePathname();
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const writingRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const desktop = !reducedMotion.matches && !coarsePointer.matches && window.innerWidth >= 901;
    if (!desktop) return;

    const root = document.documentElement;
    const previousInlineBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    root.classList.add("suecia-smooth-scroll");

    const LERP = 0.18;
    const WHEEL_MULTIPLIER = 1.15;
    const FRAME = 1000 / 60;
    const maxScroll = () => Math.max(0, root.scrollHeight - window.innerHeight);
    const clamp = (value: number) => Math.max(0, Math.min(maxScroll(), value));

    const syncToNativePosition = () => {
      const y = clamp(window.scrollY);
      currentRef.current = y;
      targetRef.current = y;
    };
    syncToNativePosition();

    const stopRaf = () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastTimeRef.current = 0;
    };

    const animate = (time: number) => {
      const previousTime = lastTimeRef.current || time;
      const deltaMs = Math.min(48, Math.max(1, time - previousTime));
      lastTimeRef.current = time;
      const target = clamp(targetRef.current);
      targetRef.current = target;
      const current = currentRef.current;
      const distance = target - current;
      const alpha = 1 - Math.pow(1 - LERP, deltaMs / FRAME);
      let next = current + distance * alpha;
      if (Math.abs(distance) < 0.35) next = target;
      currentRef.current = next;
      writingRef.current = true;
      window.scrollTo(0, next);
      writingRef.current = false;
      if (next !== target) rafRef.current = window.requestAnimationFrame(animate);
      else stopRaf();
    };

    const ensureRaf = () => { if (!rafRef.current) rafRef.current = window.requestAnimationFrame(animate); };

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const element = event.target as HTMLElement | null;
      if (element?.closest("[data-native-scroll='true']")) return;
      event.preventDefault();
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
      const delta = event.deltaY * unit * WHEEL_MULTIPLIER;
      if (Math.abs(delta) < 0.01) return;
      targetRef.current = clamp(targetRef.current + delta);
      ensureRaf();
    };

    const onNativeScroll = () => {
      if (writingRef.current || rafRef.current) return;
      syncToNativePosition();
    };

    const findContentOffset = (destination: HTMLElement) => {
      const destinationRect = destination.getBoundingClientRect();
      const children = Array.from(destination.children) as HTMLElement[];
      for (const child of children) {
        const style = window.getComputedStyle(child);
        if (style.position === "absolute" || style.position === "fixed" || style.display === "none") continue;
        const rect = child.getBoundingClientRect();
        if (rect.height <= 0) continue;
        return Math.max(0, rect.top - destinationRect.top);
      }
      return Math.max(0, parseFloat(window.getComputedStyle(destination).paddingTop) || 0);
    };

    const anchorDestination = (destination: HTMLElement) => {
      if (destination.id === "inicio") return 0;
      const rect = destination.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const topbar = document.querySelector<HTMLElement>(".topbar");
      const headerBottom = topbar?.getBoundingClientRect().bottom ?? 0;
      const breathingRoom = Math.max(8, Math.min(18, window.innerHeight * 0.012));
      const contentOffset = findContentOffset(destination);

      // Align the section's first real content row just below the fixed glass
      // navbar. Sections that already contain their own top padding are scrolled
      // farther, instead of applying a second fixed offset on top of that padding.
      const desiredSectionTop = headerBottom + breathingRoom - contentOffset;
      return clamp(absoluteTop - desiredSectionTop);
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const element = event.target as Element | null;
      const anchor = element?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;
      try {
        const nextUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);
        if (nextUrl.origin !== currentUrl.origin || nextUrl.pathname !== currentUrl.pathname || !nextUrl.hash) return;
        const destination = document.querySelector<HTMLElement>(nextUrl.hash);
        if (!destination) return;
        event.preventDefault();
        currentRef.current = window.scrollY;
        targetRef.current = anchorDestination(destination);
        history.pushState(null, "", nextUrl.hash);
        ensureRaf();
      } catch {
        // Leave invalid links to the browser.
      }
    };

    const onResize = () => {
      targetRef.current = clamp(targetRef.current);
      currentRef.current = clamp(window.scrollY);
    };
    const onPageShow = () => { stopRaf(); syncToNativePosition(); };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("click", onAnchorClick, true);

    // Hash navigation coming from /carta or /links swaps the route before this
    // component can intercept the anchor. Once the destination DOM exists, use
    // the same measured alignment instead of falling back to a fixed CSS offset.
    const hashFrame = window.requestAnimationFrame(() => {
      if (!window.location.hash) return;
      const destination = document.querySelector<HTMLElement>(window.location.hash);
      if (!destination) return;
      currentRef.current = window.scrollY;
      targetRef.current = anchorDestination(destination);
      ensureRaf();
    });

    return () => {
      window.cancelAnimationFrame(hashFrame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("click", onAnchorClick, true);
      stopRaf();
      root.classList.remove("suecia-smooth-scroll");
      root.style.scrollBehavior = previousInlineBehavior;
    };
  }, [pathname]);

  return null;
}

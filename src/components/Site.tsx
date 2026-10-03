"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useCallback, useState } from "react";
import About from "./About";
import Contact from "./Contact";
import Hero from "./Hero";
import Nav from "./Nav";
import Preloader from "./Preloader";
import Projects from "./Projects";
import Skills from "./Skills";
import SmoothScroll from "./SmoothScroll";
import Timeline from "./Timeline";

export default function Site() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <AnimatePresence>{!ready && <Preloader key="preloader" onDone={done} />}</AnimatePresence>
        <div className="grain" aria-hidden />
        <Nav ready={ready} />
        <main>
          <Hero ready={ready} />
          <About />
          <Timeline />
          <Skills />
          <Projects />
        </main>
        <Contact />
      </SmoothScroll>
    </MotionConfig>
  );
}

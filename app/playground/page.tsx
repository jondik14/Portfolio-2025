import { Metadata } from "next";
import InteractiveCanvas from "./InteractiveCanvas";

export const metadata: Metadata = {
  title: "Playground – Luke Niccol",
  description: "Interactive project canvas – explore creative work in an infinite space.",
};

export default function PlaygroundPage() {
  return (
    <div className="playground-canvas-page">
      {/* Header */}
      <header className="playground-canvas-header">
        <h1 className="playground-canvas-title">Playground</h1>
        <p className="playground-canvas-description">
          An interactive canvas of experiments and creative projects.
          Drag to explore, click to dive deeper.
        </p>
      </header>

      {/* Interactive Canvas */}
      <InteractiveCanvas />
    </div>
  );
}

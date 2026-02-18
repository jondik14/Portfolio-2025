"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  status: "live" | "wip" | "concept";
}

// Larger, more grid-aligned projects like hypeboard
const projects: Project[] = [
  { id: "p1", title: "Brand System", description: "Visual identity for fintech", tags: ["Branding"], x: 0, y: 0, width: 500, height: 600, color: "#FF6B6B", status: "live" },
  { id: "p2", title: "E-commerce", description: "Shopping experience redesign", tags: ["UX/UI"], x: 550, y: 0, width: 500, height: 290, color: "#4ECDC4", status: "wip" },
  { id: "p3", title: "Banking App", description: "Mobile banking for Gen Z", tags: ["Mobile"], x: 550, y: 310, width: 500, height: 290, color: "#A259FF", status: "live" },
  { id: "p4", title: "Analytics", description: "Enterprise data dashboards", tags: ["Data"], x: 1100, y: 0, width: 350, height: 600, color: "#FFD93D", status: "concept" },
  { id: "p5", title: "Social Tool", description: "Content scheduling platform", tags: ["SaaS"], x: 0, y: 650, width: 350, height: 350, color: "#6BCB77", status: "wip" },
  { id: "p6", title: "Healthcare", description: "Patient portal redesign", tags: ["Health"], x: 400, y: 650, width: 350, height: 350, color: "#4D96FF", status: "live" },
  { id: "p7", title: "AI Chat", description: "Conversational interface", tags: ["AI"], x: 800, y: 650, width: 350, height: 350, color: "#FF8C42", status: "concept" },
  { id: "p8", title: "Travel App", description: "Booking experience", tags: ["Travel"], x: 1200, y: 650, width: 500, height: 350, color: "#9B59B6", status: "wip" },
  { id: "p9", title: "Music App", description: "Streaming platform", tags: ["Music"], x: 0, y: 1050, width: 500, height: 350, color: "#E74C3C", status: "live" },
  { id: "p10", title: "Fitness", description: "Workout tracking", tags: ["Fitness"], x: 550, y: 1050, width: 350, height: 350, color: "#1ABC9C", status: "concept" },
  { id: "p11", title: "Education", description: "Learning platform", tags: ["EdTech"], x: 950, y: 1050, width: 500, height: 350, color: "#F39C12", status: "wip" },
  { id: "p12", title: "Real Estate", description: "Property search", tags: ["Property"], x: 1500, y: 1050, width: 500, height: 350, color: "#3498DB", status: "live" },
  { id: "p13", title: "Dashboard", description: "Admin panel", tags: ["Admin"], x: 1500, y: 0, width: 350, height: 450, color: "#E91E63", status: "live" },
  { id: "p14", title: "Calendar", description: "Scheduling app", tags: ["Productivity"], x: 1500, y: 500, width: 350, height: 250, color: "#00BCD4", status: "wip" },
  { id: "p15", title: "Chat App", description: "Team messaging", tags: ["Chat"], x: 1900, y: 0, width: 500, height: 350, color: "#9C27B0", status: "concept" },
  { id: "p16", title: "Weather", description: "Forecast app", tags: ["Weather"], x: 1900, y: 400, width: 350, height: 250, color: "#03A9F4", status: "live" },
  { id: "p17", title: "Notes", description: "Note taking app", tags: ["Productivity"], x: 2050, y: 700, width: 350, height: 350, color: "#8BC34A", status: "wip" },
  { id: "p18", title: "Photos", description: "Photo gallery", tags: ["Media"], x: 2050, y: 1100, width: 500, height: 300, color: "#FF5722", status: "live" },
];

const CANVAS_WIDTH = 2600;
const CANVAS_HEIGHT = 1500;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;

export default function InteractiveCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.7 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  
  const animationRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });

  // Center canvas initially
  useEffect(() => {
    if (typeof window !== "undefined") {
      const centerX = (window.innerWidth - CANVAS_WIDTH * 0.7) / 2;
      const centerY = (window.innerHeight - 200 - CANVAS_HEIGHT * 0.7) / 2;
      setTransform({ x: centerX, y: centerY, scale: 0.7 });
    }
  }, []);

  // Hide instructions after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Space key for hand tool
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isDragging) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isDragging]);

  // Apply transform with bounds checking
  const applyTransform = useCallback((newTransform: { x: number; y: number; scale: number }) => {
    const container = containerRef.current;
    if (!container) return newTransform;
    
    const padding = 200;
    const minX = -(CANVAS_WIDTH * newTransform.scale) + padding;
    const minY = -(CANVAS_HEIGHT * newTransform.scale) + padding;
    const maxX = container.clientWidth - padding;
    const maxY = container.clientHeight - padding;
    
    return {
      x: Math.max(minX, Math.min(maxX, newTransform.x)),
      y: Math.max(minY, Math.min(maxY, newTransform.y)),
      scale: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newTransform.scale)),
    };
  }, []);

  // Inertia/momentum animation
  useEffect(() => {
    if (isDragging || (Math.abs(velocity.x) < 0.5 && Math.abs(velocity.y) < 0.5)) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = () => {
      setTransform(prev => {
        const newTransform = applyTransform({
          x: prev.x + velocity.x,
          y: prev.y + velocity.y,
          scale: prev.scale,
        });
        return newTransform;
      });
      
      setVelocity(prev => ({
        x: prev.x * 0.92,
        y: prev.y * 0.92,
      }));
      
      if (Math.abs(velocity.x) > 0.5 || Math.abs(velocity.y) > 0.5) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, velocity, applyTransform]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".project-card")) return;
    if (e.button !== 0 && e.button !== 1) return; // Left or middle mouse only
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    setVelocity({ x: 0, y: 0 });
    setShowInstructions(false);
    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const now = Date.now();
    const dt = now - lastMouseRef.current.time;
    if (dt > 0) {
      setVelocity({
        x: (e.clientX - lastMouseRef.current.x) * 0.8,
        y: (e.clientY - lastMouseRef.current.y) * 0.8,
      });
    }
    
    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
    
    setTransform(prev => applyTransform({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart, applyTransform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, transform.scale * delta));
    
    // Zoom towards mouse position
    const scaleRatio = newScale / transform.scale;
    const newX = mouseX - (mouseX - transform.x) * scaleRatio;
    const newY = mouseY - (mouseY - transform.y) * scaleRatio;
    
    setTransform(applyTransform({ x: newX, y: newY, scale: newScale }));
  }, [transform, applyTransform]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".project-card")) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
      setVelocity({ x: 0, y: 0 });
      setShowInstructions(false);
    }
  }, [transform]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setTransform(prev => applyTransform({
      ...prev,
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    }));
  }, [isDragging, dragStart, applyTransform]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse up
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  // Zoom controls
  const zoomIn = () => {
    setTransform(prev => applyTransform({ ...prev, scale: prev.scale * 1.2 }));
  };
  
  const zoomOut = () => {
    setTransform(prev => applyTransform({ ...prev, scale: prev.scale / 1.2 }));
  };
  
  const resetView = () => {
    const centerX = (window.innerWidth - CANVAS_WIDTH * 0.7) / 2;
    const centerY = (window.innerHeight - 200 - CANVAS_HEIGHT * 0.7) / 2;
    setTransform({ x: centerX, y: centerY, scale: 0.7 });
  };

  return (
    <div 
      ref={containerRef}
      className={`canvas-container ${isSpacePressed ? 'space-pressed' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Grid Background */}
      <div 
        ref={canvasRef}
        className="canvas-grid"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      >
        {/* Grid Lines */}
        <svg className="grid-lines" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
            </pattern>
            <pattern id="grid-dots" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="1.5" fill="rgba(0,0,0,0.08)" />
            </pattern>
          </defs>
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid)" />
          <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid-dots)" />
        </svg>

        {/* Canvas Boundary */}
        <div className="canvas-boundary" />

        {/* Project Cards */}
        {projects.map((project) => (
          <div
            key={project.id}
            className={`project-card ${hoveredProject === project.id ? 'hovered' : ''}`}
            style={{
              left: project.x,
              top: project.y,
              width: project.width,
              height: project.height,
            }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <Link href={`/playground/${project.id}`} className="project-card-link">
              <div 
                className="project-visual"
                style={{ background: project.color }}
              >
                <div className="project-pattern">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id={`pattern-${project.id}`} patternUnits="userSpaceOnUse" width="30" height="30">
                        <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.15)" />
                        <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.08)" />
                        <circle cx="30" cy="30" r="1" fill="rgba(255,255,255,0.08)" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill={`url(#pattern-${project.id})`} />
                  </svg>
                </div>
                <span className={`project-status status-${project.status}`}>
                  {project.status === "live" ? "●" : project.status === "wip" ? "◐" : "○"}
                </span>
              </div>
              
              <div className="project-content">
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <div className="instruction-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 15l-3-3-3 3" />
                <path d="M9 9l3 3 3-3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span>Drag to pan</span>
            </div>
            <div className="instruction-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              <span>Scroll to zoom</span>
            </div>
            <div className="instruction-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span>Space + drag</span>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button onClick={zoomIn} className="zoom-btn" title="Zoom In">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </button>
        <div className="zoom-level">{Math.round(transform.scale * 100)}%</div>
        <button onClick={zoomOut} className="zoom-btn" title="Zoom Out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
          </svg>
        </button>
        <button onClick={resetView} className="zoom-btn reset" title="Reset View">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* Controls Hint */}
      <div className="controls-hint">
        <span>Drag to pan • Scroll to zoom • Space + drag</span>
      </div>
    </div>
  );
}

// src/components/SocialGraph.tsx
import { useEffect, useRef } from "preact/hooks";
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
} from "d3-force";
import { drag as d3drag } from "d3-drag";
import { select } from "d3-selection";
import "d3-transition";

import type { GraphNode, NodeKind } from "../features/nodes/types";

type SimNode = SimulationNodeDatum &
  GraphNode & {
    color: string;
  };

type LinkDatum = {
  sourceId: string | number;
  targetId: string | number;
};

type Props = {
  nodes: GraphNode[];
  onNodeClick?: (node: GraphNode) => void;

  /** incrementa para pedir animación de salida */
  exitSignal?: number;
  /** callback cuando terminó la animación de salida */
  onExitDone?: () => void;
};

export function SocialGraph({
  nodes,
  onNodeClick,
  exitSignal = 0,
  onExitDone,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // guardamos selecciones para animar salida sin rearmar todo
  const d3Ref = useRef<{
    nodeSel?: any;
    textSel?: any;
    linkSel?: any;
    focusedProjectId?: string | number | null;
    BASE_RADIUS?: number;
    isNeighbor?: (d: SimNode) => boolean;
  }>({});

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svgEl = svgRef.current;
    let width = svgEl.clientWidth || window.innerWidth;
    let height = svgEl.clientHeight || window.innerHeight;

    const BASE_RADIUS = 40;
    const SELECTED_RADIUS = BASE_RADIUS * 2.05;
    const NEIGHBOR_RADIUS = BASE_RADIUS * 1.3;

    const USERS_ENTER_DURATION = 700;
    const USERS_ENTER_DELAY = 140;
    const SELECT_GROW_DURATION = 900;
    const LINKS_FADE_DURATION = 600;
    const LABELS_FADE_DURATION = 600;

    let colliderPadding = 14;
    let attractionForce = 50;

    if (window.innerWidth < 640) {
      colliderPadding = 8;
      attractionForce = 20;
    }

    const simNodes: SimNode[] = nodes.map((n) => ({
      ...n,
      color: getColor(n.kind),
    }));

    const focusedProject = simNodes.find(
      (n) => n.kind === "project" && (n.meta as any)?.focused
    );
    const focusedProjectId = focusedProject?.id ?? null;

    const isNeighbor = (d: SimNode): boolean => {
      if (focusedProjectId == null) return false;
      return (
        d.kind === "user" && (d.meta as any)?.projectId === focusedProjectId
      );
    };

    const getFinalRadius = (d: SimNode) => {
      if (!focusedProjectId) return BASE_RADIUS;
      if (d.id === focusedProjectId) return SELECTED_RADIUS;
      if (isNeighbor(d)) return NEIGHBOR_RADIUS;
      return BASE_RADIUS;
    };

    const getFillOpacity = (d: SimNode) => {
      if (!focusedProjectId) return 1;
      if (d.id === focusedProjectId) return 1;
      if (isNeighbor(d)) return 1; // miembros sin opacidad (como pediste)
      return 0.28;
    };

    const svg = select(svgEl).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const maxRadius = Math.min(width, height) / 2 - 40;

    svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", maxRadius)
      .attr("stroke", "rgba(148,163,184,0.18)")
      .attr("fill", "transparent")
      .attr("opacity", 0.35);

    const linkGroup = svg.append("g");
    const nodeGroup = svg.append("g");
    const textGroup = svg.append("g");

    const links: LinkDatum[] =
      focusedProjectId == null
        ? []
        : simNodes
            .filter((n) => isNeighbor(n))
            .map((u) => ({ sourceId: focusedProjectId, targetId: u.id }));

    const link = linkGroup
      .selectAll<SVGPathElement, LinkDatum>("path")
      .data(links)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#020617")
      .attr("stroke-width", 1.6)
      .attr("stroke-linecap", "round")
      .attr("stroke-opacity", 0);

    const node = nodeGroup
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(simNodes)
      .enter()
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", (d) => {
        if (!focusedProjectId) return BASE_RADIUS;
        if (d.kind === "user") return 0; // entran desde 0
        if (d.id === focusedProjectId) return BASE_RADIUS; // crece luego
        return BASE_RADIUS;
      })
      .style("fill", (d) => d.color)
      .style("fill-opacity", (d) => getFillOpacity(d))
      .style("cursor", "pointer");

    // users enter
    (node.filter((d) => !!focusedProjectId && d.kind === "user") as any)
      .transition()
      .delay(USERS_ENTER_DELAY)
      .duration(USERS_ENTER_DURATION)
      .ease((t: number) => 1 - Math.pow(1 - t, 3))
      .attr("r", (d: SimNode) => getFinalRadius(d))
      .style("fill-opacity", (d: SimNode) => getFillOpacity(d));

    // selected grow
    (node.filter((d) => !!focusedProjectId && d.id === focusedProjectId) as any)
      .transition()
      .duration(SELECT_GROW_DURATION)
      .ease((t: number) => 1 - Math.pow(1 - t, 3))
      .attr("r", (d: SimNode) => getFinalRadius(d));

    // --------- TEXT (ellipsis dinámico + tooltip nativo) ---------
    const text = textGroup
      .selectAll<SVGTextElement, SimNode>("text")
      .data(simNodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", (d) => getLabelFontSize(getFinalRadius(d), d.kind))
      .attr("font-weight", 600)
      .attr("font-family", "ui-sans-serif, system-ui, -apple-system")
      .attr("fill", "white")
      .style("pointer-events", "none")
      .style("opacity", (d) => getFillOpacity(d))
      .text((d) => formatLabelByRadius(d.label, getFinalRadius(d), d.kind));

    text.append("title").text((d) => d.label);

    // labels de users aparecen suave (y sus labels crecen con su radio final)
    // (text.filter((d) => focusedProjectId && d.kind === "user") as any)
    (text.filter((d) => !!focusedProjectId && d.kind === "user") as any)
      .style("opacity", 0)
      .transition()
      .delay(USERS_ENTER_DELAY + 80)
      .duration(LABELS_FADE_DURATION)
      .style("opacity", 1);

    (link as any)
      .transition()
      .delay(USERS_ENTER_DELAY + 90)
      .duration(LINKS_FADE_DURATION)
      .attr("stroke-opacity", focusedProjectId ? 0.55 : 0);

    const simulation = forceSimulation<SimNode>(simNodes)
      .force("charge", forceManyBody().strength(attractionForce))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collide",
        forceCollide<SimNode>()
          .strength(0.2)
          // ✅ collider por radio REAL (seleccionado / vecinos)
          .radius((d) => getFinalRadius(d) + colliderPadding)
      );

    simulation.on("tick", () => {
      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      // mantiene texto centrado
      text.attr("x", (d) => d.x!).attr("y", (d) => d.y!);

      if (focusedProjectId) {
        link.attr("d", (d) => {
          const s = simNodes.find((n) => n.id === d.sourceId);
          const t = simNodes.find((n) => n.id === d.targetId);
          if (!s || !t) return "";

          const mx = (s.x! + t.x!) / 2;
          const my = (s.y! + t.y!) / 2 - 48;

          return `M ${s.x},${s.y} Q ${mx},${my} ${t.x},${t.y}`;
        });
      }
    });

    node.call(
      d3drag<SVGCircleElement, SimNode>()
        .on("start", (e, d) => {
          if (!e.active) simulation.alphaTarget(0.03).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on("end", (e, d) => {
          if (!e.active) simulation.alphaTarget(0.03);
          d.fx = null;
          d.fy = null;
        })
    );

    node.on("click", (e, d) => {
      e.stopPropagation();
      onNodeClick?.(d);
    });

    // guardamos refs para animación de salida
    d3Ref.current = {
      nodeSel: node,
      textSel: text,
      linkSel: link,
      focusedProjectId,
      BASE_RADIUS,
      isNeighbor,
    };

    return () => simulation.stop();
  }, [nodes, onNodeClick]);

  // ---------- EXIT ANIMATION ----------
  useEffect(() => {
    const ref = d3Ref.current;
    if (!ref.nodeSel || !ref.textSel || !ref.linkSel) return;
    if (!ref.focusedProjectId) return;

    const node = ref.nodeSel as any;
    const text = ref.textSel as any;
    const link = ref.linkSel as any;
    const focusedProjectId = ref.focusedProjectId;
    const BASE_RADIUS = ref.BASE_RADIUS ?? 40;
    const isNeighbor = ref.isNeighbor ?? (() => false);

    // un poco más lento para que se note (sin “corte”)
    const OUT = 520;

    (link as any).transition().duration(OUT).attr("stroke-opacity", 0);

    (text.filter((d: SimNode) => isNeighbor(d)) as any)
      .transition()
      .duration(OUT)
      .style("opacity", 0);

    (node.filter((d: SimNode) => isNeighbor(d)) as any)
      .transition()
      .duration(OUT)
      .ease((t: number) => 1 - Math.pow(1 - t, 3))
      .attr("r", 0)
      .style("fill-opacity", 0);

    (node.filter((d: SimNode) => d.id === focusedProjectId) as any)
      .transition()
      .duration(OUT + 120)
      .ease((t: number) => 1 - Math.pow(1 - t, 3))
      .attr("r", BASE_RADIUS)
      .on("end", () => onExitDone?.());
  }, [exitSignal, onExitDone]);

  return (
    <div className="relative w-full h-[78vh] md:h-[82vh] overflow-hidden bg-transparent">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

/* helpers */

function getColor(kind: NodeKind): string {
  switch (kind) {
    case "project":
      return "#f97316";
    case "user":
      return "#0ea5e9";
    default:
      return "#8b5cf6";
  }
}

function formatLabelByRadius(label: string, r: number, kind: NodeKind) {
  const clean = (label ?? "").trim();

  // “Perillas” para evitar overflow:
  const padding = kind === "project" ? 22 : 18; // más padding => menos chars
  const charWidth = kind === "project" ? 7.6 : 7.2; // más ancho => menos chars

  const maxPx = Math.max(0, r * 2 - padding);
  const maxChars = Math.max(4, Math.floor(maxPx / charWidth));

  if (clean.length <= maxChars) return clean;
  return clean.slice(0, Math.max(0, maxChars - 1)).trimEnd() + "…";
}

function getLabelFontSize(radius: number, kind: NodeKind) {
  const raw =
    kind === "project"
      ? radius / 3.6
      : kind === "user"
      ? radius / 3.9
      : radius / 3.8;

  const min = kind === "project" ? 12 : 11;
  const max = kind === "project" ? 14 : 18;

  return Math.max(min, Math.min(max, Math.floor(raw)));
}

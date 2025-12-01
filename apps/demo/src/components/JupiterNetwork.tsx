// src/components/JupiterNetwork.tsx
import { useEffect, useRef } from "preact/hooks";
import * as d3 from "d3";
import gsap from "gsap";

export type NodeType = "hub" | "creator" | "idea" | "follower";

export type NodeDatum = {
  id: string;
  type: NodeType;
  role: string;
  grad?: string;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

export type LinkDatum = d3.SimulationLinkDatum<NodeDatum>;

export type JupiterNetworkProps = {
  onNodeSelect?: (node: Pick<NodeDatum, "id" | "type" | "role">) => void;
};

const palette = [
  "#6a0dad",
  "#00f5d4",
  "#ff007f",
  "#00ffee",
  "#ff3cac",
  "#ffb347",
];

export default function JupiterNetwork({ onNodeSelect }: JupiterNetworkProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const svg = d3.select(svgEl).attr("viewBox", [0, 0, width, height]);
    const defs = svg.append("defs");

    // === Gradiente hub ===
    const gradHub = defs
      .append("radialGradient")
      .attr("id", "gradHub")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    gradHub.append("stop").attr("offset", "0%").attr("stop-color", "#ff9e2c");
    gradHub.append("stop").attr("offset", "100%").attr("stop-color", "#d9822b");

    // === Icons ===
    defs
      .append("symbol")
      .attr("id", "hubIcon")
      .attr("viewBox", "0 0 100 100")
      .html(
        `<circle cx="50" cy="50" r="18" stroke="white" stroke-width="4" fill="none"/>`
      );

    defs
      .append("symbol")
      .attr("id", "creatorIcon")
      .attr("viewBox", "0 0 32 32")
      .html(
        `<polygon points="16,4 28,28 4,28" stroke="white" stroke-width="2" fill="none"/>`
      );

    defs
      .append("symbol")
      .attr("id", "ideaIcon")
      .attr("viewBox", "0 0 24 24")
      .html(
        `<rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" stroke="white" stroke-width="2" fill="none"/>`
      );

    defs
      .append("symbol")
      .attr("id", "followerIcon")
      .attr("viewBox", "0 0 24 24")
      .html(
        `<circle cx="12" cy="12" r="6" stroke="white" stroke-width="2" fill="none"/>`
      );

    // === Escalas ===
    const sizeScale = Math.min(width, height) / 500;
    const radius = {
      hub: 60 * sizeScale,
      creator: 25 * sizeScale,
      idea: 15 * sizeScale,
      follower: 10 * sizeScale,
    };
    const iconScale = {
      hub: 26 * sizeScale,
      creator: 16 * sizeScale,
      idea: 14 * sizeScale,
      follower: 12 * sizeScale,
    };

    // === Datos iniciales ===
    let nodeIdCounter = 1000;
    let nodes: NodeDatum[] = [
      { id: "Red Social", type: "hub", grad: "gradHub", role: "Hub" },
    ];
    let links: LinkDatum[] = [];

    // === Simulación ===
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d) => {
            const s = d.source as NodeDatum;
            if (s.type === "hub") return 180;
            if (s.type === "creator") return 100;
            return 60;
          })
      )
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => radius[d.type] + 5)
      );

    const gMain = svg.append("g");

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.4, 2])
        .on("zoom", (event) => gMain.attr("transform", event.transform))
    );

    const linkGroup = gMain.append("g");
    const nodeGroup = gMain.append("g");

    // === Generador de subárbol ===
    function generateSubtree(parentId: string) {
      const newNodes: NodeDatum[] = [];
      const newLinks: LinkDatum[] = [];

      const numCreators = 1 + (width < 600 ? 1 : Math.floor(Math.random() * 2));

      for (let i = 0; i < numCreators; i++) {
        const cId = `C_${nodeIdCounter++}`;
        const colorC = palette[Math.floor(Math.random() * palette.length)];
        newNodes.push({
          id: cId,
          type: "creator",
          color: colorC,
          role: "Creator",
        });
        newLinks.push({ source: parentId, target: cId });

        const numIdeas =
          1 + (width < 600 ? 1 : Math.floor(Math.random() * 2) + 1);
        for (let j = 0; j < numIdeas; j++) {
          const iId = `I_${nodeIdCounter++}`;
          const colorI = palette[Math.floor(Math.random() * palette.length)];
          newNodes.push({ id: iId, type: "idea", color: colorI, role: "Idea" });
          newLinks.push({ source: cId, target: iId });

          const numFollowers =
            width < 600 ? 1 : 1 + Math.floor(Math.random() * 2);
          for (let k = 0; k < numFollowers; k++) {
            const fId = `F_${nodeIdCounter++}`;
            const colorF = palette[Math.floor(Math.random() * palette.length)];
            newNodes.push({
              id: fId,
              type: "follower",
              color: colorF,
              role: "Follower",
            });
            newLinks.push({ source: iId, target: fId });
          }
        }
      }

      return { nodes: newNodes, links: newLinks };
    }

    function linkKey(d: LinkDatum) {
      const s = typeof d.source === "string" ? d.source : d.source.id;
      const t = typeof d.target === "string" ? d.target : d.target.id;
      return `${s}-${t}`;
    }

    function curvedLine(d: LinkDatum) {
      const s = d.source as NodeDatum;
      const t = d.target as NodeDatum;
      if (!s.x || !s.y || !t.x || !t.y) return "";
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 0.7;
      return `M${s.x},${s.y} A${dr},${dr} 0 0,1 ${t.x},${t.y}`;
    }

    function animateFlow() {
      linkGroup.selectAll("path").each(function () {
        const path = this as SVGPathElement;
        const length = path.getTotalLength();

        d3.select(path)
          .attr("stroke-dasharray", length)
          .attr("stroke-dashoffset", length);

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          repeat: -1,
          ease: "linear",
        });
      });
    }

    function updateNetwork() {
      // === Links ===
      linkGroup
        .selectAll("path")
        .data(links, linkKey)
        .join((enter) =>
          enter
            .append("path")
            .attr("stroke", "#00f5d4")
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.7)
            .attr("stroke-linecap", "round")
            .attr("fill", "none")
        );

      // === Nodes ===
      nodeGroup
        .selectAll("g")
        .data(nodes, (d: any) => d.id)
        .join((enter) => {
          const g = enter.append("g");

          g.append("circle")
            .attr("r", (d: any) => radius[d.type])
            .attr("fill", (d: any) =>
              d.type === "hub" ? "url(#gradHub)" : d.color || "#fff"
            )
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.3);

          g.append("circle")
            .attr("r", (d: any) => radius[d.type] * 0.6)
            .attr("fill", "#0b0c10");

          g.append("use")
            .attr("href", (d: any) =>
              d.type === "hub"
                ? "#hubIcon"
                : d.type === "creator"
                ? "#creatorIcon"
                : d.type === "idea"
                ? "#ideaIcon"
                : "#followerIcon"
            )
            .attr("width", (d: any) => iconScale[d.type])
            .attr("height", (d: any) => iconScale[d.type])
            .attr("x", (d: any) => -iconScale[d.type] / 2)
            .attr("y", (d: any) => -(radius[d.type] * 1.2))
            .attr("stroke", (d: any) => (d.type === "hub" ? "#fff" : d.color))
            .attr("fill", "none");

          g.append("text")
            .text((d: any) => d.id)
            .attr("font-size", "clamp(8px,2vw,12px)")
            .attr("fill", "#fff")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("pointer-events", "none")
            .attr("font-weight", 400);

          // === Drag ===
          g.call(
            d3
              .drag()
              .on("start", (event, d: any) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
              })
              .on("drag", (event, d: any) => {
                d.fx = event.x;
                d.fy = event.y;
              })
              .on("end", (event, d: any) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
              })
          );

          // === Click (solo ideas abren panel) ===
          g.on("click", (event: any, d: NodeDatum) => {
            event.stopPropagation();

            if (onNodeSelect && d.type === "idea") {
              onNodeSelect({ id: d.id, type: d.type, role: d.role });
            }

            const newSub = generateSubtree(d.id);
            nodes = nodes.concat(newSub.nodes);
            links = links.concat(newSub.links);

            simulation.nodes(nodes);
            simulation.force("link")!.links(links as any);
            updateNetwork();

            // === Partículas ===
            const count = width < 600 ? 10 : 18;
            for (let i = 0; i < count; i++) {
              const size = 1 + Math.random() * 2;
              const angle = Math.random() * Math.PI * 2;
              const distance = 20 + Math.random() * 40;
              const color = palette[Math.floor(Math.random() * palette.length)];

              const p = gMain
                .append("circle")
                .attr("r", size)
                .attr("fill", color)
                .attr("cx", d.x!)
                .attr("cy", d.y!);

              gsap.to(p.node(), {
                cx: d.x! + Math.cos(angle) * distance,
                cy: d.y! + Math.sin(angle) * distance,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                onComplete: () => p.remove(),
              });
            }

            simulation.alpha(0.2).restart();
          });

          return g;
        });

      animateFlow();
    }

    simulation.on("tick", () => {
      linkGroup.selectAll("path").attr("d", (d: any) => curvedLine(d));
      nodeGroup
        .selectAll("g")
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      svg.attr("viewBox", [0, 0, width, height]);
      simulation.force("center", d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.2).restart();
    }

    window.addEventListener("resize", handleResize);

    updateNetwork();

    return () => {
      window.removeEventListener("resize", handleResize);
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, []); // 🔥 ya NO depende de onNodeSelect (no se reinicia)

  return <svg ref={svgRef} class="network-svg" />;
}

import { FunnelLanding } from "./funnel-landing";

export const metadata = { title: "Axiom Commerce", description: "Find the commerce lane that fits how you actually want to sell." };

export default function Page(){ return <FunnelLanding config={{ name: "Axiom Commerce", monogram: "AX", eyebrow: "RETAIL SIGNALS", title: "Find the commerce lane that fits how you actually want to sell.", body: "Retail AI & agentic shopping", accent: "#172e9e", soft: "#e9edff", steps: ["Choose your operator style","Match the right category","Get your tailored commerce route"], cta: "Get my route", outcome: "Commerce route" }} />; }


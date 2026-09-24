import { notFound } from "next/navigation";

// Any path under a language that no page claims: render that language's 404.
export default function CatchAll() {
  notFound();
}

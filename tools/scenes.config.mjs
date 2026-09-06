/* Scene briefs for the homepage 50/50 blocks.

   The images currently in public/scenes/ were built in Canva: an AI-generated
   empty room, then the door element swapped for the anchor product's real
   catalogue render. Canva has no text-to-image tool, so the room comes from its
   generator and the door is a genuine product photo composited in. The raw
   1920x1080 export is then finished locally:

     node tools/finish-scene.mjs <raw-export.jpg> <slug>

   which paints the shadows Canva cannot draw (its shapes have no blur) and
   centre-crops to 4:3 for `.split-media`. The Canva designs stay editable in the
   account that made them, so a re-export can be re-finished the same way.

   tools/generate-scene-images.mjs is the alternative route: it feeds the same
   anchor render to Fal.ai as a reference image and generates the whole scene in
   one pass, which lights the door with the room instead of pasting it in. It
   needs credit on the Fal account.

   Each entry maps a category block in src/app/page.js to a photoreal interior
   shot of a door that actually exists in the catalogue: `anchor` is a product
   id from src/data/products.js whose first catalogue render is fed to the
   image model as a reference, so the generated door keeps the real panel
   design, colour and hardware instead of being invented.

   Leave `anchor` null to run plain text-to-image (used for categories that
   have no products yet).

   `door` is where the composited leaf sits on the Canva page (1920x1080
   coordinates) and `light` is which side the room's daylight comes from;
   tools/finish-scene.mjs uses both to paint the contact and cast shadows a
   pasted-in door would otherwise be missing. Omit `door` for scenes whose
   door was generated in place and already lit. */

export const scenes = [
  {
    slug: "ardurvis-dzivoklim",
  door: { left: 796, top: 158, width: 326, height: 675 },
    light: "left",
    anchor: "prema-172",
    side: "outer",
    prompt:
      "Photorealistic architectural interior photograph of an apartment building landing. " +
      "The exact steel entrance door from the reference image is installed in the wall, closed, " +
      "seen straight on and slightly from the left: keep its panel milling pattern, proportions, " +
      "anthracite colour, handle and lock hardware identical to the reference. " +
      "A calm contemporary common hallway around it - light plastered walls, a large-format " +
      "porcelain tile floor, a slim console table, soft daylight falling from a window out of frame. " +
      "Full door visible from threshold to top of the frame, centred in the composition. " +
      "Shot on a 35mm lens at f/4, natural warm daylight, no people, no text, no logos, no watermark.",
  },
  {
    slug: "ardurvis-privatmajai",
  door: { left: 825, top: 202, width: 291, height: 630 },
    light: "left",
    anchor: "th-710-venge",
    side: "outer",
    prompt:
      "Photorealistic architectural photograph of the entrance of a modern private house, seen from " +
      "the covered porch. The exact thermal entrance door from the reference image is installed in the " +
      "facade, closed: keep its panel design, proportions, dark wenge wood-grain finish and hardware " +
      "identical to the reference. Around it, a clean Nordic facade of light render and vertical timber " +
      "cladding, a stone step, a simple planter, autumn daylight and soft long shadows. " +
      "Full door visible, centred, shot on a 35mm lens at f/4, no people, no text, no logos, no watermark.",
  },
  {
    slug: "ieksdurvis",
  door: { left: 809, top: 90, width: 348, height: 742 },
    light: "left",
    anchor: "rv-06-balts-ultramats-melns",
    side: "interior",
    prompt:
      "Photorealistic interior photograph of a bright contemporary living space. " +
      "The exact interior door from the reference image is installed in the wall, half open: keep its " +
      "panel layout, ultra-matt white leaf, black glazing bars and slim black frame identical to the " +
      "reference. Around it, an oak herringbone floor, warm white walls, a linen armchair and a floor " +
      "lamp at the edge of frame, daylight raking across the wall. " +
      "Full door visible from floor to frame head, shot on a 35mm lens at f/4, no people, no text, " +
      "no logos, no watermark.",
  },
];

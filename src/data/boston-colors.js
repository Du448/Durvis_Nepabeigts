/* The Boston powder-coat palette as shown in the product page's palette tab -
   the same shades (and swatch photos) the configurator offers, see
   @/data/boston-config-options. */
import { BOSTON_PAINT } from "@/data/boston-config-options";

export const bostonColorPalette = BOSTON_PAINT.map((p) => ({ ral: p.key, hex: p.hex, premium: !!p.premium, name: p.name, image: p.image, plainOnly: !!p.plainOnly }));

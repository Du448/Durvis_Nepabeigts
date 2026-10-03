/* Read-only breakdown of the hidden-door set count from the last stock file
   (see @/lib/hiddenKits): per model and size, how many leaves are in the
   warehouse and how many of them go out as complete sets, plus the frame
   parts the count was limited by. */

const SIDE = { left: "kreisā", right: "labā" };

export default function HiddenKits({ report, productNames }) {
  if (!report?.leaves?.length) return null;

  const byProduct = new Map();
  for (const leaf of report.leaves) {
    const sizes = byProduct.get(leaf.productId) || new Map();
    const size = `${leaf.width}×${leaf.height}`;
    const row = sizes.get(size) || { size, width: leaf.width, leaves: 0, kits: 0, sides: [] };
    row.leaves += leaf.qty;
    row.kits += leaf.kits;
    if (leaf.side) row.sides.push(`${SIDE[leaf.side]} ${leaf.kits}/${leaf.qty}`);
    sizes.set(size, row);
    byProduct.set(leaf.productId, sizes);
  }

  const horizontal = Object.entries(report.horizontal || {}).sort((a, b) => a[0] - b[0]);
  const vertical = Object.entries(report.vertical || {}).sort();

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-[15px] font-semibold text-neutral-900">Slēpto durvju komplekti</h2>
        <p className="mt-1 text-[13px] text-neutral-500">
          Vietnē rāda tikai pilnus komplektus: vērtne + alumīnija kārbas horizontāle tās platumā + vertikāle tās
          augstumā un virzienā (INS vērtnēm - tā pati puse, OUT vērtnēm - jebkura). Horizontāles ir kopīgas OUT un INS
          vērtnēm. Aprēķināts no pēdējā atlikumu faila.
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {[...byProduct.entries()].map(([productId, sizes]) => (
            <table key={productId} className="w-full text-[13px]">
              <caption className="pb-1 text-left text-[13px] font-medium text-neutral-900">
                {productNames[productId] || productId}
              </caption>
              <thead>
                <tr className="text-left text-[12px] text-neutral-500">
                  <th className="py-1 font-medium">Izmērs</th>
                  <th className="py-1 font-medium">Vērtnes</th>
                  <th className="py-1 font-medium">Komplekti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[...sizes.values()]
                  .sort((a, b) => a.width - b.width)
                  .map((row) => (
                    <tr key={row.size}>
                      <td className="py-1">{row.size}</td>
                      <td className="py-1">{row.leaves}</td>
                      <td className={`py-1 font-medium ${row.kits < row.leaves ? "text-amber-700" : "text-emerald-800"}`}>
                        {row.kits}
                        {row.sides.length ? (
                          <span className="ml-2 text-[12px] font-normal text-neutral-500">({row.sides.join(", ")})</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ))}
        </div>
        <div className="mt-3 text-[12px] text-neutral-500">
          Kārbas noliktavā - horizontāles: {horizontal.length ? horizontal.map(([w, q]) => `${w} mm ${q}`).join(", ") : "nav"}
          {" · "}vertikāles:{" "}
          {vertical.length
            ? vertical
                .map(([key, q]) => {
                  const [swing, side, height] = key.split("|");
                  return `${swing} ${SIDE[side]} ${height} mm ${q}`;
                })
                .join(", ")
            : "nav"}
        </div>
      </div>
    </div>
  );
}

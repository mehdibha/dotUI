export default function OverviewPage() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-4 p-8">
        <div className="bg-bg-muted col-span-5 rounded-lg p-4">
          <h3 className="text-fg-muted text-sm">Total net worth</h3>
          <p className="text-3xl font-bold">
            $234,567<span className="text-fg-muted text-sm">USD</span>
          </p>
          <p className="text-fg-muted text-sm">≈ 87.578 BTC</p>
        </div>
        <div className="col-span-7 grid grid-cols-2 gap-4 rounded-lg">
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Profits</h3>
            <p className="text-xl font-bold">
              $31,255<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Expenses</h3>
            <p className="text-xl font-bold">
              $12,389<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Net worth</h3>
            <p className="text-xl font-bold">
              $18,866<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Profit margin</h3>
            <p className="text-xl font-bold">
              12.5%<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-4 p-8">
        <div className="col-span-5 rounded-lg bg-bg-muted p-4">
          <h3 className="text-sm text-fg-muted">Total net worth</h3>
          <p className="text-3xl font-bold">
            $234,567<span className="text-sm text-fg-muted">USD</span>
          </p>
          <p className="text-sm text-fg-muted">≈ 87.578 BTC</p>
        </div>
        <div className="col-span-7 grid grid-cols-2 gap-4 rounded-lg">
          <div className="rounded-lg bg-bg-muted p-4">
            <h3 className="text-sm text-fg-muted">Profits</h3>
            <p className="text-xl font-bold">
              $31,255<span className="text-sm text-fg-muted">USD</span>
            </p>
          </div>
          <div className="rounded-lg bg-bg-muted p-4">
            <h3 className="text-sm text-fg-muted">Expenses</h3>
            <p className="text-xl font-bold">
              $12,389<span className="text-sm text-fg-muted">USD</span>
            </p>
          </div>
          <div className="rounded-lg bg-bg-muted p-4">
            <h3 className="text-sm text-fg-muted">Net worth</h3>
            <p className="text-xl font-bold">
              $18,866<span className="text-sm text-fg-muted">USD</span>
            </p>
          </div>
          <div className="rounded-lg bg-bg-muted p-4">
            <h3 className="text-sm text-fg-muted">Profit margin</h3>
            <p className="text-xl font-bold">
              12.5%<span className="text-sm text-fg-muted">USD</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

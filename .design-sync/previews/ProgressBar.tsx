import {
  Label,
  ProgressBar,
  ProgressBarControl,
  ProgressBarFill,
  ProgressBarOutput,
} from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 360,
}

const header: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
}

export const Values = () => (
  <div style={stack}>
    <ProgressBar value={30} style={{ width: '100%' }}>
      <div style={header}>
        <Label>Downloading</Label>
        <ProgressBarOutput />
      </div>
      <ProgressBarControl />
    </ProgressBar>
    <ProgressBar value={70} style={{ width: '100%' }}>
      <div style={header}>
        <Label>Uploading</Label>
        <ProgressBarOutput />
      </div>
      <ProgressBarControl />
    </ProgressBar>
    <ProgressBar value={100} style={{ width: '100%' }}>
      <div style={header}>
        <Label>Complete</Label>
        <ProgressBarOutput />
      </div>
      <ProgressBarControl />
    </ProgressBar>
  </div>
)

export const Indeterminate = () => (
  <div style={stack}>
    <ProgressBar isIndeterminate aria-label="Loading" style={{ width: '100%' }}>
      <Label>Processing…</Label>
      <ProgressBarControl />
    </ProgressBar>
  </div>
)

export const Variants = () => (
  <div style={stack}>
    {(
      [
        ['Primary', 'bg-primary'],
        ['Success', 'bg-success'],
        ['Danger', 'bg-danger'],
        ['Warning', 'bg-warning'],
      ] as const
    ).map(([label, cls]) => (
      <ProgressBar key={label} value={75} style={{ width: '100%' }}>
        <Label>{label}</Label>
        <ProgressBarControl>
          <ProgressBarFill className={cls} />
        </ProgressBarControl>
      </ProgressBar>
    ))}
  </div>
)

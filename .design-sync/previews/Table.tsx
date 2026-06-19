import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from 'www'

const invoices = [
  { id: 'INV-001', status: 'Paid', method: 'Credit Card', amount: 250 },
  { id: 'INV-002', status: 'Pending', method: 'PayPal', amount: 150 },
  { id: 'INV-003', status: 'Unpaid', method: 'Bank Transfer', amount: 350 },
  { id: 'INV-004', status: 'Paid', method: 'Credit Card', amount: 450 },
  { id: 'INV-005', status: 'Paid', method: 'PayPal', amount: 550 },
] as const

const statusVariant = {
  Paid: 'success',
  Pending: 'warning',
  Unpaid: 'neutral',
} as const

const currency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

const right: React.CSSProperties = { textAlign: 'right' }

export const Invoices = () => {
  const total = invoices.reduce((sum, i) => sum + i.amount, 0)
  return (
    <TableContainer style={{ width: 480 }}>
      <Table aria-label="Invoices">
        <TableHeader>
          <TableColumn isRowHeader>Invoice</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Method</TableColumn>
          <TableColumn style={right}>Amount</TableColumn>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell style={{ fontWeight: 500 }}>{invoice.id}</TableCell>
              <TableCell>
                <Badge appearance="subtle" variant={statusVariant[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell style={right}>{currency(invoice.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell style={right}>{currency(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

const files = [
  { id: 1, name: 'Games', type: 'File folder', date: '6/7/2020' },
  { id: 2, name: 'Program Files', type: 'File folder', date: '4/7/2021' },
  { id: 3, name: 'bootmgr', type: 'System file', date: '11/20/2010' },
  { id: 4, name: 'log.txt', type: 'Text document', date: '1/18/2016' },
]

export const Selectable = () => (
  <TableContainer style={{ width: 440 }}>
    <Table aria-label="Files" selectionMode="multiple" defaultSelectedKeys={[2]}>
      <TableHeader>
        <TableColumn isRowHeader>Name</TableColumn>
        <TableColumn>Type</TableColumn>
        <TableColumn>Date modified</TableColumn>
      </TableHeader>
      <TableBody items={files}>
        {(item) => (
          <TableRow>
            <TableCell style={{ fontWeight: 500 }}>{item.name}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.date}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
)

import { UploadIcon } from '@/registry/icons'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'
import { Link } from '@/registry/ui/link'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ButtonsGroupExamples() {
  return (
    <Examples>
      <Example title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="quiet">Quiet</Button>
        </div>
      </Example>
      <Example title="Toggle Button">
        <div className="flex flex-wrap items-center gap-3">
          <ToggleButton>Bold</ToggleButton>
          <ToggleButton defaultSelected>Italic</ToggleButton>
        </div>
      </Example>
      <Example title="Toggle Button Group">
        <ToggleButtonGroup>
          <ToggleButton id="left">Left</ToggleButton>
          <ToggleButton id="center">Center</ToggleButton>
          <ToggleButton id="right">Right</ToggleButton>
        </ToggleButtonGroup>
      </Example>
      <Example title="File Trigger">
        <FileTrigger>
          <Button>
            <UploadIcon data-icon-start="" />
            Upload file
          </Button>
        </FileTrigger>
      </Example>
      <Example title="Link">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#">Default link</Link>
          <Link href="#" variant="quiet">
            Quiet link
          </Link>
        </div>
      </Example>
    </Examples>
  )
}

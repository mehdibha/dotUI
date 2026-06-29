'use client'

import { useState } from 'react'

import { Button } from '@/registry/ui/button'
import { Loader } from '@/registry/ui/loader'

export default function Demo() {
  const [isSaving, setIsSaving] = useState(false)
  return (
    <Button
      isDisabled={isSaving}
      onPress={() => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 2000)
      }}
    >
      {isSaving ? (
        <>
          <Loader />
          Saving...
        </>
      ) : (
        'Save changes'
      )}
    </Button>
  )
}

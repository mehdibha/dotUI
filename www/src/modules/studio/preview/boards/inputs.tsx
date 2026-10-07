import ComboboxDemo from "@/registry/ui/combobox/demos/basic"
import InputDemo from "@/registry/ui/input/demos/default"
import NumberFieldDemo from "@/registry/ui/number-field/demos/basic"
import OtpDemo from "@/registry/ui/otp-field/demos/basic"
import SelectDemo from "@/registry/ui/select/demos/basic"
import TextFieldDemo from "@/registry/ui/text-field/demos/default"
import FieldErrorDemo from "@/registry/ui/text-field/demos/error-message"

import { Board, BoardSection } from "./board"

export default function InputsBoard() {
  return (
    <Board id="inputs">
      <BoardSection
        member="input"
        title="Input"
        axes={[
          "inputStyle",
          "focusInputStyle",
          "roleControl",
          "inputHover",
          "inputHeight",
          "inputMotion",
        ]}
      >
        <TextFieldDemo />
        <InputDemo />
      </BoardSection>
      <BoardSection
        member="number-field"
        title="Number field"
        axes={["numberLayout"]}
      >
        <NumberFieldDemo />
      </BoardSection>
      <BoardSection member="otp" title="OTP field" axes={["otpStyle"]}>
        <OtpDemo />
      </BoardSection>
      <BoardSection
        member="select"
        title="Select"
        axes={["selectTrigger", "pickerCaret"]}
      >
        <SelectDemo />
        <ComboboxDemo />
      </BoardSection>
      <BoardSection
        member="field"
        title="Field"
        axes={["fieldLabel", "inputError"]}
      >
        <FieldErrorDemo />
      </BoardSection>
    </Board>
  )
}

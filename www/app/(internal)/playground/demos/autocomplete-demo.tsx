"use client";

import { AudioLinesIcon, PaperclipIcon } from "lucide-react";
import {
  Autocomplete,
  SelectableCollectionContext,
  useFilter,
} from "react-aria-components";

import { cn } from "@dotui/registry-v2/lib/utils";
import { Button } from "@dotui/registry-v2/ui/button";
import { Dialog, DialogContent } from "@dotui/registry-v2/ui/dialog";
import { Input, InputAddon, InputGroup } from "@dotui/registry-v2/ui/input";
import { ListBox, ListBoxItem } from "@dotui/registry-v2/ui/list-box";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSub,
} from "@dotui/registry-v2/ui/menu";
import { Overlay } from "@dotui/registry-v2/ui/overlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry-v2/ui/select";
import { TextField } from "@dotui/registry-v2/ui/text-field";
import { Tooltip } from "@dotui/registry-v2/ui/tooltip";

export function AutocompleteDemo() {
  const { contains } = useFilter({ sensitivity: "base" });
  return (
    <div>
      <Dialog>
        <Button>Super grok</Button>
        <Overlay
          modalProps={{
            className: "border-0 bg-transparent shadow-none h-120",
          }}
        >
          <DialogContent className="w-full max-w-2xl rounded-4xl bg-neutral p-0! gap-0">
            <Autocomplete
              filter={(textValue, inputValue) => {
                if (inputValue === "") return false;
                return contains(textValue, inputValue);
              }}
            >
              <InputGroup
                size="lg"
                className="w-full border-0 p-1.5 [--radius-factor:9999] [--spacing:0.4em]"
              >
                <InputAddon>
                  <SelectableCollectionContext value={null}>
                    <Menu>
                      <Tooltip content="Attach">
                        <Button aria-label="Attach" variant="quiet">
                          <PaperclipIcon className="-rotate-45" />
                        </Button>
                      </Tooltip>
                      <Overlay type="popover">
                        <MenuContent className="outline-hidden">
                          <MenuItem>Upload a file</MenuItem>
                          <MenuItem>Add text content</MenuItem>
                          <MenuItem>Draw a sketch</MenuItem>
                          <MenuItem>Connect Google Drive</MenuItem>
                          <MenuItem>Connect Microsoft OneDrive</MenuItem>
                          <MenuSub>
                            <MenuItem>Recent</MenuItem>
                            <Overlay type="popover">
                              <MenuContent>
                                <MenuItem>image.png</MenuItem>
                              </MenuContent>
                            </Overlay>
                          </MenuSub>
                        </MenuContent>
                      </Overlay>
                    </Menu>
                  </SelectableCollectionContext>
                </InputAddon>
                <TextField autoFocus aria-label="Search" className="w-full">
                  <Input
                    placeholder="What do you want to know?"
                    className="min-h-0 w-full py-2"
                  />
                </TextField>
                <InputAddon>
                  <SelectableCollectionContext value={null}>
                    <Select
                      aria-label="Model"
                      className="w-fit"
                      defaultValue="grok-4-fast"
                    >
                      <SelectTrigger aspect="default" />
                      <SelectContent>
                        <SelectItem id="grok-4-fast">Grok 4 fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </SelectableCollectionContext>
                  <Button aria-label="Speak mode" variant="primary">
                    <AudioLinesIcon />
                  </Button>
                </InputAddon>
              </InputGroup>
              <ListBox
                items={questions.map((question, index) => ({
                  id: index,
                  question: question,
                }))}
                className={cn(
                  "!w-full overflow-y-auto transition-[height] duration-100 ease-out not-data-empty:h-[300px] empty:h-0 empty:p-0",
                )}
              >
                {(item) => (
                  <ListBoxItem id={item.id}>{item.question}</ListBoxItem>
                )}
              </ListBox>
            </Autocomplete>
          </DialogContent>
        </Overlay>
      </Dialog>
    </div>
  );
}

const questions = [
  "How does quantum computing differ from classical computing?",
  "What are the best practices for prompt engineering?",
  "Explain the concept of neural networks in simple terms",
  "What is the difference between machine learning and deep learning?",
  "How does blockchain technology work?",
  "What are the main causes of climate change?",
  "Can you explain the theory of relativity?",
  "What is the best way to learn a new programming language?",
  "How do I optimize my website for search engines?",
  "What are the benefits of meditation?",
  "How does photosynthesis work?",
  "What is the meaning of life according to different philosophies?",
  "How can I improve my productivity?",
  "What are the key principles of good design?",
  "How does the human immune system work?",
  "What is the difference between AI and AGI?",
  "How do I start investing in stocks?",
  "What are the best exercises for building muscle?",
  "How does encryption keep my data safe?",
  "What is the future of renewable energy?",
  "How do I create a sustainable morning routine?",
  "What are the most important soft skills for career success?",
  "How does CRISPR gene editing work?",
  "What is the best way to learn a new language?",
  "How do recommendation algorithms work?",
  "What are the ethical implications of AI?",
  "How can I reduce my carbon footprint?",
  "What is the difference between sympathy and empathy?",
  "How does compound interest work?",
  "What are the benefits of intermittent fasting?",
  "How do I build a personal brand?",
  "What is dark matter and dark energy?",
  "How can I improve my public speaking skills?",
  "What are the principles of stoic philosophy?",
  "How does the stock market work?",
  "What is the best way to handle stress?",
  "How do I create engaging content for social media?",
  "What are the latest trends in web development?",
  "How does the brain process information?",
  "What is the difference between HTTP and HTTPS?",
  "How can I improve my sleep quality?",
  "What are the key features of Web3?",
  "How do I negotiate a better salary?",
  "What is the difference between microservices and monolithic architecture?",
  "How does memory formation work in the brain?",
  "What are the best strategies for time management?",
  "How do I build resilience and mental toughness?",
  "What is the role of dopamine in motivation?",
  "How can I create a successful YouTube channel?",
  "What are the principles of effective communication?",
  "How does GPS technology work?",
  "What is the difference between React and Vue?",
  "How can I improve my critical thinking skills?",
  "What are the best practices for cybersecurity?",
  "How does the electoral college work?",
  "What is the difference between UI and UX design?",
  "How can I build healthy habits that stick?",
  "What are the main theories of consciousness?",
  "How do I create a business plan?",
  "What is the difference between copyright and trademark?",
  "How does artificial neural networks learn?",
  "What are the best frameworks for mobile app development?",
  "How can I overcome procrastination?",
  "What is the difference between SQL and NoSQL databases?",
  "How does the placebo effect work?",
  "What are the key principles of servant leadership?",
  "How do I build an emergency fund?",
  "What is the difference between TypeScript and JavaScript?",
  "How can I develop emotional intelligence?",
  "What are the stages of startup growth?",
  "How does the human digestive system work?",
  "What is the best way to learn data science?",
  "How do I create a diversified investment portfolio?",
  "What are the principles of Lean methodology?",
  "How does cryptocurrency mining work?",
  "What is the difference between compiler and interpreter?",
  "How can I improve my work-life balance?",
  "What are the best practices for API design?",
  "How does the endocrine system regulate hormones?",
  "What is the difference between cloud computing models?",
  "How can I build self-confidence?",
  "What are the key concepts in game theory?",
  "How do I prepare for a technical interview?",
  "What is the difference between synchronous and asynchronous programming?",
  "How does the cardiovascular system work?",
  "What are the best strategies for networking?",
  "How can I develop a growth mindset?",
  "What is the difference between AR and VR?",
  "How do I create a content marketing strategy?",
  "What are the principles of agile development?",
  "How does DNA replication occur?",
  "What is the best way to manage remote teams?",
  "How can I improve my decision-making skills?",
  "What are the different types of cloud storage?",
  "How does the nervous system transmit signals?",
  "What is the difference between REST and GraphQL?",
  "How can I build better relationships?",
  "What are the key metrics for startup success?",
  "How does containerization work with Docker?",
  "What is the best approach to conflict resolution?",
];

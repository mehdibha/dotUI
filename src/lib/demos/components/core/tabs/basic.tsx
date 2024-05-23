import {
  TabsRoot,
  TabsList,
  TabsPanel,
  TabsItem,
} from "@/lib/components/core/default/tabs";

export default function TabsDemo() {
  return (
    <TabsRoot>
      <TabsList>
        <TabsItem id="github">GitHub</TabsItem>
        <TabsItem id="gitlab">GitLab</TabsItem>
        <TabsItem id="bitbucket">Bitbucket</TabsItem>
      </TabsList>
      <TabsPanel id="github">Content of GitHub</TabsPanel>
      <TabsPanel id="gitlab">Content of GitLab</TabsPanel>
      <TabsPanel id="bitbucket">Content of Bitbucket</TabsPanel>
    </TabsRoot>
  );
}

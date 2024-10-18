export const CloneThemeDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DialogRoot>
      {children}
      <Dialog title="Clone theme">
        {({ close }) => (
          <>
            <TextField label="Name" className="w-full" />
            <DialogFooter>
              <Button variant="outline" size="sm" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onPress={() => {
                  close();
                }}
              >
                Save theme
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogRoot>
  );
};

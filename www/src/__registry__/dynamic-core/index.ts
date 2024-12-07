const Components = {
  button: {
    "button-01": React.lazy(() =>
      import("@/__registry__/core/button-01").then((module) => ({
        default: module.Button,
      }))
    ),
    "button-02": React.lazy(() =>
      import("@/__registry__/core/button-02").then((module) => ({
        default: module.Button,
      }))
    ),
  },
};

import { Breadcrumbs, Button } from "@mui/material";

import { useAppContext } from "~/stores";

export const PathBar = () => {
  const { paths, setPaths } = useAppContext();

  return (
    <Breadcrumbs aria-label="Path Bar">
      {paths.map((path, index) => (
        <Button
          key={index}
          variant="text"
          size="small"
          color="inherit"
          onClick={() => setPaths(paths.slice(0, index + 1))}
        >
          {path === "" ? "Home" : path}
        </Button>
      ))}
    </Breadcrumbs>
  );
};

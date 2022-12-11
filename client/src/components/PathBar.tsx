import { Breadcrumbs, Link } from "@mui/material";

import { useAppContext } from "~/stores";

export const PathBar = () => {
  const { paths, setPaths } = useAppContext();

  return (
    <Breadcrumbs aria-label="Path Bar">
      {paths.map((path, index) => (
        <Link
          key={index}
          underline="hover"
          color="inherit"
          href={`#${path}`}
          onClick={() => setPaths(paths.slice(0, index + 1))}
        >
          {path === "" ? "Home" : path}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

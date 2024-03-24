import fs from "fs";
import path from "path";
import { getAllMdxFiles, parseMDXFile } from "./mdx";
import { type TableOfContents, getTableOfContents } from "./toc";

type Type = "components" | "pages" | "templates" | "icons" | "hooks";

export type Item = { href: string; type: Type; metadata: DocFrontmatter };

interface DocFrontmatter {
  title: string;
  description?: string;
  thumbnail?: string;
  video?: string;
  keywords?: string[];
  externalLink?: string;
  label?: string;
}

interface DocMetadata {
  title: string;
  type: Type;
  breadcrumbs: { label: string; href: string }[];
  description?: string;
  thumbnail?: string;
  video?: string;
}

interface Category {
  label: string;
  href: string;
}

export interface Doc {
  rawContent: string;
  metadata: DocMetadata;
  categories?: Category[];
  toc: TableOfContents;
  items?: Item[];
}

const getBreadcrumbs = (slug: string[]): { label: string; href: string }[] => {
  const result = slug.map((slugPart, index) => {
    const partPath = path.join(process.cwd(), "content", ...slug.slice(0, index + 1));
    if (fs.existsSync(partPath) && fs.lstatSync(partPath).isDirectory()) {
      // get title from index.mdx
      const indexPath = path.join(partPath, "index.mdx");
      if (fs.existsSync(indexPath)) {
        const fileRawContent = fs.readFileSync(indexPath, "utf-8");
        const { frontmatter } = parseMDXFile<DocFrontmatter>(fileRawContent);
        return {
          label: frontmatter.title,
          href: `/${slug.slice(0, index + 1).join("/")}`,
        };
      }
    } else {
      // get title from last {slug}.mdx
      const filePath = path.join(
        process.cwd(),
        "content",
        ...slug.slice(0, index),
        `${slugPart}.mdx`
      );
      if (fs.existsSync(filePath)) {
        const fileRawContent = fs.readFileSync(filePath, "utf-8");
        const { frontmatter } = parseMDXFile<DocFrontmatter>(fileRawContent);
        return {
          label: frontmatter.title,
          href: `/${slug.slice(0, index + 1).join("/")}`,
        };
      }
    }
  });

  return result.filter((elem) => !!elem) as { label: string; href: string }[];
};

export const getDocFromSlug = async (slug: string[]): Promise<Doc | null> => {
  // 1st scenario: if it's a directory
  const breadcrumbs = getBreadcrumbs(slug);
  const type = slug[0] as Type;
  const directoryPath = path.join(process.cwd(), "content", ...slug);
  if (fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()) {
    // check if index.mdx exists
    const indexPath = path.join(directoryPath, "index.mdx");
    if (fs.existsSync(indexPath)) {
      // get rawContent & metadata from index.mdx
      const fileRawContent = fs.readFileSync(indexPath, "utf-8");
      const { content, frontmatter } = parseMDXFile<DocFrontmatter>(fileRawContent);
      // get categories from subfolders
      const subfolders = fs
        .readdirSync(directoryPath)
        .filter((item) => fs.lstatSync(path.join(directoryPath, item)).isDirectory());
      const categories = subfolders
        .map((subfolder) => {
          const categoryIndexPath = path.join(directoryPath, subfolder, "index.mdx");
          if (fs.existsSync(categoryIndexPath)) {
            const fileRawContent = fs.readFileSync(categoryIndexPath, "utf-8");
            const { frontmatter } = parseMDXFile<DocFrontmatter>(fileRawContent);
            return {
              label: frontmatter.title,
              href: `/${[...slug, subfolder].join("/")}`,
            };
          }
        })
        .filter((item) => item) as Category[];
      // get items from all nested mdx files
      const items = getAllMdxFiles(directoryPath, directoryPath).map(
        ({ fullPath, relativePath }) => {
          const itemRawContent = fs.readFileSync(fullPath, "utf-8");
          const { frontmatter: itemFrontmatter } =
            parseMDXFile<DocFrontmatter>(itemRawContent);
          return {
            metadata: itemFrontmatter,
            type,
            href: `/${type}/${relativePath.join("/")}`,
          };
        }
      );
      const toc = await getTableOfContents(content);

      return {
        metadata: {
          title: frontmatter.title,
          description: frontmatter.description,
          type,
          breadcrumbs,
        },
        rawContent: content,
        categories,
        toc,
        items,
      };
    }
  }

  // 2nd scenario: if it's a file
  const filePath = path.join(
    process.cwd(),
    "content",
    ...slug.slice(0, -1),
    `${slug[slug.length - 1]}.mdx`
  );
  if (fs.existsSync(filePath)) {
    const fileRawContent = fs.readFileSync(filePath, "utf-8");
    const { content, frontmatter } = parseMDXFile<DocFrontmatter>(fileRawContent);
    const toc = await getTableOfContents(content);
    return {
      metadata: {
        title: frontmatter.title,
        description: frontmatter.description,
        type,
        breadcrumbs,
      },
      rawContent: content,
      toc,
    };
  }

  return null;
};

export const getAllDocs = () => {
  const directoryPath = path.join(process.cwd(), "content");
  return getAllMdxFiles(directoryPath, directoryPath, [], true).map(
    ({ fullPath, relativePath }) => {
      const itemRawContent = fs.readFileSync(fullPath, "utf-8");
      const { frontmatter: itemFrontmatter } =
        parseMDXFile<DocFrontmatter>(itemRawContent);
      return {
        ...itemFrontmatter,
        href: `/${relativePath.join("/").replace("/index", "")}`,
      };
    }
  );
};

export const getAllCategoryDocs = (category: string, includeIndex = false) => {
  const directoryPath = path.join(process.cwd(), "content", ...category.split("/"));
  return getAllMdxFiles(directoryPath, directoryPath, [], includeIndex).map(
    ({ fullPath, relativePath }) => {
      const itemRawContent = fs.readFileSync(fullPath, "utf-8");
      const { frontmatter: itemFrontmatter } =
        parseMDXFile<DocFrontmatter>(itemRawContent);
      return {
        ...itemFrontmatter,
        href: `/${category}/${relativePath.join("/").replace("/index", "")}`,
      };
    }
  );
};

// export const getDocsNavItems = (): {
//   items: SidebarNavItem[];
// } => {
//   // nested files will be in items field
//   //{ items: { title: "test", href: "#", items: [{ title: "test2", href: "#" }] }
//   const directoryPath = path.join(process.cwd(), "content");

//   // recursive function to get all nested files
//   const getItems = (directory: string): SidebarNavItem[] => {
//     const files = fs.readdirSync(directory);
//     // console.log(files)
//     return files.reduce<SidebarNavItem[]>((acc, file) => {
//       const filePath = path.join(directory, file);
//       const fileStat = fs.statSync(filePath);
//       if (fileStat.isDirectory()) {
//         const items = getItems(filePath);
//         const indexPath = path.join(filePath, "index.mdx");
//         if (fs.existsSync(indexPath)) {
//           const fileRawContent = fs.readFileSync(indexPath, "utf-8");
//           const { frontmatter } = parseMDXFile<DocFrontmatter>(fileRawContent);
//           acc.push({
//             title: frontmatter.title,
//             href: `/${path.relative(directoryPath, filePath).replace(/\\/g, "/")}`,
//             items,
//           });
//         }
//       }
//       if (path.extname(file) === ".mdx" && file !== "index.mdx") {
//         const { frontmatter } = parseMDXFile<DocFrontmatter>(
//           fs.readFileSync(filePath, "utf-8")
//         );
//         acc.push({
//           title: frontmatter.title,
//           href: `/${path.relative(directoryPath, filePath).replace(/\\/g, "/").replace(".mdx", "")}`,
//           items: [],
//         });
//       }
//       return acc;
//     }, []);
//   };

//   return { items: getItems(directoryPath) };
// };

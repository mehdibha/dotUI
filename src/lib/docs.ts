import fs from "fs";
import path from "path";
import { getAllMdxFiles, parseMDXFile } from "./mdx";

export type Type = "components" | "pages" | "templates" | "icons" | "hooks";

export type Item = DocFrontmatter & { href: string; type: Type };

export interface DocFrontmatter {
  title: string;
  description?: string;
  thumbnail?: string;
}

export interface DocMetadata {
  title: string;
  type: Type;
  breadcrumbs: { label: string; href: string }[];
  description?: string;
  thumbnail?: string;
}

export interface Category {
  label: string;
  href: string;
}

export interface Doc {
  rawContent: string;
  metadata: DocMetadata;
  categories?: Category[];
  items?: Item[];
}

const getBreadcrumbs = (slug: string[]): { label: string; href: string }[] => {
  const result = slug.map((slugPart, index) => {
    const partPath = path.join(process.cwd(), "content", ...slug.slice(0, index + 1));
    // console.log("🥲partPath",partPath);
    if (fs.existsSync(partPath) && fs.lstatSync(partPath).isDirectory()) {
      // get title from index.mdx
      const indexPath = path.join(partPath, "index.mdx");
      // console.log(indexPath)
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

export const getDocFromSlug = (slug: string[]): Doc | null => {
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
          return { ...itemFrontmatter, type, href: `/${type}/${relativePath.join("/")}` };
        }
      );

      return {
        metadata: {
          title: frontmatter.title,
          description: frontmatter.description,
          type,
          breadcrumbs,
        },
        rawContent: content,
        categories,
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
    return {
      metadata: {
        title: frontmatter.title,
        description: frontmatter.description,
        type,
        breadcrumbs,
      },
      rawContent: content,
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

type FeatureCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href?: string;
  badge?: string;
};

type NavigationHeaderProps = {
  onSearchOpen: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
};

type TocKey =
  | "introduction"
  | "installation"
  | "commit-messages"
  | "quick-start";
type TocItem = { id: string; title: string };

interface TableOfContentsProps {
  activeDoc: string;
}

export type {
  FeatureCardProps,
  NavigationHeaderProps,
  TocKey,
  TocItem,
  TableOfContentsProps,
};

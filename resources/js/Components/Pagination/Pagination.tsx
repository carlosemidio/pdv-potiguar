import { Link } from '@inertiajs/react';
import classNames from 'classnames';

interface PaginationProps {
  links: PaginationItem[];
}

export default function Pagination({ links = [] }: PaginationProps) {
  if (links.length === 3) return null;

  const maxLinksPerSide = 2;
  const currentIndex = links.findIndex(link => link.active);
  const start = Math.max(currentIndex - maxLinksPerSide, 0);
  const end = Math.min(currentIndex + maxLinksPerSide + 1, links.length);

  const visibleLinks = links.slice(start, end);

  const showStartEllipsis = start > 1;
  const showEndEllipsis = end < links.length - 1;

  return (
    <div className="flex flex-wrap justify-center mt-4">
      {showStartEllipsis && <Ellipsis />}
      {visibleLinks.map(link => {
        return link.url === null ? (
          <PageInactive key={link.label} label={link.label} />
        ) : (
          <PaginationItem key={link.label} {...link} />
        );
      })}
      {showEndEllipsis && <Ellipsis />}
    </div>
  );
}

interface PaginationItem {
  url: null | string;
  label: string;
  active: boolean;
}

function PaginationItem({ active, label, url }: PaginationItem) {
  const className = classNames(
    [
      'mr-1 mb-1',
      'px-4 py-3',
      'border border-solid border-gray-300 rounded',
      'text-sm',
      'focus:outline-none focus:border-indigo-700 focus:text-indigo-700'
    ],
    {
      'bg-sky-600 text-white hover:bg-sky-500': active,
      'bg-white hover:bg-slate-100': !active
    }
  );

  return (
    <Link className={className} href={url as string}>
      <span dangerouslySetInnerHTML={{ __html: label }}></span>
    </Link>
  );
}

function PageInactive({ label }: Pick<PaginationItem, 'label'>) {
  const className = classNames(
    ['mr-1 mb-1 px-4 py-3 text-sm border rounded border-solid border-gray-300 text-gray bg-white hover:bg-slate-100'],
  );

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: label }} />
  );
}

function Ellipsis() {
  return (
    <div className="mr-1 mb-1 px-4 py-3 text-sm border rounded border-solid border-gray-300 text-gray bg-white">
      ...
    </div>
  );
}

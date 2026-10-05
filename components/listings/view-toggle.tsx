import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { catalogueUrl, type CatalogueState } from "@/lib/listings-url";
import { cn } from "@/lib/utils";

/** Grid / list switch. Stored in the URL (?view=list) so shared links keep the layout. */
export function ViewToggle({ state }: { state: CatalogueState }) {
  const current = state.view ?? "grid";
  const options = [
    { view: "grid" as const, label: "Grid view", Icon: LayoutGrid },
    { view: "list" as const, label: "List view", Icon: List },
  ];

  return (
    <div className="inline-flex rounded-lg border bg-card p-1" role="group" aria-label="Layout">
      {options.map(({ view, label, Icon }) => {
        const active = current === view;
        return (
          <Link
            key={view}
            href={catalogueUrl({ ...state, view })}
            scroll={false}
            aria-label={label}
            aria-current={active ? "true" : undefined}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </Link>
        );
      })}
    </div>
  );
}

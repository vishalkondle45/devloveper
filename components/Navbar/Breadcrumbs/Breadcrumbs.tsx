import { Breadcrumbs, Anchor } from "@mantine/core";
import { BreadcrumbItem, BreadcrumbsProps } from "./Breadcrumbs.types";
import { useRouter } from "next/navigation";

export default function BreadcrumbsComp({ breadcrumbs }: BreadcrumbsProps) {
  const router = useRouter();
  const navigateTo = (path: string): void => router.push(path);
  return (
    <>
      <Breadcrumbs>
        {breadcrumbs?.map((item: BreadcrumbItem) => (
          <Anchor
            onClick={() => navigateTo(item.href)}
            // href={item.href}
            key={item.href}
          >
            {item.title}
          </Anchor>
        ))}
      </Breadcrumbs>
    </>
  );
}

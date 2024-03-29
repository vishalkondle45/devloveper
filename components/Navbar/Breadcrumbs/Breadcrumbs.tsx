import { Breadcrumbs, Anchor, Text } from "@mantine/core";
import { BreadcrumbItem, BreadcrumbsProps } from "./Breadcrumbs.types";
import { useRouter } from "next/navigation";

export default function BreadcrumbsComp({ breadcrumbs }: BreadcrumbsProps) {
  const router = useRouter();
  const navigateTo = (path: string): void => router.push(path);
  return (
    <>
      <Breadcrumbs
        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
        separator="→"
      >
        {breadcrumbs?.map((item: BreadcrumbItem, i: number) =>
          i !== breadcrumbs.length - 1 ? (
            <Anchor onClick={() => navigateTo(item.href)} key={item.href}>
              {item.title}
            </Anchor>
          ) : (
            <Text key={item.href}>{item.title}</Text>
          )
        )}
      </Breadcrumbs>
    </>
  );
}

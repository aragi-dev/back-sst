import { Resource } from "@utils/enums/Resource";

export const resolveResources = <T extends Resource[]>(
  stage: string,
  all: Record<Resource, any>,
  needs: T
): { stage: string } & Record<T[number], any> => {
  return Object.fromEntries([
    ["stage", stage],
    ...needs.map((key) => [key, all[key]])
  ]) as any;
};

import "server-only";
import { revalidateTag } from "next/cache";

export const PUBLIC_CATALOG_TAG = "public-catalog";

export function revalidatePublicCatalog() {
  revalidateTag(PUBLIC_CATALOG_TAG, { expire: 0 });
}

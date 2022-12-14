import { TOTAL_PRODUCTS_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // If we already have the field, return it.
      // If we return false, it will do a network request
      const { skip, first } = args;

      const data = cache.readQuery({ query: TOTAL_PRODUCTS_QUERY });

      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((x) => x);

      if (
        (page === pages && items.length && items.length < first) ||
        items.length === first
      ) {
        return items;
      }

      if (items.length !== first) {
        return false;
      }

      return false;
    },
    merge(existing, incoming, { args }) {
      // This runs when the Apollo client comes back from the network with our fields
      // Here we say how we're going to put them on the cache
      const { skip } = args;

      const merged = existing ? [...existing] : [];

      for (let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}

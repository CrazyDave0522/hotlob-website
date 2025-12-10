// lib/constants.ts

export const CONSTANTS = {
    // URLs
    ORDER_URL: 'https://www.ubereats.com/au/store/hotlob-elizabeth-street/NYteIBrURkOJEvArP0rBTA/5e126e11-ff14-4486-88e8-f50878f1d325?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMkhvc3RlbCUyMEclMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjI1MTNkNDQ5MC04YjFlLWJkN2UtODlkNS03MGI3ODJmZTAyYTMlMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIydWJlcl9wbGFjZXMlMjIlMkMlMjJsYXRpdHVkZSUyMiUzQS0zMS45NTAwOTIlMkMlMjJsb25naXR1ZGUlMjIlM0ExMTUuODY0NjExJTdE',

    // Default values (using online placeholder services)
    DEFAULT_DISH_IMAGE: 'https://source.unsplash.com/800x600/?lobster,seafood',
    DEFAULT_TAG_ICON: 'https://via.placeholder.com/80x80/f0f0f0/666666?text=Tag',
    DEFAULT_TAG_ICON_ACTIVE: 'https://via.placeholder.com/80x80/EA4148/ffffff?text=Active',
    // Local ALL tag icons (place your SVGs under public/images/icons/)
    ALL_TAG_ICON: '/images/icons/tag-all.svg',
    ALL_TAG_ICON_ACTIVE: '/images/icons/tag-all-active.svg',

    // Revalidation (seconds)
    // Note: App Router route-segment exports (e.g. `export const revalidate`)
    // must be numeric literals in the corresponding `layout` files so
    // Next.js can statically validate them. The values used in layouts are
    // literal numbers; they were previously mirrored here for reference.
    // These mirrored constants were removed because they cannot be used
    // directly for route-segment exports. Keep this section if you want a
    // documented reference for TTLs; it's currently intentionally minimal.
    REVALIDATE_TIME: 60, // default / fallback

    // UI
    MAX_VISIBLE_TAGS: 6,
} as const

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

    // Revalidation
    REVALIDATE_TIME: 60, // seconds

    // UI
    MAX_VISIBLE_TAGS: 6,
} as const

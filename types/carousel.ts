import { NewsListItem } from '@/types/news';

export interface NewsCarouselProps {
    news?: NewsListItem[];
}

export interface NewsCarouselItemProps {
    newsItem: NewsListItem;
}

export interface CarouselIndicatorProps {
    total: number;
    current: number;
    onClick: (index: number) => void;
}

export interface CarouselArrowProps {
    direction: 'left' | 'right';
    onClick: () => void;
    disabled?: boolean;
}
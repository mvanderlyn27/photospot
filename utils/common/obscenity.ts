import {
    RegExpMatcher,
    TextCensor,
    englishDataset,
    englishRecommendedTransformers,
} from 'obscenity';

export const NSFWTextMatcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
});

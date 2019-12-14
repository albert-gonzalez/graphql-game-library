import { Game } from '../../domain/game';
import { replaceRelativeAnchorUrls } from '../../../common/services/url/relativeUrls';

export default (game: Partial<Game>) => {
  let firstDescriptionPosition = game?.description?.indexOf('<p>');
  firstDescriptionPosition = firstDescriptionPosition !== -1 &&
    firstDescriptionPosition !== undefined ? firstDescriptionPosition + 3 : 0;

  let lastDescriptionPosition = game?.description?.indexOf('</p>');
  lastDescriptionPosition = lastDescriptionPosition !== -1 ? lastDescriptionPosition : undefined;

  return replaceRelativeAnchorUrls(
    'giantbomb.com',
    game.description?.slice(firstDescriptionPosition, lastDescriptionPosition),
  );
};

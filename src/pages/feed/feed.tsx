import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  feedErrorSelector,
  feedLoadingSelector,
  feedOrdersSelector,
  getFeeds
} from '../../services/slices';

const FEED_POLL_INTERVAL_MS = 15000;

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(feedOrdersSelector);
  const isLoading = useSelector(feedLoadingSelector);
  const error = useSelector(feedErrorSelector);

  useEffect(() => {
    dispatch(getFeeds());

    const id = setInterval(() => {
      dispatch(getFeeds());
    }, FEED_POLL_INTERVAL_MS);

    return () => {
      clearInterval(id);
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    if (isLoading) return;
    dispatch(getFeeds());
  };

  if (error && !orders.length) {
    return <p className='text text_type_main-default'>{error}</p>;
  }

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
